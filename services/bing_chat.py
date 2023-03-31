
# -*- coding: utf-8 -*-
# Author: XiaoXinYo

from typing import Union, Any, AsyncGenerator
from fastapi import FastAPI, Request, WebSocket, Response
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from img import ImageGen
import uvicorn
import asyncio
import EdgeGPT
import uuid
import time
import json
import re

HOST = '0.0.0.0'
PORT = 4000
COOKIE_FILE_PATH = './cookie.json'

APP = FastAPI()
APP.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
STYLES = ['balanced', 'creative', 'precise']
CHATBOT = {}

def getChatBot(token: str, cookies:dict) -> tuple:
    global CHATBOT
    if token in CHATBOT:
        chatBot = CHATBOT[token]['chatBot']
        CHATBOT[token]['useTime'] = time.time()
    else:
        token, chatBot = addChatBot(cookies)
    return token, chatBot

def addChatBot(cookies: dict):
    global CHATBOT
    chatBot = EdgeGPT.Chatbot(cookies=cookies)
    token = str(uuid.uuid4())
    CHATBOT[token] = {}
    CHATBOT[token]['chatBot'] = chatBot
    CHATBOT[token]['useTime'] = time.time()
    return token, chatBot

def getStyleEnum(style: str) -> EdgeGPT.ConversationStyle:
    enum = EdgeGPT.ConversationStyle
    if style == 'balanced':
        enum = enum.balanced
    elif style == 'creative':
        enum = enum.creative
    elif style == 'precise':
        enum = enum.precise
    return enum

def getAnswer(data: dict) -> str:
    messages = data.get('item').get('messages')
    if 'text' in messages[1]:
        return messages[1].get('text')
    else:
        return messages[1].get('adaptiveCards')[0].get('body')[0].get('text')

def filterAnswer(answer: str) -> str:
    answer = re.sub(r'\[\^.*?\^]', '', answer)
    return answer

def getStreamAnswer(data: dict) -> str:
    messages = data.get('item').get('messages')
    if 'text' in messages[1]:
        answer = messages[1].get('text')
    else:
        answer = messages[1].get('adaptiveCards')[0].get('body')[0].get('text')
    answer = answer = filterAnswer(answer)
    return answer

def getUrl(data: dict) -> list:
    sourceAttributions = data.get('item').get('messages')[1].get('sourceAttributions')
    urls = []
    if sourceAttributions:
        for sourceAttribution in sourceAttributions:
            urls.append({
                'title': sourceAttribution.get('providerDisplayName'),
                'url': sourceAttribution.get('seeMoreUrl')
            })
    return urls

def needReset(data: dict, answer: str) -> bool:
    maxTimes = data.get('item').get('throttling').get('maxNumUserMessagesInConversation')
    nowTimes = data.get('item').get('throttling').get('numUserMessagesInConversation')
    errorAnswers = ['I’m still learning', '我还在学习']
    if [errorAnswer for errorAnswer in errorAnswers if errorAnswer in answer]:
        return True
    elif nowTimes == maxTimes:
        return True
    return False

async def getrequestParameter(request: Request) -> dict:
    data = {}
    if request.method == 'GET':
        data = request.query_params
    elif request.method == 'POST':
        data = await request.form()
        if not data:
            data = await request.json()
    return dict(data)

def getToken(request: Request) -> str:
    bearer = request.headers.get('Authorization')

    if not bearer:
        return ''

    tk = re.match(r'Bearer\s+(\S+)', bearer)

    if not tk:
        return ''  

    return tk.group(1)

class GenerateResponse:
    TYPE = Union[str, Response]

    def __init__(self):
        self.response = {}
        self.onlyJSON = False
    
    def _json(self) -> TYPE:
        responseJSON = json.dumps(self.response, ensure_ascii=False)
        if self.onlyJSON:
            return responseJSON
        return Response(responseJSON, media_type='application/json')

    def error(self, code: int, message: str, onlyJSON: bool=False) -> TYPE:
        self.response = {
            'code': code,
            'message': message
        }
        self.onlyJSON = onlyJSON
        return self._json()

    def success(self, data: Any, onlyJSON: bool=False) -> TYPE:
        self.response = {
            'code': 200,
            'message': 'success',
            'data': data
        }
        self.onlyJSON = onlyJSON
        return self._json()

async def checkToken() -> None:
    global CHATBOT
    while True:
        for token in CHATBOT.copy():
            if time.time() - CHATBOT[token]['useTime'] > 5 * 60:
                await CHATBOT[token]['chatBot'].close()
                del CHATBOT[token]
        await asyncio.sleep(60)

@APP.on_event('startup')
async def startup() -> None:
    asyncio.get_event_loop().create_task(checkToken())

@APP.exception_handler(404)
def error404(request: Request, exc: Exception) -> Response:
    return GenerateResponse().error(404, '未找到文件')

@APP.exception_handler(500)
def error500(request: Request, exc: Exception) -> Response:
    return GenerateResponse().error(500, '未知错误')

@APP.route('/create_image', methods=['POST'])
async def create_image(request: Request) -> Response:
    tk = getToken(request)

    if not tk:
        return GenerateResponse().error(110, 'token不能为空')  

    cookies = json.loads(tk)

    if not cookies:
        return GenerateResponse().error(111, 'token错误')

    parameters = await getrequestParameter(request)
    prompt = parameters.get('prompt')

    if not prompt:
        return GenerateResponse().error(110, 'prompt不能为空')

    argU = ''
    for cookie in cookies:
        if cookie.get("name") == "_U":
            argU = cookie.get("value")
            break


    print(argU)
    image_generator = ImageGen(argU)
    imgs = image_generator.get_images(prompt)

    res = {
      'imgs': imgs
    }
    return GenerateResponse().success(res)
 

@APP.route('/api_stream', methods=['GET', 'POST'])
async def apiStream(request: Request) -> Response:
    cookies = json.loads(getToken(request))
    parameters = await getrequestParameter(request)
    token = parameters.get('token')
    style = parameters.get('style')
    question = parameters.get('question')

    if not style or not question:
        return GenerateResponse().error(110, '参数不能为空')
    elif style not in STYLES:
        return GenerateResponse().error(110, 'style不存在')

    token, chatBot = getChatBot(token, cookies)

    async def generator() -> AsyncGenerator:
        index = 0
        info = {
            'answer': '',
            'urls': [],
            'done': False,
            'reset': False,
            'token': token
        }
        async for final, data in chatBot.ask_stream(question, conversation_style=getStyleEnum(style)):
            if not final:
                answer = data[index:]
                index = len(data)
                answer = filterAnswer(answer)
                if answer:
                    info['answer'] = answer
                    yield GenerateResponse().success(info, True)
            else:
                if data.get('item').get('result').get('value') == 'Throttled':
                    yield GenerateResponse().error(120, '已上限,24小时后尝试', True)
                    break
                
                messages = data.get('item').get('messages')
                info['answer'] = getStreamAnswer(data)
                if 'text' not in messages[1]:
                    yield GenerateResponse().success(info, True)
                info['done'] = True
                info['urls'] = getUrl(data)

                if needReset(data, answer):
                    await chatBot.reset()
                    info['reset'] = True
                
                yield GenerateResponse().success(info, True)
    
    return StreamingResponse(generator(), media_type='text/plain')

if __name__ == '__main__':
    uvicorn.run(APP, host=HOST, port=PORT)


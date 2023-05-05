import asyncio
import json
import os
import re
import time
import uuid
from typing import Any, AsyncGenerator, Union

import EdgeGPT
import uvicorn
from BingImageCreator import ImageGen
from fastapi import FastAPI, Request, Response, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

app = FastAPI()

app.add_middleware(
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

def getSuggest(data: dict) -> list:
    suggestedResponses = data.get('item').get('messages')[1].get('suggestedResponses')
    suggest = []
    if suggestedResponses:
        for item in suggestedResponses:
            suggest.append(item.get('text'))
    return suggest

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

@app.on_event('startup')
async def startup() -> None:
    asyncio.get_event_loop().create_task(checkToken())

@app.exception_handler(404)
def error404(request: Request, exc: Exception) -> Response:
    return GenerateResponse().error(404, '未找到文件')

@app.exception_handler(500)
def error500(request: Request, exc: Exception) -> Response:
    return GenerateResponse().error(500, '未知错误')

@app.post('/create_image')
async def create_image(request: Request) -> Response:
    tk = getToken(request)

    if not tk:
        return GenerateResponse().error(110, 'token不能为空')  

    argU = tk
    cookies = json.loads(tk)
    if cookies:
        for cookie in cookies:
            if cookie.get("name") == "_U":
                argU = cookie.get("value")
                break

    parameters = await getrequestParameter(request)
    prompt = parameters.get('prompt')

    if not prompt:
        return GenerateResponse().error(110, 'prompt不能为空')

    imgs = []
    try:
        image_generator = ImageGen(argU, None, False)
        imgs = image_generator.get_images(prompt)
    except Exception as e:
        return GenerateResponse().error(500, e.__str__())

    res = {
      'imgs': imgs
    }
    return GenerateResponse().success(res)
 
@app.post('/api')
async def api(request: Request) -> Response:
    headers_json = getToken(request)
    if not headers_json:
        return GenerateResponse().error(110, 'token不能为空')
    
    cookies = json.loads(headers_json)

    parameters = await getrequestParameter(request)
    token = parameters.get('token')
    style = parameters.get('style')
    question = parameters.get('question')
    if not question:
        return GenerateResponse().error(110, '参数不能为空')
    elif not style or  style not in STYLES:
        style = 'balanced'
    
    token, chatBot = getChatBot(token, cookies)

    if not chatBot:
        return GenerateResponse().error(120, 'token不存在')
    data = await chatBot.ask(question, conversation_style=getStyleEnum(style))
    
    if data.get('item').get('result').get('value') == 'Throttled':
        return GenerateResponse().error(120, '已上限,24小时后尝试')

    info = {
        'answer': '',
        'urls': [],
        'reset': False,
        'token': token
    }
    answer = getAnswer(data)
    answer = filterAnswer(answer)
    info['answer'] = answer
    info['urls'] = getUrl(data)
    
    if needReset(data, answer):
        await chatBot.reset()
        info['reset'] = True
    
    return GenerateResponse().success(info)


@app.post('/api_stream')
async def apiStream(request: Request) -> Response:
    headers_json = getToken(request)
    if not headers_json:
        return GenerateResponse().error(110, 'token不能为空')
    
    cookies = json.loads(headers_json)
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
            'token': token,
            'suggests': []
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
                last = messages[-1]
                if last.get('contentType') == 'IMAGE':
                    info['img_prompt'] = last.get('text')

                info['answer'] = getStreamAnswer(data)
                if 'text' not in messages[1]:
                    yield GenerateResponse().success(info, True)
                info['done'] = True
                info['urls'] = getUrl(data)
                info['suggests'] = getSuggest(data)

                if needReset(data, answer):
                    await chatBot.reset()
                    info['reset'] = True
                
                yield GenerateResponse().success(info, True)
    
    return StreamingResponse(generator(), media_type='text/plain')


@app.get("/")
def read_root():
    return {"Hello": "Bing!"}


if __name__ == '__main__':
    uvicorn.run(app)


# 🧠 GPT-Chat-App

<div>
  <a href="./README.md">中文</a> |
  <a href="./README.en.md">English</a>
</div>

GPT-Chat-App is a frontend project built with TypeScript, Vite, Vue 3, and UnoCSS, allowing users to interact with OpenAI and Bing's GPT models.

[online demo](https://gpt-chat-app-six.vercel.app)
bing services on space: `https://deta.space/discovery/r/sgzhrcavxfxaahhr`

## ✨ Features

1. Modern frontend project built with **TypeScript**, **Vite**, **Vue 3**, and **UnoCSS**.
2. Interaction with **OpenAI** and **Bing** GPT models.
3. **OpenAI** integration:
   - Chat with GPT-3.5
   - Generate images
   - Speech-to-text
   - web access response
4. **Bing** integration:
   - Chat
   - Generate images
5. **PWA application** with responsive design, optimized for mobile access.
6. Bing service implemented using the [Bing-Chat](https://github.com/XiaoXinYo/Bing-Chat) project.
7. **Local storage** of conversation history.
8. Provides **custom prompt** selection and editing features.

## 🚀 Getting Started

### Clone the project

```bash
git clone https://github.com/Hzzy2O/GPT-Chat-App.git
```

### Install dependencies
```bash
pnpm install
```

### Run the project

```bash
pnpm run dev
```

Now you can access http://localhost:3000 to view the application.

### Build for production

```bash
pnpm run build
```

After the build is complete, the dist folder will contain the files required for the production environment.

### bing services

### deta space 
```
https://deta.space/discovery/@hzzy/chat/exp-G7tt
```

```bash
cd ./services
```

#### install
```bash
pip install -r requirements.txt
```
#### run
```bash
python bing_chat.py
```

## 📝 License

This project is licensed under the MIT License.

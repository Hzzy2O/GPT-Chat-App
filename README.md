# 🧠 GPT-Chat-App

<div>
  <a href="./README.md">中文</a> |
  <a href="./README.en.md">English</a>
</div>

GPT-Chat-App 是一个基于 TypeScript、Vite、Vue 3 和 UnoCSS 构建的前端项目，允许用户与 OpenAI 和 Bing 的 GPT 模型进行交互。

[online demo](https://gpt-chat-app-six.vercel.app)
bing services on space: `https://deta.space/discovery/r/sgzhrcavxfxaahhr`

## ✨ 功能介绍

1. 使用 **TypeScript**, **Vite**, **Vue 3** 和 **UnoCSS** 构建的现代前端项目。
2. 提供与 **OpenAI** 和 **Bing** GPT 模型的交互功能。
3. **OpenAI** 集成：
   - 与 GPT-3.5 进行聊天
   - 生成图片
   - 语音转文字
   - 联网响应
4. **Bing** 集成：
   - 聊天
   - 对话中生成图片
   - 生成图片
5. **PWA 应用**，响应式布局，适配移动端访问。
6. 使用 [Bing-Chat](https://github.com/XiaoXinYo/Bing-Chat) 项目实现的 Bing 服务。
7. 会话记录 **本地存储**。
8. 提供 **自定义 prompt** 选择和编辑功能。
9. **autogpt** 集成：
   - 使用 [Auto-Chain-Api](https://github.com/Hzzy2O/Auto-Chain-Api.git) 自动运行任务
   - 文件下载

## 🚀 开始使用

### 克隆项目

```bash
git clone https://github.com/Hzzy2O/GPT-Chat-App.git
```

### 安装依赖
```bash
pnpm install
```

### 运行项目

```bash
pnpm run dev
```

现在可以访问 [http://localhost:3000](http://localhost:3000) 来查看应用。

### 构建生产环境

```bash
pnpm run build
```

构建完成后，`dist` 文件夹内将包含生产环境所需的文件。

### bing服务

```bash
cd ./services
```

#### 安装
```bash
pip install -r requirements.txt
```

#### 启动
```bash
python bing_chat.py
```


## 📝 许可证

本项目采用 [MIT](LICENSE) 许可证。

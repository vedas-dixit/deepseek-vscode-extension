DeepSeek VS Code Extension

🚀 DeepSeek AI-powered VS Code extension for seamless AI interactions within your editor.

Features

AI Chat Panel: Ask DeepSeek AI directly inside VS Code.

Uses DeepSeek-R1 (1.5B) model via Ollama.

Interactive WebView UI: Clean, minimalistic chat interface.

Streaming Response: AI replies dynamically as it processes.

Installation

1️⃣ Install Ollama (Required for Running DeepSeek)

Download and install Ollama based on your OS:

macOS/Linux:

curl -fsSL https://ollama.com/install.sh | sh

Windows:

Download Ollama and install manually.

Then, pull the DeepSeek model:

ollama pull deepseek-r1:1.5b

2️⃣ Install the Extension (Locally)

git clone https://github.com/vedas-dixit/deepseek-vscode-extension.git
cd deepseek-vscode-extension
npm install

3️⃣ Run in VS Code

Open the folder in VS Code

Press F5 to launch in Extension Development Mode

Open the Command Palette (Ctrl+Shift+P → "DeepSeek Chat")

How It Works

The extension opens a WebView where you can enter your prompt.

It sends the query to DeepSeek AI via the Ollama API.

AI responses are streamed back inside VS Code.

Development & Contribution

Want to improve the extension? Follow these steps:

git clone https://github.com/vedas-dixit/deepseek-vscode-extension.git
cd deepseek-vscode-extension
npm install

To Test the Extension Locally:

Open the folder in VS Code

Press F5 to launch the extension in a new window

Test the chat feature

Publish to VS Code Marketplace

1️⃣ Package the Extension

vsce package

This creates a .vsix file.

2️⃣ Publish to Marketplace

vsce publish

If it's an update:

vsce publish minor

License

This project is licensed under the MIT License.
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const child_process_1 = require("child_process");
const ollama_1 = require("ollama");
const vscode = __importStar(require("vscode"));
const ollama = new ollama_1.Ollama();
function checkOllamaInstallation() {
    return new Promise((resolve) => {
        (0, child_process_1.exec)('ollama --version', (error, stdout, stderr) => {
            if (error || stderr) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
async function ensureOllamaInstalled() {
    const isInstalled = await checkOllamaInstallation();
    const isReady = await ensureOllamaInstalled();
    console.log(isInstalled);
    console.log(isReady);
    if (!isReady)
        return;
    pullDeepSeekModel();
    if (!isInstalled) {
        vscode.window.showWarningMessage("Ollama is not installed. Please install it before using Deep Seek Chat.", "Download Ollama").then(selection => {
            if (selection === "Download Ollama") {
                vscode.env.openExternal(vscode.Uri.parse("https://ollama.com/download"));
            }
        });
        return false;
    }
    return true;
}
function pullDeepSeekModel() {
    const terminal = vscode.window.createTerminal("Ollama Setup");
    terminal.show();
    terminal.sendText("ollama pull deepseek-r1:1.5b");
}
function GetWebViewContent() {
    return /* html */ ` 
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deep VS Code Extension</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                padding: 10px;
                background-color: #1e1e1e;
                color: #ffffff;
            }
            h2 {
                text-align: center;
            }
            #prompt {
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                background: #333;
                color: white;
                border: 1px solid #555;
                border-radius: 5px;
            }
            #askbtn {
                display: block;
                width: 100%;
                padding: 10px;
                background-color: #007acc;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            #askbtn:hover {
                background-color: #005f99;
            }
            #response {
                margin-top: 20px;
                padding: 10px;
                background: #222;
                border-radius: 5px;
                min-height: 50px;
                border: 1px solid #555;
            }
        </style>
    </head>
    <body>
        <h2>Deep VS Code Extension</h2>
        <textarea id="prompt" rows="4" placeholder="Ask something..."></textarea>
        <button id="askbtn">Ask</button>
        <div id="response">Response will appear here...</div>

        <script>
            const vscode = acquireVsCodeApi();
            document.getElementById('askbtn').addEventListener('click', async () => {
                const prompt = document.getElementById('prompt').value;
                
                if (!prompt.trim()) {
                    document.getElementById('response').innerText = "Please enter a question.";
                    return;
                }

                document.getElementById('response').innerText = "Thinking...";

                vscode.postMessage({ command: 'chat', text: prompt });

                window.addEventListener('message', event => {
                    const { command, text } = event.data;
                    if (command === 'chatResponse') {
                        document.getElementById('response').innerText = text;
                    }
                });
                document.getElementById('prompt').value ="";
            });
        </script>
    </body>
    </html>
    `;
}
function activate(context) {
    const disposable = vscode.commands.registerCommand('kurama.helloWorld', () => {
        const panel = vscode.window.createWebviewPanel('deepchat', "Deep Seek Chat", vscode.ViewColumn.One, { enableScripts: true });
        panel.webview.html = GetWebViewContent();
        panel.webview.onDidReceiveMessage(async (message) => {
            if (message.command === 'chat') {
                const userPrompt = message.text;
                let responseText = '';
                try {
                    const streamResponse = await ollama.chat({
                        model: 'deepseek-r1:1.5b',
                        messages: [{ role: 'user', content: userPrompt }],
                        stream: true
                    });
                    for await (const part of streamResponse) {
                        responseText += part.message.content;
                        panel.webview.postMessage({ command: 'chatResponse', text: responseText });
                    }
                }
                catch (err) {
                    console.error(err);
                    panel.webview.postMessage({ command: 'chatResponse', text: "Error: Unable to fetch response." });
                }
            }
        });
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map
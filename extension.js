const vscode = require('vscode');

function activate(context) {
    console.log('Congratulations, your extension "Tech Docs Viewer" is now active!');

    let disposable = vscode.commands.registerCommand('extension.openTechDocs', async () => {
        try {
            const techDocs = await selectTechDocs();
            if (!techDocs) {
                vscode.window.showInformationMessage('Tech Docs Viewer: No documentation selected.');
                return;
            }
            const url = getTechDocsURL(techDocs);
            openWebviewPanel(techDocs, url);
        } catch (error) {
            vscode.window.showErrorMessage(`Tech Docs Viewer: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

async function selectTechDocs() {
    return vscode.window.showQuickPick([
        "Python",
        "JavaScript",
        "TypeScript",
        "HTML",
        "CSS",
        "React",
        "Vue.js",
        "Angular",
        "Cheatsheets"
        // Add more tech documentation options here
    ], { placeHolder: 'Select a tech documentation to view' });
}

function getTechDocsURL(techDocs) {
    switch (techDocs) {
        case "Python":
            return 'https://docs.python.org/3/';
        case "JavaScript":
            return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript';
        case "TypeScript":
            return 'https://www.typescriptlang.org/docs/';
        case "HTML":
            return 'https://developer.mozilla.org/en-US/docs/Web/HTML';
        case "CSS":
            return 'https://developer.mozilla.org/en-US/docs/Web/CSS';
        case "React":
            return 'https://react.dev';
        case "Vue.js":
            return 'https://vuejs.org/guide/introduction.html';
        case "Angular":
            return 'https://angular.dev/overview';
        case "Cheatsheets":
            return 'https://overapi.com/';
        // Add more cases for other tech documentation options
        default:
            throw new Error('Invalid tech documentation option');
    }
}

function openWebviewPanel(title, url) {
    const panel = vscode.window.createWebviewPanel(
        'techDocsViewer',
        `${title} Documentation`,
        vscode.ViewColumn.Two,
        {
            enableScripts: true
        }
    );

    panel.webview.html = getWebviewContent(url);
}

function getWebviewContent(url) {
    const options = [
        "Python",
        "JavaScript",
        "TypeScript",
        "HTML",
        "CSS",
        "React",
        "Vue.js",
        "Angular",
        "Cheatsheets"
    ];

    const optionsHtml = options.map(option => `<option value="${option}">${option}</option>`).join('');

    return `
        <style>
            body, html {
                margin: 0;
                padding: 5px;
                height: 100%;
                overflow: hidden;
            }

            #docFrame {
                padding: 5px;
                border: 1px solid #000;
                width: 95vw;
                height: 90vh;
                border: none;
            }
        </style>
        <div>
            <p>Select a tech documentation from the list to view it here.</p>
            <select id="techDocsSelect">
                <option value="" disabled selected>Select a tech documentation</option>
                ${optionsHtml}
            </select>
            <button onclick="search()" style="padding: 3px; border-radius: 5px; background-color: #009bff; color: #fff; font-family: Sans-Serif;font-size: 14px; cursor: pointer;">Search</button>
            <button onclick="goBack()" style="padding: 3px; border-radius: 5px; background-color: #009bff; color: #fff; font-family: Sans-Serif;font-size: 14px; cursor: pointer;">Back</button>
            <button onclick="goForward()" style="padding: 3px; border-radius: 5px; background-color: #009bff; color: #fff; font-family: Sans-Serif;font-size: 14px; cursor: pointer;">Forward</button>
            <iframe id="docFrame" src="${url}"></iframe>
        </div>
        <script>
            function search() {
                const techDocsSelect = document.getElementById('techDocsSelect');
                const selectedOption = techDocsSelect.options[techDocsSelect.selectedIndex].value;
                const url = getTechDocsURL(selectedOption);
                const docFrame = document.getElementById('docFrame');
                docFrame.src = url;
            }

            function goBack() {
                const panel = vscode.window.activeWebviewPanel;
                if (panel) {
                    vscode.commands.executeCommand('browserView.goBack', panel.webview);
                }
            }

            function goForward() {
                const panel = vscode.window.activeWebviewPanel;
                if (panel) {
                    vscode.commands.executeCommand('browserView.goForward', panel.webview);
                }
            }


            function getTechDocsURL(techDocs) {
                switch (techDocs) {
                    case "Python":
                        return 'https://docs.python.org/3/';
                    case "JavaScript":
                        return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript';
                    case "TypeScript":
                        return 'https://www.typescriptlang.org/docs/';
                    case "HTML":
                        return 'https://developer.mozilla.org/en-US/docs/Web/HTML';
                    case "CSS":
                        return 'https://developer.mozilla.org/en-US/docs/Web/CSS';
                    case "React":
                        return 'https://react.dev';
                    case "Vue.js":
                        return 'https://vuejs.org/guide/introduction.html';
                    case "Angular":
                        return 'https://angular.dev/overview';
                    case "Cheatsheets":
                        return 'https://overapi.com/';
                    // Add more cases for other tech documentation options
                    default:
                        throw new Error('Invalid tech documentation option');
                }
            }
        </script>
    `;
}




function deactivate() {}

module.exports = {
    activate,
    deactivate
};


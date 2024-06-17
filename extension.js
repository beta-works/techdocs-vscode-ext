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
            return 'https://reactjs.org/docs/getting-started.html';
        case "Vue.js":
            return 'https://vuejs.org/v2/guide/';
        case "Angular":
            return 'https://angular.io/docs';
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
    return `
        <div>
            <p>Welcome to Tech Docs Viewer!</p>
            <p>Select a tech documentation from the list to view it here.</p>
            <input type="text" id="searchInput" placeholder="Enter search query...">
            <button onclick="search()">Search</button>
            <iframe id="docFrame" src="${url}" frameborder="0" style="overflow:hidden;height:80%;width:100%" height="80%" width="100%"></iframe>
        </div>
        <script>
            function search() {
                const searchQuery = document.getElementById('searchInput').value;
                const docFrame = document.getElementById('docFrame');
                docFrame.src = '${url}' + '?search=' + encodeURIComponent(searchQuery);
            }
        </script>
    `;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};

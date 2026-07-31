
let currentPath = '';  // 現在のパス

// ファイル一覧を読み込む
async function loadFiles(path = '') {
    currentPath = path;
    document.getElementById('path').textContent = '/' + path;

    try {
        const res = await fetch(`/api/list?path=${encodeURIComponent(path)}`);
        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        const tbody = document.querySelector('#fileList tbody');
        tbody.innerHTML = '';

        // 親ディレクトリに戻るボタン
        if (path) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="4" style="cursor:pointer; color:blue;" onclick="goUp()">
                    .. (親ディレクトリに戻る)
                </td>
            `;
            tbody.appendChild(tr);
        }

        data.items.sort((a, b) => {
            if (a.isDir !== b.isDir) return b.isDir - a.isDir; // フォルダを上にする
            return a.name.localeCompare(b.name);
        });

        data.items.forEach(item => {

            const tr = document.createElement('tr');
            const fullPath = path ? `${path}/${item.name}` : item.name;

            tr.innerHTML = `
                <td onclick="${item.isDir ? `navigateTo('${fullPath}')` : `download('${fullPath}')`}" 
                    style="cursor: pointer;">
                    ${item.isDir ? '📁' : '📄'} ${item.name}
                </td>
                <td>${item.isDir ? 'フォルダ' : 'ファイル'}</td>
                <td>${item.isDir ? '-' : formatBytes(item.size)}</td>
                <td>${new Date(item.modified).toLocaleString('ja-JP')}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        alert('一覧取得に失敗しました');
    }
}

// 親ディレクトリへ移動
function goUp() {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    loadFiles(parts.join('/'));
}

// フォルダへ移動
function navigateTo(newPath) {
    loadFiles(newPath);
}

// ダウンロード
function download(filePath) {
    window.location.href = `/api/download?path=${encodeURIComponent(filePath)}`;
}

// ファイルサイズ表示用
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// アップロード
//form送信に変えます
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append('path', currentPath);

    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
        alert('ファイルを選択してください');
        return;
    }

    fileInput.addEventListener("cancel", () => {
        console.log("キャンセル");
        fileInput.value = '';
    });


    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            alert('アップロード完了');
            fileInput.value = '';
            loadFiles(currentPath);
        } else {
            alert('アップロード失敗');
        }
    } catch (err) {
        console.error(err);
        alert('アップロード中にエラーが発生しました');
    }


});


/*
document.getElementById('fileInput').addEventListener('change', async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const formData = new FormData();
    formData.append('path', currentPath);
    for (let file of files) {
        formData.append('files', file);
    }

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const result = await res.json();

        if (result.success) {
            alert('アップロード完了');
            loadFiles(currentPath);  // 再読み込み
        }
    } catch (err) {
        alert('アップロード失敗');
    }

    // 入力リセット
    e.target.value = '';
});

// 新規フォルダ作成

async function createFolder() {
    const name = prompt('新規フォルダ名を入力してください:');
    if (!name) return;

    try {
        const res = await fetch('/api/mkdir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: currentPath, name })
        });
        const result = await res.json();

        if (result.success) {
            loadFiles(currentPath);
        }
    } catch (err) {
        alert('フォルダ作成に失敗しました');
    }
}
*/

// 初期表示
document.addEventListener('DOMContentLoaded', () => {
    loadFiles();
});

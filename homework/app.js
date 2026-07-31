const express = require('express');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 3000;

//ここを今年度のフォルダにする
//angerosからmetatoronへ接続
//参考 https://sftptogo.com/blog/jp/node-js-jp/
const ROOT_DIR = path.join(__dirname, 'uploads'); // 管理するルートフォルダ

//文字化け対策
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});
//

app.use(express.static('public'));
app.use(express.json());

// パス
function safeResolve(reqPath) {
    const resolved = path.resolve(ROOT_DIR, reqPath || '.');
    //初めが公開しているルートフォルダと異なる場合、
    //公開範囲をはみ出しているのでエラーを吐く
    //ディレクトリトラバーサル対策
    if (!resolved.startsWith(ROOT_DIR)) {
        throw new Error('不正なパスです');
    }
    return resolved;
}

//multerの設定 
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        const targetDir = safeResolve(req.body.path || '');
        fs.ensureDirSync(targetDir);
        cb(null, targetDir);
    },

    filename: (req, file, cb) => {
        //ここで日本語のファイル名を正しくデコード
        let originalname = file.originalname;
        try {
            originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        } catch (e) {
            console.log('Filename encoding conversion failed');
        }

        const ext = path.extname(originalname);
        const name = path.basename(originalname, ext);

        //重複防止
        //投稿ファイルの時間毎に名前に秒数数字を追加している
        //ここは上書きか選べるようにしよう
        const today = new Date();
        const safeFilename = `${name}_${today.getMonth()}-${today.getDate()}-${today.getFullYear()}${ext}`;
        cb(null, safeFilename);

    }
});





// ディレクトリ一覧取得
app.get('/api/list', (req, res) => {
    try {
        const dirPath = safeResolve(req.query.path || '');

        console.log('Listing directory:', dirPath);

        const items = fs.readdirSync(dirPath).map(name => {
            const fullPath = path.join(dirPath, name);
            const stat = fs.statSync(fullPath);
            return {
                name,
                isDir: stat.isDirectory(),
                size: stat.size,
                modified: stat.mtime
            };
        });
        res.json({ path: req.query.path || '', items });
    } catch (err) {

        console.error('List error:', err.message);

        res.status(400).json({ error: err.message });
    }
});

// アップロード（複数ファイル対応）
const upload = multer({
    storage: storage,
    //あとでファイルサイズ検討
    limits: { fileSize: 100 * 1024 * 1024 }//100MB
    //dest: 'temp/'
});


app.post('/api/upload', upload.array('files'), async (req, res) => {
    try {
        /*const targetDir = safeResolve(req.body.path || '');
        for (const file of req.files) {
            await fs.move(file.path, path.join(targetDir, file.originalname));
        }*/
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ダウンロード
app.get('/api/download', (req, res) => {
    try {
        const filePath = safeResolve(req.query.path);
        if (fs.statSync(filePath).isDirectory()) {
            return res.status(400).send('フォルダはダウンロードできません');
        }
        res.download(filePath);
    } catch (err) {
        res.status(400).send('ファイルが見つかりません');
    }
});


app.listen(PORT, () => {
    console.log(`サーバー起動: http://localhost:${PORT}`);
    // ルートフォルダ作成
    fs.ensureDirSync(ROOT_DIR);
});

app.get('/test', (req, res) => {
    res.send('サーバは問題なし');
});

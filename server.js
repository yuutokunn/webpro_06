"use strict";

const express = require('express');
const app = express();

// フォームデータ(POST)を解析するための設定
app.use(express.urlencoded({ extended: true }));

let spots = [
    { id: 1, name: "図書館", location: "5号館", status: "空き" },
    { id: 2, name: "コメダ", location: "徒歩10分", status: "混雑" }
];

// --- 1. スポット一覧・検索システム ---
app.get("/", (req, res) => {
    const q = req.query.q || ""; // GETパラメータでの検索
    const filtered = spots.filter(s => s.name.includes(q));

    let rows = filtered.map(s => `
        <tr>
            <td>${s.id}</td>
            <td><a href="/detail?id=${s.id}">${s.name}</a></td> <td>${s.status}</td>
        </tr>`).join("");

    res.send(`
        <h1>📚 津田沼スポット検索</h1>
        <form action="/" method="GET"> <input type="text" name="q" value="${q}" placeholder="名前で検索">
            <button type="submit">検索</button>
        </form>
        <table border="1">${rows}</table>
        <p><a href="/add-page">＋ 新規登録へ</a></p>
    `);
});

// --- 2. スポット詳細表示システム ---
app.get("/detail", (req, res) => {
    const id = parseInt(req.query.id);
    const spot = spots.find(s => s.id === id);

    if (!spot) return res.send("スポットが見つかりません。<a href='/'>戻る</a>");

    res.send(`
        <h1>📍 詳細情報</h1>
        <ul>
            <li>ID: ${spot.id}</li>
            <li>名称: ${spot.name}</li>
            <li>場所: ${spot.location}</li>
            <li>現在の状況: ${spot.status}</li>
        </ul>
        <a href="/">一覧に戻る</a>
    `);
});

// --- 3. スポット登録システム ---
app.get("/add-page", (req, res) => {
    res.send(`
        <h1>🆕 新規スポット登録</h1>
        <form action="/insert" method="POST"> 名称: <input type="text" name="name" required><br>
            場所: <input type="text" name="location" required><br>
            <button type="submit">登録を確定する</button>
        </form>
        <a href="/">キャンセル</a>
    `);
});

// 登録処理実行エンドポイント
app.post("/insert", (req, res) => {
    const newSpot = {
        id: spots.length + 1,
        name: req.body.name,
        location: req.body.location,
        status: "空き"
    };
    spots.push(newSpot);
    // 処理後、一覧ページへリダイレクト（ページ遷移）
    res.redirect("/");
});

app.listen(8080, () => console.log("System running at http://localhost:8080"));
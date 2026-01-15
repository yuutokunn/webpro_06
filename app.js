"use strict";

window.onload = function() {
    fetchBooks();
};


async function fetchBooks() {
    const keyword = document.getElementById("search-keyword").value;
    let url = "/api/books";
    if(keyword) {
        url += `?q=${encodeURIComponent(keyword)}`;
    }

    try {
        const response = await fetch(url);
        const books = await response.json();
        renderTable(books);
    } catch (err) {
        console.error(err);
    }
}


function searchBooks() {
    fetchBooks();
}


function renderTable(books) {
    const tbody = document.getElementById("book-list-body");
    tbody.innerHTML = "";

    books.forEach(book => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${book.id}</td>
            <td style="font-weight:bold; color:#2196F3;">${book.title}</td>
            <td>${book.author}</td>
            <td>${book.status === '状態' ? '🟢 空き' : '🔴 混雑'}</td>
        `;
        tr.onclick = () => fetchBookDetail(book.id);
        tbody.appendChild(tr);
    });
}


async function fetchBookDetail(id) {
    try {
        const response = await fetch(`/api/books/${id}`);
        const book = await response.json();
        renderDetailForm(book);
    } catch (err) {
        console.error(err);
    }
}


function renderDetailForm(book) {
    const area = document.getElementById("detail-area");
    const isEdit = book !== null;

    area.innerHTML = `
        <h2>${isEdit ? '編集・詳細' : '新規登録'}</h2>
        <form onsubmit="return false;">
            <input type="hidden" id="book-id" value="${isEdit ? book.id : ''}">
            
            <label>テナント名</label>
            <input type="text" id="title" value="${isEdit ? book.title : ''}" required>
            
            <label>津田沼からの距離</label>
            <input type="text" id="author" value="${isEdit ? book.author : ''}" required>

            <label>ビル</label>
            <input type="text" id="publisher" value="${isEdit ? book.publisher : ''}">

            <label>価格 (円)</label>
            <input type="number" id="price" value="${isEdit ? book.price : ''}">
            
            <label>綺麗さ</label>
            <input type="number" id="year" value="${isEdit ? book.year : ''}">

            <label>ステータス</label>
            <select id="status">
                <option value="空き" ${isEdit && book.status === '空き' ? 'selected' : ''}>空いている</option>
                <option value="混雑" ${isEdit && book.status === '混雑' ? 'selected' : ''}>混雑</option>
            </select>
            
            <div style="margin-top:20px;">
                <button onclick="${isEdit ? 'updateBook()' : 'createBook()'}">${isEdit ? '更新する' : '登録する'}</button>
                ${isEdit ? '<button class="btn-delete" onclick="deleteBook()">削除</button>' : ''}
            </div>
        </form>
    `;
}

function showCreateForm() {
    renderDetailForm(null);
}


function getFormData() {
    return {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        publisher: document.getElementById("publisher").value,
        price: document.getElementById("price").value,
        year: document.getElementById("year").value,
        status: document.getElementById("status").value
    };
}


async function createBook() {
    await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getFormData())
    });
    alert("登録しました");
    fetchBooks();
    showCreateForm();
}


async function updateBook() {
    const id = document.getElementById("book-id").value;
    await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getFormData())
    });
    alert("更新しました");
    fetchBooks();
}

async function deleteBook() {
    const id = document.getElementById("book-id").value;
    if(!confirm("本当に削除しますか？")) return;
    
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    alert("削除しました");
    fetchBooks();
    showCreateForm();
}
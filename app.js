"use strict";
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


let data = {
    zisyuu: [{ id: 1, name: "図書館5F", location: "5号館", status: "空き" }],
    cafe: [{ id: 1, name: "木", location: "塩豚丼", status: "350円" }],
    risyuu: [{ id: 1, name: "月2", location: "Webプログラミング", status: "231教室" }]
};
let nextId = 100;


const setupRoutes = (path, key) => {
    
    app.get("/" + path, (req, res) => {
        res.render(path + "/list", { items: data[key], mode: "index", target: null });
    });
   
    app.get("/" + path + "/detail/:id", (req, res) => {
        const item = data[key].find(i => i.id === parseInt(req.params.id));
        res.render(path + "/list", { items: data[key], mode: "detail", target: item });
    });
    
    app.get("/" + path + "/edit/:id", (req, res) => {
        const item = data[key].find(i => i.id === parseInt(req.params.id));
        res.render(path + "/list", { items: data[key], mode: "edit", target: item });
    });
    
    app.post("/" + path + "/add", (req, res) => {
        data[key].push({ id: nextId++, ...req.body });
        res.redirect("/" + path);
    });
   
    app.post("/" + path + "/update/:id", (req, res) => {
        const index = data[key].findIndex(i => i.id === parseInt(req.params.id));
        if (index !== -1) data[key][index] = { id: parseInt(req.params.id), ...req.body };
        res.redirect("/" + path);
    });
    
    app.post("/" + path + "/delete/:id", (req, res) => {
        data[key] = data[key].filter(i => i.id !== parseInt(req.params.id));
        res.redirect("/" + path);
    });
};


setupRoutes("zisyuu", "zisyuu");
setupRoutes("cafe", "cafe");
setupRoutes("risyuu", "risyuu");

module.exports = app;
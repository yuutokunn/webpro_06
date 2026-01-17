"use strict";
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


let zisyuuSpots = [{ id: 1, name: "図書館5F", location: "5号館", status: "空き" }];
let cafeterias = [{ id: 1, shop: "津田沼食堂", menu: "カツカレー", price: 450 }];
let courses = [{ id: 1, name: "Webプログラミング", time: "月2", room: "231" }];
let nextId = 100;


app.get("/zisyuu", (req, res) => res.render("zisyuu/list", { items: zisyuuSpots }));
app.post("/zisyuu/add", (req, res) => {
    zisyuuSpots.push({ 
        id: nextId++, 
        name: req.body.name, 
        location: req.body.location, 
        status: req.body.status 
    });
    res.redirect("/zisyuu"); 
});


app.get("/cafe", (req, res) => res.render("cafe/list", { items: cafeterias }));
app.post("/cafe/add", (req, res) => { cafeterias.push({ id: nextId++, ...req.body }); res.redirect("/cafe"); });
app.get("/risyuu", (req, res) => res.render("risyuu/list", { items: courses }));
app.post("/risyuu/add", (req, res) => { courses.push({ id: nextId++, ...req.body }); res.redirect("/risyuu"); });

module.exports = app;

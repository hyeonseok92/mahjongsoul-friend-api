const Database = require("./database.js")
const express = require('express');
const { MahjongSoulDriver } = require('./mahjong_soul_driver');

const app = express();
const db = new Database(/* sync= */true);
const port = 9999;

app.get('/', (req, res, next) => {
  res.send(`
  /api/user/:account_id : Get user info<br>
  /api/stat/east/:account_id : Get user stat for east game<br>
  /api/stat/south/:account_id : Get user stat for south game<br>
  `);
});

app.get("/api/user/:id", (req, res, next) => {
  if (req.params.id == "refresh") {
    db.refreshUserInfo().then(() => {
      res.send("done");
    });
  } else {
    db.getUserInfo(req.params.id).then((rows) => {
      res.json(rows);
    });
  }
});

app.get("/api/user", (req, res, next) => {
  db.getAllUserInfo().then((rows) => {
    res.json(rows);
  });
});

app.get("/api/stat/refresh", (req, res, next) => {
  db.refreshUserStat().then(() => {
    res.send("done");
  });
});

app.get("/api/stat/east", (req, res, next) => {
  db.getAllUserStat("East").then((rows) => {
    res.json(rows);
  });
});

app.get("/api/stat/east/:id", (req, res, next) => {
  db.getUserStat(req.params.id, "East").then((rows) => {
    res.json(rows);
  });
});

app.get("/api/stat/south", (req, res, next) => {
  db.getAllUserStat("South").then((rows) => {
    res.json(rows);
  });
});

app.get("/api/stat/south/:id", (req, res, next) => {
  db.getUserStat(req.params.id, "South").then((rows) => {
    res.json(rows);
  });
});

// Default response for any other request
app.use(function(req, res){
  res.send("Default response");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

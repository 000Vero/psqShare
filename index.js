import express from "express";

const app = express()
const port = 3000

app.set("view engine", "ejs");

app.set("views", "./views");

app.use(express.static("./static"));

app.use(express.json());


app.get("/articles/:page", (req, res) => {
  res.render("home");
})

app.get("/", (req, res) => {
  res.render("home");
})

app.get("/article/:id", (req, res) => {
  res.render("article");
})

app.get("/editor", (req, res) => {
  res.render("editor")
})

app.listen(port)
const express = require("express");
const fetch = require("node-fetch");
const { engine } = require("express-handlebars");
const app = express();
const validateURL = require("./utils/validateURL");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { page: "Cookie skener" });
});

app.post("/:website", async (req, res) => {
  const website = req.body.website;

  if (validateURL(website)) {
    const cookieScan = "https://www.cookieserve.com/get_scan_result?url=" + website;

    try {
      const response = await fetch(cookieScan);

      const websiteCookies = await response.json();

      res.render("cookies", { cookies: websiteCookies.cookies, page: "Scan result" });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.render("404", { page: "404" });
  }
});

// 404 page
app.use((req, res, next) => {
  res.status(404).render("404", { page: "404" });
});

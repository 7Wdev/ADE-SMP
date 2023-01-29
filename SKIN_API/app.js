var createError = require("http-errors");
var path = require("path");
var fs = require("fs");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const express = require("express");
const app = express();
const port = 3001;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

async function PlayerNameToSkin(name) {
  if (name != "" && name !== null) {
    try {
      let data = await fs.promises.readFile(
        path.join(
          __dirname,
          "../SERVER_CORE/plugins/SkinsRestorer/Players/" + name + ".player"
        ),
        "binary"
      );
      return Buffer.from(data).toString("utf8");
    } catch (err) {
      return "invalid name";
    }
  } else {
    return "invalid name";
  }
}

async function SkinToUuid(skin) {
  switch (skin) {
    case "citizen1":
      return "6858e6fd4e83a7c3fbf790ce3747c70e5488a104a8950d6590910eb37d6a22d8";
    case "citizen2":
      return "fff23714064df5fce5b23951d1835cd503ed1a0b51316c30e159d184e816f7e0";
    case "citizen3":
      return "2ae6757a3b1facdc59161c3853f4e914538a75b3f68a039a45411ad59933876a";
    case "citizen4":
      return "81ca34fa4fe564486ea59c8ca83ed68dc397a0d768be3ccf9976b7af49cb6108";
    case "citizen5":
      return "8c855b27c93a19d4ee65591255d1c6aabd2f7b21eda4b1f5b7fd2a59a6957926";
  }
}

app.get("/", (req, res) => {
  res.setHeader("Content-type", "text/html");
  res.send(
    '<p>ADE-SMP simple skin-api to support skinsrestorer fetching!</p><p>for bedrock players use "☎" at the start of their names.</p>'
  );
});

app.get("/skin/avatar/:playername", async (req, res) => {
  let data = await SkinToUuid(await PlayerNameToSkin(req.params.playername));
  console.log(data);
  let img = fs.readFileSync(`avatars/${data}.png`);
  res.writeHead(200, { "Content-Type": "image/png" });
  res.end(img, "binary");
});

const http = require("http");
const server = http.createServer(app);
server.listen(port, "0.0.0.0", () => {
  console.log(`app is listening on port ${port}`);
});

module.exports = app;

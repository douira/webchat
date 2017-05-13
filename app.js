//run with: DEBUG=webchat:* npm start

const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const session = require("express-session");
const FileStore = require("session-file-store")(session);

const chat = require("./routes/chat");
const about = require("./routes/about");
const pickName = require("./routes/pickName");
const validateUsername = require("./routes/validateUsername");
const registerName = require("./routes/registerName");

const DatabaseManager = new require("./databaseManager");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//sessions
app.use(session({
  store: new FileStore({
    retries: 2
  }),
  secret: "GFg54gd/$gs$FSD409",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  name: "webchat.sid",
  maxAge: 3600000 //1 hour
}));

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", chat.router);
app.use("/pick", pickName.router);
app.use("/about", about.router);
app.use("/validateusername", validateUsername.router);
app.use("/registername", registerName.router);

//database for use in route js' that need it
const dbMan = new DatabaseManager();
dbMan.createSet("users", "DictSet");
dbMan.createSet("messages", "OrderedSet");

//attach database on pages that need it
validateUsername.db = dbMan;
chat.db = dbMan;
registerName.db = dbMan;

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//error handler
app.use(function(err, req, res, next) {
  //set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  //render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

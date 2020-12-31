const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const flash = require('connect-flash');
const { sequelize } = require("./app/models");
const session = require('express-session');
const SequelizeStore = require("express-session-sequelize")(session.Store);
const passport = require('passport');
const requestIp = require('request-ip');
const expressFormData = require('express-form-data');
const cookieParser = require('cookie-parser');
const Mail = require("./framework/Mail/Mail");
const middlewares = require("./app/middlewares");
const namedRoutes = require("./framework/ExpressNamedRoutes/namedRoutes");

//Initializations
const app = express();

// Añadimos las variables de entorno de .env a process.env
require('dotenv').config({
  path: path.join(__dirname, '../.env')
});

//Registramos las estrategias de autenticación a usar con passports que serán usadas después por el frameword (propio) de autenticación
require('./framework/Auth/Passport');

// Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "resources/views"));
ejs.delimiter = "?";

app.set("view engine", "ejs");
app.use(expressLayouts);

app.set('layout', 'template/template');

app.use(cookieParser());
app.use(flash());
app.use(session({
  key: 'v56re1as3f1awe5g',
  secret : "gre5g46er8fs321",
  resave : false,
  saveUninitialized : false,
  store : new SequelizeStore({ db: sequelize })
}));
app.use(passport.initialize());
app.use(passport.session());
Mail.setApp(app);

// Middlewares
middlewares(app);

app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(requestIp.mw())
app.use(expressFormData.parse({ keepExtension : true }));

// Routes
app.use(require('./routes'));
app.use(require('./routes/auth'));

namedRoutes.setNamedRoutes(app);

// Public
app.use(express.static(path.join(__dirname, "public")));

// Error codes
app.use((req, res, next) => {
  res.status(404).render("errors/404");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).render("errors/500", { err });
});

// Instalación del certificado SSL
let server;

if (process.env.APP_ENV == "production") {

  server = https.createServer({
    key: fs.readFileSync("/etc/ssl/private/cert.key"),
    cert: fs.readFileSync("/etc/ssl/cert.crt"),
    ca: fs.readFileSync("/etc/ssl/cert.ca-bundle")
  }, app);

  // Redirección a HTTPS (Creo un server http y todas sus rutas redirigiran a https):
  const httpServer = express();

  httpServer.get("*", (req, res) => {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  });

  httpServer.listen(80, () => {
    console.log("El servidor http está corriendo en el puerto ", 80);
  });

}
else {

  server = app;

}

//Starting Server
server = server.listen(app.get("port"), () => {
  console.log("El servidor https está corriendo en el puerto ", app.get("port"));
});

//socketServer(server);

//Socket connection
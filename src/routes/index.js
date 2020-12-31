const express = require('express');
const namedRoutes = require("../framework/ExpressNamedRoutes/namedRoutes");
const expressRouter = express.Router();
const router = namedRoutes.getRouter(expressRouter);

// Controladores

const ViewsController  = require('../app/controllers/ViewsController');

// Enrutador

router.get("/", ViewsController.loadHome).setName("home");

router.get("/profile", ViewsController.loadProfile).setName("profile");

module.exports = router;
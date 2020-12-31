// Establece los middlewares de la aplicación, requiere de la instancia de express para poder establecerlos

module.exports = function (app) {

    const middlewares = [
        "globalVars",
        "modifiers",
        "RedirectWithoutWWW"
    ];

    middlewares.forEach(middleware => {
        app.use(require("./" + middleware)(app));
    });

 }
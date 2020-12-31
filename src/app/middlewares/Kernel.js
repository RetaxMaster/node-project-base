const constantVars = require("../../config/constantVars");
const { NEXT } = constantVars;

/**
 * Esta clase filtra los middlewares que necesita cada ruta, el express router solo permite
 * un único middleware, así que esta clase permite hacer uso de más de un solo middleware,
 * mediante la función getMiddlewareFunction, el express router podrá mandar a ejecutar el
 * middleware, y ya esta función se encargará de filtrar los middlewares requeridos.
 */
class Middleware {

    constructor(list) {

        this.list = list;

        // Similar al routeMiddleware de Laravel
        this.routeMiddleware = {
            auth: require("./Auth"),
            guest: require("./Guest"),
        }

    }

    /**
     * Este es el método retorna la función que se le pasará al middleware
     */
    executeMiddleware() {

        return async (req, res, next) => {

            // Valido cada middleware
            for (const middleware of this.list) {
                
                const middlewareInstance = new this.routeMiddleware[middleware]();
                const middlewareValidationResult = await middlewareInstance.handle(req, res, () => {
                    return NEXT;
                });

                //middlewareValidationResult debe retornar o NEXT o un res.redirect()
                if(middlewareValidationResult != NEXT) return middlewareValidationResult;
                
            }

            return next();

        }

    }

}


module.exports = middlewareList => {
    const middleware = new Middleware(middlewareList);
    return middleware.executeMiddleware();
}
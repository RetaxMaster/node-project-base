// Developed BY RetaxMaster

module.exports = {

    getRouter: router => {

        // Para implementar la funcionalidad de nombres en las rutas tenemos que sobreescribir los métodos ya que debemos interceptar los parámetros pasados a esos métodos, así que primero guardamos los métodos originales con un nombre similar que son los que mandaremos a llamar desde los métodos sobreescritos
        router._get = router.get;
        router._post = router.post;
        router._put = router.put;
        router._delete = router.delete;

        // Creamos las funciones que sobreescribiran los métodos originales
        router.get = (...params) => {
            // Establecemos en el objeto del router la propiedad lastRouteAdded que nos indicará el path de la última ruta que se añadió, esto en orden de ejecución, por tanto, cada que se añada una ruta este valor cambiará, esto puede ser aprovechado por setName para saber cuál ruta se está nombrando
            router.lastRouteAdded = params[0];
            return router._get(...params);
        }

        router.post = (...params) => {
            router.lastRouteAdded = params[0];
            return router._post(...params);
        }

        router.put = (...params) => {
            router.lastRouteAdded = params[0];
            return router._put(...params);
        }

        router.delete = (...params) => {
            router.lastRouteAdded = params[0];
            return router._delete(...params);
        }

        // Función que se encargará de establecer el nombre
        router.setName = (name) => {

            // Creamos una nueva propiedad que contendrá los nombres de las rutas junto con su path
            if(!router.names) router.names = [];

            router.names[name] = router.lastRouteAdded;
            
        };

        return router;
        
    },

    setNamedRoutes: app => {
        // Ya que registramos las diferentes rutas, ahora toca concatenar los paths para las rutas que tengan tal path, en este punto, las rutas que tienen nombre ya traen el objeto names con sus dichas rutas, solo recorreremos dicho objeto para concatenar sus paths, el objeto app._router.stack trae varias instancias de routes, así que hay que recorrerlas y hacer un objeto global de routes el cual podrá consultar el helper routes:

        const router = app._router.stack;
        let allRoutes = {};

        router.forEach(routerInstance => {

            if (routerInstance.name && routerInstance.name == "router") {

                // Ya que las rutas pueden o no tener un path (Un precedente en la url) recorremos cada ruta y le concatenamos ese path
                const names = routerInstance.handle.names;
                let regexpPath = routerInstance.regexp.toString();

                // En caso de que haya parámetros en el path reemplazamos el regexp por su tag (El router reemplaza el tag por un regexp, nosotros haremos la inversa pues es lo que nos interesa)
                const keys = routerInstance.keys;

                keys.forEach(param => {

                    const start = param.offset + 2; // Se suma dos para contar los delimitadores regexp
                    const end = start + 15; // 14 es lo que mide el regexp que pone el router

                    // Obtenemos la primera parte de la cadena
                    const firstPart = regexpPath.substring(0, start);

                    // Obtenemos la segunda parte de la cadena
                    const secondPart = regexpPath.substring(end, regexpPath.length);

                    // Reemplazamos la regexp por el tag
                    regexpPath = firstPart + "/:" + param.name + secondPart;
                    
                });

                const pathOcurrences = regexpPath.match(/\/\:?[A-Za-z0-9]+/igm); // Busco todas las ocurrencias del tipo /some (Retorna un array)
                let path;

                if (pathOcurrences != null) {
                    pathOcurrences.pop(); // Quito el último elemento pues igual me traerá el /i de la expresión regular
                    path =  pathOcurrences.join(""); // Unimos las ocurrencias
                }
                else {
                    path = "";
                }

                for (const key in names) names[key] = path + names[key];

                Object.assign(allRoutes, names)

            }

        });

        // Establecemos la lista de rutas en el objeto de rutas
        app._router.names = allRoutes;

    }

};
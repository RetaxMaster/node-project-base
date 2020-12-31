/*
Archivo creado por RetaxMaster, este archivo maneja creadores de eventos
*/

const events = {
    //Establece el evento a un único nodo, recibe el evento, un objeto de tipo nodo y un callback - RetaxMaster
    eventOne : (allEvents, element, callback, getThis = false) => {
        if (element) {

            allEvents = allEvents.split(" ");

            if (!getThis) {
                allEvents.forEach(event => {
                    element.addEventListener(event, e => {
                        callback(element, e);
                    });
                });
            }
            else {
                allEvents.forEach(event => {
                    element.addEventListener(event, callback);
                })
            }
        }
    },
    
    //Establece un evento a todos los elementos que sean pasados mediante el selector CSS, recibe el evento, el selector (O también puede ser un objeto de tipo nodo) y un callback - RetaxMaster 
    event : (allEvents, elements, callback, getThis = false) => {
        if ((typeof elements == "string")) elements = document.querySelectorAll(elements);
        elements =(elements.children != undefined) ? [elements] : Array.from(elements);

        // La validación de elements.children != undefined se hacer porque, para usar el forEach necesitamos que elements sea un array que contenga todos los elementos seleccionados, cuando pasamos en elements un string no hay problema, pues gracias al querySelectorAll, siempre va a retornar un objeto de tipo NodeList, por consecuencia, este objeto NO tiene definida la propiedad children, porque el objeto NodeList es una lista de objetos HTMLCollection, entonces, simplemente convertimos el NodeList a un Array, en cambio, si en elements pasamos un objeto, es posible que estemos pasando un querySelector y no un querySelectorAll, en cuyo caso, querySelector devuelve un objeto HTMLCollection, estos objetos SI tienen la propiedad children definida (Aún así sea un elemento sin hijos), al ser un objeto HTML no podermos usar Array.from, así que simplemente lo encerramos en corchetes a modo de crear un array con ese único objeto HTML
            
        elements.forEach(element => {
            events.eventOne(allEvents, element, callback, getThis);
        });
    },
    
    //Establece un evento a todos los elementos del padre que sean pasados mendiante el selector CSS, esta función se puede usar para darle eventos a los items añadidos dinamicamente con JavaScript, recibe el evento, el elemento padre en el cual se buscará el hijo, el elemento hijo el cual tendrá el evento y un callback - RetaxMaster
    //.test .me
    eventAll : (allEvents, parentElement, element, callback, getThis = false) => {

        const addEventToChildrens = parent => {

            // Primero se le añade el evento a todos los elementos que ya existen
            events.event(allEvents, element, callback, getThis);

            // Luego usaremos el MutationObserver para añadir el evento a los elementos que sean añadidos dinámicamente
            const config = { childList: true, subtree: true }

            const observerCallback = (mutationsList, observer) => {
                

                // Recorremos cada mutación observada
                if (Array.isArray(mutationsList)) {
                    mutationsList.forEach(mutation => {
    
                        // Miramos que elementos se añadieron y buscamos si dentro de esos elementos añadidos están los que necesitan llevar el evento
                        const addedElements = mutation.addedNodes;
                        
                        addedElements.forEach(children => {

                            // Primeo buscamos si el nodo añadido coincide con el elemento que se está buscando, este querySelectorAll buscará todos los elementos que coincidan con el buscado, de esta forma compararemos si el nodo que nos está informando MutationObserver es el nodo buscado, y se le añadirá el evento al nodo del mutation observer para no duplicar eventos
                            const availableElements = Array.from(parent.querySelectorAll(element));

                            let includesTheSearchedElement = availableElements.includes(children);


                            if (!includesTheSearchedElement && children instanceof HTMLElement) {

                                // Si no lo incluye, es porque probablemente se esté buscando un subelemento del elemento insertado, (children solo contendrá al elemento mayor insertado, NO contendrá a todos sus subelementos) Así que buscamos si el elemento a buscar está dentro de children, si sí está, entonces será ese al que le añadiremos el evento

                                let added = children.querySelector(element);
                                
                                if (added != null) {
                                    includesTheSearchedElement = true;
                                    children = added;
                                }
                                
                            }

                            // Si en este punto aún no incluye el elemento buscado, es porque el elemento que nos está informando MutationObserver no es el que estamos buscando así que no hacemos nada, si sí lo incluye, entonces añadimos el evento
                            if (includesTheSearchedElement) events.eventOne(allEvents, children, callback, getThis);
    
                        });
    
    
                    });
                }
            
            };

            const observer = new MutationObserver(observerCallback);
            observer.observe(parent, config);

        }
    
        if (typeof parentElement == "string") {
            parentElement = document.querySelectorAll(parentElement);
            parentElement.forEach(parent => {
                addEventToChildrens(parent);
            });
        }
        else{
            addEventToChildrens(parentElement);
        } 
    }
}

export default events;
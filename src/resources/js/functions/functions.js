/*
Archivo creado por RetaxMaster, este archivo maneja funciones generales que pueden ser de ayuda durante el desarrollo
*/


const functions = {

    //Valida inputs y textareas de un formulario
    validateInputs : form => {
        let flag = true;
        form.querySelectorAll("input:not(.no-required), textarea:not(.no-required), .text-area-container .text-area").forEach(element => {
            if ((element.tagName == "INPUT" && element.value == "") || (element.tagName == "TEXTAREA" && element.value == "") || (element.tagName == "DIV" && element.textContent == "")) {
                flag = false;
                element.classList.add("is-invalid");
            } else {
                element.classList.remove("is-invalid");
            }
        });
        return flag;
    },

    //Crea un Nodo HTML a partir de un string - RetaxMaster
    createHTMLNode : html => {
        return (new DOMParser()).parseFromString(html, 'text/html').body.children[0];
    },

    // Quita todos los espacios de una cadena
    removeSpaces : string => {
        return string.split(" ").join("");
    },
    
    //Realiza una petición Ajax, recibe la url y el tipo de petición, opcionalmente recibe los datos a enviar  y el tipo de respuesta, por defecto está en text, puede recibir text o json - RetaxMaster
    ajax : (url, method, data = null, responseType = "text", contentType = true, processData = true, useXMLHttpRequest = false) => {

        // Procesos generales
        
        // Compruebo si existe algun csrf-token en el atributo meta
        const csrf_token_node = document.querySelector("meta[name='csrf-token']");
        const csrf_token = csrf_token_node != null;
        // -> Compruebo si existe algun csrf-token en el atributo meta

        // Especifico los headers
        const headers = new Headers();
        if (csrf_token) headers.append("X-CSRF-TOKEN", csrf_token_node.content);
        if (contentType) {
            headers.append("Accept", "application/json");
            headers.append("Content-Type", "application/json; charset=UTF-8");
        }
        // -> Especifico los headers

        if (method.toUpperCase() == "GET" && data != null) {
            url = new URL(url);
            Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));
        }
        
        // -> Procesos generales

        // Enviando la petición con Fetch o con XMLHttpRequest
        
        if (!self.fetch || useXMLHttpRequest) {
            //Solicitud usando XMLHttpRequest
            const xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            const success = new Promise((resolve, reject) => {
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status >= 200 && this.status < 300) {
                            const response = responseType == "text" ? this.responseText : JSON.parse(this.responseText);
    
                            resolve(response);
                        }
                        else {
                            console.log("Status: ", this.status);
                            reject("Request failed.");
                        }
                    }
                };

                
            });
            
            xhr.upload.addEventListener("progress", function(e) {});

            xhr.open(method.toUpperCase(), url, true);
            headers.forEach((value, key) => {
                xhr.setRequestHeader(key, value);
            });
            
            data = method.toUpperCase() == "GET" ? "" : (processData ? JSON.stringify(data) : data);
            xhr.send(data);
            
            return useXMLHttpRequest ? { success, xhr } : success;

        }
        else {
            //Solicitud usando Fetch
            return new Promise(async (resolve, reject) => {
                
                const params = (method.toUpperCase() == "GET") ? {
                    headers: headers                    
                } : {
                    headers: headers,
                    method: method.toUpperCase(),
                    body: processData ? JSON.stringify(data) : data
                };

                try {
                    let res = await fetch(url, params);
                    res = await res.text();
            
                    if (responseType == "text") {
                        resolve(res);
                    }
                    else {
                        resolve(JSON.parse(res));
                    }
                } catch(e) {
                    reject(e);
                }

            });
        }
        
        // -> Enviando la petición con Fetch o con XMLHttpRequest
        
    },
    
    //Quita un elemento del DOM - RetaxMaster
    remove : selector => {
        if ((typeof selector == "string")) selector = document.querySelectorAll(selector);
        if (selector != null) {
            selector = (selector.children != undefined) ? [selector] : Array.from(selector);
            
            selector.forEach(element => {
                element.parentNode.removeChild(element);
            });
        }
    },
    
    //Obtiene una cadena aleatoria - RetaxMaster
    getRandomString : length => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    
        return text;
    },
    
    //Sanea un string - RetaxMaster
    filterString : (string, type) => {
        let sanitized;
        switch (type) {
            case 'string':
                sanitized = string.replace(/[^a-zA-Z0-9á-ú-A-Ú., \\W]/igm, "");
                break;
    
            case 'keep_html_characters':
                sanitized = string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
                break;
    
            case 'remove_special_chars_low':
                sanitized = string.replace(/[^A-Za-z0-9á-úÁ-Ú., ?¿¡!.:;]/igm, "");
                break;
    
            case 'remove_special_chars_medium':
                sanitized = string.replace(/[^A-Za-z0-9á-úÁ-Ú., ?¿¡!]/igm, "");
                break;
    
            case 'remove_special_chars_high':
                sanitized = string.replace(/[^A-Za-z0-9á-úÁ-Ú ]|¿/igm, "");
                break;
    
            case 'keep_only_words':
                sanitized = string.replace(/\d/igm, "");
                break;
    
            case 'keep_only_numbers':
                sanitized = string.replace(/\D/igm, "");
                break;
    
            case 'email':
                sanitized = string.replace(/[^A-Za-z0-9á-úÁ-Ú@._\-]/igm, "");
                break;
    
            default:
                sanitized = string.trim();
                break;
        }
        return sanitized;
    },
    
    //Valida cualquier string - RetaxMaster
    validateString : (string, type) => {
        let validated;
        switch (type) {
            case 'email':
                validated = /^[A-Za-z0-9á-úÁ-Ú_\-]+@[a-z0-9]+.[a-z]+(.[a-z]+)?$/ig.test(string);
                break;
    
            case 'float':
                validated = /^\d+\.\d+$/.test(string);
                break;
    
            case 'int':
                validated = /^\d+$/.test(string);
                break;
    
            case 'ip':
                validated = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,4})?$/.test(string);
                break;
    
            case 'friendlyUrl':
                validated = /^(https?:\/\/)?[a-z]([a-z0-9\-]+[a-z0-9])?\.[a-z]([a-z0-9\-]+[a-z0-9])?\.[a-z]+(.[a-z]+)?\/?(\/[a-z]([a-z0-9\-]+[a-z])?\/?)+?$/.test(string);
                break;
    
            case 'url':
                const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
                validated = !!pattern.test(string);
                break;
    
            default:
                validated = false;
                break;
        }
        return validated;
    },
    
    //Quita acentos - RetaxMaster
    removeAccent : texto => {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    },
    
    //Convierte un número en formato de moneda - RetaxMaster
    parseMoney : money => {
        return `$${money.toFixed(2)}`;
    },
    
    //Añade ceros a la izquierda - RetaxMaster
    addLeftZeros : (text, quantity) => {
        return text.padStart(quantity, "0");
    },
    
    //Quita los ceros a la izquierda - RetaxMaster
    removeLeftZeros : text => {
        return text.replace(/^0+/, "");
    },
    
    //Convierte un string a formato URL Amigable - RetaxMaster
    convertStringToUrl : word => {
        let wordCleaned;
        wordCleaned = functions.filterString(word, "remove_special_chars_high");
        wordCleaned = functions.filterString(wordCleaned, "string").split(" ").join("-");
        wordCleaned = functions.removeAccent(wordCleaned);
        wordCleaned = wordCleaned.toLowerCase();
        return wordCleaned;
    },
    
    //Simplifica un objeto en base a un índice dado (Puede ser un objeto de objetos) - RetaxMaster
    simplifyObject : (object, index) => {
        const newObject = {};
        let i = 0;
        for (const key in object) {
            newObject[i] = object[key][index];
            i++;
        }
        return newObject;
    },
    
    //Simplifica un array en base a un índice dado (Puede ser un array de arrays) - RetaxMaster
    simplifyArray : (array, index) => {
        const newArray = [];
        array.forEach(item => {
            newArray.push(item[index]);
        });
        return newArray;
    },

    // Convierte un Json a Array
    jsonToArray : json => {
        var array = [];

        for (const key in json)
            array[key] = json[key];

        return array;
    },

    //Convierte una array a fomrato URL amigable - RetaxMaster
    filterArrayUrl: (array) => {
        let newArray = [];
        array.forEach(item => {
            newArray.push(functions.convertStringToUrl(item));
        });
        return newArray;
    },
    
    //Restaura las palabras de la URL, recibe un arreglo a comparar como parámetro opcional, esto en en el caso de que, existan elementos en la URL que sea dificil restaurar, por ejemplo, las palabras con acentos, si se tiene una base, se puede comparar la palabra sin acento con alguna de las palabras con acento aplicando un poco de ingenieria inversa, devuelve una cadena vacía si no lo encuentra - RetaxMaster
    restoreUrlValue : (word, arrayToCompare = []) => {
        //Si envió un arreglo para hacer la comparación...
        if (arrayToCompare.length > 0) {
            //Primero creo un arreglo de todas las posibles palabras que puede contener (Al enviar el arreglo, se da por hecho de que la palabra si existe, solo hay que encontrarla) Por ello es que se transforma a cómo se vería en la URL
            
            const posibleWords = functions.filterArrayUrl(arrayToCompare);
    
            //En este punto, la posible palabra está dentro del arreglo $posibleWords, así que toca buscar su índice
            
            const index = posibleWords.indexOf(word);
    
            //En este punto ya encontré la palabra, así que solo queda retornar la palabra traducida de la siguiente forma:
            
            word = (index != -1) ? arrayToCompare[index] : "";
    
        } else {
            word = word.split("-").join(" ").capitalize();
        }
        return word;
    },
    
    //Añade los espacios de la URL(%20) - RetaxMaster
    addUrlSpaces : text => {
        return text.split(" ").join("%20");
    },

    //Hace un log de un objeto FormData
    logFormData : formData => {
        for (let pair of formData.entries()) {
            console.log("Field: ", pair[0]);
            console.log("Value: ", pair[1]);
        }
    },

    //Obtiene parámetros GET de una URL
    getParameterByName : name => {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    //Hace un smooth scrolling a tal posición
    smoothScrollTo : (element, endX, endY, duration = 400) => {
        const startX = element.scrollX || element.pageXOffset || element.scrollLeft,
            startY = element.scrollY || element.pageYOffset || element.scrollTop,
            distanceX = endX - startX,
            distanceY = endY - startY,
            startTime = new Date().getTime();

        // Easing function
        const easeInOutQuart = (time, from, distance, duration) => {
            if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
            return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
        };

        const timer = setInterval(() => {

            const time = new Date().getTime() - startTime,
                newX = easeInOutQuart(time, startX, distanceX, duration),
                newY = easeInOutQuart(time, startY, distanceY, duration);

            if (time >= duration)
                clearInterval(timer);

            element.scrollTo(newX, newY);

        }, 1000 / 60); // 60 fps
    },

    //Obtiene la fecha a partir de un tiemstamp
    getDateFromTimestamp : timestamp => {
        const date = new Date(timestamp);
        const daysOfTheWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        // Obteniendo los datos
        
        const weekDay = daysOfTheWeek[date.getDay()];
        const numberDay = functions.addLeftZeros(date.getDate().toString(), 2);
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        // -> Obteniendo los datos
        
        return `${weekDay} ${numberDay} de ${month} del ${year}`;
    },

    //Obtiene la fecha corta a partir de un tiemstamp
    getShortDateFromTimestamp: timestamp => {
        const date = new Date(timestamp);

        // Obteniendo los datos
        const numberDay = functions.addLeftZeros(date.getDate().toString(), 2);
        const month = functions.addLeftZeros((date.getMonth() + 1).toString(), 2);
        const year = date.getFullYear();

        // -> Obteniendo los datos

        return `${numberDay}/${month}/${year}`;
    },

    //Obtiene la hora a partir de un timestamp
    getTimeFromTimestamp : timestamp => {
        const time = new Date(timestamp);

        // Obteniendo los datos
        
        let hour = time.getHours().toString();
        const ampm  = hour > 12 ? "p.m" : "a.m";
        hour = hour > 12 ? hour - 12 : hour;
        hour = functions.addLeftZeros(hour.toString(), 2);
        const minutes = functions.addLeftZeros(time.getMinutes().toString(), 2);
        
        // -> Obteniendo los datos

        return `${hour}:${minutes}${ampm}`;
    },

    translateToTime : (time, getHours = true) => {
        let hours, minutes, seconds;
    
        hours = Math.floor(time/3600);
        time %= 3600;
        minutes = Math.floor(time/60);
        seconds = Math.floor(time%60);
    
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
    
        return getHours ? hours + ":" + minutes + ":" + seconds : minutes + ":" + seconds;
    },

    //Obtiene la fecha completa a partir de un tiemstamp
    getFullDate : timestamp => {
        return functions.getDateFromTimestamp(timestamp) + " a las " + functions.getTimeFromTimestamp(timestamp);
    },

    // Valida si el navegador soporta drag & drop
    canDragNDrop : () => {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    },

    // Valida un archivo de Excel
    validateExcelFile: (excelFile) => {
        
        const validFormats = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
        return validFormats.includes(excelFile.type);

    }

}

export default functions;
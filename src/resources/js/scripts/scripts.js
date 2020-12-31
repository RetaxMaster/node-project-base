require("../bootstrap");

import events from "../functions/events";
import FJ from "../functions/FamilyJewels";
import m from "../functions/modal";
import f from "../functions/functions";
import smoothscroll from 'smoothscroll-polyfill';
import moment from "moment";

const { eventOne, eventAll, event } = events;

// kick off the polyfill!
smoothscroll.polyfill();

document.addEventListener("DOMContentLoaded", () => {

    // Ventana modal
    
    //Cerrar la ventana al hacer click afuera
    document.addEventListener("click", e => {
        let _this = e.target;
        if ((_this.classList.contains('close-modal') || _this.classList.contains('modal-main')) && document.querySelector("#loading").style.display != "block") m.closeModal();
    });
    
    // -> Ventana modal

});
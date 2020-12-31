/*
Archivo creado por RetaxMaster, este archivo maneja funciones para la ventana modal
*/

// Funciones

const modalFunctions = {
    closeModal: () => {
        const modal = document.querySelector("#modal");
        modal.classList.remove("show");

        setTimeout(() => {
            const cards = modal.querySelectorAll(".modal-card");
            cards.forEach(e => e.style.display = "none");
        }, 300);
    },

    showModal: e => {
        document.querySelector(`#${e}`).style.display = "block";
        document.querySelector("#modal").classList.add("show");
    },

    loading: (status, tag) => {
        if (status) {
            document.querySelector("#loading .tag").textContent = tag;
            modalFunctions.showModal("loading");
        } else {
            modalFunctions.closeModal();
        }
    }
}


// -> Funciones

export default modalFunctions
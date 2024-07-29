const id = localStorage.getItem('id');

let listaEjercicios = {
    lunes: [],
    martes: [],
    miercoles: [],
    jueves: [],
    viernes: [],
    sabado: [],
    domingo: []
};

function createImage(src, isActive = false) {
    const carouselItem = document.createElement("div");
    carouselItem.setAttribute("class", isActive ? "carousel-item active h-100" : "carousel-item h-100");

    const image = document.createElement("img");
    image.setAttribute("src", src);
    image.setAttribute("class", "d-block mx-auto");

    carouselItem.append(image);
    return carouselItem;
}

function createCarousel(img1, img2) {
    const carousel = document.createElement("div");
    carousel.setAttribute("class", "carousel slide carousel-fade card-img-container");
    carousel.setAttribute("data-bs-ride", "carousel");
    carousel.setAttribute("data-bs-pause", "false");
    carousel.setAttribute("data-bs-interval", "3000");

    const carouselInner = document.createElement("div");
    carouselInner.setAttribute("class", "carousel-inner h-100");

    const carouselItem1 = createImage(`http://127.0.0.1:8000/img/ejercicios_lista/${img1}`, true);
    const carouselItem2 = createImage(`http://127.0.0.1:8000/img/ejercicios_lista/${img2}`);

    carouselInner.append(carouselItem1, carouselItem2);
    carousel.append(carouselInner);
    
    return carousel;
}

function createCard(content) {
    const item = document.createElement("div");
    item.setAttribute("class", "col-12 col-sm-6 col-lg-4 col-xl-3 mb-4 item");

    const card = document.createElement("div");
    card.setAttribute("class", "card h-100 card-ejercicio");
    card.setAttribute("data-content", content.id);

    const carousel = createCarousel(content.img1, content.img2);
    card.append(carousel);

    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body d-flex align-items-center justify-content-center");

    const cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title text-center m-0");
    cardTitle.textContent = content.name;

    cardBody.append(cardTitle);
    card.append(cardBody);
    item.append(card);

    return item;
}

function createCards(data) {
    const container = document.getElementById("exercises");
    
    data.exercises.forEach(content => {
        const card = createCard(content);
        container.append(card);
    });
    
    // Inicializa los carruseles de Bootstrap 
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        new bootstrap.Carousel(carousel);
    });

    // Añade evento a las cards para guardar los ejercicios que el usuario selecciona por dia
    const cards = document.querySelectorAll(".card-ejercicio");
    cardsEvents(cards)
}

function cardsEvents (cards) {
    const modalEjercicios = document.getElementById("modal-ejercicios");
    
    cards.forEach(card => {
        card.addEventListener("click", () => {

            // alterna los estilos 
            toggleCardEjercicio(card);
    
            // añade el ejercicio a la lista
            const diaActivo = modalEjercicios.getAttribute("data-content");
            const idEjercicio = card.getAttribute("data-content");
            const ejercicioNombre = card.querySelector(".card-title").textContent;

            const ejercicio = {
                id: idEjercicio,
                nombre: ejercicioNombre,
                peso: null,
                series: null,
                repeticiones: null,
                descanso: null
            };

            if (card.classList.contains("card-activado")) {
                listaEjercicios[diaActivo].push(ejercicio);

            } else {
                const index = listaEjercicios[diaActivo].findIndex(ej => ej.id === idEjercicio);
                listaEjercicios[diaActivo].splice(index, 1);
            }
            actualizarTabla(diaActivo);
            console.log(listaEjercicios);
        });
    });  
}

function toggleCardEjercicio (card) {
    card.classList.toggle("border-success");
    card.classList.toggle("card-activado");
    const cardBody = card.querySelector(".card-body");
    cardBody.classList.toggle("activado");    
}

// -------------------- actualizar tabla de ejercicios --------------------

function actualizarTabla(dia) {
    const tabla = document.getElementById(`tabla-${dia}`);
    tabla.innerHTML = "";

    if (listaEjercicios[dia][0] == -1) {
        tablaDescanso(tabla);
    } else {
        ejerciciosTabla(tabla, dia);
    }
}

function ejerciciosTabla(tabla, dia) {
    for (let i = 0; i < listaEjercicios[dia].length; i++) {
        const ejercicio = listaEjercicios[dia][i];
        const nuevaFila = crearFilaEjercicio(i + 1, ejercicio.nombre, dia, ejercicio.id);
        tabla.appendChild(nuevaFila);
    }
}

function crearFilaEjercicio(numero, nombre, dia, id) {
    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
        <th scope="row">${numero}</th>
        <td class="col-4">${nombre}</td>
        <td><input type="number" class="form-control form-control-sm text-center align-center" data-id="${id}" data-dia="${dia}" data-tipo="peso" placeholder="30 (kg)" min="1"></td>
        <td><input type="number" class="form-control form-control-sm text-center align-center" data-id="${id}" data-dia="${dia}" data-tipo="series" placeholder="4" min="1"></td>
        <td><input type="number" class="form-control form-control-sm text-center align-center" data-id="${id}" data-dia="${dia}" data-tipo="repeticiones" placeholder="12" min="1"></td>
        <td><input type="number" class="form-control form-control-sm text-center align-center" data-id="${id}" data-dia="${dia}" data-tipo="descanso" placeholder="120 (seg)" min="1"></td>
    `;
    return nuevaFila;
}

function tablaDescanso(tabla) {
    const nuevaFila = crearFilaDescanso();
    tabla.appendChild(nuevaFila);
}

function crearFilaDescanso() {
    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
        <th scope="row">1</th>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
    `;
    return nuevaFila;
}

document.addEventListener('DOMContentLoaded', function () {

    // -------------------- checkBoxes de dia descanso --------------------

    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const dia = this.id.split('-').pop(); // Extrae el día del id del checkbox
            const button = document.querySelector(`button[data-content="${dia}"]`);

            if (this.checked) {
                button.disabled = true;
                listaEjercicios[dia] = [];
                listaEjercicios[dia].push(-1); 

            } else {
                button.disabled = false;
                listaEjercicios[dia] = [];
            }
            console.log(listaEjercicios);
            actualizarTabla(dia);
        });
    });
    
    // -------------------- manejo del modal --------------------
    
    const modalEjercicios = document.getElementById('modal-ejercicios');
    modalEjercicios.addEventListener('show.bs.modal', function (event) {

        const button = event.relatedTarget;
        const diaActivo = button.getAttribute('data-content');

        modalEjercicios.setAttribute("data-content", diaActivo);

        const modalTitulo = modalEjercicios.querySelector('.modal-title');
        modalTitulo.textContent = `Dia de entrenamiento: ${diaActivo.charAt(0).toUpperCase() + diaActivo.slice(1)}`;
        
        const cards = document.querySelectorAll(".card-ejercicio");
        cards.forEach(card => {

            const ejercicioContent = card.getAttribute("data-content");

            if (card.classList.contains("card-activado")) {
                toggleCardEjercicio(card);
            }

            if (listaEjercicios[diaActivo].some(e => e.id === ejercicioContent)) {
                toggleCardEjercicio(card);
            }
        })
    });

    // -------------------- barra de busqueda --------------------
    
    document.getElementById("searchInput").addEventListener("input", function() {
        const input = document.getElementById("searchInput").value.toLowerCase();
        const items = document.querySelectorAll(".item");
    
        items.forEach(item => {
            const title = item.querySelector(".card-title").textContent.toLowerCase();
    
            if (title.includes(input)) {
                item.removeAttribute("hidden");
            } else {
                item.setAttribute("hidden", "");
            }
        });
    });

    // -------------------- peticion al backend --------------------

    fetch("http://localhost:5000/exercises")
        .then(response => response.json())
        .then(createCards)
        .catch(error => console.error('El servidor fallo:', error));

    // -------------------- subir rutina --------------------

    document.getElementById("form-rutina").addEventListener("submit", function(event) {
        event.preventDefault()

        // nombre de la rutina
        const nombreRutina = document.getElementById("nombre-rutina").value;
        console.log("Nombre: " + nombreRutina);

        // descripcion de la rutina
        let descripcionRutina = document.getElementById("desc-rutina").value

        if (descripcionRutina.trim() === "") {
            descripcionRutina = "Sin descripción";
        }
        console.log("Descripcion: " + descripcionRutina);

        // añadir los inputs de los ejercicios al objeto listaRutinas
        const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

        dias.forEach(dia => {

            const inputs = document.querySelectorAll(`input[data-dia="${dia}"]`)
            inputs.forEach(input => {
                
                const tipo = input.getAttribute("data-tipo");
                const valor = input.value;
                const ejercicio = listaEjercicios[dia].find(ej => ej.id === input.getAttribute('data-id'))

                if (tipo == "peso"){
                    if (valor == ""){
                        ejercicio.peso = 30;
                    }else{
                        ejercicio.peso = valor;
                    }
                }else if (tipo == "series"){
                    if (valor == ""){
                        ejercicio.series = 4;
                    }else{
                        ejercicio.series = valor;
                    }
                }else if (tipo == "repeticiones"){
                    if (valor == ""){
                        ejercicio.repeticiones = 12;
                    }else{
                        ejercicio.repeticiones = valor;
                    }
                }else if (tipo == "descanso"){
                    if (valor == ""){
                        ejercicio.descanso = 120;
                    }else{
                        ejercicio.descanso = valor;
                    }
                }
            })

            // aquellas tablas sin ejercicio se los considera como dia de descanso (valor -1)
            if (listaEjercicios[dia].length == 0) 
                listaEjercicios[dia][0] = -1;

        })

        fetch('http://localhost:5000/rutines', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({descripcionRutina, nombreRutina, id, listaEjercicios}),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Rutina creada existosamente. Puedes encontrarla en "Mi perfil" o en "Explorar"');
                window.location.href = `http://127.0.0.1:8000/rutinas/explorar/buscar/?name=${nombreRutina}`;
            } else {
                alert("error");
            }
        })
        .catch(error => console.error('El servidor fallo:', error));
    })
    
});
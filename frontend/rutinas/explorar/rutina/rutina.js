const id_usuario = localStorage.getItem("id");
let id_rutina = null;

function eliminar_rutina(id){
    if (window.confirm("¿Seguro quieres eliminar este comentario?")){
        fetch('http://localhost:5000/rutines', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id}),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "../";
            } else {
                alert("El comentario no pudo ser eliminado");
            }
        })
        .catch(error => console.error('El servidor fallo:', error));
    }
}

function cargarDatosRutina (content) {
    console.log(content);
    id_rutina = content.id;

    document.getElementById("rutina-titulo").append(content.name_rutine);
    document.getElementById("rutina-descripcion").append(content.description);
    document.getElementById("rutina-meta-data").append(`Creado por ${content.name} el ${formatearFecha(content.date)}`);

    if(id_usuario == content.user_id){
        const boton = document.getElementById("botones_interaccion");
        const create_div = document.createElement("div");
        const boton_eliminar = document.createElement("button");
        
        create_div.setAttribute("class", "mx-1");
        boton_eliminar.setAttribute("onclick",`eliminar_rutina(${content.id})`);
        boton_eliminar.setAttribute("class","btn btn-danger");
        boton_eliminar.append("Eliminar rutina");

        create_div.append(boton_eliminar);
        boton.append(create_div);
    }
    

    const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

    dias.forEach(dia => {
        const columna = document.getElementById(`col-${dia}`);


        if (content[dia].length == 0) {
            const parrafo = document.createElement("p");
            parrafo.append("Descanso");
            columna.append(parrafo);

        } else {
            for (let i = 0; i < content[dia].length; i++) {    
                const parrafo = document.createElement("p");
                parrafo.append(content[dia][i].exercise);
                columna.append(parrafo);
            }
        }
    })
    // crear carruseles
    createCarousels(content);
}

function formatearFecha(fecha) {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const [mes, dia, año] = fecha.split("/");

    const diaNumero = parseInt(dia, 10);
    const mesNumero = parseInt(mes, 10);

    const nombreMes = meses[mesNumero - 1];

    return `${diaNumero} de ${nombreMes} de 20${año}`;
}

function createCarousels(content) {
    const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

    dias.forEach(dia => {
        const carousel = document.getElementById(`carousel-${dia}`);
        const carouselInner = carousel.querySelector(".carousel-inner");

        for (let i = 0; i < content[dia].length; i+= 3) {

            const tresEjercicios = content[dia].slice(i, i+3);
            const carouselItem = createCarouselItem(tresEjercicios, i);
            
            if (i === 0) {
                carouselItem.classList.add('active');
            }
            carouselInner.appendChild(carouselItem);
        }

        if (content[dia].length === 0) {
            carouselInner.innerHTML = `
                <div class="p-5 m-1">
                    <div class="m-1 p-1">
                        <h1 class="text-center p-5 m-5">Dia de descanso<h1>
                    </div>
                </div>
            `;
        }
    })
}

function createCarouselItem (ejercicios, i) {
    const carouselItem = document.createElement("div");
    carouselItem.setAttribute("class", "carousel-item");

    const rowElement = document.createElement("div");
    rowElement.setAttribute("class", "row row-cols-3")
    carouselItem.append(rowElement);

    ejercicios.forEach(ejercicio => {
        rowElement.innerHTML += `
            <div class="col">
                <div class="card h-100" style="width: 18rem;">
                    <div class="d-flex justify-content-center">
                        <img src="http://localhost:8000/img/ejercicios_lista/${ejercicio.img1}">
                        <img src="http://localhost:8000/img/ejercicios_lista/${ejercicio.img2}" class="img-fade">
                    </div>
                    <div class="card-body d-flex flex-column p-0" style="height: 100%;">
                        <div class="flex-grow-1 d-flex align-items-center justify-content-center custom-card-title">
                            <h5 class="text-center m-0 p-1">${ejercicio.exercise}</h5>
                        </div>                                
                        <ul>
                            <li>Peso: ${ejercicio.peso} kg.</li>
                            <li>Series: ${ejercicio.sets}</li>
                            <li>Repeticiones: ${ejercicio.reps}</li>
                            <li>Descanso: ${ejercicio.rest} segs.</li>
                        </ul>
                    </div>   
                    <div class="card-footer text-body-secondary text-center">
                        n° ${i+1}
                    </div>                                     
                </div>
            </div>
        `;
        i++;
    })
    return carouselItem;
}

document.addEventListener('DOMContentLoaded', function () {

    // --------- peticion al backend ---------

    const parametros = new URLSearchParams(window.location.search)
    const id_parametro = parametros.get("id");

    if (id_parametro === null)
        window.location.href = "http://127.0.0.1:8000/rutinas/explorar/";

    fetch(`http://localhost:5000/rutine/${id_parametro}`)
    .then(response => response.json())
    .then(content => cargarDatosRutina(content))
    .catch(error => console.error('El servidor fallo:', error));

    // --------- enlace entre botones y caruseles segun dia ---------

    const btns = document.querySelectorAll('.btn-check');
    const carousels = document.querySelectorAll('.carousel-content');

    function showCarousel(id) {
        carousels.forEach(carousel => {
            carousel.style.display = carousel.id === id ? 'block' : 'none';
        });
    }

    btns.forEach(btn => {
        btn.addEventListener('change', function() {
            if (this.checked) {
                showCarousel(`carousel-${this.id.split('-')[1]}`);
            }
        });
    });
    // Mostrar el contenido del botón seleccionado inicialmente
    showCarousel('carousel-lunes');

    // --------- boton para activar rutina ---------
    
    document.getElementById("btn-activar-rutina").addEventListener("click", function() {
        const rutinaActiva = localStorage.active_rutine_id;

        if (rutinaActiva == id_rutina) 
            alert("La rutina ya se encuentra activa");

        else {
            const id_usuario = localStorage.id;

            fetch('http://localhost:5000/active_rutine', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_usuario, id_rutina }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('active_rutine_id', id_rutina);
                    
                    console.log(localStorage);
                    alert('Rutina activada existosamente. Vuelve a "Mi rutina" para verlo.');
    
                } else {
                    alert("No se pudo activar la rutina.");
                }
            })
            .catch(error => console.error('El servidor fallo:', error));
        }
    });

});
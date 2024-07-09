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
    item.setAttribute("class", "col-12 col-sm-6 col-md-4 col-lg-3 mb-4 item");

    const card = document.createElement("div");
    card.setAttribute("class", "card h-100");

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
}

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

fetch("http://localhost:5000/exercises")
    .then(response => response.json())
    .then(createCards)
    .catch(error => console.error('El servidor fallo:', error));
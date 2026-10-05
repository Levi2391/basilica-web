function loadContactHTML() {
    removeHistoriaButtons();

    document.getElementById("panel").style.display = "block";
    slideshow.pause();
    
    const container = document.getElementById("contact-container");
    console.log(container);
    container.style.display = "grid";
    container.innerHTML = "Cargando...";
    console.log(container);

    const theme = document.body.getAttribute("data-theme");
    const qrImage = theme === "light" ? "contact-light-qr.png" : "contact-dark-qr.png";

    container.innerHTML = `
        <div class="contact-qr-wrapper">
            <img class="contact-qr-img" src="./images/${qrImage}">
            <span class="contact-qr-caption">Scan me / Escanéame</span>
        </div>
      `;

    currentView = "horarios";

    container.classList.remove("hidden");
}
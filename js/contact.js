function loadContactHTML() {
    removeHistoriaButtons();

    document.getElementById("panel").style.display = "block";
    document.getElementById("mainVideo").pause();
    
    const container = document.getElementById("contact-container");
    console.log(container);
    container.style.display = "grid";
    container.innerHTML = "Cargando...";
    console.log(container);
    container.innerHTML = `
        <img class="img-contained" src="./imagenes/contacto.jpg"></img>
      `;

    currentView = "horarios";

    container.classList.remove("hidden");
}
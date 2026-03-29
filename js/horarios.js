function loadHorariosHTML() {
    removeHistoriaButtons();

    document.getElementById("panel").style.display = "block";
    document.getElementById("mainVideo").pause();

    canvas.style.display = "none";

    const container = document.getElementById("horarios-container");
    console.log(container);
    container.style.display = "grid";
    container.innerHTML = "Cargando...";
    console.log(container);
    container.innerHTML = `
        <img class="img-contained" src="./imagenes/horario.jpg"></img>
      `;

    container.classList.remove("hidden");
}
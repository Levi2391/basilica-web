async function init() {
    await loadLanguage("es");

    const res = await fetch("components/main-menu.html");
    document.getElementById("menuContainer").innerHTML = await res.text();
}

init();
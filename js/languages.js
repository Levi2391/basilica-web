let currentLang = "es";
let translations = {};

async function loadLanguage(lang) {
    const res = await fetch(`docs/historia/${lang}.json`);
    translations = await res.json();

    console.log("Loaded translations:", translations);
    
    currentLang = lang;
    updateLangUI();
}

async function changeLang(lang) {
    await loadLanguage(lang);

    if (currentView === "history") {
        await openHistoria();
    }
    else if (currentView.startsWith("history-detail-")) {
        const sectionId = currentView.replace("history-detail-", "");
        showHistoria(sectionId);
    }
}

function renderHistoriaMenu(parent) {
    const t = translations.history;

    if (!t || !t.menu) {
        console.error("History menu not found in translations");
        return;
    }

    const menuContainer = parent.querySelector("#historiaMenu");

    if (!menuContainer) {
        console.error("historiaMenu not found in parent");
        return;
    }

    menuContainer.innerHTML = `
        <div class="grid grid-cols-1 gap-4">
            ${t.menu.map(item => `
                <div class="historiaBtn" onclick="navigate('history-detail','${item.id}')">
                    <img src="${item.icon}" class="w-20 mb-4">
                    <span>${item.label}</span>
                </div>
            `).join("")}
        </div>
    `;
}

function updateLangUI() {
    const buttons = document.querySelectorAll("#langs button");

    buttons.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add("active-lang");
        } else {
            btn.classList.remove("active-lang");
        }
    });
}
window.changeLang = changeLang;

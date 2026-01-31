const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "normal";

let data = [];
let keys = [];
let filteredKeys = [];
let index = 0;
let flipped = false;

let hafal = [];
let belumHafal = [];

// ---- LOAD DATA ----
fetch("/data/mnn_vocab.json")
    .then(res => res.json())
    .then(json => {
        data = json;
        keys = Object.keys(json).sort((a,b) => Number(a) - Number(b));
        populateBab();
        filteredKeys = keys;
        setupMode();
        loadCard();
    });

function populateBab() {
    let babSelect = document.getElementById("babSelect");

    let maxBab = Math.max(...keys.map(k => data[k].bab));

    for (let i = 1; i <= maxBab; i++) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.textContent = "Bab " + i;
        babSelect.appendChild(opt);
    }
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function setupMode() {
    if (mode === "random") {
        document.getElementById("navButtons").style.display = "none";
        document.getElementById("randomButtons").style.display = "flex";
    }
}

function flipCard() {
    const card = document.getElementById("card");
    flipped = !flipped;
    card.classList.toggle("flipped");
}

// ---- POPUP BAB ----
function openBab() {
    document.getElementById("babPopup").style.setProperty("display", "flex", "important");
    document.getElementById("fcContainer").classList.add("blur");
}

function closeBab() {
    document.getElementById("babPopup").style.setProperty("display", "none", "important");
    document.getElementById("fcContainer").classList.remove("blur");
}

function applyBab() {
    let bab = Number(document.getElementById("babSelect").value);

    filteredKeys = keys.filter(k => data[k].bab === bab);

    if (mode === "random") shuffle(filteredKeys);

    index = 0;
    hafal = [];
    belumHafal = [];

    closeBab();
    loadCard();
}

// ---- LOAD CARD ----
function loadCard() {
    let key = filteredKeys[index];
    let item = data[key];

    document.getElementById("frontText").innerHTML = item.jpn;
    document.getElementById("backText").innerHTML =
        item.romaji + "<br><br>" + item.arti;

    document.getElementById("counter").innerHTML =
        (index + 1) + " / " + filteredKeys.length;

    flipped = false;
    document.getElementById("card").classList.remove("flipped");

    updateProgress();
}

// ---- NORMAL MODE ----
function nextCard() {
    if (index < filteredKeys.length - 1) index++;
    loadCard();
}

function prevCard() {
    if (index > 0) index--;
    loadCard();
}

// ---- RANDOM MODE ----
function chooseHafal() {
    let key = filteredKeys[index];
    if (!hafal.includes(key)) hafal.push(key);
    goNextRandom();
}

function chooseTidakHafal() {
    let key = filteredKeys[index];
    if (!belumHafal.includes(key)) belumHafal.push(key);
    goNextRandom();
}

function goNextRandom() {
    if (index < filteredKeys.length - 1) {
        index++;
        loadCard();
    } else {
        showEndScreen();
    }
}

// ---- END SCREEN ----
function showEndScreen() {
    document.getElementById("fcContainer").style.display = "none";
    document.getElementById("endScreen").style.display = "block";

    document.getElementById("summaryText").innerHTML =
        `Hafal: ${hafal.length} | Belum Hafal: ${belumHafal.length}`;

    let ul = document.getElementById("listBelumHafal");
    ul.innerHTML = "";

    belumHafal.forEach(key => {
        let li = document.createElement("li");
        let d = data[key];
        li.textContent = `${d.jpn} - ${d.romaji} - ${d.arti}`;
        ul.appendChild(li);
    });
}

function repeatBelumHafal() {
    filteredKeys = [...belumHafal];
    index = 0;
    hafal = [];
    belumHafal = [];

    document.getElementById("endScreen").style.display = "none";
    document.getElementById("fcContainer").style.display = "block";

    loadCard();
}

// ---- PROGRESS ----
function updateProgress() {
    let p = document.getElementById("progress");
    if (!p) {
        document.getElementById("counter").insertAdjacentHTML(
            "afterend",
            `<div id="progress"
               style="margin-top:8px;color:#c62828;font-weight:600;">
               Hafal: ${hafal.length} | Belum Hafal: ${belumHafal.length}
            </div>`
        );
    } else {
        p.innerHTML = `Hafal: ${hafal.length} | Belum Hafal: ${belumHafal.length}`;
    }
}

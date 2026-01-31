const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "quiz";

let data = {};
let keys = [];
let filteredKeys = [];
let index = 0;

let benar = [];
let salah = [];

// =============================
// LOAD DATA
// =============================
fetch("/data/kanji_n4.json")
    .then(res => res.json())
    .then(json => {
        data = json;
        keys = Object.keys(json).sort((a, b) => Number(a) - Number(b));
        filteredKeys = [...keys];
        loadCard();
    });

// =============================
// RANGE POPUP
// =============================
function openRange() {
    document.getElementById("rangePopup").style.display = "flex";
    document.getElementById("fcContainer").classList.add("blur");
}

function closeRange() {
    document.getElementById("rangePopup").style.display = "none";
    document.getElementById("fcContainer").classList.remove("blur");
}

function applyRange() {
    const start = parseInt(document.getElementById("rangeStart").value);
    const end = parseInt(document.getElementById("rangeEnd").value);

    if (
        isNaN(start) ||
        isNaN(end) ||
        start < 1 ||
        end < start ||
        end > keys.length
    ) {
        alert("Range tidak valid");
        return;
    }

    filteredKeys = keys.slice(start - 1, end);
    index = 0;
    benar = [];
    salah = [];

    closeRange();
    loadCard();
}

// =============================
// LOAD CARD
// =============================
function loadCard() {
    if (index >= filteredKeys.length) {
        showEndScreen();
        return;
    }

    const key = filteredKeys[index];
    const item = data[key];

    document.getElementById("kanjiFront").textContent = item.kanji;
    document.getElementById("counter").textContent =
        `Soal ${index + 1} dari ${filteredKeys.length}`;

    renderChoices(item.yomi);
    updateProgress();
}

// =============================
// RENDER CHOICES
// =============================
function renderChoices(correctYomi) {
    const choicesEl = document.getElementById("choices");
    choicesEl.innerHTML = "";

    let options = [correctYomi];

    while (options.length < 3) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const yomi = data[randomKey].yomi;
        if (!options.includes(yomi)) options.push(yomi);
    }

    options.sort(() => Math.random() - 0.5);

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.className = "choice-btn";

        btn.onclick = () => handleAnswer(opt, correctYomi, btn);
        choicesEl.appendChild(btn);
    });
}

// =============================
// HANDLE ANSWER
// =============================
function handleAnswer(selected, correct, btn) {
    const buttons = document.querySelectorAll(".choice-btn");
    buttons.forEach(b => (b.disabled = true));

    const key = filteredKeys[index];

    if (selected === correct) {
        btn.classList.add("correct");
        benar.push(key);
    } else {
        btn.classList.add("wrong");
        salah.push(key);

        buttons.forEach(b => {
            if (b.textContent === correct) {
                b.classList.add("correct");
            }
        });
    }

    setTimeout(() => {
        index++;
        loadCard();
    }, 900);
}

// =============================
// END SCREEN
// =============================
function showEndScreen() {
    document.getElementById("fcContainer").style.display = "none";
    document.getElementById("endScreen").style.display = "block";

    document.getElementById("summaryText").textContent =
        `Benar: ${benar.length} | Salah: ${salah.length}`;

    const list = document.getElementById("listBelumHafal");
    list.innerHTML = "";

    salah.forEach(key => {
        const li = document.createElement("li");
        li.textContent = `${data[key].kanji} (${data[key].yomi}) - ${data[key].arti}`;
        list.appendChild(li);
    });
}

// =============================
// REPEAT WRONG ONLY
// =============================
function repeatBelumHafal() {
    if (salah.length === 0) {
        alert("Tidak ada soal yang salah 👍");
        return;
    }

    filteredKeys = [...salah];
    index = 0;
    benar = [];
    salah = [];

    document.getElementById("endScreen").style.display = "none";
    document.getElementById("fcContainer").style.display = "flex";
    loadCard();
}

// =============================
// PROGRESS
// =============================
function updateProgress() {
    const progressEl = document.getElementById("progress");
    progressEl.textContent = `✔ ${benar.length} | ✘ ${salah.length}`;
}
// ================= RANGE POPUP =================
function openRange() {
    document.getElementById("rangePopup").classList.add("active");
}

function closeRange() {
    document.getElementById("rangePopup").classList.remove("active");
}
function renderResultTable() {
    const tbody = document.getElementById("resultTableBody");
    tbody.innerHTML = "";

    belumHafal.forEach(item => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="kanji-cell">${item.kanji}</td>
            <td>${item.hiragana}</td>
            <td>${item.arti}</td>
        `;

        tbody.appendChild(tr);
    });
}

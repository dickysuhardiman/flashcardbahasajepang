let data = [];
let keys = [];

// Load JSON
fetch("/data/kanji_n4.json")
    .then(res => res.json())
    .then(json => {
        data = json;

        // Urutkan key numerik
        keys = Object.keys(json).sort((a, b) => Number(a) - Number(b));

        renderList();
    });

// =====================================================
// Render list awal
// =====================================================
function renderList() {
    const tbody = document.getElementById("kanjiBody");
    tbody.innerHTML = "";

    keys.forEach(key => {
        const item = data[key];
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${key}</td>
            <td>${item.kanji}</td>
            <td>${item.yomi}</td>
            <td>${item.arti}</td>
        `;

        // klik → buka flashcard sesuai nomor
        tr.onclick = () => openFlashcardAt(key);

        tbody.appendChild(tr);
    });
}

// =====================================================
// OPEN FLASHCARD PADA NOMOR TERTENTU
// =====================================================
function openFlashcardAt(no) {
    // Mode normal, range satu nomor saja
    window.location.href = `flashcard.html?mode=normal&start=${no}&end=${no}`;
}

// =====================================================
// Search + Highlight
// =====================================================
function searchKanji() {
    const q = document.getElementById("search").value.toLowerCase();
    const tbody = document.getElementById("kanjiBody");
    tbody.innerHTML = "";

    keys.forEach(key => {
        const item = data[key];
        const text = `${key} ${item.kanji} ${item.yomi} ${item.arti}`.toLowerCase();

        if (text.includes(q)) {
            const tr = document.createElement("tr");

            tr.onclick = () => openFlashcardAt(key);

            tr.innerHTML = `
                <td>${highlight(key, q)}</td>
                <td>${highlight(item.kanji, q)}</td>
                <td>${highlight(item.yomi, q)}</td>
                <td>${highlight(item.arti, q)}</td>
            `;

            tbody.appendChild(tr);
        }
    });
}

// Highlight fungsi
function highlight(text, query) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.toString().replace(regex, `<span style="background:#ffea00;">$1</span>`);
}

// Back btn
function goHome() {
    window.location.href = "index.html";
}

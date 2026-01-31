/* ===============================
   SLIDE-IN PANEL
================================= */
const flashcardBtn = document.getElementById('flashcardBtn');
const slidePanel = document.getElementById('slidePanel');
const closePanelBtn = document.getElementById('closePanelBtn');

flashcardBtn.addEventListener('click', () => {
    slidePanel.classList.add('active');
});

closePanelBtn.addEventListener('click', () => {
    slidePanel.classList.remove('active');
});

/* ===============================
   NAVIGASI HALAMAN FLASHCARD
================================= */
function startNormal() {
    // mode latihan biasa (urutan)
    window.location.href = "/flashcard.html?mode=normal&v=20250210";
}

function startRandom() {
    // mode test RANDOM
    window.location.href = "/flashcard.html?mode=random&v=20250210";
}

function openList() {
    // halaman daftar kanji
    window.location.href = "/list.html?v=20250210";
}

/* ===============================
   NAVIGASI VOCAB MINNA
================================= */
function openVocabFlashcard() {
    window.location.href = "/vocab_flashcard.html?mode=random&v=20250210";
}

function openVocabList() {
    window.location.href = "/vocab.html?v=20250210";
}

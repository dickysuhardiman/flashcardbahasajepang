document.addEventListener("DOMContentLoaded", () => {

  let data = {};
  let keys = [];
  let activeKeys = [];

  let searchTimer = null;

  const babSelect = document.getElementById("babSelect");
  const searchInput = document.getElementById("search");
  const tbody = document.getElementById("vocabBody");

  // ===============================
  // LOAD JSON
  // ===============================
  fetch("data/mnn_vocab.json")
    .then(res => {
      if (!res.ok) throw new Error("File JSON tidak ditemukan");
      return res.json();
    })
    .then(json => {
      data = json;
      keys = Object.keys(json).sort((a, b) => Number(a) - Number(b));
      activeKeys = keys; // tampilkan semua awal
      renderList();
    })
    .catch(err => {
      console.error(err);
      alert("Gagal memuat vocabulary");
    });

  // ===============================
  // RENDER TABEL (NO LIMIT)
  // ===============================
  function renderList() {
    tbody.innerHTML = "";

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < activeKeys.length; i++) {
      const key = activeKeys[i];
      const item = data[key];
      if (!item) continue;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${key}</td>
        <td>${item.jpn}</td>
        <td>${item.romaji}</td>
        <td>${item.arti}</td>
        <td>${item.jenis}</td>
        <td>${item.bab}</td>
      `;
      fragment.appendChild(tr);
    }

    tbody.appendChild(fragment);
  }

  // ===============================
  // FILTER + SEARCH (GLOBAL SEMUA BAB)
  // ===============================
  function filterData() {
    const bab = babSelect.value;
    const q = searchInput.value.trim().toLowerCase();

    activeKeys = keys.filter(key => {
      const item = data[key];
      if (!item) return false;

      const matchBab =
        bab === "all" || bab === "" ? true : item.bab == bab;

      const matchSearch =
        q === "" ||
        item.jpn.includes(q) ||
        item.romaji.toLowerCase().includes(q) ||
        item.arti.toLowerCase().includes(q) ||
        item.jenis.toLowerCase().includes(q);

      return matchBab && matchSearch;
    });

    renderList();
  }

  // ===============================
  // EVENT LISTENER (ANTI LAG)
  // ===============================
  babSelect.addEventListener("change", filterData);

  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(filterData, 300);
  });

});

// ===============================
// HOME
// ===============================
function goHome() {
  window.location.href = "index.html";
}

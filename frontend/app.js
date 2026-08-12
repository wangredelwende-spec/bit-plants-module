// ============================================================
// Plants Module — Frontend (Task 1: Varieties)
// Connected to FastAPI backend at localhost:8000
// ============================================================

(function () {
  "use strict";

  const API_BASE = "http://localhost:8000";

  // --- DOM refs ---
  const tableSection = document.getElementById("table-section");
  const filterSelect = document.getElementById("filter-bloc");
  const btnClear = document.getElementById("btn-clear-filter");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  // --- State ---
  let allVarieties = []; // cache of last full fetch (for populating filter)

  // --- Helpers ---

  function formatValue(val) {
    // Returns display string. null/undefined → '—' styled as null-value
    if (val === null || val === undefined || val === "") return null; // will be handled by caller
    return String(val);
  }

  function nullHtml(val) {
    // Returns HTML string for a value, with null styling if needed
    if (val === null || val === undefined || val === "") {
      return '<span class="null-value">—</span>';
    }
    return escapeHtml(String(val));
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatNumber(val) {
    if (val === null || val === undefined) return '<span class="null-value">—</span>';
    return escapeHtml(Number(val).toLocaleString());
  }

  function formatDate(val) {
    if (!val) return '<span class="null-value">—</span>';
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return escapeHtml(val);
      return escapeHtml(d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
    } catch {
      return escapeHtml(val);
    }
  }

  function formatBloc(val) {
    if (!val) return '<span class="null-value">—</span>';
    return escapeHtml("Block " + val);
  }

  function vigorBadge(val) {
    if (!val) return '<span class="null-value">—</span>';
    const map = {
      "Forte": "green",
      "Moyenne": "amber",
      "Faible": "red",
    };
    const cls = map[val] || "gray";
    return `<span class="badge badge--${cls}">${escapeHtml(val)}</span>`;
  }

  // --- API calls ---

  async function fetchVarieties(params = {}) {
    const url = new URL(`${API_BASE}/v1/varieties`);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") {
        url.searchParams.set(k, v);
      }
    });

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  }

  async function fetchVarietyById(id) {
    const res = await fetch(`${API_BASE}/v1/varieties/${id}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error("Variety not found");
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  }

  // --- Renderers ---

  function renderLoading() {
    tableSection.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <span class="loading__text">Loading variety data…</span>
      </div>
    `;
  }

  function renderError(message) {
    tableSection.innerHTML = `
      <div class="state-message state-message--error">
        <span class="state-message__icon">⚠</span>
        <span class="state-message__title">Unable to load data</span>
        <span class="state-message__text">${escapeHtml(message)}</span>
        <button class="state-message__btn" id="btn-retry" type="button">Retry</button>
      </div>
    `;
    document.getElementById("btn-retry").addEventListener("click", () => init());
  }

  function renderEmpty() {
    tableSection.innerHTML = `
      <div class="state-message state-message--empty">
        <span class="state-message__icon">📭</span>
        <span class="state-message__title">No varieties found</span>
        <span class="state-message__text">No variety records match the current filter. Try selecting a different block or clearing the filter.</span>
      </div>
    `;
  }

  function renderTable(data) {
    if (data.length === 0) {
      renderEmpty();
      return;
    }

    // Table columns definition
    // Each: [header label, render function returning HTML string]
    const columns = [
      ["Name", (r) => `<strong>${escapeHtml(r.nom)}</strong>`],
      ["Trees", (r) => formatNumber(r.nombre_arbres)],
      ["Spacing (m)", (r) => {
        if (r.espacement_inter_rang_m == null && r.espacement_intra_rang_m == null) {
          return '<span class="null-value">—</span>';
        }
        const inter = r.espacement_inter_rang_m != null ? r.espacement_inter_rang_m : '—';
        const intra = r.espacement_intra_rang_m != null ? r.espacement_intra_rang_m : '—';
        return escapeHtml(`${inter} × ${intra}`);
      }],
      ["Density (/ha)", (r) => formatNumber(r.densite_arbres_ha)],
      ["Exp. Yield (kg)", (r) => formatNumber(r.rendement_attendu_kg)],
      ["Act. Yield (kg)", (r) => formatNumber(r.rendement_reel_kg)],
      ["Vigor", (r) => vigorBadge(r.vigueur)],
      ["Block", (r) => formatBloc(r.bloc_parcelle)],
      ["Origin", (r) => nullHtml(r.origine_plant)],
      ["Source", (r) => nullHtml(r.source)],
      ["Last Updated", (r) => formatDate(r.date_maj)],
    ];

    let html = '<div class="data-table-wrapper"><table class="data-table">';
    html += "<thead><tr>";
    columns.forEach(([label]) => {
      html += `<th>${escapeHtml(label)}</th>`;
    });
    html += "</tr></thead><tbody>";

    data.forEach((row) => {
      html += `<tr data-variety-id="${row.id}">`;
      columns.forEach(([, render]) => {
        html += `<td>${render(row)}</td>`;
      });
      html += "</tr>";
    });

    html += "</tbody></table></div>";
    tableSection.innerHTML = html;

    // Attach click handlers to rows
    tableSection.querySelectorAll("tr[data-variety-id]").forEach((tr) => {
      tr.addEventListener("click", () => {
        openDetailModal(parseInt(tr.dataset.varietyId, 10));
      });
    });
  }

  // --- Modal ---

  async function openDetailModal(id) {
    modalOverlay.classList.add("active");
    modalTitle.textContent = "Loading…";
    modalBody.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
      const v = await fetchVarietyById(id);
      modalTitle.textContent = v.nom || "Variety Details";

      // Fields to display in the modal
      const fields = [
        ["Name", escapeHtml(v.nom)],
        ["Farm ID", nullHtml(v.id_ferme)],
        ["Number of Trees", formatNumber(v.nombre_arbres)],
        ["Inter-row Spacing (m)", nullHtml(v.espacement_inter_rang_m)],
        ["Intra-row Spacing (m)", nullHtml(v.espacement_intra_rang_m)],
        ["Density (trees/ha)", formatNumber(v.densite_arbres_ha)],
        ["Expected Yield (kg)", formatNumber(v.rendement_attendu_kg)],
        ["Actual Yield (kg)", formatNumber(v.rendement_reel_kg)],
        ["Vigor", vigorBadge(v.vigueur)],
        ["Block", formatBloc(v.bloc_parcelle)],
        ["Plant Origin", nullHtml(v.origine_plant)],
        ["Source", nullHtml(v.source)],
        ["Last Updated", formatDate(v.date_maj)],
      ];

      modalBody.innerHTML = fields
        .map(
          ([label, value]) => `
            <div class="modal__field">
              <div class="modal__field-label">${escapeHtml(label)}</div>
              <div class="modal__field-value">${value}</div>
            </div>`
        )
        .join("");
    } catch (err) {
      modalBody.innerHTML = `
        <div class="state-message state-message--error" style="grid-column:1/-1">
          <span class="state-message__icon">⚠</span>
          <span class="state-message__text">${escapeHtml(err.message)}</span>
        </div>
      `;
    }
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
  }

  // Close modal on overlay click (outside the card)
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  modalClose.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // --- Filter ---

  function populateFilterDropdown(data) {
    const blocs = [...new Set(data.map((r) => r.bloc_parcelle).filter(Boolean))].sort();

    // Preserve current selection if possible
    const current = filterSelect.value;

    // Clear existing options except the first "All blocks"
    while (filterSelect.options.length > 1) {
      filterSelect.remove(1);
    }

    blocs.forEach((b) => {
      const opt = document.createElement("option");
      opt.value = b;
      opt.textContent = "Block " + b;
      filterSelect.appendChild(opt);
    });

    // Restore selection
    if (current && blocs.includes(current)) {
      filterSelect.value = current;
    }
  }

  async function loadData() {
    renderLoading();

    try {
      const bloc = filterSelect.value;
      const params = {};
      if (bloc) params.bloc_parcelle = bloc;

      const data = await fetchVarieties(params);

      // If unfiltered, cache for filter population
      if (!bloc) {
        allVarieties = data;
        populateFilterDropdown(data);
      }

      renderTable(data);
    } catch (err) {
      renderError(
        err.message.includes("Failed to fetch") || err.message.includes("NetworkError")
          ? "Unable to reach the backend server — check that it is running on localhost:8000"
          : err.message
      );
    }
  }

  filterSelect.addEventListener("change", () => loadData());
  btnClear.addEventListener("click", () => {
    filterSelect.value = "";
    loadData();
  });

  // --- Init ---

  function init() {
    loadData();
  }

  init();
})();

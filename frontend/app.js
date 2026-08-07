/**
 * Plants Module — App Logic
 * Navigation + micro-interactivity (bloc filter, column sort)
 * No backend, no API — purely front-end on static data.
 */

/* ========================================================================
   1. Hash-based Navigation
   ======================================================================== */

/**
 * Navigate to a specific screen by hash
 * @param {string} hash - The target route (e.g., 'dashboard', 'varieties')
 */
function navigateTo(hash) {
  window.location.hash = hash;
}

// Expose globally for onclick attributes in HTML
window.navigateTo = navigateTo;

/**
 * Read current hash and show the matching screen
 */
function handleRoute() {
  const hash = window.location.hash.slice(1) || 'dashboard';

  const routes = {
    'dashboard': 'screen-dashboard',
    'varieties': 'screen-varieties',
    'growth': 'screen-growth',
    'fertilizers': 'screen-fertilizers',
    'diseases': 'screen-diseases',
    'harvest': 'screen-harvest',
    'nursery': 'screen-nursery'
  };

  const targetId = routes[hash] || 'screen-dashboard';

  // Hide all screens, show target
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(targetId);
  if (target) {
    target.classList.add('active');
  }

  // Highlight active link in navbar
  document.querySelectorAll('.app-nav__link').forEach(link => {
    if (link.dataset.route === hash) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Scroll to top
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);


/* ========================================================================
   2. Bloc / Parcelle Filter
   Reads the "Bloc" column in each table on the active screen and hides
   rows that don't match the selected value. Works with the static data
   already embedded in the HTML — no backend.
   ======================================================================== */

/**
 * Find which column index contains "Bloc" in a table's header row
 * @param {HTMLTableElement} table
 * @returns {number} column index (0-based), or -1 if not found
 */
function findBlocColumnIndex(table) {
  const headers = table.querySelectorAll('thead th');
  for (let i = 0; i < headers.length; i++) {
    const text = headers[i].textContent.trim().toLowerCase();
    if (text.includes('block')) {
      return i;
    }
  }
  return -1;
}

/**
 * Filter all tables in the currently active screen by the selected bloc value
 * @param {HTMLSelectElement} select - the dropdown that changed
 */
function filterByBloc(select) {
  const screen = select.closest('.screen');
  if (!screen) return;

  const value = select.value; // "All blocks" or "Block A", etc.
  const showAll = value === 'All blocks';

  // Filter every table in this screen
  screen.querySelectorAll('.data-table').forEach(table => {
    const colIndex = findBlocColumnIndex(table);
    if (colIndex === -1) return; // No "Bloc" column in this table

    const tbody = table.querySelector('tbody');
    let visibleRows = 0;

    const rows = tbody.querySelectorAll('tr:not(.empty-state-row)');
    rows.forEach(row => {
      if (showAll) {
        row.style.display = '';
        visibleRows++;
        return;
      }
      const cell = row.cells[colIndex];
      if (!cell) return;
      const cellText = cell.textContent.trim();
      const isMatch = cellText.includes(value);
      row.style.display = isMatch ? '' : 'none';
      if (isMatch) visibleRows++;
    });

    // Handle empty state
    let emptyRow = tbody.querySelector('.empty-state-row');
    if (visibleRows === 0) {
      if (!emptyRow) {
        emptyRow = document.createElement('tr');
        emptyRow.className = 'empty-state-row';
        const colsCount = table.querySelectorAll('thead th').length;
        emptyRow.innerHTML = `<td colspan="${colsCount}" style="text-align: center; color: var(--gray-500); font-style: italic; padding: var(--space-xl);">No data for ${value} on this screen.</td>`;
        tbody.appendChild(emptyRow);
      } else {
        emptyRow.querySelector('td').textContent = `No data for ${value} on this screen.`;
        emptyRow.style.display = '';
      }
    } else if (emptyRow) {
      emptyRow.style.display = 'none';
    }
  });

  // Also filter health cards on the diseases screen
  if (screen.id === 'screen-diseases') {
    screen.querySelectorAll('.health-card').forEach(card => {
      if (showAll) {
        card.style.display = '';
        return;
      }
      const blocLabel = card.querySelector('.health-card__bloc');
      if (blocLabel) {
        card.style.display = blocLabel.textContent.trim() === value ? '' : 'none';
      }
    });
  }
}

/**
 * Navigate to the Diseases screen and filter by a specific block
 * @param {string} blockName - The name of the block (e.g., "Block A")
 */
function goToDiseasesForBlock(blockName) {
  navigateTo('diseases');
  
  // Need a tiny timeout to ensure the DOM is visible before applying filters if necessary,
  // but since it's static we can just find it directly.
  const screen = document.getElementById('screen-diseases');
  const select = screen.querySelector('.filter-bar select');
  if (select) {
    select.value = blockName;
    filterByBloc(select);
  }
}

// Expose globally
window.goToDiseasesForBlock = goToDiseasesForBlock;

/**
 * Highlight a specific trend line in the SVG chart on the dashboard
 * @param {string} blockId - The block identifier (e.g., 'A', 'B', 'C', 'D')
 */
function highlightTrendLine(blockId) {
  const allLines = document.querySelectorAll('.trend-chart-line');
  if (!allLines.length) return;
  
  allLines.forEach(line => {
    line.style.opacity = '0.2';
    line.classList.remove('highlight');
  });
  
  const targetLine = document.getElementById(`trend-line-${blockId}`);
  if (targetLine) {
    targetLine.style.opacity = '1';
    targetLine.classList.add('highlight');
  }
}

/**
 * Unhighlight all trend lines in the SVG chart
 */
function unhighlightTrendLines() {
  const allLines = document.querySelectorAll('.trend-chart-line');
  allLines.forEach(line => {
    line.style.opacity = '1';
    line.classList.remove('highlight');
  });
}

// Expose globally
window.highlightTrendLine = highlightTrendLine;
window.unhighlightTrendLines = unhighlightTrendLines;


/* ========================================================================
   3. Column Sorting
   Click any <th class="sortable"> to toggle sort direction on that column.
   Sorts the table body rows in place (DOM reorder, no data structure).
   ======================================================================== */

/**
 * Sort a table by the given column header
 * @param {HTMLTableCellElement} th - the clicked header cell
 */
function sortTable(th) {
  const table = th.closest('table');
  if (!table) return;

  const colIndex = Array.from(th.parentNode.children).indexOf(th);
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // Determine sort direction
  const isAsc = th.classList.contains('sort-asc');
  const direction = isAsc ? -1 : 1; // toggle: if currently asc, go desc

  // Clear sort indicators on sibling headers
  th.parentNode.querySelectorAll('th').forEach(h => {
    h.classList.remove('sort-asc', 'sort-desc');
  });
  th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');

  // Sort rows
  rows.sort((a, b) => {
    const aText = (a.cells[colIndex]?.textContent || '').trim();
    const bText = (b.cells[colIndex]?.textContent || '').trim();

    // Try numeric comparison first (strip non-digits for values like "20 000 kg")
    const aNum = parseFloat(aText.replace(/[^\d.,-]/g, '').replace(',', '.'));
    const bNum = parseFloat(bText.replace(/[^\d.,-]/g, '').replace(',', '.'));

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return (aNum - bNum) * direction;
    }

    // Fallback to locale-aware string comparison
    return aText.localeCompare(bText, 'fr') * direction;
  });

  // Re-append rows in new order
  rows.forEach(row => tbody.appendChild(row));
}


/* ========================================================================
   4. Initialization
   Wire up filter dropdowns and sortable headers after DOM is ready.
   ======================================================================== */

window.addEventListener('DOMContentLoaded', () => {
  // Wire up all bloc filter dropdowns
  document.querySelectorAll('.filter-bar select').forEach(select => {
    select.addEventListener('change', () => filterByBloc(select));
  });

  // Make table headers sortable (add "sortable" class to all th in data tables)
  document.querySelectorAll('.data-table thead th').forEach(th => {
    th.classList.add('sortable');
    th.addEventListener('click', () => sortTable(th));
  });
});

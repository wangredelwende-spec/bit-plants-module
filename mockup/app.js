/**
 * Plants Module — Mockup (throwaway prototype)
 * Static UI only: no backend, no API calls, hardcoded data.
 * Not intended to evolve into the production frontend — a separate,
 * connected frontend will be built later in its own folder.
 *
 * Navigation + micro-interactivity (bloc filter, column sort)
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
  var hash = window.location.hash.slice(1) || 'dashboard';

  var routes = {
    'dashboard':         'screen-dashboard',
    'varieties':         'screen-varieties',
    'growth':            'screen-growth',
    'fertilizers':       'screen-fertilizers',
    'diseases':          'screen-diseases',
    'harvest':           'screen-harvest',
    'nursery':           'screen-nursery',
    'whatif':            'screen-scenario-analysis',  // legacy hash — still works
    'scenario-analysis': 'screen-scenario-analysis'
  };

  var targetId = routes[hash] || 'screen-dashboard';

  // Hide all screens, show target
  document.querySelectorAll('.screen').forEach(function (s) {
    s.classList.remove('active');
  });
  var target = document.getElementById(targetId);
  if (target) {
    target.classList.add('active');
  }

  // Highlight active link in navbar
  document.querySelectorAll('.app-nav__link').forEach(function (link) {
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
  var headers = table.querySelectorAll('thead th');
  for (var i = 0; i < headers.length; i++) {
    var text = headers[i].textContent.trim().toLowerCase();
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
  var screen = select.closest('.screen');
  if (!screen) { return; }

  var value   = select.value;
  var showAll = value === 'All blocks';

  // Filter every table in this screen
  screen.querySelectorAll('.data-table').forEach(function (table) {
    var colIndex = findBlocColumnIndex(table);
    if (colIndex === -1) { return; }

    var tbody      = table.querySelector('tbody');
    var visibleRows = 0;

    var rows = tbody.querySelectorAll('tr:not(.empty-state-row)');
    rows.forEach(function (row) {
      if (showAll) {
        row.style.display = '';
        visibleRows++;
        return;
      }
      var cell = row.cells[colIndex];
      if (!cell) { return; }
      var cellText = cell.textContent.trim();
      var isMatch  = cellText.includes(value);
      row.style.display = isMatch ? '' : 'none';
      if (isMatch) { visibleRows++; }
    });

    // Handle empty state
    var emptyRow = tbody.querySelector('.empty-state-row');
    if (visibleRows === 0) {
      if (!emptyRow) {
        emptyRow = document.createElement('tr');
        emptyRow.className = 'empty-state-row';
        var colsCount = table.querySelectorAll('thead th').length;
        emptyRow.innerHTML = '<td colspan="' + colsCount + '" style="text-align: center; color: var(--gray-500); font-style: italic; padding: var(--space-xl);">No data for ' + value + ' on this screen.</td>';
        tbody.appendChild(emptyRow);
      } else {
        emptyRow.querySelector('td').textContent = 'No data for ' + value + ' on this screen.';
        emptyRow.style.display = '';
      }
    } else if (emptyRow) {
      emptyRow.style.display = 'none';
    }
  });

  // Also filter health cards on the diseases screen
  if (screen.id === 'screen-diseases') {
    screen.querySelectorAll('.health-card').forEach(function (card) {
      if (showAll) {
        card.style.display = '';
        return;
      }
      var blocLabel = card.querySelector('.health-card__bloc');
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
  var screen = document.getElementById('screen-diseases');
  var select = screen.querySelector('.filter-bar select');
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
  var allLines = document.querySelectorAll('.trend-chart-line');
  if (!allLines.length) { return; }

  allLines.forEach(function (line) {
    line.style.opacity = '0.2';
    line.classList.remove('highlight');
  });

  var targetLine = document.getElementById('trend-line-' + blockId);
  if (targetLine) {
    targetLine.style.opacity = '1';
    targetLine.classList.add('highlight');
  }
}

/**
 * Unhighlight all trend lines in the SVG chart
 */
function unhighlightTrendLines() {
  var allLines = document.querySelectorAll('.trend-chart-line');
  allLines.forEach(function (line) {
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
  var table = th.closest('table');
  if (!table) { return; }

  var colIndex = Array.from(th.parentNode.children).indexOf(th);
  var tbody    = table.querySelector('tbody');
  var rows     = Array.from(tbody.querySelectorAll('tr'));

  // Determine sort direction
  var isAsc     = th.classList.contains('sort-asc');
  var direction = isAsc ? -1 : 1;

  // Clear sort indicators on sibling headers
  th.parentNode.querySelectorAll('th').forEach(function (h) {
    h.classList.remove('sort-asc', 'sort-desc');
  });
  th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');

  // Sort rows
  rows.sort(function (a, b) {
    var aText = (a.cells[colIndex] ? a.cells[colIndex].textContent : '').trim();
    var bText = (b.cells[colIndex] ? b.cells[colIndex].textContent : '').trim();

    // Try numeric comparison first (strip non-digits for values like "20 000 kg")
    var aNum = parseFloat(aText.replace(/[^\d.,-]/g, '').replace(',', '.'));
    var bNum = parseFloat(bText.replace(/[^\d.,-]/g, '').replace(',', '.'));

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return (aNum - bNum) * direction;
    }

    // Fallback to locale-aware string comparison
    return aText.localeCompare(bText, 'fr') * direction;
  });

  // Re-append rows in new order
  rows.forEach(function (row) { tbody.appendChild(row); });
}


/* ========================================================================
   4. Initialization
   Wire up filter dropdowns and sortable headers after DOM is ready.
   ======================================================================== */

window.addEventListener('DOMContentLoaded', function () {
  // Wire up all bloc filter dropdowns
  document.querySelectorAll('.filter-bar select').forEach(function (select) {
    select.addEventListener('change', function () { filterByBloc(select); });
  });

  // Make table headers sortable
  document.querySelectorAll('.data-table thead th').forEach(function (th) {
    th.classList.add('sortable');
    th.addEventListener('click', function () { sortTable(th); });
  });
});


/* ========================================================================
   5. Scenario Analysis Rendering
   Note: These are illustrative projections, not validated agronomic or
   financial forecasts. All figures are static — no backend, no real-time data.
   ======================================================================== */

/**
 * Baseline figures — Zalka 2025 (kept visible and labelled on screen)
 */
var SCENARIO_BASELINE = {
  trees:      200,
  yieldKg:    44000,
  costPerKg:  0.22,
  investment: 171512,
  revenue:    39918,
  roi:        16.34  // percentage
};

/**
 * Compute projected figures for a given yield-increase percentage (0-50).
 * Uses the same linear projection logic as the original static scenario cards.
 * investmentDelta scales at half the yield delta (matching the original 5/10/15% ratios).
 * @param {number} yieldPct - yield increase as a whole number (e.g. 10 means +10%)
 * @returns {object} sYield, sRevenue, sInvestment, sRoi, deltaYield, deltaRevenue, deltaRoi
 */
function computeScenario(yieldPct) {
  var b               = SCENARIO_BASELINE;
  var yieldDelta      = yieldPct / 100;
  var investmentDelta = yieldDelta / 2;  // half-ratio from original logic

  var sYield      = b.yieldKg    * (1 + yieldDelta);
  var sRevenue    = b.revenue    * (1 + yieldDelta);
  var sInvestment = b.investment * (1 + investmentDelta);
  var sProfit     = sRevenue - (sYield * b.costPerKg);
  var sRoi        = (sProfit / sInvestment) * 100;

  return {
    sYield:       sYield,
    sRevenue:     sRevenue,
    sInvestment:  sInvestment,
    sRoi:         sRoi,
    deltaYield:   sYield    - b.yieldKg,
    deltaRevenue: sRevenue  - b.revenue,
    deltaRoi:     sRoi      - b.roi
  };
}

/**
 * Update live metric cards and SVG chart when the slider moves.
 * Called via oninput on the range input in index.html.
 * @param {number|string} rawVal - current slider value (0-50)
 */
function updateScenarioAnalysis(rawVal) {
  var pct = parseInt(rawVal, 10);

  // Update percentage label
  var label = document.getElementById('yield-slider-value');
  if (label) {
    label.textContent = (pct === 0) ? 'Baseline (0%)' : '+' + pct + '%';
  }

  var c = computeScenario(pct);
  var b = SCENARIO_BASELINE;

  var fmt    = function (n) { return new Intl.NumberFormat('en-US').format(Math.round(n)); };
  var fmtCur = function (n) { return fmt(n) + ' \u20ac'; };
  var sign   = function (n) { return (n > 0) ? '+' : ''; };

  // Color helpers — reuse existing CSS tokens, no new colors introduced
  var colorClass = function (val, isCost) {
    if (val === 0) { return 'task-card--amber'; }
    if (val > 0)   { return isCost ? 'task-card--red'   : 'task-card--green'; }
    return                  isCost ? 'task-card--green' : 'task-card--red';
  };
  var textColor = function (val, isCost) {
    if (val === 0) { return 'var(--amber)'; }
    if (val > 0)   { return isCost ? 'var(--red)'   : 'var(--green)'; }
    return                  isCost ? 'var(--green)' : 'var(--red)';
  };

  // Metric badge: pastel bg + 4px left border (via task-card modifier class)
  var badge = function (val, isCost, display) {
    return (
      '<div class="task-card ' + colorClass(val, isCost) + '"' +
      ' style="padding:2px 8px; font-size:var(--font-sm); box-shadow:none; cursor:default;' +
      ' display:inline-block; width:auto; flex:none; transform:none;' +
      ' color:' + textColor(val, isCost) + '; font-weight:600; border-radius:var(--radius-sm);">' +
      display + '</div>'
    );
  };

  // ---- Live metrics grid ----
  var metrics = document.getElementById('scenario-live-metrics');
  if (metrics) {
    if (pct === 0) {
      metrics.innerHTML =
        '<p style="color:var(--gray-700); font-size:var(--font-sm);">' +
        'Move the slider above 0% to see projected changes.</p>';
    } else {
      var investDelta = c.sInvestment - b.investment;
      metrics.innerHTML =
        '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px,1fr)); gap:var(--space-md);">' +

          '<div class="widget__list-item" style="flex-direction:column; align-items:flex-start; padding:var(--space-md);">' +
            '<div style="display:flex; justify-content:space-between; width:100%;">' +
              '<span>Projected Yield</span>' +
              '<span style="font-weight:600;">' + fmt(c.sYield) + ' kg</span>' +
            '</div>' +
            badge(c.deltaYield, false, sign(c.deltaYield) + fmt(c.deltaYield) + ' kg') +
          '</div>' +

          '<div class="widget__list-item" style="flex-direction:column; align-items:flex-start; padding:var(--space-md);">' +
            '<div style="display:flex; justify-content:space-between; width:100%;">' +
              '<span>Projected Revenue</span>' +
              '<span style="font-weight:600;">' + fmtCur(c.sRevenue) + '</span>' +
            '</div>' +
            badge(c.deltaRevenue, false, sign(c.deltaRevenue) + fmtCur(c.deltaRevenue)) +
          '</div>' +

          '<div class="widget__list-item" style="flex-direction:column; align-items:flex-start; padding:var(--space-md);">' +
            '<div style="display:flex; justify-content:space-between; width:100%;">' +
              '<span>Est. Investment</span>' +
              '<span style="font-weight:600;">' + fmtCur(c.sInvestment) + '</span>' +
            '</div>' +
            badge(investDelta, true, sign(investDelta) + fmtCur(investDelta)) +
          '</div>' +

          '<div class="widget__list-item" style="flex-direction:column; align-items:flex-start; padding:var(--space-md);">' +
            '<div style="display:flex; justify-content:space-between; width:100%;">' +
              '<span>Resulting ROI</span>' +
              '<span style="font-weight:600;">' + c.sRoi.toFixed(2) + '%</span>' +
            '</div>' +
            badge(c.deltaRoi, false, sign(c.deltaRoi) + c.deltaRoi.toFixed(2) + '%') +
          '</div>' +

        '</div>';
    }
  }

  // ---- Inline SVG bar chart ----
  // Illustrative static projection — not real-time data.
  // Two grouped bars: Revenue and ROI, baseline vs projected.
  var svg = document.getElementById('scenario-chart');
  if (!svg) { return; }

  // Chart layout (viewBox 480x160)
  var chartW = 480, chartH = 160;
  var padL = 48, padR = 16, padT = 12, padB = 28;
  var innerH = chartH - padT - padB;  // 120px usable height

  // Normalise heights; both clamped so bars never overflow the viewBox
  var maxRevenue = b.revenue * 2.0;  // x2 gives headroom up to 100% increase; safe at 50% max
  var maxRoi     = 40;               // % axis cap

  var revBase = (b.revenue   / maxRevenue) * innerH;
  var revProj = Math.min(c.sRevenue / maxRevenue, 1) * innerH;  // clamped
  var roiBase = (b.roi       / maxRoi)     * innerH;
  var roiProj = Math.min(c.sRoi    / maxRoi,     1) * innerH;  // clamped

  // Bar geometry: 2 groups x 2 bars, evenly spaced
  var groupGap = 40;
  var barW     = 40;
  var group1X  = padL + groupGap;
  var group2X  = padL + groupGap + 2 * barW + groupGap + barW;

  var baseColor = '#9e9e9e';  // var(--gray-500) — existing token
  var projColor = (pct === 0) ? '#9e9e9e' : '#2e7d32';  // var(--green) — existing token

  var bar = function (x, h, fill, axisLabel, topLabel) {
    var y         = padT + innerH - h;
    var valueFill = (fill === baseColor) ? '#616161' : '#2e7d32';
    return (
      '<rect x="' + x + '" y="' + y + '" width="' + barW + '" height="' + h + '" fill="' + fill + '" rx="3"/>' +
      '<text x="' + (x + barW / 2) + '" y="' + (y - 4) + '" text-anchor="middle"' +
        ' font-size="9" fill="' + valueFill + '"' +
        ' font-family="-apple-system,Segoe UI,Roboto,sans-serif">' + topLabel + '</text>' +
      '<text x="' + (x + barW / 2) + '" y="' + (chartH - padB + 14) + '" text-anchor="middle"' +
        ' font-size="9" fill="#616161"' +
        ' font-family="-apple-system,Segoe UI,Roboto,sans-serif">' + axisLabel + '</text>'
    );
  };

  var fmt2 = function (n) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
  };

  // Build SVG via string concatenation — avoids template-literal nesting issues
  svg.innerHTML =
    // Axes
    '<line x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + (padT + innerH) + '" stroke="#e0e0e0" stroke-width="1"/>' +
    '<line x1="' + padL + '" y1="' + (padT + innerH) + '" x2="' + (chartW - padR) + '" y2="' + (padT + innerH) + '" stroke="#e0e0e0" stroke-width="1"/>' +
    // Revenue bars
    bar(group1X,        Math.max(revBase, 2), baseColor, 'Rev. Base', fmt2(b.revenue)  + '\u20ac') +
    bar(group1X + barW, Math.max(revProj, 2), projColor, 'Rev. Proj', fmt2(c.sRevenue) + '\u20ac') +
    '<text x="' + (group1X + barW) + '" y="' + (chartH - 4) + '"' +
      ' text-anchor="middle" font-size="9" fill="#9e9e9e"' +
      ' font-family="-apple-system,Segoe UI,Roboto,sans-serif">Revenue (\u20ac)</text>' +
    // ROI bars
    bar(group2X,        Math.max(roiBase, 2), baseColor, 'ROI Base', b.roi.toFixed(1) + '%') +
    bar(group2X + barW, Math.max(roiProj, 2), projColor, 'ROI Proj', c.sRoi.toFixed(1) + '%') +
    '<text x="' + (group2X + barW) + '" y="' + (chartH - 4) + '"' +
      ' text-anchor="middle" font-size="9" fill="#9e9e9e"' +
      ' font-family="-apple-system,Segoe UI,Roboto,sans-serif">ROI (%)</text>' +
    // Legend
    '<rect x="' + padL + '" y="' + padT + '" width="10" height="10" fill="' + baseColor + '" rx="2"/>' +
    '<text x="' + (padL + 14) + '" y="' + (padT + 9) + '"' +
      ' font-size="9" fill="#616161" font-family="-apple-system,Segoe UI,Roboto,sans-serif">Baseline</text>' +
    '<rect x="' + (padL + 60) + '" y="' + padT + '" width="10" height="10" fill="' + projColor + '" rx="2"/>' +
    '<text x="' + (padL + 74) + '" y="' + (padT + 9) + '"' +
      ' font-size="9" fill="#616161" font-family="-apple-system,Segoe UI,Roboto,sans-serif">Projected (+' + pct + '%)</text>';
}

// Expose for oninput handler in index.html
window.updateScenarioAnalysis = updateScenarioAnalysis;


/**
 * Render the three static scenario comparison cards (+10/+20/+30% yield).
 * Illustrative projections — not real-time data.
 */
function renderScenarioAnalysis() {
  var container = document.getElementById('whatif-scenarios-container');
  if (!container) { return; }

  var b = SCENARIO_BASELINE;

  var scenarios = [
    { label: 'Scenario 1: +10% yield', yieldDelta: 0.10, investmentDelta: 0.05 },
    { label: 'Scenario 2: +20% yield', yieldDelta: 0.20, investmentDelta: 0.10 },
    { label: 'Scenario 3: +30% yield', yieldDelta: 0.30, investmentDelta: 0.15 }
  ];

  var html = '';

  scenarios.forEach(function (s) {
    var sYield      = b.yieldKg    * (1 + s.yieldDelta);
    var sRevenue    = b.revenue    * (1 + s.yieldDelta);
    var sInvestment = b.investment * (1 + s.investmentDelta);

    var deltaYield      = sYield      - b.yieldKg;
    var deltaRevenue    = sRevenue    - b.revenue;
    var deltaInvestment = sInvestment - b.investment;

    var sProfit  = sRevenue - (sYield * b.costPerKg);
    var sRoi     = (sProfit / sInvestment) * 100;
    var deltaRoi = sRoi - b.roi;

    var fmt    = function (num) { return new Intl.NumberFormat('en-US').format(Math.round(num)); };
    var fmtCur = function (num) { return fmt(num) + ' \u20ac'; };
    var fmtPct = function (num) { return (num > 0 ? '+' : '') + num.toFixed(2) + '%'; };

    // Delta badge — pastel bg + 4px left border using existing CSS modifier classes
    var getDeltaUI = function (val, isCost) {
      isCost = isCost || false;
      var colorClass = 'task-card--amber';
      var textColor  = 'var(--amber)';
      if (val > 0) {
        colorClass = isCost ? 'task-card--red'   : 'task-card--green';
        textColor  = isCost ? 'var(--red)'       : 'var(--green)';
      } else if (val < 0) {
        colorClass = isCost ? 'task-card--green' : 'task-card--red';
        textColor  = isCost ? 'var(--green)'     : 'var(--red)';
      }
      var displayVal = (typeof val === 'number')
        ? ((val > 0 ? '+' : '') + fmt(val))
        : val;
      return (
        '<div class="task-card ' + colorClass + '"' +
        ' style="padding:2px 8px; margin-top:4px; font-size:var(--font-sm);' +
        ' box-shadow:none; cursor:default; display:inline-block;' +
        ' width:auto; flex:none; transform:none;' +
        ' color:' + textColor + '; font-weight:600; border-radius:var(--radius-sm);">' +
        displayVal + '</div>'
      );
    };

    html +=
      '<div class="widget">' +
        '<h4 style="font-size:var(--font-lg); margin-bottom:var(--space-md);">' + s.label + '</h4>' +
        '<ul class="widget__list">' +
          '<li class="widget__list-item" style="flex-direction:column; align-items:flex-start;">' +
            '<div style="display:flex; justify-content:space-between; width:100%;">' +
              '<span>Projected Yield</span>' +
              '<span style="font-weight:600;">' + fmt(sYield) + ' kg</span>' +
            '</div>' +
            getDeltaUI('+' + fmt(deltaYield) + ' kg', false) +
          '</li>' +
          '<li class="widget__list-item" style="flex-direction:column; align-items:flex-start;">' +
            '<div style="display:flex; justify-content:space-between; width:100%;">' +
              '<span>Projected Revenue</span>' +
              '<span style="font-weight:600;">' + fmtCur(sRevenue) + '</span>' +
            '</div>' +
            getDeltaUI('+' + fmtCur(deltaRevenue), false) +
          '</li>' +
          '<li class="widget__list-item" style="flex-direction:column; align-items:flex-start;">' +
            '<div style="display:flex; justify-content:space-between; width:100%;">' +
              '<span>Est. Addt\'l Investment</span>' +
              '<span style="font-weight:600;">' + fmtCur(sInvestment) + '</span>' +
            '</div>' +
            getDeltaUI('+' + fmtCur(deltaInvestment), true) +
          '</li>' +
          '<li class="widget__list-item" style="flex-direction:column; align-items:flex-start; border-bottom:none;">' +
            '<div style="display:flex; justify-content:space-between; width:100%;">' +
              '<span>Resulting ROI</span>' +
              '<span style="font-weight:600;">' + sRoi.toFixed(2) + '%</span>' +
            '</div>' +
            getDeltaUI(fmtPct(deltaRoi), false) +
          '</li>' +
        '</ul>' +
      '</div>';
  });

  container.innerHTML = html;
}

window.addEventListener('DOMContentLoaded', function () {
  renderScenarioAnalysis();
  // Initialise slider display at default value (10%)
  updateScenarioAnalysis(10);
});

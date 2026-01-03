// Lógica movida desde script.js: middle dinámicos del aside + exportTableToCSV

(function () {
  const init = () => {
    const sidebarLinks = document.querySelectorAll('main aside .sidebar a');
    const middle = document.querySelector('main section.middle');

    // nodos que ocultaremos al abrir un panel
    const contentSelectors = [
      '.headers-container',
      '.monthly-report',
      '.pozos-vistos',
      '.charts-grid'
    ];

    const hideContent = () => {
      contentSelectors.forEach(sel => {
        const el = middle.querySelector(sel);
        if (el) el.style.display = 'none';
      });
    };

    const showContent = () => {
      contentSelectors.forEach(sel => {
        const el = middle.querySelector(sel);
        if (el) el.style.display = '';
      });
    };

    const createPanel = (title, id) => {
      let panel = middle.querySelector('#middle-panel');
      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'middle-panel';
        panel.className = 'middle-panel';
        const header = document.createElement('div');
        header.className = 'middle-panel-header';
        const h = document.createElement('h2');
        h.className = 'middle-panel-title';
        header.appendChild(h);
        panel.appendChild(header);

        const body = document.createElement('div');
        body.className = 'middle-panel-body';
        panel.appendChild(body);

        const ref = middle.querySelector('.headers-container') || null;
        if (ref) middle.insertBefore(panel, ref.nextSibling);
        else middle.appendChild(panel);
      }

      panel.querySelector('.middle-panel-title').innerText = title;
      const body = panel.querySelector('.middle-panel-body');

      // AICO: toolbar + tabla (sin Nuevo/Importar/Cerrar)
      if (id === 'panel-2' || /AICO/i.test(title)) {
        body.innerHTML = `
          <div class="aico-toolbar">
            <div class="aico-actions">
              <button id="aico-export" class="btn btn-primary">Exportar tabla</button>
            </div>
          </div>
          <div class="aico-table-wrap">
            <table id="aico-table" class="aico-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr class="empty"><td colspan="5">Sin datos</td></tr>
              </tbody>
            </table>
          </div>
        `;

        const btnExport = body.querySelector('#aico-export');
        btnExport.addEventListener('click', () => {
          exportTableToCSV('aico-table', 'aico_export.csv');
        });

      // FALLAS: filtros por fecha, seleccionar todo y tabla con checkboxes
      } else if (id === 'panel-3' || /Fallas/i.test(title)) {
        // nueva UI: lista agrupada por responsable + filtros de fecha mejorados
        body.innerHTML = `
          <div class="fallas-toolbar">
            <div class="fallas-filters">
              <label class="date-label">Fecha Inicial
                <input type="date" id="fallas-start" class="fallas-date-input">
              </label>
              <label class="date-label">Fecha Final
                <input type="date" id="fallas-end" class="fallas-date-input">
              </label>
              <button id="fallas-search" class="btn btn-primary">Buscar</button>
            </div>
            <div class="fallas-actions">
              <button id="fallas-select-all" class="btn">Seleccionar todas las fallas</button>
              <button id="fallas-export" class="btn btn-primary">Exportar visibles</button>
            </div>
          </div>
          <div class="fallas-list-wrap">
            <!-- aquí se renderiza la lista agrupada -->
          </div>
        `;

        // datos demo (se reemplazarán por DB luego)
        const sample = [
          { id: 'F001', desc: 'Fuga en válvula principal', resp: 'DIEL', date: '2025-12-20' },
          { id: 'F002', desc: 'Sensor caído en línea 2', resp: 'ELEC', date: '2025-12-30' },
          { id: 'F003', desc: 'Sobrepresión en pozo C', resp: 'ENEL', date: '2026-01-02' },
          { id: 'F004', desc: 'Mantenimiento preventivo', resp: 'DIEL', date: '2026-01-05' },
          { id: 'F005', desc: 'Fuga menor', resp: 'FSOP', date: '2026-01-10' }
        ];

        const listWrap = body.querySelector('.fallas-list-wrap');

        // render agrupado por responsable (accordion)
        const renderFallasList = (data) => {
          listWrap.innerHTML = '';
          const byResp = data.reduce((acc, cur) => {
            (acc[cur.resp] = acc[cur.resp] || []).push(cur);
            return acc;
          }, {});

          Object.keys(byResp).sort().forEach(resp => {
            const items = byResp[resp];
            const group = document.createElement('div');
            group.className = 'fallas-group';

            const header = document.createElement('div');
            header.className = 'group-header';
            header.innerHTML = `
              <div class="group-title">
                <strong>${resp}</strong>
                <span class="group-count">(${items.length})</span>
              </div>
              <div class="group-controls">
                <button class="btn btn-sm toggle-group">Abrir</button>
              </div>
            `;

            const bodyTable = document.createElement('div');
            bodyTable.className = 'group-body';
            bodyTable.innerHTML = `
              <table class="aico-table fallas-group-table">
                <thead>
                  <tr>
                    <th></th><th>ID</th><th>Descripción</th><th>Fecha</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(it => `
                    <tr data-id="${it.id}">
                      <td><input type="checkbox" class="fallas-row-checkbox"></td>
                      <td>${it.id}</td>
                      <td>${it.desc}</td>
                      <td class="fallas-date">${it.date}</td>
                      <td><button class="btn btn-sm">Ver</button></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `;

            group.appendChild(header);
            group.appendChild(bodyTable);
            listWrap.appendChild(group);

            // toggle
            const toggleBtn = header.querySelector('.toggle-group');
            toggleBtn.addEventListener('click', () => {
              const open = group.classList.toggle('open');
              toggleBtn.innerText = open ? 'Cerrar' : 'Abrir';
            });
          });
        };

        // inicial render
        renderFallasList(sample);

        // helpers
        const getVisibleRows = () => Array.from(listWrap.querySelectorAll('tbody tr')).filter(r => r.closest('.fallas-group').classList.contains('open'));

        const setAllVisible = (checked) => {
          getVisibleRows().forEach(r => {
            const cb = r.querySelector('.fallas-row-checkbox');
            if (cb) cb.checked = checked;
          });
        };

        // Select all button: alterna selección de filas visibles
        const btnSelectAll = body.querySelector('#fallas-select-all');
        btnSelectAll.addEventListener('click', () => {
          const rows = getVisibleRows();
          if (rows.length === 0) return;
          const allChecked = rows.every(r => r.querySelector('.fallas-row-checkbox').checked);
          setAllVisible(!allChecked);
        });

        // Export visibles: construye CSV desde filas visibles (abiertas)
        const btnExport = body.querySelector('#fallas-export');
        btnExport.addEventListener('click', () => {
          const rows = getVisibleRows();
          if (rows.length === 0) return alert('No hay filas visibles para exportar. Expande un responsable o ajusta el filtro.');
          const csvRows = [['ID','Descripción','Responsable','Fecha']];
          rows.forEach(r => {
            const id = r.children[1].innerText.trim();
            const desc = r.children[2].innerText.trim();
            const date = r.children[3].innerText.trim();
            const resp = r.closest('.fallas-group').querySelector('.group-title strong').innerText;
            csvRows.push([id, desc, resp, date]);
          });
          const csv = csvRows.map(cols => cols.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'fallas_visibles.csv';
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        });

        // Buscar por rango de fechas (filtra y rerenderiza)
        const btnSearch = body.querySelector('#fallas-search');
        btnSearch.addEventListener('click', () => {
          const start = body.querySelector('#fallas-start').value;
          const end = body.querySelector('#fallas-end').value;
          const startTime = start ? Date.parse(start) : -Infinity;
          const endTime = end ? Date.parse(end) : Infinity;
          const filtered = sample.filter(it => {
            const t = Date.parse(it.date);
            return t >= startTime && t <= endTime;
          });
          renderFallasList(filtered);
        });

        // mejora UX: inputs de fecha limpian filtro cuando cambian vacío
        body.querySelectorAll('.fallas-date-input').forEach(inp => {
          inp.addEventListener('change', () => {
            // no acción extra por ahora
          });
        });
      } else {
        body.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.className = 'middle-panel-placeholder';
        placeholder.innerText = `Sección: ${title} — aquí puedes colocar contenido independiente.`;
        body.appendChild(placeholder);
      }

      panel.dataset.panelId = id || '';
      return panel;
    };

    const openPanel = (title, id) => {
      hideContent();
      createPanel(title, id);
      middle.classList.add('has-panel');
    };

    const closePanel = () => {
      const panel = middle.querySelector('#middle-panel');
      if (panel) panel.remove();
      showContent();
      middle.classList.remove('has-panel');
    };

    // listeners en links del aside
    sidebarLinks.forEach((link, idx) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const title = (link.querySelector('h4') && link.querySelector('h4').innerText) || link.textContent.trim() || `Sección ${idx+1}`;

        if (idx === 0) {
          closePanel();
          return;
        }

        openPanel(title, `panel-${idx}`);
      });
    });

    // abrir panel por hash (opcional)
    if (location.hash && location.hash.startsWith('#panel-')) {
      const id = location.hash.slice(1);
      const link = Array.from(sidebarLinks).find((l, i) => (`panel-${i}` === id));
      if (link) link.click();
    }
  };

  // helper export CSV (cliente-side)
  function exportTableToCSV(tableId, filename = 'export.csv') {
    const table = document.getElementById(tableId);
    if (!table) return;
    const rows = Array.from(table.querySelectorAll('tr'));
    if (rows.length === 0) return alert('La tabla está vacía.');

    const csv = rows.map(row => {
      const cols = Array.from(row.querySelectorAll('th, td')).map(td => {
        const text = td.innerText.replace(/\r?\n|\r/g, ' ').replace(/"/g, '""');
        return `"${text.trim()}"`;
      });
      return cols.join(',');
    }).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Ejecutar init cuando el DOM esté listo (funciona si el script se carga al final del body)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
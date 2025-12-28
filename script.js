/* const chart = document.querySelector("#chart").getContext('2d');

new Chart(chart,{
    type: 'line',
    data: {
        labels: ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sep','Oct','Oct','Nov'],
        
        datasets: [
            {
                label: 'BTC',
                data: [29374, 33537, 49631, 59095, 57828, 36684, 33572, 39974, 48847, 48116, 61004, 51004],
                borderColor: 'red',
                borderWidth: 2
            },
            {
                label: 'ETH',
                data: [25374, 37537, 39631, 69095, 37828, 26684, 43572, 29974, 58847, 38116, 71004, 61004],
                borderColor: 'blue',
                borderWidth: 2
            }

        ]
    },
    options: {
        responsive: true
    }
})
*/

// Mostrar/ocultar columna (sidebar) - selectores corregidos
const menuBtn = document.querySelector('#menu-btn');
const closeBtn = document.querySelector('#close-btn');
const sidebar = document.querySelector('main aside'); // selecciona el aside

if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });
}

if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
}

// También permite cerrar tocando fuera de la sidebar en mobile
document.addEventListener('click', (e) => {
    if (!sidebar) return;
    const isClickInside = sidebar.contains(e.target) || (menuBtn && menuBtn.contains(e.target));
    if (!isClickInside && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});

// Cambiar tema de claro a oscuro
const themeBtn = document.querySelector('.theme-btn');

themeBtn.addEventListener('click', () =>{
    document.body.classList.toggle('dark-theme');

    themeBtn.querySelector('span:first-child').classList.toggle('active');
    themeBtn.querySelector('span:last-child').classList.toggle('active');
})

// Reemplazo: crear múltiples charts en grid (2x3) — ahora cada gráfico tiene tipo/estilo distinto
const chartElements = document.querySelectorAll('.chart-canvas');

const colors = ['#4f46e5','#ef4444','#06b6d4','#10b981','#f59e0b','#8b5cf6'];
const labelsMonthly = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const sampleNumberData = (n, min = 1000, max = 70000) =>
  Array.from({length: n}, () => Math.floor(Math.random() * (max - min + 1)) + min);

// configuraciones para cada canvas (6)
const chartConfigs = [
  // 1 - Line
  {
    type: 'line',
    data: {
      labels: labelsMonthly,
      datasets: [{
        label: 'Producción',
        data: sampleNumberData(labelsMonthly.length),
        borderColor: colors[0],
        backgroundColor: colors[0] + '33',
        fill: true,
        tension: 0.25,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(0,0,0,0.03)' } }
      }
    }
  },

  // 2 - Bar
  {
    type: 'bar',
    data: {
      labels: labelsMonthly,
      datasets: [{
        label: 'Flujo',
        data: sampleNumberData(labelsMonthly.length, 100, 5000),
        backgroundColor: labelsMonthly.map((_,i) => colors[i % colors.length] + 'cc'),
        borderColor: colors[1],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { ticks: { maxTicksLimit: 4 } }
      }
    }
  },

  // 3 - Doughnut
  {
    type: 'doughnut',
    data: {
      labels: ['Pozo A','Pozo B','Pozo C','Pozo D'],
      datasets: [{
        label: 'Distribución',
        data: [35, 25, 20, 20],
        backgroundColor: ['#4f46e5','#ef4444','#06b6d4','#10b981'],
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'right' } }
    }
  },

  // 4 - Radar (reemplazado por Mixed: barras + línea)
  {
    type: 'bar',
    data: {
      labels: ['Temperatura','Presión','pH','Viscosidad','Turbidez'],
      datasets: [
        {
          label: 'Medición',
          data: [65, 75, 50, 55, 60],
          backgroundColor: '#06b6d4cc',
          borderColor: '#06b6d4',
          borderWidth: 1
        },
        {
          type: 'line',
          label: 'Objetivo',
          data: [70, 80, 55, 60, 65],
          borderColor: '#ef4444',
          backgroundColor: '#ef444433',
          tension: 0.3,
          pointRadius: 3,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top' }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { maxTicksLimit: 5 } }
      }
    }
  },

  // 5 - Polar Area
  {
    type: 'polarArea',
    data: {
      labels: ['Norte','Sur','Este','Oeste'],
      datasets: [{
        label: 'Zonas',
        data: [11, 16, 7, 14],
        backgroundColor: ['#f59e0b','#8b5cf6','#06b6d4','#ef4444']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'right' } }
    }
  },

  // 6 - Pie
  {
    type: 'pie',
    data: {
      labels: ['Activos','Inactivos','Mantenimiento'],
      datasets: [{
        data: [60, 25, 15],
        backgroundColor: ['#10b981','#ef4444','#4f46e5']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  }
];

chartElements.forEach((canvas, i) => {
  const ctx = canvas.getContext('2d');
  const config = chartConfigs[i % chartConfigs.length];

  // clonar config para evitar mutaciones compartidas si se reconstruyen charts
  const cfg = JSON.parse(JSON.stringify(config));
  new Chart(ctx, cfg);
});
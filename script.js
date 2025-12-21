const chart = document.querySelector("#chart").getContext('2d');

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
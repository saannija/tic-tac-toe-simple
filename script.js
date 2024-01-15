const klase_X = 'x';
const klase_O = 'circle';

let punkti_X = 0;
let punkti_O = 0;

punkti_X = parseInt(localStorage.getItem('punkti_X')) || 0;
punkti_O = parseInt(localStorage.getItem('punkti_O')) || 0;

const punktiXElem = document.getElementById('punktiX');
const punktiOElem = document.getElementById('punktiO');

/*
    0 | 1 | 2
    3 | 4 | 5
    6 | 7 | 8
*/

const uzvaras_nosacijumi = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const visi_laucini = document.querySelectorAll('.cell');
const rezultatu_logs = document.getElementById('resaultBox');
const rezultatu_pazinojums = document.querySelector('.resaultInfo');
const atjaunot_poga = document.getElementById('restartButton');
const atjaunot_punktus_poga = document.getElementById('restartScoreButton');

const attelotSpeletaju = document.querySelector('.display');

let speletajs_O;

let startTime;
let gameInterval;

sakt_speli();

function sakt_speli() {
    startTime = new Date().getTime();
    startTimer();

    speletajs_O = false;
    attelotSpeletaju.innerText = `${speletajs_O ? "O" : "X"}`;
    visi_laucini.forEach(laucins => {
        laucins.classList.remove(klase_X);
        laucins.classList.remove(klase_O);
        laucins.style.backgroundColor = '';
        laucins.addEventListener('click', lietotaja_darbiba, { once: true });
    });
    rezultatu_logs.classList.remove('show');

    document.getElementById('timer').innerText = "0:00";
}


function startTimer() {
    gameInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedMilliseconds = currentTime - startTime;
    const minutes = Math.floor(elapsedMilliseconds / (60 * 1000));
    const seconds = Math.floor((elapsedMilliseconds % (60 * 1000)) / 1000);

    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById('timer').innerText = formattedTime;
}

function lietotaja_darbiba(klikskis) {
    const laucins = klikskis.target;
    const aktivais_speletajs = speletajs_O ? klase_O : klase_X;
    fona_maina(laucins, aktivais_speletajs);

    if (parbaudit_uzvaru(aktivais_speletajs)) {
        beigt_speli(false);
    } else if (neizskirts()) {
        beigt_speli(true);
    } else {
        mainit_speletaju();
    }
}

function fona_maina(laucins, aktivais_speletajs) {
    laucins.classList.add(aktivais_speletajs);
    if (aktivais_speletajs === klase_X) {
        document.body.style.backgroundColor = '#1c2c1a';
    } else {
        document.body.style.backgroundColor = '#1a252c';
    }
}

function mainit_speletaju() {
    speletajs_O = !speletajs_O;
    attelotSpeletaju.innerText = `${speletajs_O ? "O" : "X"}`;
}

function parbaudit_uzvaru(aktivais_speletajs) {
    const uzvaretajs = uzvaras_nosacijumi.find(nosacijums => {
        return nosacijums.every(index => {
            return visi_laucini[index].classList.contains(aktivais_speletajs);
        });
    });

    return uzvaretajs ? aktivais_speletajs : null;
}

function beigt_speli(neizskirts) {
    document.body.style.backgroundColor = '';

    clearInterval(gameInterval);

    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';

    const elapsedMilliseconds = new Date().getTime() - startTime;
    const elapsedMinutes = Math.floor(elapsedMilliseconds / (60 * 1000));
    const elapsedSeconds = Math.floor((elapsedMilliseconds % (60 * 1000)) / 1000);

    if (neizskirts) {
        rezultatu_pazinojums.innerText = "Neizšķirts rezultāts!";
    } else {
        const uzvaretajs = parbaudit_uzvaru(speletajs_O ? klase_O : klase_X);

        if (uzvaretajs !== null) {
            const uzvarosasKombinacijas = uzvaras_nosacijumi.find(nosacijums => {
                return nosacijums.every(index => {
                    return visi_laucini[index].classList.contains(uzvaretajs);
                });
            });

            if (uzvarosasKombinacijas) {
                uzvarosasKombinacijas.forEach(index => {
                    visi_laucini[index].classList.add('winning-cell');
                });
            }

            if (uzvaretajs === klase_X) {
                punkti_X++;
                overlay.style.display = 'block';
                rezultatu_pazinojums.innerText = "Spēlētājs X uzvarēja!";
            } else if (uzvaretajs === klase_O) {
                punkti_O++;
                overlay.style.display = 'block';
                rezultatu_pazinojums.innerText = "Spēlētājs O uzvarēja!";
            }
        }
    }

    attelotPunktuInfo();
    saglabatPunktusLocalStorage();

    const formattedTime = `${elapsedMinutes}m ${elapsedSeconds}s`;
    localStorage.setItem('pedejas_speles_ilgums', formattedTime);

    setTimeout(function () {
        rezultatu_logs.classList.add('show');
        overlay.style.display = 'none';
    }, 1000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function attelotPunktuInfo() {
    const punktuInfo = `Punkti X: ${punkti_X} | Punkti O: ${punkti_O}`;
    document.querySelector('.resaultInfo').innerText = punktuInfo;
    punktiXElem.textContent = punkti_X;
    punktiOElem.textContent = punkti_O;
}

function saglabatPunktusLocalStorage() {
    localStorage.setItem('punkti_X', punkti_X);
    localStorage.setItem('punkti_O', punkti_O);
}

function atjaunot_punktus() {
    punkti_X = 0;
    punkti_O = 0;
    attelotPunktuInfo();
    saglabatPunktusLocalStorage();
    localStorage.removeItem('pedejas_speles_ilgums');
}

window.addEventListener('load', () => {
    punkti_X = parseInt(localStorage.getItem('punkti_X')) || 0;
    punkti_O = parseInt(localStorage.getItem('punkti_O')) || 0;
    attelotPunktuInfo();
});

atjaunot_punktus_poga.addEventListener('click', atjaunot_punktus);

function neizskirts() {
    return [...visi_laucini].every(laucins => {
        return laucins.classList.contains(klase_X) || laucins.classList.contains(klase_O);
    });
}

atjaunot_poga.addEventListener('click', function () {
    sakt_speli();
    visi_laucini.forEach(laucins => {
        laucins.classList.remove('winning-cell');
    });
});

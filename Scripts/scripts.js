let towers = document.querySelectorAll('.tower');
let totalDisks = document.querySelectorAll('.disk').length;

let currentDisk = null;
let currentTower = null;
let offsetX = 0;
let offsetY = 0;
let moves = 0;
let movesText = document.getElementById('move-counter');
movesText.innerHTML = moves;

let originContent = document.getElementById('tower-a').innerHTML;

document.getElementById('reset-button').addEventListener('click', reset);

document.addEventListener('DOMContentLoaded', () => {

    // Eventos de ratón
    towers.forEach((tower) => {
        tower.addEventListener('mousedown', startDrag, { passive: true });
    });

    document.addEventListener('mousemove', onDrag, { passive: true });
    document.addEventListener('mouseup', endDrag, { passive: true });

    // Eventos de toque (móviles)
    towers.forEach((tower) => {
        tower.addEventListener('touchstart', startDrag, { passive: true });
    });

    document.addEventListener('touchmove', onDrag, { passive: true });
    document.addEventListener('touchend', endDrag, { passive: true });
});

function startDrag(e) {
    //e.preventDefault();
    let event = e.type === 'touchstart' ? e.touches[0] : e;
    
    if (event.target.classList.contains('disk')) {
        let disk = event.target;
        currentTower = disk.parentNode;

        if (currentTower.lastElementChild !== disk) {
            console.log("Sólo se puede mover el disco que está en la parte superior de la torre.");
            return;
        }

        currentDisk = disk;
        offsetX = event.offsetX || event.pageX - disk.getBoundingClientRect().left;
        offsetY = event.offsetY || event.pageY - disk.getBoundingClientRect().top;

        disk.style.position = 'absolute';
        disk.style.zIndex = '1000';
        document.body.appendChild(disk);

        moveAt(event.pageX, event.pageY);
    }
}

function onDrag(e) {
    //e.preventDefault();
    let event = e.type === 'touchmove' ? e.touches[0] : e;
    
    if (currentDisk) {
        moveAt(event.pageX, event.pageY);

        towers.forEach((tower) => {
            let towerRect = tower.getBoundingClientRect();
            if (
                event.clientX > towerRect.left &&
                event.clientX < towerRect.right &&
                event.clientY > towerRect.top &&
                event.clientY < towerRect.bottom
            ) {
                tower.classList.add('hover');
            } else {
                tower.classList.remove('hover');
            }
        });
    }
}

function endDrag(e) {
    //e.preventDefault();
    let event = e.type === 'touchend' ? e.changedTouches[0] : e;

    if (currentDisk) {
        let dropped = false;

        towers.forEach((tower) => {
            tower.classList.remove('hover');
            let towerRect = tower.getBoundingClientRect();
            if (
                event.clientX > towerRect.left &&
                event.clientX < towerRect.right &&
                event.clientY > towerRect.top &&
                event.clientY < towerRect.bottom
            ) {
                if (canMove(currentDisk, tower)) {
                    moveDisk(currentDisk, tower);
                    dropped = true;
                } else {
                    console.log("No se puede soltar el disco en esta torre.");
                }
            }
        });

        if (!dropped) {
            currentTower.appendChild(currentDisk);
        }

        currentDisk.style.position = 'static';
        currentDisk.style.zIndex = '1';
        currentDisk = null;
        checkWin();
    }
}

function moveAt(pageX, pageY) {
    if (currentDisk) {
        currentDisk.style.left = pageX - offsetX + 'px';
        currentDisk.style.top = pageY - offsetY + 'px';
    }
}

function canMove(disk, tower) {
    let topDisk = tower.lastElementChild;
    return !topDisk || parseInt(disk.dataset.size) < parseInt(topDisk.dataset.size);
}

function moveDisk(disk, tower) {
    tower.appendChild(disk);
    moves += 1;
    movesText.innerHTML = moves;
}

function checkWin() {
    let towerC = document.getElementById('tower-c');
    let disksInTowerC = towerC.querySelectorAll('.disk');
    
    if (disksInTowerC.length === totalDisks) {
        alert(`¡Felicidades! Has ganado el juego de la Torre de Hanoi. Movimientos ${moves}`);
        reset();
    }
}

function reset() {
    let towerA = document.getElementById('tower-a');
    let towerB = document.getElementById('tower-b');
    let towerC = document.getElementById('tower-c');

    towerB.innerHTML = '';
    towerC.innerHTML = '';

    towerA.innerHTML = originContent;

    moves = 0;
    movesText.innerHTML = moves; 
}
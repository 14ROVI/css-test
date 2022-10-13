const NUM_GHOST = 4;
let pac = null;
let gridRowCount = 0;
let gridColumnCount = 0;
let UP = 0;
let DOWN = 1;
let LEFT = 2;
let RIGHT = 3;
let STOP = -1;

function elementsOverlap(el1, el2) {
    const domRect1 = el1.getBoundingClientRect();
    const domRect2 = el2.getBoundingClientRect();
  
    return !(
      domRect1.top > domRect2.bottom ||
      domRect1.right < domRect2.left ||
      domRect1.bottom < domRect2.top ||
      domRect1.left > domRect2.right
    );
  }

function getRowsColumns(pacman) {
    const gridComputedStyle = window.getComputedStyle(pacman);
    const gridRowCount = gridComputedStyle.getPropertyValue("grid-template-rows").split(" ").length;
    const gridColumnCount = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;
    return [gridRowCount, gridColumnCount];
}

function mousePacman(container) {
    pac = document.createElement("img");
    pac.src = "icon.svg";
    pac.classList.add("ghost");
    container.appendChild(pac);

    let x = Math.round(Math.random() * gridColumnCount);
    let y = Math.round(Math.random() * gridRowCount);

    let w = pac.width;

    let tx = 0;
    let ty = 0;

    document.addEventListener("mousemove", (e) => {
        tx = e.pageX;
        ty = e.pageY;
    });
    
    setInterval(() => {
        let cx = pac.getBoundingClientRect().x + w/2;
        let cy = pac.getBoundingClientRect().y + w/2;

        if (cx < tx - w /2) {
            direction = RIGHT;
        } else if (tx + w/2 < cx) {
            direction = LEFT;
        } else if (cy < ty - w/2) {
            direction = DOWN;
        } else if (ty + w/2 < cy) {
            direction = UP;
        } else {
            direction = STOP;
        }
        
        if (direction == UP) {
            y -= 1; // up
            pac.style.transform = "rotate(270deg)";
        }
        else if (direction == DOWN) {
            y += 1; // down
            pac.style.transform = "rotate(90deg)";
        }
        else if (direction == RIGHT) {
            x += 1; // right
            pac.style.transform = "rotate(0deg)";
        }
        else if (direction == LEFT) {
            x -= 1; // left
            pac.style.transform = "rotate(180deg)";
        }

        if (y > gridRowCount) {
            y = gridRowCount;
            direction = UP;
        }
        if (y < 0) {
            y = 0;
            direction = DOWN;
        }
        if (x > gridColumnCount) {
            x = gridColumnCount;
            direction = LEFT;
        }
        if (x < 0) {
            x = 0;
            direction = RIGHT;
        }

        pac.style.gridColumn = x;
        pac.style.gridRow = y;
    }, 50);
}

function ghostDie(g, pacman) {
    let dn = () => {g.style.display = "none";};
    let d = () => {g.style.display = "";};
    setTimeout(dn, 0);    
    setTimeout(d, 100);
    setTimeout(dn, 400);    
    setTimeout(d, 300);
    setTimeout(dn, 600);    
    setTimeout(d, 500);
    setTimeout(dn, 800);
    setTimeout(() => {
        g.remove();
    }, 800);
    
    setTimeout(() => {
        ghost(pacman);
    }, 5000);
}

function ghost(pacman) {
    const ghost = document.createElement("img");
    ghost.src = "ghost.svg";
    ghost.classList.add("ghost");
    pacman.appendChild(ghost);

    let x = Math.round(Math.random() * gridColumnCount);
    let y = Math.round(Math.random() * gridRowCount);

    let direction = Math.round(Math.random() * 4);
    
    setInterval(() => {
        if (direction != STOP && Math.random() > 0.95) {
            direction = Math.round(Math.random() * 4);
        }
        
        if (direction == UP) y -= 1; // up
        else if (direction == DOWN) y += 1; // down
        else if (direction == RIGHT) x += 1; // right
        else if (direction == LEFT) x -= 1; // left

        if (y > gridRowCount) {
            y = gridRowCount;
            direction = UP;
        }
        if (y < 0) {
            y = 0;
            direction = DOWN;
        }
        if (x > gridColumnCount) {
            x = gridColumnCount;
            direction = LEFT;
        }
        if (x < 0) {
            x = 0;
            direction = RIGHT;
        }

        ghost.style.gridColumn = x;
        ghost.style.gridRow = y;

        if (elementsOverlap(ghost, pac) && direction != STOP) {
            ghostDie(ghost, pacman);
            direction = STOP;
        }
    }, 50);
}

document.addEventListener("DOMContentLoaded", () => {
    const pacman = document.getElementById("pacman");

    [gridRowCount, gridColumnCount] = getRowsColumns(pacman);
    console.log([gridRowCount, gridColumnCount]);
    window.addEventListener("resize", () => {
        [gridRowCount, gridColumnCount] = getRowsColumns(pacman);
    });

    mousePacman(pacman);

    for (let i = 0; i < NUM_GHOST; i+=1) {
        ghost(pacman);
    }
});
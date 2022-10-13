const NUM_GHOST = 4;
let pac = null;
let cWidth = 0;
let cHeight = 0;
const ms = 5;
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

function mousePacman(container) {
    pac = document.createElement("img");
    pac.src = "icon.svg";
    pac.classList.add("ghost");
    container.appendChild(pac);

    let x = Math.random() * cWidth;
    let y = Math.random() * cHeight;

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
            y -= ms; // up
            pac.style.transform = "rotate(270deg)";
        }
        else if (direction == DOWN) {
            y += ms; // down
            pac.style.transform = "rotate(90deg)";
        }
        else if (direction == RIGHT) {
            x += ms; // right
            pac.style.transform = "rotate(0deg)";
        }
        else if (direction == LEFT) {
            x -= ms; // left
            pac.style.transform = "rotate(180deg)";
        }

        if (y > cHeight) {
            y = cHeight;
            direction = UP;
        }
        if (y < 0) {
            y = 0;
            direction = DOWN;
        }
        if (x > cWidth) {
            x = cWidth;
            direction = LEFT;
        }
        if (x < 0) {
            x = 0;
            direction = RIGHT;
        }

        pac.style.left = x + "px";
        pac.style.top = y + "px";
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

    let x = Math.random() * cWidth;
    let y = Math.random() * cHeight;

    let direction = Math.round(Math.random() * 4);
    
    setInterval(() => {
        if (direction != STOP && Math.random() > 0.95) {
            direction = Math.round(Math.random() * 4);
        }
        
        if (direction == UP) y -= ms; // up
        else if (direction == DOWN) y += ms; // down
        else if (direction == RIGHT) x += ms; // right
        else if (direction == LEFT) x -= ms; // left

        if (y > cHeight) {
            y = cHeight;
            direction = UP;
        }
        if (y < 0) {
            y = 0;
            direction = DOWN;
        }
        if (x > cWidth) {
            x = cWidth;
            direction = LEFT;
        }
        if (x < 0) {
            x = 0;
            direction = RIGHT;
        }

        ghost.style.left = x + "px";
        ghost.style.top = y + "px";

        if (elementsOverlap(ghost, pac) && direction != STOP) {
            ghostDie(ghost, pacman);
            direction = STOP;
        }
    }, 100);
}

document.addEventListener("DOMContentLoaded", () => {
    const pacman = document.getElementById("pacman");

    cWidth = pacman.getBoundingClientRect().width;
    cHeight = pacman.getBoundingClientRect().height;
    window.addEventListener("resize", () => {
        cWidth = pacman.getBoundingClientRect().width;
        cHeight = pacman.getBoundingClientRect().height;
    });

    mousePacman(pacman);

    for (let i = 0; i < NUM_GHOST; i+=1) {
        ghost(pacman);
    }
});
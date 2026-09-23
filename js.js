
const board = document.getElementById("div");
const palette = document.getElementById("palette");
const rightPalette = document.getElementById("rightdiv");

const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
    "black",
    "gray",
    "white",
    "cyan",
    "brown"
];

let selectedColor = colors[0];

let palleteitemisclicked = false;


// Build the color palette
colors.forEach(function (color) {

    const swatch = document.createElement("div");
    swatch.style.backgroundColor = color;

    if (color === selectedColor) {
        swatch.classList.add("selected");
    }

    swatch.addEventListener("click", function () {

        selectedColor = color;

        // if color is clicked twice, it will deselect the color
        // and set selectedColor to black
        if (swatch.classList.contains("selected")) {

            swatch.classList.remove("selected");
            selectedColor = "black";

            return;
        }

        document.querySelectorAll("#palette > div").forEach(function (s) {
            s.classList.remove("selected");
        });

        swatch.classList.add("selected");
    });

    palette.appendChild(swatch);
});


// -------------------------
// MOUSE / TOUCH CONTROLS
// -------------------------

let isMouseDown = false;

board.addEventListener("mousedown", function (event) {

    isMouseDown = true;

    event.preventDefault();
});

document.addEventListener("mouseup", function () {

    isMouseDown = false;
});

board.addEventListener("touchstart", function (event) {

    isMouseDown = true;

    event.preventDefault();
});

document.addEventListener("touchend", function () {

    isMouseDown = false;
});

board.addEventListener("touchmove", function (event) {

    event.preventDefault();

    const touch = event.touches[0];

    const target = document.elementFromPoint(
        touch.clientX,
        touch.clientY
    );

    if (target && target.parentElement === board) {

        target.dispatchEvent(new Event("mouseenter"));
    }
});


// -------------------------
// CREATE THE LITE-BRITE HOLES
// -------------------------

// how many holes across (and down) the board is
let boardSize = 20;

function buildBoard(size) {

    boardSize = size;

    // remove the old holes
    board.innerHTML = "";

    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    // big boards get thinner rings so the holes fit on a phone
    board.classList.toggle("dense", size >= 25);

    for (let i = 0; i < size * size; i++) {
        createHole();
    }
}

function createHole() {

    const hole = document.createElement("div");

    let isPainted = false;

    function paint() {

        hole.style.backgroundColor = selectedColor;

        hole.style.boxShadow =
            `0 0 20px ${selectedColor}`;

        isPainted = true;
    }

    hole.addEventListener("click", function () {

        if (isPainted) {

            hole.style.backgroundColor = "";
            hole.style.boxShadow = "";

            isPainted = false;

        } else {

            paint();
        }
    });

    hole.addEventListener("mouseenter", function () {

        if (isMouseDown) {

            paint();

            // If mouse is dragged without a color selected,
            // paint it black
            if (!selectedColor) {

                selectedColor = "black";
            }
        }
    });

    board.appendChild(hole);
}

buildBoard(boardSize);


// -------------------------
// CLEAR BUTTON
// -------------------------

const clearButton = document.createElement("button");

clearButton.innerHTML = '<img src="images//Screenshot 2026-09-22 214600.png" width="50" style="border-radius: 20px;">';

clearButton.addEventListener("click", function () {

    if (smileyInterval !== null) {
        clearInterval(smileyInterval);
        smileyInterval = null;
    }
    if (discoInterval !== null) {
        clearInterval(discoInterval);
        discoInterval = null;
    }
    document.querySelectorAll("#div > div").forEach(function (hole) {

        hole.style.backgroundColor = "";
        hole.style.boxShadow = "";
    });
});

palette.appendChild(clearButton);


// -------------------------
// DISCO MODE
// -------------------------

const discoButton = document.createElement("button");

discoButton.innerHTML = '<img src=" images/discoBall.png" width="50" style="border-radius: 20px;">';

let discoInterval = null;

discoButton.addEventListener("click", function () {

    if (smileyInterval !== null) {
        clearInterval(smileyInterval);
        smileyInterval = null;
    }

    const holes = document.querySelectorAll("#div > div");

    if (discoInterval === null) {

        // START

        discoInterval = setInterval(function () {

            holes.forEach(function (hole) {

                const randomColor =
                    colors[Math.floor(Math.random() * colors.length)];

                hole.style.backgroundColor = randomColor;

                hole.style.boxShadow =
                    `0 0 20px ${randomColor}`;
            });

        }, 100);

        discoButton.innerHTML = '<img src="images/Screenshot 2026-09-22 213449.png" width="50" style="border-radius: 20px;">';

    } else {

        // STOP

        clearInterval(discoInterval);
        // Clear the board
        discoInterval = null;
        const holes = document.querySelectorAll("#div > div");

        holes.forEach(hole => {

            hole.style.backgroundColor = "#111";
            hole.style.boxShadow = "none";
        });


        discoButton.innerHTML = '<img src=" images/discoBall.png" width="50" style="border-radius: 20px;">';
        //smileyButton.innerHTML =
        // '<img src=" images\discoBall.png" width="50" style="border-radius: 20px;">';

    }
});

palette.appendChild(discoButton);


// -------------------------
// SMILEY FACE
// -------------------------

const smileyButton = document.createElement("button");

smileyButton.innerHTML =
    '<img src="images/Screenshot 2026-09-22 212213.png" width="50" style="border-radius: 20px;">';


let smileyInterval = null;

let lookingRight = false;


smileyButton.addEventListener("click", function () {

    // stops other functions like disco
    if (discoInterval !== null) {
        clearInterval(discoInterval);
        discoInterval = null;
    }

    function drawSmiley(lookingRight) {

        const holes = document.querySelectorAll("#div > div");


        // Turn everything off first

        holes.forEach(hole => {

            hole.style.backgroundColor = "#111";
            hole.style.boxShadow = "none";
        });


        // Helper function

        // the smiley is drawn for a 20x20 board,
        // so on bigger boards shift it to the middle
        const offset = Math.floor((boardSize - 20) / 2);

        function colorDot(row, column, color) {

            row = row + offset;
            column = column + offset;

            // skip dots that would land off the board
            if (row < 0 || row >= boardSize || column < 0 || column >= boardSize) {
                return;
            }

            const index = row * boardSize + column;

            holes[index].style.backgroundColor = color;

            holes[index].style.boxShadow =
                `0 0 20px ${color}`;
        }


        // -------------------------
        // FACE
        // -------------------------

        const yellow = "yellow";

        colorDot(3, 7, yellow);
        colorDot(3, 8, yellow);
        colorDot(3, 9, yellow);
        colorDot(3, 10, yellow);
        colorDot(3, 11, yellow);
        colorDot(3, 12, yellow);

        colorDot(4, 5, yellow);
        colorDot(4, 6, yellow);
        colorDot(4, 13, yellow);
        colorDot(4, 14, yellow);

        colorDot(5, 4, yellow);
        colorDot(5, 15, yellow);

        colorDot(6, 3, yellow);
        colorDot(6, 16, yellow);

        colorDot(7, 3, yellow);
        colorDot(7, 16, yellow);

        colorDot(8, 2, yellow);
        colorDot(8, 17, yellow);

        colorDot(9, 2, yellow);
        colorDot(9, 17, yellow);

        colorDot(10, 2, yellow);
        colorDot(10, 17, yellow);

        colorDot(11, 2, yellow);
        colorDot(11, 17, yellow);

        colorDot(12, 3, yellow);
        colorDot(12, 16, yellow);

        colorDot(13, 3, yellow);
        colorDot(13, 16, yellow);

        colorDot(14, 4, yellow);
        colorDot(14, 15, yellow);

        colorDot(15, 5, yellow);
        colorDot(15, 6, yellow);
        colorDot(15, 13, yellow);
        colorDot(15, 14, yellow);

        colorDot(16, 7, yellow);
        colorDot(16, 8, yellow);
        colorDot(16, 9, yellow);
        colorDot(16, 10, yellow);
        colorDot(16, 11, yellow);
        colorDot(16, 12, yellow);


        // -------------------------
        // EYES
        // -------------------------

        if (lookingRight) {

           

            // Left eye - white
            colorDot(6, 7, "white");
            colorDot(6, 8, "white");
            colorDot(6, 9, "white");
            colorDot(7, 7, "white");
            colorDot(7, 8, "white");
            colorDot(7, 9, "white");
            colorDot(8, 7, "white");
            colorDot(8, 8, "white");
            colorDot(8, 9, "white");

            // Left pupil
            colorDot(7, 9, "blue");

            // Right eye - white
            colorDot(6, 11, "white");
            colorDot(6, 12, "white");
            colorDot(6, 13, "white");
            colorDot(7, 11, "white");
            colorDot(7, 12, "white");
            colorDot(7, 13, "white");
            colorDot(8, 11, "white");
            colorDot(8, 12, "white");
            colorDot(8, 13, "white");

            // Right pupil
            colorDot(7, 13, "blue");

        } else {

           

            // Left eye - white
            colorDot(6, 7, "white");
            colorDot(6, 8, "white");
            colorDot(6, 9, "white");
            colorDot(7, 7, "white");
            colorDot(7, 8, "white");
            colorDot(7, 9, "white");
            colorDot(8, 7, "white");
            colorDot(8, 8, "white");
            colorDot(8, 9, "white");

            // Left pupil
            colorDot(7, 8, "blue");

            // Right eye - white
            colorDot(6, 11, "white");
            colorDot(6, 12, "white");
            colorDot(6, 13, "white");
            colorDot(7, 11, "white");
            colorDot(7, 12, "white");
            colorDot(7, 13, "white");
            colorDot(8, 11, "white");
            colorDot(8, 12, "white");
            colorDot(8, 13, "white");

            // Right pupil
            colorDot(7, 12, "blue");
        }


        colorDot(12, 7, "red");
        colorDot(13, 8, "red");
        colorDot(13, 9, "red");
        colorDot(13, 10, "red");
        colorDot(13, 11, "red");
        colorDot(12, 12, "red");
        // -------------------------
        // SMILE
        // -------------------------

        // colorDot(10, 7, "red");
        // colorDot(11, 8, "red");
        // colorDot(11, 9, "red");
        // colorDot(11, 10, "red");
        // colorDot(11, 11, "red");
        // colorDot(10, 12, "red");
    }


    // -------------------------
    // START / STOP
    // -------------------------

    if (smileyInterval === null) {

        // START

        smileyInterval = setInterval(function () {

            drawSmiley(lookingRight);

            lookingRight = !lookingRight;

        }, 2000);


        // RUNNING IMAGE
        smileyButton.innerHTML =
            '<img src="images/Screenshot 2026-09-22 212236.png" width="50" style="border-radius: 20px;">';

    } else {

        // STOP

        clearInterval(smileyInterval);

        smileyInterval = null;


        // Clear the board

        const holes = document.querySelectorAll("#div > div");

        holes.forEach(hole => {

            hole.style.backgroundColor = "#111";
            hole.style.boxShadow = "none";
        });


        // STOPPED IMAGE




        smileyButton.innerHTML =
            '<img src="images/Screenshot 2026-09-22 212213.png" width="50" style="border-radius: 20px;">';
    }

});


palette.appendChild(smileyButton);


// -------------------------
// BOARD SIZE
// -------------------------

const boardSizes = [10, 15, 20, 25, 30];

// clicking this opens / closes the size choices, like a dropdown
const sizeToggle = document.createElement("button");
sizeToggle.classList.add("sizetoggle");
rightPalette.appendChild(sizeToggle);

// start tucked away
rightPalette.classList.add("collapsed");

function updateSizeToggle() {

    if (rightPalette.classList.contains("collapsed")) {
        sizeToggle.textContent = `Size ${boardSize} ▾`;
    } else {
        sizeToggle.textContent = `Size ${boardSize} ▴`;
    }
}

sizeToggle.addEventListener("click", function () {

    rightPalette.classList.toggle("collapsed");
    updateSizeToggle();
});

updateSizeToggle();

boardSizes.forEach(function (size) {

    const sizeButton = document.createElement("div");

    sizeButton.textContent = size;
    sizeButton.title = `${size} × ${size}`;

    if (size === boardSize) {
        sizeButton.classList.add("selected");
    }

    sizeButton.addEventListener("click", function () {

        // stop disco and smiley so they don't keep
        // using the old holes
        if (discoInterval !== null) {
            clearInterval(discoInterval);
            discoInterval = null;
            discoButton.innerHTML = '<img src=" images/discoBall.png" width="50" style="border-radius: 20px;">';
        }
        if (smileyInterval !== null) {
            clearInterval(smileyInterval);
            smileyInterval = null;
            smileyButton.innerHTML =
                '<img src="images/Screenshot 2026-09-22 212213.png" width="50" style="border-radius: 20px;">';
        }

        buildBoard(size);

        document.querySelectorAll("#rightdiv > div").forEach(function (s) {
            s.classList.remove("selected");
        });

        sizeButton.classList.add("selected");

        updateSmileyButton();

        // tuck the choices away again after picking one
        rightPalette.classList.add("collapsed");
        updateSizeToggle();
    });

    rightPalette.appendChild(sizeButton);
});

// the smiley face needs at least a 20x20 board to fit
function updateSmileyButton() {

    if (boardSize < 20) {
        smileyButton.disabled = true;
        smileyButton.style.opacity = "0.4";
        smileyButton.title = "Smiley needs a 20 × 20 board or bigger";
    } else {
        smileyButton.disabled = false;
        smileyButton.style.opacity = "";
        smileyButton.title = "";
    }
}


// -------------------------
// BUTTON STYLING
// -------------------------

smileyButton.style.borderRadius = "20px";

discoButton.style.borderRadius = "20px";

clearButton.style.borderRadius = "20px";

 




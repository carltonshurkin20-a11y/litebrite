 const board = document.getElementById("div");
const palette = document.getElementById("palette");

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

 

// Build the color palette
colors.forEach(function (color) {

    const swatch = document.createElement("div");
    swatch.style.backgroundColor = color;

    if (color === selectedColor) {
        swatch.classList.add("selected");
    }

    swatch.addEventListener("click", function () {
        selectedColor = color;
        // if color is clicked twice, it will deselect the color and set selectedColor to null
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
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    if (target && target.parentElement === board) {
        target.dispatchEvent(new Event("mouseenter"));
    }
});
// Create 400 Lite-Brite holes
for (let i = 0; i < 400; i++) {

    const hole = document.createElement("div");
    let isPainted = false;

    function paint() {
        hole.style.backgroundColor = selectedColor;
        hole.style.boxShadow = `0 0 20px ${selectedColor}`;
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
            // make if mouse is dragged without a color selected, it will paint it black
            if (!selectedColor) {
                selectedColor = "black";
            } 
        }
    }); 
    board.appendChild(hole);
}

 
const clearButton = document.createElement("button");
clearButton.textContent = "Clear Board";
clearButton.addEventListener("click", function () {
    document.querySelectorAll("#div > div").forEach(function (hole) {
        hole.style.backgroundColor = "";
        hole.style.boxShadow = "";
 } ); 


});
palette.appendChild(clearButton);
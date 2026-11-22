const gpaWheel = document.getElementById("gpaWheel");

function updateGpaWheel(value) {
    if (value < 0) value = 0;
    if (value > 4) value = 4;

    let color1 = "hotpink"; // default
    let color2 = "pink";    // default

    if (value === 2.0 || value === 2) {
        color1 = "green";
        color2 = "lightgreen";
    } else if (value >= 3.5) {
        color1 = "blue";
        color2 = "lightblue";
    } else if (value === 0) {
        color1 = "#d3e8d3ff";
        color2 = "#d3e8d3ff";
    } else if (value < 1.0) {
        color1 = "red";
        color2 = "orange";
    }

    // Smoothly update via CSS variables
    gpaWheel.style.setProperty("--color1", color1);
    gpaWheel.style.setProperty("--color2", color2);
    gpaWheel.style.setProperty("--progress-value", value);

    // Update text
    gpaWheel.setAttribute("data-value", value.toFixed(2));
}

// Example init
updateGpaWheel(Gpa);

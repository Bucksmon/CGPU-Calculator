// ---------------- Grade Scales ----------------
const gradeScales = {
    CUST: [
        { grade: "A", marks: "90-100", gpa: "4.00" },
        { grade: "A-", marks: "86-89", gpa: "3.67" },
        { grade: "B+", marks: "81-85", gpa: "3.33" },
        { grade: "B", marks: "77-80", gpa: "3.00" },
        { grade: "B-", marks: "72-76", gpa: "2.67" },
        { grade: "C+", marks: "68-71", gpa: "2.33" },
        { grade: "C", marks: "63-67", gpa: "2.00" },
        { grade: "C-", marks: "58-62", gpa: "1.67" },
        { grade: "D+", marks: "54-57", gpa: "1.33" },
        { grade: "D", marks: "50-53", gpa: "1.00" },
        { grade: "F", marks: "Below 50", gpa: "0.00" }
    ],

    COMSATS: [
        { grade: "A", marks: "85 and above", gpa: "4.00" },
        { grade: "A-", marks: "80-84", gpa: "3.66" },
        { grade: "B+", marks: "75-79", gpa: "3.33" },
        { grade: "B", marks: "71-74", gpa: "3.00" },
        { grade: "B-", marks: "68-70", gpa: "2.66" },
        { grade: "C+", marks: "64-67", gpa: "2.33" },
        { grade: "C", marks: "61-63", gpa: "2.00" },
        { grade: "C-", marks: "58-60", gpa: "1.66" },
        { grade: "D+", marks: "54-57", gpa: "1.30" },
        { grade: "D", marks: "50-53", gpa: "1.00" },
        { grade: "F", marks: "Below 50", gpa: "0.00" }
    ],

    Air: [
        { grade: "A", marks: "80-100", gpa: "4.00" },
        { grade: "A-", marks: "75-79.99", gpa: "3.67" },
        { grade: "B+", marks: "70-74.99", gpa: "3.33" },
        { grade: "B", marks: "65-69.99", gpa: "3.00" },
        { grade: "B-", marks: "60-64.99", gpa: "2.67" },
        { grade: "C+", marks: "55-59.99", gpa: "2.33" },
        { grade: "C", marks: "50-54.99", gpa: "2.00" },
        { grade: "F", marks: "Below 50", gpa: "0.00" }
    ],

    Bahria: [
        { grade: "A", marks: "87-100", gpa: "4.00" },
        { grade: "B+", marks: "80-86", gpa: "3.50" },
        { grade: "B", marks: "72-79", gpa: "3.00" },
        { grade: "C+", marks: "66-71", gpa: "2.50" },
        { grade: "C", marks: "60-65", gpa: "2.00" },
        { grade: "D", marks: "50-59", gpa: "1.50" },
        { grade: "F", marks: "Below 50", gpa: "0.00" }
    ]
};


// ---------------- GPA Menu ----------------
function initGpaMenu(containerSelector, onChangeHandler) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const items = Array.from(container.querySelectorAll(".nav-item"));
    let index = items.findIndex(div => div.classList.contains("active"));
    if (index === -1) index = 0;

    function updateMenu(triggerChange = true) {
        items.forEach((div, i) => {
            div.classList.remove("active");
            if (i === index) div.classList.add("active");
        });

        if (triggerChange && onChangeHandler) {
            const uniName = items[index].querySelector("span").textContent.trim();
            onChangeHandler(uniName);
        }
    }

    // ✅ CLICK EVENT
    items.forEach((div, i) => {
        div.addEventListener("click", () => {
            index = i;
            updateMenu();
        });
    });

    updateMenu(false); // initial render
}


// ---------------- Grade Table Population ----------------
function populateGradeTable(scaleKey) {
    const tableBody = document.querySelector("#grade-scale-table tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";
    gradeScales[scaleKey].forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.grade}</td>
            <td>${row.marks}</td>
            <td>${row.gpa}</td>
        `;
        tableBody.appendChild(tr);
    });
}


// ---------------- Initialize GPA Menu ----------------
let activeUni = "COMSATS";
let gpa = [];
const uniBackgrounds = {
    CUST: "../images/cust.png",
    COMSATS: "../images/Comsats.svg",
    Air: "../images/Air.svg",
    Bahria: "../images/Bahria.svg"
};
const infoPanel = document.querySelector(".info");
infoPanel.style.background = `
        linear-gradient(rgba(0, 47, 122, 0.85), rgba(0, 47, 122, 0.85)),
        url("../images/Comsats.svg") center/600px no-repeat
    `;
function updateInfoBackground(uniKey) {

    if (!infoPanel) return;
    const bgImage = uniBackgrounds[uniKey] || "../images/Comsats.svg";
    const titleImg = document.querySelector(".title img");
    switch (uniKey) {
        case "COMSATS":
            infoPanel.style.background = `
        linear-gradient(rgba(0, 47, 122, 0.85), rgba(0, 47, 122, 0.85)),
        url("${bgImage}") center/600px no-repeat
    `;
            titleImg.src = uniBackgrounds.COMSATS;

            break;

        case "CUST":
            infoPanel.style.background = `
        linear-gradient(rgba(0, 43, 87, 0.85), rgba(220, 38, 38, 0.85)),
        url("${bgImage}") center/550px no-repeat
    `;
            titleImg.src = uniBackgrounds.CUST;
            break;

        case "Air":
            infoPanel.style.background = `
        linear-gradient(rgba(1, 5, 17, 0.85), rgba(148, 151, 159, 0.85)),
        url("${bgImage}") center/600px no-repeat
    `;
            titleImg.src = uniBackgrounds.Air;
            break;

        case "Bahria":
            infoPanel.style.background = `
        linear-gradient(rgba(0, 34, 68, 0.85), rgba(144, 110, 27, 0.65)),
        url("${bgImage}") center/500px no-repeat
    `;
            titleImg.src = uniBackgrounds.Bahria;

            break;

    }

} function resetCourses() {
    // Remove all rows
    coursesContainer.querySelectorAll(".course-row").forEach(row => row.remove());
    createCourseRow();
    createCourseRow();
    calculateGPA();
}

initGpaMenu(".uni-navbar", selectedText => {
    let key = null;
    if (selectedText === "COMSATS") key = "COMSATS";
    else if (selectedText === "Cust") key = "CUST";
    else if (selectedText === "Air") key = "Air";
    else if (selectedText === "Bahria") key = "Bahria";


    if (key) {
        populateGradeTable(key);
        activeUni = key;
        gpa = gradeScales[activeUni].map(s => s.gpa);
        updateInfoBackground(key);
        resetCourses();
        calculateGPA();
    }
});

// Default load
populateGradeTable("COMSATS");
activeUni = "COMSATS";
function attachCourseListeners() {
    // Get all credits and grades dropdowns
    const creditSelects = document.querySelectorAll("#courses-container .credits");
    const gradeSelects = document.querySelectorAll("#courses-container .grades");

    // Attach change event listener
    creditSelects.forEach(select => {
        select.addEventListener("change", calculateGPA);
    });

    gradeSelects.forEach(select => {
        select.addEventListener("change", calculateGPA);
    });
}

// Call this once when the page loads
attachCourseListeners();

document.addEventListener("DOMContentLoaded", () => {
    
});
const coursesContainer = document.getElementById("courses-container");
const addRowBtn = coursesContainer.querySelector(".add-row");

function syncCourseLabels() {
    const rows = coursesContainer.querySelectorAll(".course-row");
    rows.forEach((row, i) => {
        const label = row.querySelector(".course-label");
        label.textContent = `Course ${i + 1}`;
    });
}

function createCourseRow() {
    const row = document.createElement("div");
    row.classList.add("course-row");
    let gradeOptions = "";
    if (gradeScales[activeUni]) {
        gradeOptions = gradeScales[activeUni]
            .map(g => `<option value="${g.grade}">${g.grade}</option>`)
            .join("");
    }
    row.innerHTML = `
        <span class="course-label"></span>
         <select class="credits">
            <option value="" disabled selected>Select Credits</option>
            <option value="1">1 Credit</option>
            <option value="2">2 Credits</option>
            <option value="3">3 Credits</option>
            <option value="4">4 Credits</option>
            <option value="5">5 Credits</option>
        </select>
        <select class="grades">
             <option value="" disabled selected>Select Grade</option>
            ${gradeOptions}
        </select>
        <button class="delete-row">🗑️</button>
    `;

    row.querySelector(".delete-row").addEventListener("click", () => {
        row.remove();
        syncCourseLabels();
        calculateGPA();
    });

    coursesContainer.insertBefore(row, addRowBtn);
    syncCourseLabels();
    row.querySelector(".credits").addEventListener("change", calculateGPA);
    row.querySelector(".grades").addEventListener("change", calculateGPA);

}

addRowBtn.addEventListener("click", () => {
    createCourseRow();
});

// Initialize delete events for existing rows
coursesContainer.querySelectorAll(".course-row .delete-row").forEach(btn => {
    btn.addEventListener("click", e => {
        e.target.closest(".course-row").remove();
        syncCourseLabels();
    });
});
document.addEventListener("DOMContentLoaded", function () {
    calculateGPA();
});// ---------------- GPA Calculator ----------------
function calculateGPA() {
    let totalCredits = 0;
    let totalPoints = 0;

    // Collect all rows
    const allRows = coursesContainer.querySelectorAll(".course-row");

    allRows.forEach(row => {
        const creditVal = Number(row.querySelector(".credits").value) || 0;
        const gradeVal = row.querySelector(".grades").value;

        // find GPA value for this grade
        const gradeObj = gradeScales[activeUni].find(g => g.grade === gradeVal);
        const gradePoint = gradeObj ? Number(gradeObj.gpa) : 0;

        if (creditVal > 0 && gradePoint >= 0) {
            totalCredits += creditVal;
            totalPoints += creditVal * gradePoint;
        }
    });

    if (totalCredits > 0) {
        const gpa = totalPoints / totalCredits;
        updateGpaWheel(gpa, totalCredits, totalPoints); // ✅ pass values here
    } else {
        updateGpaWheel(0, 0, 0); // ✅ reset wheel if no data
    }
}

// ---------------- GPA Wheel Update ----------------
function updateGpaWheel(gpa, totalCredits, totalPoints) {
    const circle = document.querySelector(".progress-ring-fill");
    const text = document.querySelector(".gpa-text");
    const creditsEl = document.getElementById("total-credits");
    const pointsEl = document.getElementById("total-points");

    if (!circle || !text || !creditsEl || !pointsEl) {
        console.error("SVG elements not found!");
        return;
    }

    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    // Clamp GPA between 0 and 4
    const normalizedGpa = Math.min(Math.max(gpa, 0), 4);

    // Convert GPA (0–4) to percentage of circle
    const percent = normalizedGpa / 4;
    const offset = circumference * (1 - percent);

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;

    // Update text and info
    text.textContent = normalizedGpa.toFixed(2);
    creditsEl.textContent = `Total Credits: ${totalCredits}`;
    pointsEl.textContent = `Total Grade Points: ${totalPoints.toFixed(2)}`;
}

// Initial sync
syncCourseLabels();

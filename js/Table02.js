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

    const items = Array.from(container.querySelectorAll(".nav-item")); // ✅ use div.nav-item
    let index = items.findIndex(div => div.classList.contains("active"));
    if (index === -1) index = 0;

    function updateMenu(triggerChange = true) {
        items.forEach((div, i) => {
            div.classList.remove("active");
            if (i === index) div.classList.add("active");
        });

        if (triggerChange && onChangeHandler) {
            onChangeHandler(items[index].querySelector("span").textContent);
        }
    }

    // ✅ CLICK ONLY
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


// ---------------- Reset Table ----------------
function resetTableForUni() {
    const table = document.getElementById("table01");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = ""; // clear only the body, keep headers

    // Reset trackers
    allRows = [];
    index = 1;

    // Add first course again
    add("Course 1");
    calculateGPA();
}


// ---------------- Initialize GPA Menu ----------------
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
        resetTableForUni();
    }
});

// Default load
populateGradeTable("COMSATS");
activeUni = "COMSATS";
gpa = gradeScales[activeUni].map(s => s.gpa);

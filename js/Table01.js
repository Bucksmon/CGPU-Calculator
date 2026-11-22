
let index = 1;
//DoM Load
document.addEventListener("DOMContentLoaded", function () {
  add("Course 1");
  calculateGPA();
});

//add Function call
const Add_Button = document.getElementById("add").addEventListener("click", function () {
  add();
});
let allRows = []; // store all rows’ data
function add(courseName) {
  let table = document.querySelector("#table01");
  let tbody = table.querySelector("tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
  }

  let add_Tr = document.createElement("tr");
  let rowData = { grade: 0, credit: 0 };
  allRows.push(rowData);

  for (let x = 1; x <= 4; x++) {
    let td = document.createElement("td");

    if (x === 1) {
      td.className = 'small';
      td.innerText = courseName || "Course " + index;
      index += 1;

    } else if (x === 2) {
      // GPA dropdown (default = 4.00 if first course)
      td.appendChild(createDropdown(
        gpa.map(String),   // ✅ use global GPA array
        gpa[0],
        function (gradeVal) {
          rowData.grade = gradeVal;
          calculateGPA();
        }
      ));
      rowData.grade = 4;

    } else if (x === 3) {
      // Credit Hours dropdown (default = 4 if first course)
      td.appendChild(createDropdown(
        ["4", "3", "2", "1"],
        "2",
        function (creditVal) {
          rowData.credit = creditVal;
          calculateGPA();
        }
      ));
      rowData.credit = 4;

    } else if (x === 4) {
      td.classList.add("small", "checkbox-td");
      td.addEventListener("click", function (e) {
        e.stopPropagation();
        let rowIndex = add_Tr.rowIndex;
        add_Tr.remove();
        allRows.splice(rowIndex - 1, 1);
        checkTableRows(rowIndex);
        calculateGPA();
      });
    }
    add_Tr.appendChild(td);
  }
  document.querySelector("#table01 tbody").appendChild(add_Tr);
  calculateGPA();
}
function createDropdown(options, selectedOption, onChangeHandler) {
  // Create container
  let container = document.createElement("div");
  container.className = "gpa-menu";

  // Create list
  let ul = document.createElement("ul");
  container.appendChild(ul);

  // Populate items
  options.forEach(opt => {
    let li = document.createElement("li");
    li.textContent = opt;
    ul.appendChild(li);
  });

  const items = Array.from(ul.querySelectorAll("li"));

  // Selected index (handle number/string safely)
  let index = options.findIndex(o => String(o) === String(selectedOption));
  if (index === -1) index = 0;

  function centerSelected() {
    const selected = items[index];
    const selectedCenter = selected.offsetTop + selected.offsetHeight / 2;
    const containerCenter = container.clientHeight / 2;
    const translateY = containerCenter - selectedCenter;
    ul.style.transform = `translateY(${translateY}px)`;
  }

  function updateMenu(triggerChange = true) {
    items.forEach((li, i) => {
      li.classList.remove("active", "neighbor");
      if (i === index) li.classList.add("active");
      else if (i === index - 1 || i === index + 1) li.classList.add("neighbor");
    });
    centerSelected();

    if (triggerChange && onChangeHandler) {
      onChangeHandler(parseFloat(items[index].textContent));
    }
  }

  function onWheel(e) {
    e.preventDefault();

    // Normalize scroll speed (so even big trackpad values = one step)
    const direction = Math.sign(e.deltaY);

    if (direction > 0 && index < items.length - 1) {
      index++;
      updateMenu();
    } else if (direction < 0 && index > 0) {
      index--;
      updateMenu();
    }
    // 🚫 If at top or bottom, ignore extra scrolls (no bounce)
  }

  container.addEventListener("wheel", onWheel, { passive: false });

  // Click to select
  items.forEach((li, i) =>
    li.addEventListener("click", () => {
      index = i;
      updateMenu();
    })
  );

  window.addEventListener("resize", centerSelected);

  // 🔑 Defer initial render until attached + sized
  (function kick() {
    if (!container.isConnected || container.clientHeight === 0) {
      requestAnimationFrame(kick);
    } else {
      updateMenu(false); // initialize without firing change
    }
  })();

  return container;
}



function calculateGPA() {
  let totalCredits = 0;
  let totalPoints = 0;

  allRows.forEach(r => {
    if (r.credit > 0 && r.grade >= 0) {
      totalCredits += r.credit;
      totalPoints += r.credit * r.grade;
    }
  });

  let resultDiv = document.getElementById("result");
  if (totalCredits > 0) {
    let gpa = totalPoints / totalCredits;

    updateGpaWheel(gpa);
  } else {
    resultDiv.textContent = "Current GPA: -";
  }
}

function checkTableRows(startRow) {
  let table = document.getElementById("table01");
  let rows = table.querySelectorAll("tr"); // all rows

  // Validate start row number
  if (startRow < 0 || startRow > rows.length) {
    console.warn(`Invalid start row: ${startRow}`);
    return;
  }

  for (let rowIndex = startRow; rowIndex < rows.length; rowIndex++) {
    let row = rows[rowIndex];
    console.log(`Row ${rowIndex}:`);

    if (row.cells.length > 0) {
      let firstCellValue = row.cells[0].textContent.trim();
      if (firstCellValue.length > 0) {
        let currentNumber = parseInt(firstCellValue.replace(/\D/g, ""), 10);
        row.cells[0].textContent = "Course " + (currentNumber - 1);
      }
    }
  }
  index = rows.length;
}


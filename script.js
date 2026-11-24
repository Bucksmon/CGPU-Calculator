"use strict";
const gradeScales = {
      CUST: [
        {grade:"A",marks:"90-100",gpa:4.00},{grade:"A-",marks:"86-89",gpa:3.67},{grade:"B+",marks:"81-85",gpa:3.33},{grade:"B",marks:"77-80",gpa:3.00},{grade:"B-",marks:"72-76",gpa:2.67},{grade:"C+",marks:"68-71",gpa:2.33},{grade:"C",marks:"63-67",gpa:2.00},{grade:"C-",marks:"58-62",gpa:1.67},{grade:"D+",marks:"54-57",gpa:1.33},{grade:"D",marks:"50-53",gpa:1.00},{grade:"F",marks:"Below 50",gpa:0.00}
      ],
      COMSATS: [
        {grade:"A",marks:"85 and above",gpa:4.00},{grade:"A-",marks:"80-84",gpa:3.66},{grade:"B+",marks:"75-79",gpa:3.33},{grade:"B",marks:"71-74",gpa:3.00},{grade:"B-",marks:"68-70",gpa:2.66},{grade:"C+",marks:"64-67",gpa:2.33},{grade:"C",marks:"61-63",gpa:2.00},{grade:"C-",marks:"58-60",gpa:1.66},{grade:"D+",marks:"54-57",gpa:1.30},{grade:"D",marks:"50-53",gpa:1.00},{grade:"F",marks:"Below 50",gpa:0.00}
      ],
      Air: [
        {grade:"A",marks:"80-100",gpa:4.00},{grade:"A-",marks:"75-79.99",gpa:3.67},{grade:"B+",marks:"70-74.99",gpa:3.33},{grade:"B",marks:"65-69.99",gpa:3.00},{grade:"B-",marks:"60-64.99",gpa:2.67},{grade:"C+",marks:"55-59.99",gpa:2.33},{grade:"C",marks:"50-54.99",gpa:2.00},{grade:"F",marks:"Below 50",gpa:0.00}
      ],
      Bahria: [
        {grade:"A",marks:"87-100",gpa:4.00},{grade:"B+",marks:"80-86",gpa:3.50},{grade:"B",marks:"72-79",gpa:3.00},{grade:"C+",marks:"66-71",gpa:2.50},{grade:"C",marks:"60-65",gpa:2.00},{grade:"D",marks:"50-59",gpa:1.50},{grade:"F",marks:"Below 50",gpa:0.00}
      ]
    };

    const universityAssets = {
      CUST: {name:"CUST",logo:"images/cust.png",background:"images/cust.png"},
      COMSATS: {name:"COMSATS",logo:"images/Comsats.svg",background:"images/Comsats.svg"},
      Air: {name:"Air University",logo:"images/Air.svg",background:"images/Air.svg"},
      Bahria: {name:"Bahria University",logo:"images/Bahria.svg",background:"images/Bahria.svg"}
    };

    const rowsContainer = document.getElementById("course-rows");
    const gpaValue = document.getElementById("gpa-value");
    const progressRing = document.getElementById("progress-ring-fill");
    const totalCreditsLabel = document.getElementById("total-credits");
    const totalPointsLabel = document.getElementById("total-points");
    const resultHint = document.getElementById("result-hint");
    const circumference = 2 * Math.PI * 60;

    let activeUniversity = "COMSATS";
    let courseNumber = 0;

    function createSelect(className, label, options) {
      const select = document.createElement("select");
      select.className = className;
      select.setAttribute("aria-label", label);

      options.forEach(({value, text, disabled = false, selected = false}) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        option.disabled = disabled;
        option.selected = selected;
        select.appendChild(option);
      });

      select.addEventListener("change", calculateGpa);
      return select;
    }

    function addCourse() {
      courseNumber += 1;

      const row = document.createElement("div");
      row.className = "course-row";

      const label = document.createElement("span");
      label.className = "course-label";
      label.textContent = "Course " + courseNumber;

      const credits = createSelect("credits", "Credits for course " + courseNumber, [
        {value:"",text:"Select Credits",disabled:true,selected:true},
        ...[1,2,3,4,5].map(value => ({value:String(value),text:value + (value === 1 ? " Credit" : " Credits")}))
      ]);

      const gradeOptions = gradeScales[activeUniversity].map(item => ({
        value:item.grade,
        text:item.grade + " · " + item.gpa.toFixed(2)
      }));
      const grade = createSelect("grades", "Grade for course " + courseNumber, gradeOptions);

      const remove = document.createElement("button");
      remove.className = "delete-row";
      remove.type = "button";
      remove.textContent = "×";
      remove.title = "Remove course";
      remove.setAttribute("aria-label", "Remove course " + courseNumber);
      remove.addEventListener("click", () => {
        row.remove();
        renumberCourses();
        calculateGpa();
      });

      row.append(label, credits, grade, remove);
      rowsContainer.appendChild(row);
      calculateGpa();
    }

    function renumberCourses() {
      [...rowsContainer.children].forEach((row, index) => {
        const number = index + 1;
        row.querySelector(".course-label").textContent = "Course " + number;
        row.querySelector(".credits").setAttribute("aria-label", "Credits for course " + number);
        row.querySelector(".grades").setAttribute("aria-label", "Grade for course " + number);
        row.querySelector(".delete-row").setAttribute("aria-label", "Remove course " + number);
      });
      courseNumber = rowsContainer.children.length;
    }

    function calculateGpa() {
      let totalCredits = 0;
      let totalPoints = 0;
      let completedCourses = 0;

      [...rowsContainer.children].forEach(row => {
        const credits = Number(row.querySelector(".credits").value);
        const grade = row.querySelector(".grades").value;
        if (!credits || !grade) return;

        const gradePoint = gradeScales[activeUniversity].find(item => item.grade === grade)?.gpa ?? 0;
        totalCredits += credits;
        totalPoints += credits * gradePoint;
        completedCourses += 1;
      });

      const gpa = totalCredits ? totalPoints / totalCredits : 0;
      gpaValue.textContent = gpa.toFixed(2);
      progressRing.style.strokeDasharray = String(circumference);
      progressRing.style.strokeDashoffset = String(circumference - (gpa / 4) * circumference);
      totalCreditsLabel.textContent = "Total Credits: " + totalCredits;
      totalPointsLabel.textContent = "Total Grade Points: " + totalPoints.toFixed(2);
      resultHint.textContent = completedCourses
        ? completedCourses + (completedCourses === 1 ? " course included in this calculation." : " courses included in this calculation.")
        : "Choose credits and grades to calculate your GPA.";
    }

    function populateGradeTable(university) {
      const tbody = document.querySelector("#grade-scale-table tbody");
      tbody.replaceChildren();

      gradeScales[university].forEach(item => {
        const row = document.createElement("tr");
        [item.grade, item.marks, item.gpa.toFixed(2)].forEach(value => {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.appendChild(cell);
        });
        tbody.appendChild(row);
      });
    }

    function selectUniversity(university) {
      if (university === activeUniversity) return;
      activeUniversity = university;

      document.querySelectorAll(".nav-item").forEach(button => {
        const active = button.dataset.uni === university;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      const asset = universityAssets[university];
      document.getElementById("university-logo").src = asset.logo;
      document.getElementById("university-logo").alt = asset.name + " logo";
      document.querySelector(".info").style.backgroundImage =
        "linear-gradient(rgba(0, 47, 122, .87), rgba(0, 47, 122, .87)), url('" + asset.background + "')";

      populateGradeTable(university);
      rowsContainer.replaceChildren();
      courseNumber = 0;
      addCourse();
    }

    document.querySelectorAll(".nav-item").forEach(button => {
      button.addEventListener("click", () => selectUniversity(button.dataset.uni));
    });

    document.getElementById("add-course").addEventListener("click", addCourse);

    populateGradeTable(activeUniversity);
    addCourse();
    progressRing.style.strokeDasharray = String(circumference);
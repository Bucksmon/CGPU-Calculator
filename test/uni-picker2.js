function animateList(container, linkedContainer = null) {
  const ul = container.querySelector("ul");
  const items = Array.from(ul.querySelectorAll("li"));
  let index = 0;

  const linkedItems = linkedContainer
    ? Array.from(linkedContainer.querySelectorAll("li"))
    : [];

  function centerSelected() {
    const selected = items[index];
    const selectedCenter = selected.offsetTop + selected.offsetHeight / 2;
    const containerCenter = container.clientHeight / 2;
    const translateY = containerCenter - selectedCenter;
    ul.style.transform = `translateY(${translateY}px)`;
  }

  function updateMenu() {
    items.forEach((li, i) => {
      li.classList.remove("active", "neighbor");
      if (i === index) li.classList.add("active");
      else if (i === index - 1 || i === index + 1) li.classList.add("neighbor");
    });

    // Sync with logos in column2
    if (linkedItems.length) {
      linkedItems.forEach((li, i) => {
        li.classList.remove("active", "neighbor");
        if (i === index) li.classList.add("active");
        else if (i === index - 1 || i === index + 1) li.classList.add("neighbor");
      });
    }

    centerSelected();
  }

  function onWheel(e) {
    e.preventDefault();
    const direction = Math.sign(e.deltaY);

    let prevIndex = index;
    if (direction > 0 && index < items.length - 1) index++;
    else if (direction < 0 && index > 0) index--;

    if (prevIndex !== index) updateMenu();
  }

  container.addEventListener("wheel", onWheel, { passive: false });

  items.forEach((li, i) =>
    li.addEventListener("click", () => {
      index = i;
      updateMenu();
    })
  );

  window.addEventListener("resize", centerSelected);

  // Initial render
  (function kick() {
    if (!container.isConnected || container.clientHeight === 0) {
      requestAnimationFrame(kick);
    } else {
      updateMenu();
    }
  })();
}

// Init with sync between column1 & column2
const col1 = document.querySelector("#column1 .uni-picker");
const col2 = document.querySelector("#column2 .uni-picker");
animateList(col1, col2);

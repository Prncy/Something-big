document.addEventListener("DOMContentLoaded", () => {
  // Target Time: 2nd September 2026 at 12:30 PM
  const targetDate = new Date("2026-09-02T12:30:00").getTime();

  const units = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]')
  };

  let currentValues = { days: '-1', hours: '-1', minutes: '-1', seconds: '-1' };

  function updateClock() {
    const now = new Date().getTime();
    const timeRemaining = targetDate - now;

    if (timeRemaining <= 0) {
      clearInterval(clockInterval);
      Object.keys(units).forEach(key => {
        units[key].querySelector('.current-val').textContent = "00";
      });
      return;
    }

    const d = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const h = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    const timeStrings = {
      days: String(d).padStart(2, '0'),
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0')
    };

    Object.keys(timeStrings).forEach(unitKey => {
      if (timeStrings[unitKey] !== currentValues[unitKey]) {
        if (currentValues[unitKey] !== '-1') {
          tumbleCard(units[unitKey], timeStrings[unitKey]);
        } else {
          // Initialize startup numbers statically without spinning
          units[unitKey].querySelector('.current-val').textContent = timeStrings[unitKey];
          units[unitKey].querySelector('.next-val').textContent = timeStrings[unitKey];
        }
        currentValues[unitKey] = timeStrings[unitKey];
      }
    });
  }

  function tumbleCard(cardElement, newValue) {
    const currentFace = cardElement.querySelector('.current-val');
    const nextFace = cardElement.querySelector('.next-val');

    // Stage incoming future number behind the card out of view
    nextFace.textContent = newValue;
    cardElement.classList.add('animate');

    // Clean up classes and swap elements once the 3D transition finishes
    setTimeout(() => {
      currentFace.textContent = newValue;
      cardElement.classList.remove('animate');
    }, 500); // Matches the 0.5s CSS transition speed exactly
  }

  updateClock();
  const clockInterval = setInterval(updateClock, 1000);
});

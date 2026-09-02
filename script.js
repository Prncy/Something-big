const targetTimestamp = 1788345000000;

const elements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

let previous = {};

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateUnit(name, value) {
  const formatted = pad(value);

  if (previous[name] !== formatted) {
    elements[name].textContent = formatted;

    elements[name].classList.remove("flip");
    void elements[name].offsetWidth;
    elements[name].classList.add("flip");

    previous[name] = formatted;
  }
}

function updateCountdown() {
  const remaining = Math.max(0, targetTimestamp - Date.now());

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  updateUnit("days", days);
  updateUnit("hours", hours);
  updateUnit("minutes", minutes);
  updateUnit("seconds", seconds);

  if (remaining <= 0) {
    document.getElementById("message").textContent =
      "The countdown has reached 00:25 HRS.";
    clearInterval(timer);
  }
}

updateCountdown();
const timer = setInterval(updateCountdown, 1000);
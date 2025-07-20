// Get elements
const addWaterBtn = document.getElementById('add-water');
const goalElem = document.getElementById('goal');
const currentElem = document.getElementById('current');
const remainingElem = document.getElementById('remaining');
const progressText = document.getElementById('progress-text');
const waterFill = document.getElementById('water-fill');
const reminderText = document.getElementById('reminder-text');
const streakElem = document.getElementById('streak');

const goalLiters = 3;
let currentLiters = 0;
let streak = 0;
let lastGoalMetDate = null;
let quoteShown = false;

const TEST_MINUTES = 60; 
const positiveQuotes = [
  "Hey buddy, you saved your body from dehydration! 💧",
  "Awesome! Keep up the great hydration streak!",
  "Great job! Your body thanks you for the water!",
  "Nice! Every sip counts towards a healthier you!",
  "Sip by sip, you’re fueling greatness. Keep it flowing!",
  "Your cells are doing a happy dance with every drop—cheers to you!"];

const quotes = [
   "Hey! You haven't had water for a while! 💧",
  "Your body is craving water right now!",
  "Don’t let dehydration win — take a sip!",
  "Water break! Your brain and body will thank you.",
  "Stay sharp — hydrate before it’s too late!",
  "Feeling sluggish? Water might be the fix!",
  "Sip some water to boost your energy!",
  "Your skin and body are begging for water!",
  "A little water now saves headaches later!",
  "Hydration alert: It’s been a while!",
  "Water is your best friend right now!",
  "Refresh yourself — drink some water!",
  "Keep your focus sharp — drink water!",
  "Dehydration slows you down. Sip now!",
  "Your muscles and mind need water ASAP!",
  "Thirsty? Maybe just a little behind on water!",
  "Water up! Your body will thank you soon!",
  "Don’t wait till you’re thirsty — sip now!",
  "Drink up! Keep your body running smooth!",
  "H2O check! Time to drink some water."
];

goalElem.textContent = `${goalLiters} liters`;
currentElem.textContent = `${currentLiters} liters`;
remainingElem.textContent = `${goalLiters} liters`;
streakElem.textContent = `${streak} days🔥`;
reminderText.textContent = "Stay hydrated!";

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return d1.toDateString() === d2.toDateString();
}

function getLastDrinkTime() {
  const time = localStorage.getItem("lastDrinkTime");
  if (!time) {
    const now = new Date().getTime();
    localStorage.setItem("lastDrinkTime", now);
    return now;
  }
  return parseInt(time);
}
function updateStats() {
  currentElem.textContent = `${currentLiters.toFixed(1)} liters`;
  remainingElem.textContent = `${Math.max(0, (goalLiters - currentLiters)).toFixed(1)} liters`;

  const percentage = Math.min((currentLiters / goalLiters) * 100, 100);
  progressText.textContent = `${Math.floor(percentage)}%`;
  waterFill.style.height = `${percentage}%`;

  if (percentage === 100 && !isSameDay(new Date(), lastGoalMetDate)) {
    streak++;
    lastGoalMetDate = new Date();
    streakElem.textContent = `${streak} days🔥`;
  }
}
addWaterBtn.addEventListener('click', () => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  if (currentLiters < goalLiters) {
    currentLiters += 0.25;
    localStorage.setItem("lastDrinkTime", new Date().getTime());
    updateStats();
    const positiveQuote = positiveQuotes[Math.floor(Math.random() * positiveQuotes.length)];
    reminderText.textContent = positiveQuote;
    quoteShown = false;
  }
});
function checkMidnightReset() {
  const now = new Date();
  const lastSavedDay = localStorage.getItem("lastResetDay");

  if (!lastSavedDay || lastSavedDay !== now.toDateString()) {
    localStorage.setItem("lastResetDay", now.toDateString());

    if (currentLiters < goalLiters && !isSameDay(new Date(), lastGoalMetDate)) {
      streak = 0; 
    }

    currentLiters = 0;
    lastGoalMetDate = null;
    updateStats();
    reminderText.textContent = "Stay hydrated!";
    quoteShown = false;
  }
}

function startReminder() {
  setInterval(() => {
    const now = new Date().getTime();
    const lastTime = getLastDrinkTime();
    const diffMin = (now - lastTime) / (1000 * 60);
    if (currentLiters >= goalLiters) {
      reminderText.textContent = "Goal reached! Great job staying hydrated! 💧";
      quoteShown = true;  
      return; 
    }

    if (diffMin >= TEST_MINUTES && !quoteShown) {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      reminderText.textContent = quote;
      quoteShown = true;

      if (Notification.permission === "granted") {
        new Notification(quote);
      }
    }

    if (diffMin < TEST_MINUTES && quoteShown) {
      quoteShown = false;
      reminderText.textContent = "Stay hydrated!";
    }
  }, 60000);
}

// === Init App ===
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

checkMidnightReset();
updateStats();
startReminder();

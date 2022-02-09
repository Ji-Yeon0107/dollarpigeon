const section = document.querySelector(".game");
const startButton = document.querySelector(".game__start-button");
const pauseButton = document.querySelector(".game__pause");
const restartButton = document.querySelector(".game__restart-button");
const resumeButton = document.querySelector(".game__resume-button");
const time = document.querySelector(".game__timer");
const count = document.querySelector(".game__count");
const sound = document.querySelector(".game__sound");
const muted = document.querySelector(".game__muted");
const targetContainer = document.querySelector(".game__target-container");
const clearMessage = document.querySelector(".game__message");
const tutorial = document.querySelector(".game__tutorial");

let TARGET_COUNT = 8;
let LEFTTIME = 7;
let TIMER;
let RESULT;
const initialTargetCount = TARGET_COUNT;
const initialLeftTime = LEFTTIME;

onLoad();

function onLoad() {
  count.innerText = TARGET_COUNT;
  time.innerText = `00:0${LEFTTIME}`;

  initGame(startButton);
  initGame(restartButton, LEFTTIME);
  onClickTarget(targetContainer);
  pauseGame();
  resumeGame();
}
function initGame(button, leftTime) {
  button.addEventListener("click", (event) => {
    if (button === startButton) {
      tutorial.innerText = "Hit mosquitoes!";
      tutorial.className = "game__tutorial move";
    }
    if (button === restartButton) {
      targetContainer.style.pointerEvents = "auto";
      time.style.color = "inherit";
      time.innerText = `00:0${leftTime}`;
      clearMessage.innerHTML = "";
    }
    button.style.display = "none";
    pauseButton.style.display = "block";
    count.innerText = TARGET_COUNT;
    addTargets();
    handleTimer(initialLeftTime, initialTargetCount);
  });
}
function resetGame(result, targetQuan) {
  clearInterval(TIMER);
  targetContainer.style.pointerEvents = "none";
  pauseButton.style.display = "none";

  const resetTerm = setTimeout(() => {
    const target = document.querySelectorAll(".target");
    restartButton.style.display = "block";

    for (let i = 0; i < target.length; i++) {
      targetContainer.removeChild(target[i]);
    }

    if (result === "win") {
      clearMessage.innerHTML = "Clear!";
      TARGET_COUNT = targetQuan + 2;
    }
    if (result === "lose") {
      clearMessage.innerHTML = "Try again";
      TARGET_COUNT = targetQuan;
    }
  }, 400);

  LEFTTIME = initialLeftTime;
}
function addTargets() {
  for (let i = 0; i < TARGET_COUNT; i++) {
    const newWatermelon = document.createElement("img");
    newWatermelon.setAttribute("class", "watermelon target");
    newWatermelon.setAttribute("data-name", "watermelon");
    newWatermelon.setAttribute("src", "./img/watermelon.png");
    newWatermelon.setAttribute("alt", "watermelon");
    targetContainer.appendChild(newWatermelon);

    const newMosquito = document.createElement("img");
    newMosquito.setAttribute("class", "mosquito target");
    newMosquito.setAttribute("data-name", "mosquito");
    newMosquito.setAttribute("src", "./img/mosquito.png");
    newMosquito.setAttribute("alt", "mosquito");
    targetContainer.appendChild(newMosquito);

    putTargets(newWatermelon, newMosquito);
  }
}
function putTargets(targetA, targetB) {
  for (let i = 0; i < TARGET_COUNT; i++) {
    const randomYa = getRandomNumber(257, 400);
    const randomXa = getRandomNumber(90, 713);
    const randomYb = getRandomNumber(257, 400);
    const randomXb = getRandomNumber(90, 713);
    targetA.style.top = `${randomYa}px`;
    targetA.style.left = `${randomXa}px`;
    targetB.style.top = `${randomYb}px`;
    targetB.style.left = `${randomXb}px`;
  }
}
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function handleTimer(initialLeftTime, targetQuan) {
  // const targetQuan = TARGET_COUNT;
  TIMER = setInterval(() => {
    LEFTTIME--;
    time.innerText = `00:0${LEFTTIME}`;
    if (LEFTTIME <= 3) {
      time.style.color = "red";
    }
    if (LEFTTIME === 0) {
      RESULT = "lose";
      resetGame(RESULT, targetQuan);
      LEFTTIME = initialLeftTime;
    }
  }, 1000);
}
function pauseGame() {
  pauseButton.addEventListener("click", () => {
    clearInterval(TIMER);
    resumeButton.style.display = "block";
    targetContainer.style.pointerEvents = "none";
  });
}
function resumeGame() {
  resumeButton.addEventListener("click", () => {
    targetContainer.style.pointerEvents = "auto";
    // handleTimerAfterResume();
    handleTimer(initialLeftTime, initialTargetCount);
    resumeButton.style.display = "none";
  });
}
function addClickEffect(target) {
  target.addEventListener("click", (event) => {
    const hitEffectContainer = document.createElement("div");
    const hitEffect = document.createElement("img");
    hitEffect.setAttribute("src", "./img/effect.png");
    hitEffect.setAttribute("alt", "effect");
    hitEffect.className = "effect";
    hitEffect.style.top = `${event.pageY - 40}px`;
    hitEffect.style.left = `${
      event.pageX - section.getBoundingClientRect().left - 40
    }px`;
    targetContainer.appendChild(hitEffectContainer);
    hitEffectContainer.appendChild(hitEffect);

    const removeEffect = setTimeout(() => {
      hitEffectContainer.remove();
    }, 100);
  });
}
function onClickTarget(target) {
  target.addEventListener("click", (event) => {
    const orignialTarget = document.querySelectorAll(".target");
    const targetQuan = orignialTarget.length / 2;

    addClickEffect(target);

    if (event.target.dataset.name === "mosquito") {
      event.target.style.display = "none";
      TARGET_COUNT--;
      if (TARGET_COUNT === 0) {
        RESULT = "win";
        resetGame(RESULT, targetQuan);
      }
    }
    if (event.target.dataset.name === "watermelon") {
      event.target.setAttribute("src", "./img/cracked.png");
      RESULT = "lose";
      resetGame(RESULT, targetQuan);
    }
    count.innerText = TARGET_COUNT;
  });
}

// function handleBgSound() {
//   sound.addEventListener("click", () => {
//     sound.style.display = "none";
//     muted.style.display = "block";
//   });
//   muted.addEventListener("click", () => {
//     muted.style.display = "none";
//     sound.style.display = "block";
//   });
// }

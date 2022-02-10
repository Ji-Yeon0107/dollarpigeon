"use strict";
const section = document.querySelector(".game");
const startButton = document.querySelector(".popup__start-button");
const restartButton = document.querySelector(".popup__restart-button");
const resumeButton = document.querySelector(".popup__resume-button");
const time = document.querySelector(".game__timer");
const count = document.querySelector(".game__count");
const pauseButton = document.querySelector(".game__pause");
const targetContainer = document.querySelector(".game__target-container");
const clearMessage = document.querySelector(".popup__message");
const tutorial = document.querySelector(".popup__tutorial");
const mosquitoSound = new Audio("./sound/carrot_pull.mp3");
const waterMelonSound = new Audio("./sound/bug_pull.mp3");
const alertSound = new Audio("./sound/alert.wav");
const winSound = new Audio("./sound/game_win.mp3");
const bgSound = new Audio("./sound/bg.mp3");

let TARGET_COUNT = 8;
let LEFTTIME = 7;
let TIMER;
let RESULT;
let SOUND = true;
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
  // resumeGame();
  handleBgSound();
}
function playSound(sound) {
  if (SOUND) {
    sound.currentTime = 0;
    sound.play();
  }
}
function stopSound(sound) {
  sound.pause();
}
function initGame(button, leftTime) {
  button.addEventListener("click", (event) => {
    playSound(bgSound);

    if (button === startButton) {
      tutorial.innerText = "Hit mosquitoes!";
      tutorial.className = "popup__tutorial move";
      handleTimer(initialLeftTime, initialTargetCount);
      resumeGame(initialTargetCount);
    }
    if (button === restartButton) {
      targetContainer.style.pointerEvents = "auto";
      time.style.color = "inherit";
      time.innerText = `00:0${leftTime}`;
      clearMessage.innerHTML = "";
      handleTimer(initialLeftTime, TARGET_COUNT);
      resumeGame(TARGET_COUNT);
    }
    button.style.display = "none";
    pauseButton.style.display = "block";
    count.innerText = TARGET_COUNT;
    addTargets();
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
  TIMER = setInterval(() => {
    LEFTTIME--;
    time.innerText = `00:0${LEFTTIME}`;
    if (LEFTTIME <= 3) {
      time.style.color = "red";
      playSound(alertSound);
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
    stopSound(bgSound);
    resumeButton.style.display = "block";
    targetContainer.style.pointerEvents = "none";
  });
}
function resumeGame(targetQuan) {
  resumeButton.addEventListener("click", () => {
    playSound(bgSound);
    clearInterval(TIMER);
    targetContainer.style.pointerEvents = "auto";
    handleTimer(initialLeftTime, targetQuan);
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
    addClickEffect(target);
    finishGame(targetContainer);

    if (event.target.dataset.name === "mosquito") {
      playSound(mosquitoSound);
      event.target.style.display = "none";
      TARGET_COUNT--;
    }
    count.innerText = TARGET_COUNT;
  });
}
function finishGame(target) {
  const targetQuan = document.querySelectorAll(".target").length / 2;

  target.addEventListener("click", (event) => {
    if (TARGET_COUNT === 0) {
      RESULT = "win";
      playSound(winSound);
      resetGame(RESULT, targetQuan);
    }
    if (event.target.dataset.name === "watermelon") {
      playSound(waterMelonSound);
      event.target.setAttribute("src", "./img/cracked.png");
      RESULT = "lose";
      resetGame(RESULT, targetQuan);
    }
  });
}
function handleBgSound() {
  const gameBtnBox = document.querySelector(".game__button-box");
  const gameBtns = document.querySelectorAll(".game__sound");
  gameBtnBox.addEventListener("click", () => {
    if (SOUND) {
      SOUND = false;
      stopSound(bgSound);
    } else {
      SOUND = true;
      playSound(bgSound);
    }
    for (let i = 0; i < gameBtns.length; i++) {
      gameBtns[i].classList.toggle("clear");
    }
  });
}

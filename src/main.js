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
const bgSound = new Audio("../sound/bg.mp3");
const clearSound = new Audio("../sound/game_win.mp3");
const mosquitoSound = new Audio("../sound/carrot_pull.mp3");
const watermelonSound = new Audio("../sound/bug_pull.mp3");
const alertSound = new Audio("../sound/alert.wav");
let TARGET_COUNT = 0;
let LEFTTIME;
let TIMER;

count.innerText = TARGET_COUNT;

sound.addEventListener("click", () => {
  bgSound.pause();
  sound.style.display = "none";
  muted.style.display = "block";
});
muted.addEventListener("click", () => {
  bgSound.play();
  muted.style.display = "none";
  sound.style.display = "block";
});

function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function putTargets() {
  for (let i = 0; i < TARGET_COUNT; i++) {
    // 랜덤좌표에 들어갈 랜덤숫자 O
    const randomY = getRandomNumber(257, 400);
    const randomX = getRandomNumber(90, 713);

    const mosRandomY = getRandomNumber(257, 400);
    const mosRandomX = getRandomNumber(90, 713);

    const newMosquito = document.createElement("img");
    newMosquito.setAttribute("class", "mosquito target");
    newMosquito.setAttribute("data-name", "mosquito");
    newMosquito.setAttribute("src", "./img/mosquito.png");
    newMosquito.setAttribute("alt", "mosquito");
    targetContainer.appendChild(newMosquito);
    newMosquito.style.top = `${mosRandomY}px`;
    newMosquito.style.left = `${mosRandomX}px`;

    const newWatermelon = document.createElement("img");
    newWatermelon.setAttribute("class", "watermelon target");
    newWatermelon.setAttribute("data-name", "watermelon");
    newWatermelon.setAttribute("src", "./img/watermelon.png");
    newWatermelon.setAttribute("alt", "watermelon");
    targetContainer.appendChild(newWatermelon);
    newWatermelon.style.top = `${randomY}px`;
    newWatermelon.style.left = `${randomX}px`;
  }
}
startButton.addEventListener("click", (event) => {
  bgSound.play();
  tutorial.innerText = "Hit mosquitoes!";
  tutorial.className = "game__tutorial move";
  startButton.style.display = "none";
  pauseButton.style.display = "block";
  TARGET_COUNT = 8;
  count.innerText = TARGET_COUNT;
  targetContainer.style.opacity = "100%";
  putTargets();
  // 1초마다 1씩 줄어들게
  LEFTTIME = "7";
  handleTimer();
});

function handleTimer() {
  const originalTargetNumber = TARGET_COUNT;
  TIMER = setInterval(() => {
    LEFTTIME--;
    time.innerText = `00:0${LEFTTIME}`;
    if (LEFTTIME === 3) {
      alertSound.play();
      time.style.color = "red";
    }
    if (LEFTTIME === 0) {
      clearInterval(TIMER);
      restartButton.style.display = "block";
      targetContainer.style.opacity = "0";
      clearMessage.innerHTML = "Try again";

      const target = document.querySelectorAll(".target");

      for (let i = 0; i < target.length; i++) {
        targetContainer.removeChild(target[i]);
      }
      TARGET_COUNT = originalTargetNumber;
      pauseButton.style.display = "none";
    }
  }, 1000);
}

restartButton.addEventListener("click", (event) => {
  targetContainer.style.pointerEvents = "auto";
  pauseButton.style.display = "block";
  time.style.color = "inherit";
  restartButton.style.display = "none";
  count.innerText = TARGET_COUNT;
  LEFTTIME = "7";
  time.innerText = `00:0${LEFTTIME}`;
  targetContainer.style.opacity = "100%";
  clearMessage.innerHTML = "";

  //그림재배치
  putTargets();
  handleTimer();
});

onClickTarget(targetContainer);

function onClickTarget(targetEle) {
  targetEle.addEventListener("click", (event) => {
    const orignialTarget = document.querySelectorAll(".target");
    const refreshedTargetNumber = orignialTarget.length / 2;

    //때리면 그 위치에 그림 나타났다 사라지기
    const hitEffectContainer = document.createElement("div");
    const hitEffect = document.createElement("img");
    hitEffect.setAttribute("src", "./img/effect.png");
    hitEffect.setAttribute("alt", "effect");
    hitEffect.className = "effect";
    hitEffect.style.top = `${event.clientY - 40}px`;
    hitEffect.style.left = `${
      event.clientX - section.getBoundingClientRect().left - 40
    }px`;
    targetContainer.appendChild(hitEffectContainer);
    hitEffectContainer.appendChild(hitEffect);
    //애니메이션으로 사라지기
    const removeEffect = setTimeout(() => {
      hitEffectContainer.remove();
    }, 200);

    if (event.target.dataset.name === "mosquito") {
      mosquitoSound.play();
      event.target.style.display = "none";
      TARGET_COUNT--;
      if (TARGET_COUNT === 0) {
        //시간카운트 멈추기
        clearInterval(TIMER);
        clearSound.play();

        const restartTerm = setTimeout(() => {
          targetContainer.style.opacity = "0";
          clearMessage.innerHTML = "Clear!";
          restartButton.style.display = "block";

          const target = document.querySelectorAll(".target");
          //재시작하면 갯수를 점차 늘리기
          TARGET_COUNT = refreshedTargetNumber + 2;

          for (let i = 0; i < target.length; i++) {
            targetContainer.removeChild(target[i]);
          }
        }, 400);
      }
    }
    if (event.target.dataset.name === "watermelon") {
      watermelonSound.play();
      event.target.setAttribute("src", "./img/cracked.png");
      //시간카운트 멈추기
      clearInterval(TIMER);
      //클릭 막기
      targetContainer.style.pointerEvents = "none";

      const restartTerm = setTimeout(() => {
        restartButton.style.display = "block";
        clearMessage.innerHTML = "Try again";

        const target = document.querySelectorAll(".target");

        TARGET_COUNT = refreshedTargetNumber;

        for (let i = 0; i < target.length; i++) {
          targetContainer.removeChild(target[i]);
        }
      }, 400);

      pauseButton.style.display = "none";
    }
    count.innerText = TARGET_COUNT;
  });
}

pauseButton.addEventListener("click", () => {
  clearInterval(TIMER);
  resumeButton.style.display = "block";
  targetContainer.style.pointerEvents = "none";
});
resumeButton.addEventListener("click", () => {
  targetContainer.style.pointerEvents = "auto";
  handleTimer();
  resumeButton.style.display = "none";
});

const section = document.querySelector("section");
const startButton = document.querySelector(".start__button");
const restartButton = document.querySelector(".restart__button");
const time = document.querySelector(".time");
const count = document.querySelector(".count");
const sound = document.querySelector(".sound");
const muted = document.querySelector(".muted");
const targetContainer = document.querySelector(".target__container");
const clearMessage = document.querySelector(".clear__message");
const tutorial = document.querySelector(".tutorial");
const bgSound = new Audio("../sound/bg.mp3");
const clearSound = new Audio("../sound/game_win.mp3");
const mosquitoSound = new Audio("../sound/carrot_pull.mp3");
const watermelonSound = new Audio("../sound/bug_pull.mp3");
const alertSound = new Audio("../sound/alert.wav");

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

let countNumber = 0;
count.innerText = countNumber;
let countTime = 0;
time.innerText = `00:0${countTime}`;

// 랜덤좌표에 들어갈 랜덤숫자 O
const randomY = getRandomInt(45, 80);
const randomX = getRandomInt(10, 80);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//랜덤하게 그림생성
function putTargets() {
  for (let i = 0; i < countNumber; i++) {
    const randomY = getRandomInt(45, 80);
    const randomX = getRandomInt(10, 80);

    const mosRandomY = getRandomInt(45, 80);
    const mosRandomX = getRandomInt(10, 80);

    const newMosquito = document.createElement("img");
    newMosquito.setAttribute("class", "mosquito target");
    newMosquito.setAttribute("data-name", "mosquito");
    newMosquito.setAttribute("src", "./img/mosquito.png");
    newMosquito.setAttribute("alt", "mosquito");
    targetContainer.appendChild(newMosquito);
    newMosquito.style.top = `${mosRandomY}%`;
    newMosquito.style.left = `${mosRandomX}%`;

    const newWatermelon = document.createElement("img");
    newWatermelon.setAttribute("class", "watermelon target");
    newWatermelon.setAttribute("data-name", "watermelon");
    newWatermelon.setAttribute("src", "./img/watermelon.png");
    newWatermelon.setAttribute("alt", "watermelon");
    targetContainer.appendChild(newWatermelon);
    newWatermelon.style.top = `${randomY}%`;
    newWatermelon.style.left = `${randomX}%`;
  }
}

startButton.addEventListener("click", (event) => {
  bgSound.play();
  tutorial.innerText = "Hit mosquitoes!";
  tutorial.className = "tutorial move";
  startButton.style.display = "none";
  countNumber = 8;
  count.innerText = countNumber;
  targetContainer.style.opacity = "100%";
  putTargets();
  // 1초마다 1씩 줄어들게
  countTime = "7";
  handleCountTimeout();
});

let countTimeout;

function handleCountTimeout() {
  const originalTargetNumber = countNumber;
  countTimeout = setInterval(() => {
    countTime--;
    time.innerText = `00:0${countTime}`;
    if (countTime === 3) {
      alertSound.play();
      time.style.color = "red";
    }
    if (countTime === 0) {
      clearInterval(countTimeout);
      restartButton.style.display = "block";
      targetContainer.style.opacity = "0";
      clearMessage.innerHTML = "Try again";

      const target = document.querySelectorAll(".target");

      for (let i = 0; i < target.length; i++) {
        targetContainer.removeChild(target[i]);
      }
      countNumber = originalTargetNumber;
    }
  }, 1000);
}

restartButton.addEventListener("click", (event) => {
  targetContainer.style.pointerEvents = "auto";
  time.style.color = "inherit";
  restartButton.style.display = "none";
  count.innerText = countNumber;
  countTime = "7";
  time.innerText = `00:0${countTime}`;
  targetContainer.style.opacity = "100%";
  clearMessage.innerHTML = "";

  //그림재배치
  putTargets();
  handleCountTimeout();
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
      countNumber--;
      if (countNumber === 0) {
        //시간카운트 멈추기
        clearInterval(countTimeout);
        clearSound.play();

        const restartTerm = setTimeout(() => {
          targetContainer.style.opacity = "0";
          clearMessage.innerHTML = "Clear!";
          restartButton.style.display = "block";

          const target = document.querySelectorAll(".target");
          //재시작하면 갯수를 점차 늘리기
          countNumber = refreshedTargetNumber + 2;

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
      clearInterval(countTimeout);
      //클릭 막기
      targetContainer.style.pointerEvents = "none";

      const restartTerm = setTimeout(() => {
        restartButton.style.display = "block";
        clearMessage.innerHTML = "Try again";

        const target = document.querySelectorAll(".target");

        countNumber = refreshedTargetNumber;

        for (let i = 0; i < target.length; i++) {
          targetContainer.removeChild(target[i]);
        }
      }, 400);

      // restartTerm;
    }
    count.innerText = countNumber;
  });
}

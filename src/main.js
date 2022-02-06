const startButton = document.querySelector(".start__button");
const restartButton = document.querySelector(".restart__button");
const time = document.querySelector(".time");
const count = document.querySelector(".count");
const targetContainer = document.querySelector(".target__container");
const clearMessage = document.querySelector(".clear__message");

let countNumber = 0;
count.innerText = countNumber;
let countTime = 00;
time.innerText = `00:${countTime}`;

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
    const newWatermelon = document.createElement("img");
    newWatermelon.setAttribute("class", "watermelon target");
    newWatermelon.setAttribute("src", "./img/watermelon.png");
    newWatermelon.setAttribute("alt", "watermelon");

    targetContainer.appendChild(newWatermelon);

    const randomY = getRandomInt(45, 80);
    const randomX = getRandomInt(10, 80);

    const mosRandomY = getRandomInt(45, 80);
    const mosRandomX = getRandomInt(10, 80);

    newWatermelon.style.top = `${randomY}%`;
    newWatermelon.style.left = `${randomX}%`;

    const newMosquito = document.createElement("img");
    newMosquito.setAttribute("class", "mosquito target");
    newMosquito.setAttribute("data-name", "mosquito");
    newMosquito.setAttribute("src", "./img/mosquito.png");
    newMosquito.setAttribute("alt", "mosquito");

    targetContainer.appendChild(newMosquito);

    newMosquito.style.top = `${mosRandomY}%`;
    newMosquito.style.left = `${mosRandomX}%`;

    //   console.log("doing");
  }
}

startButton.addEventListener("click", (event) => {
  startButton.style.display = "none";
  countNumber = 8;
  count.innerText = countNumber;
  targetContainer.style.opacity = "100%";
  putTargets();
  onClickTarget(targetContainer);
  // 시간이 줄어들게
  // settimeout 1초마다 1씩 줄어들게
  countTime = "6";
  startCountTimeout();
});

let countTimeout;
function startCountTimeout() {
  countTimeout = setInterval(() => {
    countTime--;
    time.innerText = `00:${countTime}`;

    if (countTime === 0) {
      clearInterval(countTimeout);
      restartButton.style.display = "block";
      targetContainer.style.opacity = "0";
      clearMessage.innerHTML = "Try again";

      const target = document.querySelectorAll(".target");

      for (let i = 0; i < target.length; i++) {
        targetContainer.removeChild(target[i]);
      }
    }
  }, 1000);
}

restartButton.addEventListener("click", (event) => {
  restartButton.style.display = "none";
  countNumber += 2;
  count.innerText = countNumber;
  countTime = "6";
  time.innerText = `00:${countTime}`;
  targetContainer.style.opacity = "100%";
  clearMessage.innerHTML = "";

  //그림재배치
  putTargets();
  startCountTimeout();
});

function onClickTarget(targetEle) {
  targetEle.addEventListener("click", (event) => {
    const toBeAddedTarget = document.querySelectorAll(".target");
    const toBeAddedTargetNumber = toBeAddedTarget.length / 2;
    event.target.style.display = "none";
    if (event.target.dataset.name !== "mosquito") {
      countNumber--;
      if (countNumber === 0) {
        //시간멈춤
        clearInterval(countTimeout);

        targetContainer.style.opacity = "0";
        clearMessage.innerHTML = "Clear!";
        restartButton.style.display = "block";
        targetContainer.style.opacity = "0";

        const target = document.querySelectorAll(".target");
        //재시작하면 갯수를 점차 늘리기
        countNumber = toBeAddedTargetNumber;
        console.log(toBeAddedTargetNumber);

        for (let i = 0; i < target.length; i++) {
          targetContainer.removeChild(target[i]);
        }
      }
    }
    if (event.target.dataset.name === "mosquito") {
      restartButton.style.display = "block";
      targetContainer.style.opacity = "0";
      clearMessage.innerHTML = "Try again";

      const target = document.querySelectorAll(".target");

      for (let i = 0; i < target.length; i++) {
        targetContainer.removeChild(target[i]);
      }
    }
    count.innerText = countNumber;
  });
}

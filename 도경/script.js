//--------------------------------------------------
// 기본 변수
//--------------------------------------------------
let money = 0;
let gems = 0;
let selectedIngredients = [];
let currentCustomer = null;
let currentEvent = null;

// 재료 목록
const ingredientList = [
  "푸주",
  "중국넙쩍당면",
  "판다떡",
  "치즈떡",
  "고구마떡",
  "중국짧은당면",
  "꽃모양분모자",
  "긴분모자",
  "숙주",
  "배추",
  "고수",
  "어묵",
  "유부",
];

//--------------------------------------------------
// 시작 시 초기 설정
//--------------------------------------------------
window.onload = () => {
  initIngredients();
  checkEventDay();

  const spicy = document.getElementById("spicyLevel");
  document.getElementById("spicyText").textContent = `${spicy.value}단계`;
  spicy.oninput = (e) => {
    document.getElementById("spicyText").textContent = `${e.target.value}단계`;
  };
};

//--------------------------------------------------
// 재료 생성
//--------------------------------------------------
function initIngredients() {
  const ing = document.getElementById("ingredients");
  ingredientList.forEach((name) => {
    const div = document.createElement("div");
    div.textContent = name;
    div.onclick = () => toggleIngredient(div);
    ing.appendChild(div);
  });
}

function toggleIngredient(div) {
  div.classList.toggle("selected");

  if (selectedIngredients.includes(div.textContent)) {
    selectedIngredients = selectedIngredients.filter((x) => x !== div.textContent);
  } else {
    selectedIngredients.push(div.textContent);
  }
}

function clearSelections() {
  selectedIngredients = [];
  document.querySelectorAll("#ingredients div").forEach((d) => d.classList.remove("selected"));
}

//--------------------------------------------------
// 이벤트 날짜 체크
//--------------------------------------------------
function checkEventDay() {
  const today = new Date();
  const m = today.getMonth() + 1;
  const d = today.getDate();

  if (m === 10 && d === 31) currentEvent = "halloween";
  else if (m === 12 && d === 25) currentEvent = "christmas";
  else if (m === 10 && d === 9) currentEvent = "hangul";
  else currentEvent = null;

  applyEventVisual();
  if (currentEvent) showEventBanner();
  if (currentEvent) showEventBox();
}

//--------------------------------------------------
// 이벤트 시각 효과 적용
//--------------------------------------------------
function applyEventVisual() {
  const body = document.body;
  const lora = document.getElementById("lora");

  body.className = "";
  lora.className = "";

  const oldSnow = document.querySelector(".snow");
  if (oldSnow) oldSnow.remove();

  if (currentEvent === "halloween") {
    body.classList.add("halloween-bg");
    lora.classList.add("halloween-lora");
  }
  if (currentEvent === "christmas") {
    body.classList.add("christmas-bg");
    lora.classList.add("christmas-lora");

    const snow = document.createElement("div");
    snow.classList.add("snow");
    document.body.appendChild(snow);
  }
  if (currentEvent === "hangul") {
    body.classList.add("hangul-bg");
    lora.classList.add("hangul-lora");
  }
}

//--------------------------------------------------
// 이벤트 배너
//--------------------------------------------------
function showEventBanner() {
  const b = document.getElementById("eventBanner");

  if (currentEvent === "halloween") b.textContent = "🎃 할로윈 이벤트! 스페셜 손님 확률 증가!";
  if (currentEvent === "christmas") b.textContent = "🎄 크리스마스 이벤트! 보상 2배!";
  if (currentEvent === "hangul") b.textContent = "🟦 한글날 이벤트! 미니게임 보상 2배!";
}

//--------------------------------------------------
// 이벤트 보상 상자
//--------------------------------------------------
function showEventBox() {
  document.getElementById("eventBox").style.display = "block";
}

function openEventBox() {
  let rMoney = 0,
    rGems = 0;

  if (currentEvent === "halloween") {
    rMoney = 500;
    rGems = 10;
  }
  if (currentEvent === "christmas") {
    rMoney = 800;
    rGems = 5;
  }
  if (currentEvent === "hangul") {
    rMoney = 300;
    rGems = 15;
  }

  money += rMoney;
  gems += rGems;

  alert(`🎁 이벤트 상자!\n머니 +${rMoney}\n보석 +${rGems}`);

  updateStats();
  document.getElementById("eventBox").style.display = "none";
}

//--------------------------------------------------
// 손님 생성
//--------------------------------------------------
function newCustomer() {
  clearSelections();
  const area = document.getElementById("customerArea");

  let specialChance = 0.2;
  if (currentEvent === "halloween") specialChance = 0.4;
  if (currentEvent === "christmas") specialChance = 0.3;
  if (currentEvent === "hangul") specialChance = 0.25;

  const isSpecial = Math.random() < specialChance;

  let customerName = isSpecial ? "✨ 스페셜 손님" : "🙂 손님";

  if (currentEvent === "halloween") customerName = "🧟‍♂️ 좀비 손님";
  if (currentEvent === "christmas") customerName = "🎅 산타 손님";
  if (currentEvent === "hangul") customerName = "📜 훈민정음 학자";

  currentCustomer = {
    special: isSpecial,
    request: randomRequest(),
    name: customerName,
  };

  area.innerHTML = `
    <b>${customerName}</b><br>
    원하는 재료: ${currentCustomer.request.ingredients.join(", ")}<br>
    매움도: ${currentCustomer.request.spicy}단계
  `;
}

function randomRequest() {
  const req = [];
  for (let i = 0; i < 3; i++) {
    req.push(ingredientList[Math.floor(Math.random() * ingredientList.length)]);
  }
  return {
    ingredients: req,
    spicy: Math.floor(Math.random() * 6),
  };
}

//--------------------------------------------------
// 마라탕 제공
//--------------------------------------------------
function serve() {
  if (!currentCustomer) return alert("손님이 없습니다!");

  const spicyLevel = parseInt(document.getElementById("spicyLevel").value, 10);
  const matchIng = currentCustomer.request.ingredients.every((i) => selectedIngredients.includes(i));
  const matchSpicy = currentCustomer.request.spicy === spicyLevel;

  if (matchIng && matchSpicy) {
    if (currentCustomer.special) {
      const reward = currentEvent === "halloween" ? 10 : 5;
      gems += reward;
      alert(`${currentCustomer.name} 만족!\n보석 +${reward}`);
    } else {
      const reward = currentEvent === "christmas" ? 600 : 300;
      money += reward;
      alert(`${currentCustomer.name} 만족!\n머니 +${reward}`);
    }
  } else {
    alert("손님이 만족하지 못했습니다!");
  }

  updateStats();
  currentCustomer = null;
  document.getElementById("customerArea").innerHTML = "";
}

function updateStats() {
  document.getElementById("money").textContent = money;
  document.getElementById("gems").textContent = gems;
}

//--------------------------------------------------
// 미니게임 – 같은 재료 맞히기
//--------------------------------------------------
let miniGameOpened = false;
let firstPick = null;

function startMiniGame() {
  const area = document.getElementById("miniGame");
  area.innerHTML = "";
  miniGameOpened = true;
  firstPick = null;

  const picks = [];
  for (let i = 0; i < 4; i++) {
    const ing = ingredientList[Math.floor(Math.random() * ingredientList.length)];
    picks.push(ing, ing);
  }

  picks.sort(() => Math.random() - 0.5);

  picks.forEach((name) => {
    const div = document.createElement("div");
    div.textContent = "?";
    div.onclick = () => flipCard(div, name);
    area.appendChild(div);
  });
}

function flipCard(div, name) {
  if (!miniGameOpened || div.textContent === name) return;

  div.textContent = name;

  if (!firstPick) {
    firstPick = { div, name };
  } else {
    if (firstPick.name === name && firstPick.div !== div) {
      const reward = currentEvent === "hangul" ? 200 : 100;
      money += reward;
      alert(`정답! 머니 +${reward}`);
      updateStats();
    } else {
      setTimeout(() => {
        div.textContent = "?";
        firstPick.div.textContent = "?";
      }, 500);
    }
    firstPick = null;
  }
}

//--------------------------------------------------
// 이벤트 전용 미니게임
//--------------------------------------------------
function startEventMiniGame() {
  const area = document.getElementById("eventGameArea");
  area.innerHTML = "";

  if (!currentEvent) {
    area.innerHTML = "현재 이벤트가 없습니다!";
    return;
  }

  if (currentEvent === "halloween") startHalloweenGame();
  if (currentEvent === "christmas") startChristmasGame();
  if (currentEvent === "hangul") startHangulGame();
}

//==================================================
// 🎃 할로윈 미니게임 – 호박 잡기
//==================================================
function startHalloweenGame() {
  const area = document.getElementById("eventGameArea");
  area.innerHTML = "<h3>🎃 호박 잡기!</h3>";

  let score = 0;

  function spawn() {
    const p = document.createElement("div");
    p.classList.add("pumpkin");
    p.style.left = `${Math.random() * 400}px`;
    p.style.top = "0px";
    area.appendChild(p);

    p.onclick = () => {
      score++;
      p.remove();
    };

    const fall = setInterval(() => {
      const t = parseInt(p.style.top, 10);
      p.style.top = `${t + 5}px`;
      if (t > 180) {
        p.remove();
        clearInterval(fall);
      }
    }, 50);
  }

  const timer = setInterval(spawn, 600);

  setTimeout(() => {
    clearInterval(timer);
    const reward = score * 50;
    money += reward;
    alert(`할로윈 보너스! +${reward} 머니`);
    updateStats();
    area.innerHTML = `<h3>점수: ${score}</h3>`;
  }, 10000);
}

//==================================================
// 🎄 크리스마스 미니게임 – 선물 받기
//==================================================
function startChristmasGame() {
  const area = document.getElementById("eventGameArea");
  area.innerHTML = "<h3>🎄 선물 받기!</h3>";

  let score = 0;

  const basket = document.createElement("div");
  basket.style.width = "120px";
  basket.style.height = "80px";
  basket.style.background = "#ffe0e0";
  basket.style.border = "2px dashed #ff7a5c";
  basket.style.position = "absolute";
  basket.style.bottom = "10px";
  basket.style.left = "200px";
  basket.style.borderRadius = "12px";
  area.appendChild(basket);

  area.onmousemove = (e) => {
    basket.style.left = `${e.offsetX - 60}px`;
  };

  function spawnGift() {
    const g = document.createElement("div");
    g.classList.add("gift");
    g.style.top = "0px";
    g.style.left = `${Math.random() * 400}px`;
    area.appendChild(g);

    const fall = setInterval(() => {
      const t = parseInt(g.style.top, 10);
      g.style.top = `${t + 4}px`;

      const gl = parseInt(g.style.left, 10);
      const bl = parseInt(basket.style.left, 10);

      if (t > 120 && gl > bl - 20 && gl < bl + 120) {
        score++;
        g.remove();
        clearInterval(fall);
      }
      if (t > 200) {
        g.remove();
        clearInterval(fall);
      }
    }, 50);
  }

  const timer = setInterval(spawnGift, 800);

  setTimeout(() => {
    clearInterval(timer);
    const reward = score * 80;
    money += reward;
    alert(`크리스마스 보너스! 머니 +${reward}`);
    updateStats();
    area.innerHTML = `<h3>점수: ${score}</h3>`;
  }, 15000);
}

//==================================================
// 🟦 한글날 미니게임 – 자모 조합
//==================================================
function startHangulGame() {
  const area = document.getElementById("eventGameArea");
  area.innerHTML = "<h3>🟦 자모 조합 맞히기!</h3>";

  let score = 0;
  const consonants = ["ㄱ", "ㄴ", "ㄷ", "ㅁ", "ㅂ", "ㅅ", "ㅎ"];
  const vowels = ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ", "ㅣ"];

  let answer = {
    first: consonants[Math.floor(Math.random() * consonants.length)],
    second: vowels[Math.floor(Math.random() * vowels.length)],
  };

  const p = document.createElement("p");
  p.innerHTML = `정답: <b>${answer.first}${answer.second}</b>`;
  area.appendChild(p);

  consonants.forEach((c) => {
    const card = document.createElement("div");
    card.className = "letterCard";
    card.textContent = c;
    card.onclick = () => choose("first", c);
    area.appendChild(card);
  });

  vowels.forEach((v) => {
    const card = document.createElement("div");
    card.className = "letterCard";
    card.textContent = v;
    card.onclick = () => choose("second", v);
    area.appendChild(card);
  });

  let pick = { first: null, second: null };

  function choose(type, val) {
    pick[type] = val;

    if (pick.first && pick.second) {
      if (pick.first === answer.first && pick.second === answer.second) {
        score++;
        alert("정답!");

        answer = {
          first: consonants[Math.floor(Math.random() * consonants.length)],
          second: vowels[Math.floor(Math.random() * vowels.length)],
        };
        p.innerHTML = `정답: <b>${answer.first}${answer.second}</b>`;
      } else {
        alert("틀렸습니다!");
      }

      pick = { first: null, second: null };
    }
  }

  setTimeout(() => {
    let reward = score * 100;
    if (currentEvent === "hangul") reward *= 2;
    money += reward;

    alert(`한글날 보너스! 머니 +${reward}`);
    updateStats();
    area.innerHTML = `<h3>점수: ${score}</h3>`;
  }, 12000);
}

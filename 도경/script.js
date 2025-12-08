//--------------------------------------------------
// 기본 변수
//--------------------------------------------------
let money = 800;
let gems = 12;
let selectedIngredients = [];
let currentCustomer = null;
let currentEvent = null;
let customersServed = 0;
let level = 0;

// 재료 목록
const allIngredients = [
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

let unlockedIngredients = [
  "푸주",
  "중국넙쩍당면",
  "판다떡",
  "치즈떡",
  "숙주",
  "배추",
];

// 코스튬 데이터
const costumeCatalog = [
  // Hats
  { id: "hat-strawberry", name: "딸기 모자", slot: "hat", cost: 200, currency: "money", className: "hat-strawberry" },
  { id: "hat-banana", name: "바나나 모자", slot: "hat", cost: 250, currency: "money", className: "hat-banana" },
  { id: "hat-watermelon", name: "수박 모자", slot: "hat", cost: 8, currency: "gems", className: "hat-watermelon" },
  { id: "hat-grape", name: "포도 모자", slot: "hat", cost: 10, currency: "gems", className: "hat-grape" },
  // Clothes
  { id: "clothes-blue", name: "파란 앞치마", slot: "clothes", cost: 520, currency: "money", className: "clothes-blue" },
  { id: "clothes-coral", name: "코랄 앞치마", slot: "clothes", cost: 6, currency: "gems", className: "clothes-coral" },
  { id: "clothes-mint", name: "민트 바람막이", slot: "clothes", cost: 420, currency: "money", className: "clothes-mint" },
  // Hair
  { id: "hair-bob", name: "단발", slot: "hair", cost: 0, currency: "money", className: "hair-bob" },
  { id: "hair-long", name: "긴 생머리", slot: "hair", cost: 260, currency: "money", className: "hair-long" },
  { id: "hair-twin", name: "트윈테일", slot: "hair", cost: 7, currency: "gems", className: "hair-twin" },
  { id: "hair-ash", name: "애쉬 그레이", slot: "hair", cost: 9, currency: "gems", className: "hair-ash" },
];

const ownedCostumes = new Set(["hat-strawberry", "clothes-basic", "hair-bob"]);
const characterLook = { hat: "hat-strawberry", clothes: "clothes-basic", hair: "hair-bob" };

const shopItems = [
  ...allIngredients.map((ingredient, idx) => ({
    id: `ing-${idx}`,
    type: "ingredient",
    ingredient,
    cost: 120 + idx * 20,
    currency: "money",
  })),
  ...costumeCatalog.map((item) => ({ ...item, type: item.slot })),
];

//--------------------------------------------------
// 시작 시 초기 설정
//--------------------------------------------------
window.onload = () => {
  initIngredients();
  checkEventDay();
  renderInventory();
  renderShop("ingredient");
  renderWardrobe();
  updateCharacterPreview();
  updateStats();
  updateLevelUI();

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
  ing.innerHTML = "";
  const pool = unlockedIngredients.length ? unlockedIngredients : allIngredients;
  pool.forEach((name) => {
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

function renderInventory() {
  const list = document.getElementById("inventoryList");
  if (!list) return;
  list.innerHTML = "";
  unlockedIngredients.forEach((name) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = name;
    list.appendChild(tag);
  });
}

//--------------------------------------------------
// 상점 & 코스튬
//--------------------------------------------------
function renderShop(category = "ingredient") {
  const list = document.getElementById("shopItems");
  if (!list) return;

  list.innerHTML = "";
  shopItems
    .filter((item) => item.type === category)
    .forEach((item) => {
      const card = document.createElement("div");
      card.className = "shop-item";

      const owned =
        item.type === "ingredient"
          ? unlockedIngredients.includes(item.ingredient)
          : ownedCostumes.has(item.id);

      card.innerHTML = `
        <div class="shop-title">${item.type === "ingredient" ? item.ingredient : item.name}</div>
        <p class="shop-price">${item.currency === "money" ? "💰" : "💎"} ${item.cost}</p>
        <p class="shop-desc">${describeItem(item)}</p>
      `;

      const btn = document.createElement("button");
      btn.textContent = owned ? "보유 중" : "구매";
      btn.disabled = owned;
      btn.onclick = () => purchaseItem(item.id);
      card.appendChild(btn);

      list.appendChild(card);
    });

  document.querySelectorAll(".shop-filters button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });
}

function describeItem(item) {
  if (item.type === "ingredient") return "새 손님이 요구할 수 있는 재료";
  if (item.type === "hat") return "상큼한 과일 모자";
  if (item.type === "hair") return "스타일을 바꿔주는 헤어";
  return "캐릭터 꾸미기 아이템";
}

function purchaseItem(id) {
  const item = shopItems.find((s) => s.id === id);
  if (!item) return;

  const alreadyOwned =
    item.type === "ingredient"
      ? unlockedIngredients.includes(item.ingredient)
      : ownedCostumes.has(item.id);

  if (alreadyOwned) return alert("이미 보유한 아이템입니다!");

  if (item.currency === "money" && money < item.cost) return alert("머니가 부족해요!");
  if (item.currency === "gems" && gems < item.cost) return alert("보석이 부족해요!");

  if (item.currency === "money") money -= item.cost;
  else gems -= item.cost;

  if (item.type === "ingredient") {
    unlockedIngredients.push(item.ingredient);
    initIngredients();
    renderInventory();
  } else {
    ownedCostumes.add(item.id);
    // 바로 적용되는 장비라면 시각적으로 반영
    if (item.slot) {
      characterLook[item.slot] = item.className;
    }
    renderWardrobe();
    updateCharacterPreview();
  }

  updateStats();
  renderShop(item.type);
}

function renderWardrobe() {
  const area = document.getElementById("wardrobe");
  if (!area) return;
  area.innerHTML = "";

  ["hat", "hair", "clothes"].forEach((slot) => {
    const group = document.createElement("div");
    group.className = "wardrobe-group";

    const title = document.createElement("h3");
    if (slot === "hat") title.textContent = "모자";
    if (slot === "clothes") title.textContent = "옷";
    if (slot === "hair") title.textContent = "헤어";
    group.appendChild(title);

    const ownedList = costumeCatalog
      .filter((c) => c.slot === slot && ownedCostumes.has(c.id))
      .concat([{ id: `${slot}-basic`, name: "기본", slot, className: `${slot}-basic` }]);

    ownedList.forEach((c) => {
      const btn = document.createElement("button");
      btn.textContent = c.name;
      btn.className = "wardrobe-btn";
      btn.onclick = () => applyCostume(slot, c.className || c.id);
      group.appendChild(btn);
    });

    area.appendChild(group);
  });
}

function applyCostume(slot, className) {
  characterLook[slot] = className;
  updateCharacterPreview();
}

function updateCharacterPreview() {
  const combinedClass = `${characterLook.hat} ${characterLook.clothes} ${characterLook.hair}`;

  const preview = document.getElementById("avatarPreview");
  if (preview) preview.className = `avatar-preview ${combinedClass}`;

  const hero = document.getElementById("heroAvatar");
  if (hero) hero.className = `character-art ${combinedClass}`;

  const lora = document.getElementById("lora");
  if (lora) {
    lora.className = `mini-avatar ${combinedClass}`;
    lora.classList.remove("halloween-lora", "christmas-lora", "hangul-lora");
    if (currentEvent === "halloween") lora.classList.add("halloween-lora");
    if (currentEvent === "christmas") lora.classList.add("christmas-lora");
    if (currentEvent === "hangul") lora.classList.add("hangul-lora");
  }
}

//--------------------------------------------------
// 레벨 시스템
//--------------------------------------------------
function addCustomerProgress() {
  customersServed++;
  const newLevel = Math.min(3, Math.floor(customersServed / 10));
  if (newLevel !== level) level = newLevel;
  updateLevelUI();
}

function updateLevelUI() {
  const levelText = document.getElementById("level");
  const countText = document.getElementById("customerCount");
  const toNext = document.getElementById("toNext");
  const progressFill = document.getElementById("progressFill");

  if (levelText) levelText.textContent = level;
  if (countText) countText.textContent = customersServed;

  const nextThreshold = Math.min(30, (level + 1) * 10);
  const progressBase = level * 10;
  const progress = Math.max(0, customersServed - progressBase);
  const percent = Math.min(100, (progress / 10) * 100);
  if (progressFill) progressFill.style.width = `${percent}%`;
  if (toNext) toNext.textContent = customersServed >= 30 ? 0 : nextThreshold - customersServed;
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
  updateCharacterPreview();

  const oldSnow = document.querySelector(".snow");
  if (oldSnow) oldSnow.remove();

  if (currentEvent === "halloween") {
    body.classList.add("halloween-bg");
    lora?.classList.add("halloween-lora");
  }
  if (currentEvent === "christmas") {
    body.classList.add("christmas-bg");
    lora?.classList.add("christmas-lora");

    const snow = document.createElement("div");
    snow.classList.add("snow");
    document.body.appendChild(snow);
  }
  if (currentEvent === "hangul") {
    body.classList.add("hangul-bg");
    lora?.classList.add("hangul-lora");
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
  const pool = unlockedIngredients.length ? unlockedIngredients : allIngredients;
  for (let i = 0; i < 3; i++) {
    req.push(pool[Math.floor(Math.random() * pool.length)]);
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
    addCustomerProgress();
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
let matchedPairs = 0;
let miniGameReward = 0;
let totalPairs = 0;

function startMiniGame() {
  const area = document.getElementById("miniGame");
  area.innerHTML = "";
  miniGameOpened = true;
  firstPick = null;
  matchedPairs = 0;
  miniGameReward = 0;
  totalPairs = 0;

  const resultBox = document.getElementById("miniGameResult");
  resultBox.innerHTML = "카드를 뒤집어 짝을 맞혀 보세요!";
  resultBox.classList.remove("result-finished");

  const picks = [];
  const pool = unlockedIngredients.length ? unlockedIngredients : allIngredients;
  for (let i = 0; i < 4; i++) {
    const ing = pool[Math.floor(Math.random() * pool.length)];
    picks.push(ing, ing);
  }

  picks.sort(() => Math.random() - 0.5);

  picks.forEach((name) => {
    const div = document.createElement("div");
    div.textContent = "?";
    div.onclick = () => flipCard(div, name);
    area.appendChild(div);
  });

  totalPairs = picks.length / 2;
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
      miniGameReward += reward;
      alert(`정답! 머니 +${reward}`);
      updateStats();
      matchedPairs++;

      if (matchedPairs === totalPairs) {
        endMiniGame();
      }
    } else {
      setTimeout(() => {
        div.textContent = "?";
        firstPick.div.textContent = "?";
      }, 300);
    }
    firstPick = null;
  }
}

function endMiniGame() {
  miniGameOpened = false;
  const resultBox = document.getElementById("miniGameResult");
  resultBox.classList.add("result-finished");
  resultBox.innerHTML = `
    <p>미니게임 종료! 총 획득 머니: <strong>${miniGameReward}</strong></p>
    <button type="button" onclick="restartMiniGame()">다시 시작</button>
  `;
}

function restartMiniGame() {
  startMiniGame();
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
    }, 40);
  }

  const timer = setInterval(spawn, 550);

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
    }, 40);
  }

  const timer = setInterval(spawnGift, 700);

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

const TICKER_FEATURES_1 = [
  { icon: "fa-solid fa-code-branch", text: "Exactly Two Parents" },
  { icon: "fa-solid fa-bolt", text: "Zero Fees" },
  { icon: "fa-solid fa-lock", text: "ML-DSA-87 Post-Quantum" },
  { icon: "fa-solid fa-hammer", text: "Per-Transaction PoW" },
  { icon: "fa-solid fa-shield-halved", text: "Tor-Native Privacy" },
  { icon: "fa-solid fa-gem", text: "Fixed Supply 19,960,907" },
];

const TICKER_FEATURES_2 = [
  { icon: "fa-solid fa-users", text: "Multisig Support" },
  { icon: "fa-solid fa-box", text: "17 MB Static Binary" },
  { icon: "fa-solid fa-globe", text: "Full Node Browser Wallet" },
  { icon: "fa-solid fa-magnifying-glass", text: "Built-in Explorer" },
  { icon: "fa-solid fa-network-wired", text: "Deterministic Sync" },
  { icon: "fa-solid fa-robot", text: "AI Agent Payments" },
];

function getVisibleSlotCount() {
  if (window.innerWidth >= 1024) return 6;
  if (window.innerWidth >= 640) return 3;
  return 2;
}

function createTickerCard(item, delayMs = 0) {
  const card = document.createElement("div");
  card.className = "ticker-card enter";
  card.style.animationDelay = `${delayMs}ms`;
  card.innerHTML = `<i class="${item.icon}"></i><span>${item.text}</span>`;
  card.addEventListener("animationend", (e) => {
    if (e.animationName === "ticker-pop-in") card.classList.remove("enter");
  });
  return card;
}

function initFeatureTicker(rowId, items, rowOffset = 0, rotateDelay = 0) {
  const row = document.getElementById(rowId);
  if (!row) return null;

  const state = {
    row,
    items,
    slots: [],
    poolIndex: 0,
    slotCursor: 0,
    timer: null,
    visible: getVisibleSlotCount(),
  };

  function buildSlots() {
    row.innerHTML = "";
    state.slots = [];
    state.visible = getVisibleSlotCount();
    state.poolIndex = rowOffset;

    for (let i = 0; i < state.visible; i++) {
      const slot = document.createElement("div");
      slot.className = "ticker-slot";
      const item = state.items[(state.poolIndex + i) % state.items.length];
      slot.appendChild(createTickerCard(item, i * 70));
      row.appendChild(slot);
      state.slots.push({ slotEl: slot, poolIndex: (state.poolIndex + i) % state.items.length });
    }
    state.poolIndex = (state.poolIndex + state.visible) % state.items.length;
  }

  function rotateOne() {
    if (!state.slots.length) return;

    const idx = state.slotCursor % state.slots.length;
    state.slotCursor++;
    const slot = state.slots[idx];
    const oldCard = slot.slotEl.querySelector(".ticker-card");
    if (!oldCard) return;

    const nextItem = state.items[state.poolIndex % state.items.length];
    state.poolIndex = (state.poolIndex + 1) % state.items.length;

    oldCard.classList.remove("enter");
    oldCard.classList.add("exit");

    oldCard.addEventListener("animationend", function onExit(e) {
      if (e.animationName !== "ticker-pop-out") return;
      oldCard.removeEventListener("animationend", onExit);
      const newCard = createTickerCard(nextItem, 0);
      slot.slotEl.replaceChild(newCard, oldCard);
    });
  }

  buildSlots();

  state.timer = setTimeout(() => {
    rotateOne();
    state.interval = setInterval(rotateOne, 2400);
  }, rotateDelay);

  return state;
}

function initFeatureTickers() {
  const tickers = [];

  const t1 = initFeatureTicker("ticker-row-1", TICKER_FEATURES_1, 0, 1800);
  const t2 = initFeatureTicker("ticker-row-2", TICKER_FEATURES_2, 3, 3000);

  if (t1) tickers.push(t1);
  if (t2) tickers.push(t2);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      tickers.forEach(t => {
        if (t.timer) clearTimeout(t.timer);
        if (t.interval) clearInterval(t.interval);
      });
      tickers.length = 0;
      const nt1 = initFeatureTicker("ticker-row-1", TICKER_FEATURES_1, 0, 1800);
      const nt2 = initFeatureTicker("ticker-row-2", TICKER_FEATURES_2, 3, 3000);
      if (nt1) tickers.push(nt1);
      if (nt2) tickers.push(nt2);
    }, 200);
  });
}

function copyDocker() {
  const cmd = "docker run -d --restart unless-stopped \\\n  -p 64552:64552 \\\n  -v sikka-data:/home/sikka/data \\\n  ghcr.io/sikkalabs/sikka:latest";
  navigator.clipboard.writeText(cmd).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = cmd;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  });
  const btn = document.getElementById("copy-btn");
  if (!btn) return;
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
  btn.style.color = "#22c55e";
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.style.color = "";
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  initFeatureTickers();
});
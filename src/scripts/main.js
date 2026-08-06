const TICKER_FEATURES_1 = [
  {
    icon: "fa-solid fa-bolt",
    title: "Zero Fees",
    desc: "When you send SIKKA, the exact amount arrives. No gas, no priority fees, no hidden costs — ever.",
  },
  {
    icon: "fa-solid fa-user-secret",
    title: "No Transaction History",
    desc: "Balances, not a public ledger. Finalized payments are discarded once the checkpoint state root is signed.",
  },
  {
    icon: "fa-solid fa-lock",
    title: "ML-DSA-87 Post-Quantum",
    desc: "SIKKA uses pure ML-DSA-87 cryptography throughout. No classical elliptic curve fallbacks.",
  },
  {
    icon: "fa-solid fa-percent",
    title: "Spend Credits",
    desc: "Each account earns +1 credit/min (cap 100) and burns 1 per transaction. Sustained spam is impossible; normal use is free.",
  },
  {
    icon: "fa-solid fa-gem",
    title: "1.5%/yr Low Inflation",
    desc: "Genesis 19,960,907 SIKKA. Validators earn deterministic 1.5%/year inflation on bonded stake — no premine, no VC allocations.",
  },
];

const TICKER_FEATURES_2 = [
  {
    icon: "fa-solid fa-users",
    title: "Multisig Support",
    desc: "Up to 16 wallets can collaboratively build and sign one transaction. Native m-of-n multisig, no smart contracts.",
  },
  {
    icon: "fa-solid fa-box",
    title: "17 MB Static Binary",
    desc: "A tiny static binary with wallet, explorer, and full node — zero configuration.",
  },
  {
    icon: "fa-solid fa-globe",
    title: "Full Node Browser Wallet",
    desc: "Create keys, send, receive, and manage multisig locally without trusting any third party.",
  },
  {
    icon: "fa-solid fa-magnifying-glass",
    title: "Built-in Explorer",
    desc: "Real-time network explorer. Browse accounts, checkpoints, and balances without trusting a third party.",
  },
  {
    icon: "fa-solid fa-network-wired",
    title: "Deterministic Sync",
    desc: "State verification is fully deterministic. Every honest node converges on identical ledger state.",
  },
  {
    icon: "fa-solid fa-robot",
    title: "AI Agent Payments",
    desc: "Instant micropayments between autonomous agents — bots paying for APIs, LLMs buying data.",
  },
];

function getVisibleSlotCount() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function createTickerCard(item, delayMs = 0) {
  const card = document.createElement("div");
  card.className = "ticker-card enter";
  card.style.animationDelay = `${delayMs}ms`;
  card.innerHTML = `
    <div class="ticker-card-icon"><i class="${item.icon}"></i></div>
    <div class="ticker-card-body">
      <div class="ticker-card-title">${item.title}</div>
      <p class="ticker-card-desc">${item.desc}</p>
    </div>
  `;
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
      slot.appendChild(createTickerCard(item, i * 90));
      row.appendChild(slot);
      state.slots.push({ slotEl: slot });
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
      slot.slotEl.replaceChild(createTickerCard(nextItem, 0), oldCard);
    });
  }

  buildSlots();

  state.timer = setTimeout(() => {
    rotateOne();
    state.interval = setInterval(rotateOne, 4200);
  }, rotateDelay);

  return state;
}

function initFeatureTickers() {
  const tickers = [];

  const t1 = initFeatureTicker("ticker-row-1", TICKER_FEATURES_1, 0, 2200);
  const t2 = initFeatureTicker("ticker-row-2", TICKER_FEATURES_2, 2, 3600);

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
      const nt1 = initFeatureTicker("ticker-row-1", TICKER_FEATURES_1, 0, 2200);
      const nt2 = initFeatureTicker("ticker-row-2", TICKER_FEATURES_2, 2, 3600);
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

// Exposed for inline onclick="copyDocker()" in run-node.html wiring.
window.copyDocker = copyDocker;

document.addEventListener("DOMContentLoaded", () => {
  initFeatureTickers();
});
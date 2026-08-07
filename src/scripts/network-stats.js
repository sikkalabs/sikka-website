// Live network stats — polls the SIKKA mainnet node API and updates
// [data-live-stat] elements. Replaces static copy with real-time numbers.
// The node exposes: chain_id, height, state_root, mempool, peers, validator.
// Optional fields (total_stake, delegators, chain_count) render automatically
// when the API starts exposing them.

const HEALTH_URL = 'https://1.sikkalabs.com/api/health';

function fmt(v) {
  if (v === undefined || v === null) return '—';
  return typeof v === 'number' ? v.toLocaleString() : String(v);
}

async function pollStats() {
  let data;
  try {
    const res = await fetch(HEALTH_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    data = await res.json();
  } catch (err) {
    console.warn('Live network stats unavailable:', err.message);
    data = {};
  }

  const values = {
    chain: data.chain_id ?? data.chain ?? 'sikka',
    height: data.height ?? data.checkpoint_height ?? data.checkpoint ?? data.block_height,
    mempool: data.mempool ?? data.mempool_size ?? data.pending_txs ?? 0,
    peers: data.peers ?? data.peer_count ?? 0,
    validator: data.validator ?? data.is_validator ?? false,
    total_stake: data.total_stake ?? data.stake ?? data.bonded ?? null,
    delegators: data.delegators ?? data.delegator_count ?? null,
    state: data.state_root ?? null,
  };

  document.querySelectorAll('[data-live-stat]').forEach((el) => {
    const key = el.getAttribute('data-live-stat');
    const val = values[key];
    if (val === undefined || val === null) {
      const card = el.closest('[data-live-stat-card]');
      if (card) card.classList.add('is-hidden');
      return;
    }
    const card = el.closest('[data-live-stat-card]');
    if (card) card.classList.remove('is-hidden');
    el.textContent = fmt(val);
  });

  const statusDot = document.querySelector('[data-live-status]');
  if (statusDot) {
    const online = resOk(data);
    statusDot.classList.toggle('online', online);
    statusDot.classList.toggle('offline', !online);
  }
}

function resOk(data) {
  if (data.ok === true) return true;
  if (data.height !== undefined && data.height !== null) return true;
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('[data-live-stat]')) return;
  pollStats();
  setInterval(pollStats, 5000);
});

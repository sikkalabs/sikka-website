// Bridge page — minimal & reactive Web3 bridge widget + vesting helpers.

const TOKEN_ADDRESS = '0xbab5a2cc8c9eb4042eeae289b26b66166cf04a81';
const TOKEN_ABI = [
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function burn(bytes32 sikkaAddress, uint256 amount) external'
];
const CHAIN_ID = 1;

const els = {
  connect: document.getElementById('btn-connect'),
  bridge: document.getElementById('btn-bridge'),
  balanceRow: document.getElementById('balance-row'),
  balanceVal: document.getElementById('balance-val'),
  amount: document.getElementById('amount-input'),
  sikka: document.getElementById('sikka-input'),
  sikkaCounter: document.getElementById('sikka-counter'),
  sikkaValidation: document.getElementById('sikka-validation'),
  receivePreview: document.getElementById('receive-preview'),
  status: document.getElementById('status'),
  networkWarn: document.getElementById('network-warn'),
  switchNet: document.getElementById('switch-net'),
  max: document.getElementById('btn-max')
};

let provider, signer, token, account, decimals = 9;

function setStatus(type, html) {
  els.status.className = 'bridge-status show ' + type;
  els.status.innerHTML = html;
}

function clearStatus() {
  els.status.className = 'bridge-status';
  els.status.innerHTML = '';
}

function showError(msg) {
  setStatus('error', '<i class="fa-solid fa-circle-xmark"></i><div>' + msg + '</div>');
}

function parseSikkaAddress(raw) {
  let s = (raw || '').trim();
  if (!s) return null;
  if (s.toLowerCase().startsWith('0x')) s = s.slice(2);
  if (!/^[0-9a-fA-F]{64}$/.test(s)) return null;
  return '0x' + s.toLowerCase();
}

function updateReactiveState() {
  let rawSikka = (els.sikka.value || '').trim();
  let cleanHex = rawSikka.toLowerCase().startsWith('0x') ? rawSikka.slice(2) : rawSikka;
  let hexLength = cleanHex.length;

  els.sikkaCounter.textContent = `${hexLength} / 64 hex`;

  const isValidAddress = /^[0-9a-fA-F]{64}$/.test(cleanHex);

  if (hexLength === 0) {
    els.sikka.style.borderColor = 'var(--border)';
    els.sikkaValidation.className = 'bridge-hint';
    els.sikkaValidation.innerHTML = 'Enter your 64 hex character (32-byte) Sikka address from the <a href="https://1.sikkalabs.com" target="_blank" style="color:var(--blue-2);font-weight:600;">web wallet</a>.';
  } else if (isValidAddress) {
    els.sikka.style.borderColor = 'var(--green)';
    els.sikkaValidation.className = 'bridge-hint text-green';
    els.sikkaValidation.innerHTML = '<i class="fa-solid fa-circle-check"></i> Valid 32-byte Sikka destination address';
  } else {
    els.sikka.style.borderColor = hexLength > 64 ? 'var(--red)' : 'var(--border)';
    els.sikkaValidation.className = 'bridge-hint text-muted';
    els.sikkaValidation.innerHTML = `Address must be exactly 64 hex characters (${hexLength}/64)`;
  }

  const amt = els.amount.value.trim();
  if (amt && !isNaN(amt) && parseFloat(amt) > 0) {
    els.receivePreview.textContent = `You will receive ~${amt} native SIKKA`;
    els.receivePreview.style.display = 'block';
  } else {
    els.receivePreview.style.display = 'none';
  }

  if (!account) {
    els.connect.style.display = 'flex';
    els.bridge.style.display = 'none';
  } else {
    els.connect.style.display = 'none';
    els.bridge.style.display = 'flex';

    if (!amt || isNaN(amt) || parseFloat(amt) <= 0) {
      els.bridge.textContent = 'Enter SIKKA Amount';
      els.bridge.disabled = true;
      els.bridge.style.opacity = '0.6';
    } else if (!isValidAddress) {
      els.bridge.textContent = 'Enter Valid 64-Hex Sikka Address';
      els.bridge.disabled = true;
      els.bridge.style.opacity = '0.6';
    } else {
      els.bridge.innerHTML = `<i class="fa-solid fa-fire"></i> Burn & Bridge ${amt} SIKKA`;
      els.bridge.disabled = false;
      els.bridge.style.opacity = '1';
    }
  }
}

els.amount.addEventListener('input', updateReactiveState);
els.sikka.addEventListener('input', updateReactiveState);

els.max.addEventListener('click', async () => {
  if (!token || !account) return;
  try {
    const bal = await token.balanceOf(account);
    els.amount.value = ethers.utils.formatUnits(bal, decimals);
    updateReactiveState();
  } catch (e) { /* ignore */ }
});

els.switchNet.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }]
    });
    await refreshNetwork();
  } catch (err) {
    showError('Could not switch to Ethereum. Switch networks manually in your wallet.');
  }
});

els.connect.addEventListener('click', connectWallet);

async function connectWallet() {
  clearStatus();
  if (!window.ethereum) {
    showError('No Ethereum wallet found. Install <a href="https://metamask.io/download/" target="_blank" rel="noopener">MetaMask</a> or another EIP-1193 wallet and reload.');
    return;
  }
  try {
    setStatus('info', '<i class="fa-solid fa-circle-info"></i><div>Connecting wallet…</div>');
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    signer = provider.getSigner();
    account = await signer.getAddress();
    token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
    decimals = await token.decimals();
    await refreshNetwork();
    await refreshBalance();
    updateReactiveState();
    clearStatus();
  } catch (err) {
    showError('Wallet connection cancelled or failed.');
  }
}

async function refreshNetwork() {
  const network = await provider.getNetwork();
  const warn = document.getElementById('network-warn');
  if (network.chainId === CHAIN_ID) {
    warn.classList.remove('show');
    return true;
  }
  warn.classList.add('show');
  return false;
}

async function refreshBalance() {
  try {
    const bal = await token.balanceOf(account);
    els.balanceVal.textContent = ethers.utils.commify(ethers.utils.formatUnits(bal, decimals));
    els.balanceRow.style.display = 'flex';
  } catch (e) {
    els.balanceVal.textContent = '—';
    els.balanceRow.style.display = 'flex';
  }
}

els.bridge.addEventListener('click', async () => {
  if (els.bridge.disabled) return;
  clearStatus();
  if (!token) { showError('Connect your wallet first.'); return; }

  const netOk = await refreshNetwork();
  if (!netOk) { showError('Switch to Ethereum mainnet before bridging.'); return; }

  let amountWei;
  try {
    amountWei = ethers.utils.parseUnits(els.amount.value.trim() || '0', decimals);
  } catch (e) {
    showError('Invalid amount.');
    return;
  }
  if (amountWei.lte(0)) { showError('Enter an amount greater than zero.'); return; }

  const sikkaAddr = parseSikkaAddress(els.sikka.value);
  if (!sikkaAddr) {
    showError('Invalid Sikka destination. Must be 64 hex characters (32 bytes).');
    return;
  }

  try {
    const bal = await token.balanceOf(account);
    if (amountWei.gt(bal)) { showError('Insufficient SIKKA balance for this amount.'); return; }
  } catch (e) { /* proceed */ }

  try {
    setStatus('pending', '<i class="fa-solid fa-spinner fa-spin"></i><div>Confirming the burn in your wallet…</div>');
    const tx = await token.burn(sikkaAddr, amountWei);
    setStatus('pending', '<i class="fa-solid fa-circle-notch fa-spin"></i><div>Transaction submitted. Waiting for block confirmation…<span class="small">' + tx.hash + '</span></div>');
    const receipt = await tx.wait();
    setStatus('ok',
      '<i class="fa-solid fa-circle-check"></i><div>' +
      '<strong>' + els.amount.value.trim() + ' SIKKA burned successfully!</strong> Native SIKKA will be delivered from escrow to your Sikka address.' +
      '<span class="small">View on <a href="https://etherscan.io/tx/' + receipt.transactionHash + '" target="_blank" rel="noopener">Etherscan</a></span>' +
      '</div>'
    );
    els.amount.value = '';
    await refreshBalance();
    updateReactiveState();
  } catch (err) {
    const msg = (err && err.reason) ? err.reason : 'Transaction failed or was rejected.';
    showError(msg);
  }
});

function copyContract(btn, id) {
  const addr = document.getElementById(id).textContent.trim();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(addr).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
      setTimeout(() => { btn.innerHTML = original; }, 1600);
    });
  }
}

// Exposed for inline onclick="copyContract(this, '…')" links.
window.copyContract = copyContract;
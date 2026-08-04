/* SIKKA Vesting widget — read-only live data from the Ethereum vesting
   contract (0xe4a5...98b3). Loaded on index.html and transfer.html.
   Tries balanceOf() first; falls back to eth_getStorageAt on storage slot 1
   (keccak256(abi.encode(vesting, uint256(1))) on the TOKEN contract) because
   the deployed token's balanceOf() reverts for real addresses.
   Ethers is loaded via esm.sh when not already present on the page. */
(function () {
  'use strict';

  var VESTING_ADDRESS = '0xe4a5F67529D40ACFf666303Dd0b6f72A734198B3';
  var TOKEN_ADDRESS = '0xbab5a2cc8c9eb4042eeae289b26b66166cf04a81';
  var DECIMALS = 9;
  var REFRESH_MS = 60000;

  var RPCS = [
    'https://ethereum-rpc.publicnode.com',
    'https://eth.drpc.org',
    'https://eth.meowrpc.com'
  ];

  var TOKEN_ABI = ['function balanceOf(address) view returns (uint256)'];
  var VESTING_ABI = ['function released() view returns (uint256)'];

  function loadEthers() {
    if (window.ethers) return Promise.resolve();
    return import('https://esm.sh/ethers@5.7.2').then(function (m) {
      window.ethers = m.ethers || m.default;
      if (!window.ethers) throw new Error('ethers failed to load');
    });
  }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () { reject(new Error('timeout')); }, ms);
      promise.then(
        function (v) { clearTimeout(timer); resolve(v); },
        function (e) { clearTimeout(timer); reject(e); }
      );
    });
  }

  function tryBalanceOf(provider) {
    var iface = new ethers.utils.Interface(TOKEN_ABI);
    var data = iface.encodeFunctionData('balanceOf', [VESTING_ADDRESS]);
    return provider.call({ to: TOKEN_ADDRESS, data: data })
      .then(function (result) { return ethers.BigNumber.from(result); })
      .catch(function () { return null; });
  }

  function storageSlotBalance(provider) {
    var slot = ethers.utils.keccak256(
      ethers.utils.concat([
        ethers.utils.hexZeroPad(VESTING_ADDRESS, 32),
        ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32)
      ])
    );
    return provider.send('eth_getStorageAt', [TOKEN_ADDRESS, slot, 'latest'])
      .then(function (result) { return ethers.BigNumber.from(result || '0x0'); });
  }

  function readReleased(provider) {
    var iface = new ethers.utils.Interface(VESTING_ABI);
    var data = iface.encodeFunctionData('released', []);
    return provider.call({ to: VESTING_ADDRESS, data: data })
      .then(function (result) { return ethers.BigNumber.from(result); });
  }

  function readFromRpc(rpc) {
    var provider = new ethers.providers.JsonRpcProvider(rpc);
    return tryBalanceOf(provider).then(function (balance) {
      if (balance === null) return storageSlotBalance(provider);
      return balance;
    }).then(function (balance) {
      return readReleased(provider).then(function (released) {
        return { balance: balance, released: released };
      });
    });
  }

  function format(n, maxFrac) {
    return Number(ethers.utils.formatUnits(n, DECIMALS))
      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: maxFrac || 2 });
  }

  function setAll(selector, value) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) els[i].textContent = value;
  }

  function setLoading() {
    setAll('[data-vesting-balance]', '…');
    setAll('[data-vesting-released]', '…');
  }

  function setEmpty() {
    setAll('[data-vesting-balance]', '—');
    setAll('[data-vesting-released]', '—');
  }

  function refresh() {
    var i = 0;
    function next() {
      if (i >= RPCS.length) { setEmpty(); return; }
      var rpc = RPCS[i++];
      withTimeout(readFromRpc(rpc), 8000)
        .then(function (data) {
          setAll('[data-vesting-balance]', format(data.balance));
          setAll('[data-vesting-released]', format(data.released));
        })
        .catch(next);
    }
    next();
  }

  loadEthers()
    .then(function () {
      if (!document.querySelector('[data-vesting-balance]')) return;
      setLoading();
      refresh();
      setInterval(refresh, REFRESH_MS);
    })
    .catch(function () { setEmpty(); });
})();

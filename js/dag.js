async function initHeroDagViz() {
  const container = document.getElementById("hero-dag");
  if (!container || typeof d3 === "undefined") return;

  let w = container.clientWidth || 600;
  let h = container.clientHeight || 480;
  let cx = w / 2, cy = h / 2;
  let maxR = Math.min(w, h) * 0.38;

  const svg = d3.select(container).append("svg")
    .attr("width", "100%").attr("height", "100%")
    .attr("viewBox", `0 0 ${w} ${h}`);

  const defs = svg.append("defs");
  const glowFilter = defs.append("filter").attr("id", "web-glow")
    .attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
  glowFilter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
  const merge = glowFilter.append("feMerge");
  merge.append("feMergeNode").attr("in", "blur");
  merge.append("feMergeNode").attr("in", "SourceGraphic");

  const webBg = svg.append("g").attr("class", "web-bg");
  const linkG = svg.append("g").attr("class", "web-links");
  const nodeG = svg.append("g").attr("class", "web-nodes");

  let nodes = [], links = [], linkSel, nodeSel, usingReal = false;

  function drawWebBg() {
    webBg.selectAll("*").remove();
    const rings = 6, spokes = 16;
    for (let i = 1; i <= rings; i++) {
      webBg.append("circle").attr("cx", cx).attr("cy", cy)
        .attr("r", (i / rings) * maxR).attr("fill", "none")
        .attr("stroke", "rgba(59,130,246,0.08)")
        .attr("stroke-width", i === rings ? 1 : 0.6)
        .attr("stroke-dasharray", i % 2 === 0 ? "2 6" : "none");
    }
    for (let i = 0; i < spokes; i++) {
      const angle = (i / spokes) * Math.PI * 2;
      webBg.append("line")
        .attr("x1", cx).attr("y1", cy)
        .attr("x2", cx + Math.cos(angle) * maxR)
        .attr("y2", cy + Math.sin(angle) * maxR)
        .attr("stroke", "rgba(59,130,246,0.05)").attr("stroke-width", 0.6);
    }
    webBg.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 4)
      .attr("fill", "rgba(59,130,246,0.2)");
  }

  function computeDepths(nodeList, linkList) {
    const depths = new Map();
    const idSet = new Set(nodeList.map(n => n.id));
    const parentsOf = new Map(nodeList.map(n => [n.id, []]));
    const childrenOf = new Map(nodeList.map(n => [n.id, []]));
    linkList.forEach(l => {
      const src = l.source.id || l.source, tgt = l.target.id || l.target;
      parentsOf.get(tgt)?.push(src);
      childrenOf.get(src)?.push(tgt);
    });
    const roots = nodeList.filter(n => n.id === "g" || (parentsOf.get(n.id) || []).filter(p => idSet.has(p)).length === 0);
    const queue = roots.map(n => ({ id: n.id, depth: n.id === "g" ? 0 : 1 }));
    roots.forEach(n => depths.set(n.id, n.id === "g" ? 0 : 1));
    while (queue.length) {
      const { id, depth } = queue.shift();
      (childrenOf.get(id) || []).forEach(child => {
        const next = depth + 1;
        if (!depths.has(child) || depths.get(child) < next) {
          depths.set(child, next);
          queue.push({ id: child, depth: next });
        }
      });
    }
    nodeList.forEach(n => { if (!depths.has(n.id)) depths.set(n.id, Math.max(1, Math.round((n.age || 0) * 5))); });
    return depths;
  }

  function assignWebPositions(nodeList, linkList) {
    const depths = computeDepths(nodeList, linkList);
    const maxDepth = Math.max(...depths.values(), 1);
    const rings = {};
    nodeList.forEach(n => {
      const d = depths.get(n.id) ?? 1;
      n.depth = d;
      if (!rings[d]) rings[d] = [];
      rings[d].push(n);
    });
    Object.entries(rings).forEach(([depth, ringNodes]) => {
      const d = +depth;
      const radius = d === 0 ? 0 : (d / maxDepth) * maxR;
      ringNodes.forEach((n, i) => {
        const angle = (i / ringNodes.length) * Math.PI * 2 - Math.PI / 2 + d * 0.25;
        n.theta = angle;
        n.x = cx + (d === 0 ? 0 : radius * Math.cos(angle));
        n.y = cy + (d === 0 ? 0 : radius * Math.sin(angle));
      });
    });
  }

  const nodeRadius = d => d.id === "g" ? 10 : d.isTip ? 8 : d.id?.startsWith("s-") ? 3 : 5;
  const nodeLabel = d => {
    if (d.id === "g") return "GENESIS";
    if (d.isTip && d.id?.length > 8) return d.id.slice(0, 3) + ".." + d.id.slice(-3);
    return "";
  };

  const sim = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(34).strength(0.85))
    .force("charge", d3.forceManyBody().strength(-110))
    .force("radial", d3.forceRadial(d => {
      const depth = d.depth || 1;
      const maxDepth = Math.max(...nodes.map(n => n.depth || 1), 1);
      return depth === 0 ? 0 : (depth / maxDepth) * maxR;
    }, cx, cy).strength(0.75))
    .force("center", d3.forceCenter(cx, cy).strength(0.05))
    .force("collision", d3.forceCollide().radius(d => nodeRadius(d) + 10).iterations(2))
    .alphaDecay(0.025);

  sim.on("tick", () => {
    if (linkSel) linkSel.attr("d", d => {
      const sx = d.source.x ?? cx, sy = d.source.y ?? cy;
      const tx = d.target.x ?? cx, ty = d.target.y ?? cy;
      const mx = (sx + tx) / 2 + (ty - sy) * 0.08;
      const my = (sy + ty) / 2 - (tx - sx) * 0.08;
      return `M${sx},${sy} Q${mx},${my} ${tx},${ty}`;
    });
    if (nodeSel) {
      nodeSel.attr("transform", d => `translate(${d.x ?? cx}, ${d.y ?? cy})`);
      nodeSel.select(".n-halo").attr("r", d => nodeRadius(d) + (d.isTip ? 6 + Math.sin(Date.now() / 400) * 2 : 4));
    }
  });

  function update() {
    assignWebPositions(nodes, links);

    linkSel = linkG.selectAll(".l").data(links, d => (d.source.id || d.source) + "-" + (d.target.id || d.target));
    linkSel.exit().remove();
    const le = linkSel.enter().append("path").attr("class", "l")
      .attr("fill", "none").attr("stroke-linecap", "round");
    linkSel = le.merge(linkSel);
    linkSel.attr("stroke", d => d.stub ? "rgba(96,165,250,0.12)" : "rgba(59,130,246,0.35)")
      .attr("stroke-width", d => d.stub ? 0.6 : 1.2)
      .attr("stroke-dasharray", d => d.stub ? "3 5" : "none");

    nodeSel = nodeG.selectAll(".n").data(nodes, d => d.id);
    nodeSel.exit().remove();
    const ne = nodeSel.enter().append("g").attr("class", "n")
      .attr("transform", d => `translate(${d.x ?? cx}, ${d.y ?? cy})`)
      .style("cursor", "pointer");
    ne.append("circle").attr("class", "n-halo")
      .attr("r", d => nodeRadius(d) + 4)
      .attr("fill", d => d.isTip ? "rgba(59,130,246,0.18)" : "rgba(59,130,246,0.05)")
      .attr("stroke", "none").style("pointer-events", "none");
    ne.append("circle").attr("class", "n-core").attr("r", nodeRadius)
      .attr("fill", d => d.id === "g" ? "#3b82f6" : d.isTip ? "#60a5fa" : d.isReal ? "#0f172a" : "#1e293b")
      .attr("stroke", d => d.id === "g" ? "#93c5fd" : d.isTip ? "#ffffff" : d.isReal ? "#3b82f6" : "#475569")
      .attr("stroke-width", d => (d.isTip || d.id === "g") ? 2 : 1.2)
      .attr("filter", d => (d.isTip || d.id === "g") ? "url(#web-glow)" : null);
    ne.append("text").attr("class", "n-label")
      .attr("text-anchor", "middle").attr("dy", d => nodeRadius(d) + 11)
      .attr("font-size", d => d.id === "g" ? "8px" : "7px")
      .attr("font-family", "ui-monospace, monospace")
      .attr("font-weight", d => (d.isTip || d.id === "g") ? "700" : "500")
      .attr("fill", d => d.isTip ? "#93c5fd" : d.id === "g" ? "#60a5fa" : "transparent")
      .style("pointer-events", "none").text(nodeLabel);
    ne.append("title").text(d => d.id === "g" ? "Genesis" : d.id?.startsWith("s-") ? "External parent" : d.id);
    ne.on("click", (_ev, d) => {
      if (usingReal && d.isReal && d.id && !d.id.startsWith("s-") && d.id !== "g") {
        window.open(`https://node.sikka.click/tx/${d.id}`, "_blank");
      } else { addTx(); }
    });

    nodeSel = ne.merge(nodeSel);
    nodeSel.select(".n-core").attr("r", nodeRadius)
      .attr("filter", d => (d.isTip || d.id === "g") ? "url(#web-glow)" : null);
    nodeSel.select(".n-label").text(nodeLabel)
      .attr("fill", d => d.isTip ? "#93c5fd" : d.id === "g" ? "#60a5fa" : "transparent");

    sim.nodes(nodes);
    sim.force("link").links(links);
    sim.force("radial", d3.forceRadial(d => {
      const depth = d.depth || 1;
      const maxDepth = Math.max(...nodes.map(n => n.depth || 1), 1);
      return depth === 0 ? 0 : (depth / maxDepth) * maxR;
    }, cx, cy).strength(0.75));
    sim.alpha(0.9).restart();
  }

  function fromReal(txs, status) {
    const recent = txs.slice(-20);
    const idSet = new Set(recent.map(t => t.id));
    const tips = new Set(status.tips || []);
    nodes = []; links = [];
    recent.forEach((tx, i) => {
      const age = i / Math.max(1, recent.length - 1);
      nodes.push({ id: tx.id, age, isReal: true, isTip: tips.has(tx.id) });
      (tx.parents || []).forEach(p => {
        if (idSet.has(p)) links.push({ source: p, target: tx.id });
        else links.push({ source: "s-" + p.slice(0, 5), target: tx.id, stub: true });
      });
    });
    const stubs = new Set(links.filter(l => l.stub).map(l => l.source));
    stubs.forEach(s => nodes.push({ id: s, age: 0, isReal: false, isTip: false }));
    update();
    usingReal = true;
    updateStats(status);
    const st = document.getElementById("hero-dag-stats");
    if (st) {
      st.classList.add("connected");
      st.textContent = `● Synced — ${(status.dag_size || 0).toLocaleString()} txs · ${status.tip_count || "?"} tips`;
    }
  }

  function dummy() {
    nodes = [{ id: "g", age: 0, isReal: false, isTip: false }];
    links = [];
    for (let i = 0; i < 18; i++) {
      const nid = "d" + i;
      const p1 = i < 2 ? "g" : "d" + (i - 1 - (i % 2));
      const p2 = i < 3 ? "g" : "d" + Math.max(0, i - 2);
      nodes.push({ id: nid, age: (i + 1) / 18, isReal: false, isTip: i === 17 });
      links.push({ source: p1, target: nid });
      if (p2 !== p1) links.push({ source: p2, target: nid });
    }
    nodes.forEach(n => { if (n.id !== "d17") n.isTip = false; });
    update();
    usingReal = false;
  }

  function addTx() {
    nodes.forEach(n => (n.isTip = false));
    if (nodes.length > 25) {
      const old = nodes.find(n => !n.isTip && n.id !== "g" && !n.id?.startsWith("s-"));
      if (old) {
        nodes = nodes.filter(n => n.id !== old.id);
        links = links.filter(l => (l.source.id || l.source) !== old.id && (l.target.id || l.target) !== old.id);
      }
    }
    const tips = nodes.filter(n => n.depth === Math.max(...nodes.map(x => x.depth || 0)) || n.isTip);
    const p1 = tips[tips.length - 1] || nodes[nodes.length - 1] || nodes[0];
    const p2 = tips[tips.length - 2] || nodes[Math.max(0, nodes.length - 3)] || nodes[0];
    const nid = "l" + Date.now().toString(36).slice(-4);
    nodes.push({ id: nid, age: 1, isReal: false, isTip: true });
    links.push({ source: p1.id, target: nid });
    if (p2.id !== p1.id) links.push({ source: p2.id, target: nid });
    update();
  }

  drawWebBg();
  dummy();

  async function buildDeepGraph() {
    try {
      const sRes = await fetch("https://node.sikka.click/v1/status", { cache: "no-store" });
      if (!sRes.ok) return;
      const status = await sRes.json();
      const tips = status.tips || [];
      if (tips.length === 0) return;
      const txMap = new Map();
      const queue = [...tips];
      const maxNodes = 25;
      while (queue.length > 0 && txMap.size < maxNodes) {
        const txid = queue.shift();
        if (txMap.has(txid)) continue;
        try {
          const txRes = await fetch(`https://node.sikka.click/v1/tx/${txid}`, { cache: "no-store" });
          if (!txRes.ok) continue;
          const tx = await txRes.json();
          txMap.set(txid, tx);
          if (tx.parents) for (const p of tx.parents) {
            if (!txMap.has(p) && !queue.includes(p)) queue.push(p);
          }
        } catch {}
      }
      const txs = Array.from(txMap.values()).reverse();
      if (txs.length > 2) fromReal(txs, status);
    } catch {}
  }

  buildDeepGraph();
  setInterval(() => { if (usingReal) buildDeepGraph(); }, 8000);
  setInterval(() => { if (!usingReal) addTx(); }, 2000);

  const ro = new ResizeObserver(() => {
    w = container.clientWidth;
    h = container.clientHeight || 480;
    cx = w / 2; cy = h / 2;
    maxR = Math.min(w, h) * 0.38;
    svg.attr("viewBox", `0 0 ${w} ${h}`);
    drawWebBg();
    assignWebPositions(nodes, links);
    sim.force("radial", d3.forceRadial(d => {
      const depth = d.depth || 1;
      const maxDepth = Math.max(...nodes.map(n => n.depth || 1), 1);
      return depth === 0 ? 0 : (depth / maxDepth) * maxR;
    }, cx, cy).strength(0.75));
    sim.force("center", d3.forceCenter(cx, cy).strength(0.05));
    sim.alpha(0.4).restart();
  });
  ro.observe(container);
}

function updateStats(status) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  const dagSize = status.dag_size ?? "?";
  const tipCount = status.tip_count ?? "?";
  const pow = status.submit_pow_base_bits ?? "?";
  const work = status.submit_pow_bucket_work_factor ?? "?";

  const dagStr = typeof dagSize === "number" ? dagSize.toLocaleString() : dagSize;
  const tipStr = typeof tipCount === "number" ? tipCount.toLocaleString() : tipCount;

  set("stat-dag-size", dagStr);
  set("stat-tip-count", tipStr);
  set("stat-pow", pow);
  set("stat-work", work);
  set("dash-dag-size", dagStr);
  set("dash-tip-count", tipStr);

  const label = document.getElementById("dash-dag-label");
  if (label && typeof dagSize === "number") {
    label.textContent = `DAG Block ${dagSize.toLocaleString()}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("hero-dag")) initHeroDagViz();
});
import "./style.css";

/* =========================================================================
 * Zentile — Modern 15 Puzzle
 * Pure vanilla JS. Touch + mouse + keyboard. Smooth animated tile sliding.
 * Empty cell is fixed at top-left in the SOLVED state (index 0).
 * ========================================================================= */

const app = document.getElementById("app");

const STORAGE_KEY = "zentile.best.v1";
const SIZES = [
  { n: 3, label: "3 × 3", meta: "8 tiles · Easy" },
  { n: 4, label: "4 × 4", meta: "15 tiles · Classic" },
  { n: 5, label: "5 × 5", meta: "24 tiles · Hard" },
  { n: 6, label: "6 × 6", meta: "35 tiles · Expert" },
];

/* ---------------- App router (very small) ---------------- */
let currentPage = null;

function footerHTML() {
  return `
    <footer class="site-footer">
      <span>© ${new Date().getFullYear()} Zentile</span>
      <span class="foot-links">
        <a href="/privacy.html">Privacy Policy</a>
        <span aria-hidden="true">·</span>
        <a href="/terms.html">Terms &amp; Conditions</a>
      </span>
    </footer>
  `;
}

function aboutHTML() {
  return `
    <section class="about-section" aria-labelledby="about-title">
      <span class="about-eyebrow">About Zentile</span>
      <h2 id="about-title" class="about-title">Everything you need to know about Zentile</h2>

      <div class="about-grid">
        <article class="about-card">
          <h3>What is Zentile?</h3>
          <p>
            Zentile is a modern, beautifully crafted version of the classic sliding tile puzzle — also known as the 15 puzzle. Your goal is simple: slide the numbered tiles around the board until they line up in ascending order, with the empty space resting at the top-left corner. There is nothing to install, no account to create, and no distractions to fight through. Just open Zentile in any browser, pick a board, and start solving.
          </p>
        </article>

        <article class="about-card">
          <h3>3 × 3, 4 × 4, 5 × 5 and 6 × 6 puzzles</h3>
          <p>
            Pick the board size that matches your mood. The 3 × 3 grid (8 tiles) is a quick warm-up, perfect for a one-minute brain break. The 4 × 4 grid (15 tiles) is the original 15 puzzle from the 1870s — a true classic. The 5 × 5 board (24 tiles) is a real test of patience and planning, while the 6 × 6 board (35 tiles) is reserved for expert solvers who love a serious challenge.
          </p>
        </article>

        <article class="about-card">
          <h3>Features built for smooth play</h3>
          <p>
            Zentile is fully responsive on phones, tablets, and desktops. Tap or click a tile to slide it, swipe and drag entire rows or columns with your finger or mouse, or use the arrow keys for precise keyboard control. Tiles glide with smooth, GPU-accelerated animations, and the layout recalculates instantly when you rotate or resize your screen. A clean dark theme keeps your eyes comfortable in any lighting.
          </p>
        </article>

        <article class="about-card">
          <h3>Why choose Zentile</h3>
          <p>
            Zentile is free forever, runs entirely in your browser, and works offline once loaded. There are no advertisements, no pop-ups, no sign-ups, and no tracking — your best times are saved locally on your device, never on a server. It is built for everyone: casual players seeking a moment of calm, parents introducing kids to a timeless classic, and competitive solvers chasing that perfect run.
          </p>
        </article>

        <article class="about-card about-card--wide">
          <h3>Puzzle benefits — logic, memory and speed</h3>
          <p>
            Sliding puzzles are pure logic with zero noise. Each move trains spatial reasoning and pattern recognition as you plan several steps ahead. Regular play has long been linked to sharper short-term memory, faster problem-solving, and improved focus. As you learn the classic solving techniques, you will notice your speed climbing and your move counts dropping — a small, satisfying win every single session. Pick a board above, take a breath, and slide your way to a clearer mind.
          </p>
        </article>
      </div>
    </section>
  `;
}

function renderHome() {
  cleanup();
  currentPage = "home";

  app.innerHTML = `
    <header class="site-header">
      <a class="brand" href="/" data-route="home" aria-label="Zentile home">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.4"/>
            <rect x="14" y="3" width="7" height="7" rx="1.4"/>
            <rect x="3" y="14" width="7" height="7" rx="1.4"/>
          </svg>
        </span>
        <span>
          <div class="brand-name">Zentile</div>
          <div class="brand-tag">The modern 15 puzzle</div>
        </span>
      </a>
    </header>

    <main class="home">
      <span class="hero-eyebrow"><span class="hero-dot"></span> Sliding tile puzzle</span>
      <h1 class="hero-title">Solve. Slide. Smile.</h1>
      <p class="hero-sub">
        A beautifully crafted sliding puzzle that runs on any device.
        Pick a board size to begin — the empty tile starts at the top-left.
      </p>

      <div class="size-label">Choose your board</div>
      <div class="size-grid" role="list">
        ${SIZES.map(s => sizeCardHTML(s)).join("")}
      </div>

      <div class="home-foot">Best times saved on this device · Keyboard arrows supported</div>
    </main>

    ${aboutHTML()}

    ${footerHTML()}
  `;

  // Attach handlers
  app.querySelectorAll("[data-size]").forEach(el => {
    const n = Number(el.getAttribute("data-size"));
    el.addEventListener("click", () => renderGame(n));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); renderGame(n); }
    });
  });
  app.querySelector('[data-route="home"]').addEventListener("click", (e) => {
    e.preventDefault();
    renderHome();
  });

  document.title = "Zentile — Choose Your Board | 3×3, 4×4, 5×5, 6×6 Sliding Puzzle";
}

function sizeCardHTML({ n, label, meta }) {
  const cells = n * n;
  const mini = Array.from({ length: cells }, (_, i) =>
    `<span class="${i === 0 ? "empty" : ""}"></span>`
  ).join("");
  const best = getBest(n);
  return `
    <button class="size-card" role="listitem" data-size="${n}" aria-label="Play ${label}">
      <div class="size-mini" style="grid-template-columns: repeat(${n}, 1fr); grid-template-rows: repeat(${n}, 1fr);">
        ${mini}
      </div>
      <div class="size-name">${label}</div>
      <div class="size-meta">${meta}${best ? ` · Best ${best.moves}m / ${formatTime(best.time)}` : ""}</div>
    </button>
  `;
}

/* =========================================================================
 * Game
 * ========================================================================= */
let game = null;

function renderGame(n) {
  cleanup();
  currentPage = "game";

  app.innerHTML = `
    <header class="site-header">
      <a class="brand" href="/" data-route="home" aria-label="Zentile home">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.4"/>
            <rect x="14" y="3" width="7" height="7" rx="1.4"/>
            <rect x="3" y="14" width="7" height="7" rx="1.4"/>
          </svg>
        </span>
        <span>
          <div class="brand-name">Zentile</div>
          <div class="brand-tag">${n} × ${n}</div>
        </span>
      </a>
    </header>

    <main class="game">
      <div class="game-bar" role="toolbar" aria-label="Game controls">
        <button class="icon-btn" id="back-btn" aria-label="Back to home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div class="stats" aria-live="polite">
          <div class="stat"><span class="stat-label">Moves</span><span class="stat-value" id="moves">0</span></div>
          <div class="stat"><span class="stat-label">Time</span><span class="stat-value" id="time">0:00</span></div>
          <div class="stat"><span class="stat-label">Best</span><span class="stat-value" id="best">—</span></div>
        </div>
        <button class="icon-btn" id="shuffle-btn" aria-label="Shuffle board">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
        </button>
      </div>

      <div class="board-wrap">
        <div class="board" id="board" aria-label="${n} by ${n} sliding puzzle"></div>
      </div>
    </main>

    ${footerHTML()}
  `;

  app.querySelector('[data-route="home"]').addEventListener("click", (e) => {
    e.preventDefault();
    renderHome();
  });
  document.getElementById("back-btn").addEventListener("click", renderHome);
  document.getElementById("shuffle-btn").addEventListener("click", () => game.shuffle(true));

  game = new Puzzle(n, document.getElementById("board"));
  game.mount();
  game.shuffle(true);

  document.title = `Zentile ${n}×${n} — Play the Sliding Puzzle`;
}

/* =========================================================================
 * Puzzle Engine
 * ========================================================================= */
class Puzzle {
  constructor(n, boardEl) {
    this.n = n;
    this.board = boardEl;
    this.tiles = [];          // array of tile objects { value, el, pos }
    this.grid = [];           // length n*n; values (1..n*n-1) and 0 for empty
    this.emptyIdx = 0;
    this.moves = 0;
    this.startTime = 0;
    this.timer = null;
    this.solved = false;
    this.gap = 0;
    this.cellSize = 0;
    this.dragState = null;

    this.movesEl = document.getElementById("moves");
    this.timeEl = document.getElementById("time");
    this.bestEl = document.getElementById("best");
    this.updateBestDisplay();

    this._onResize = this._onResize.bind(this);
    this._onKey = this._onKey.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
  }

  mount() {
    // Build initial solved order: [0,1,2,...,n*n-1] where 0 = empty (top-left)
    this.grid = Array.from({ length: this.n * this.n }, (_, i) => i);
    this.emptyIdx = 0;

    // Compute responsive layout
    this._layout();

    // Create tile DOM nodes
    this.board.innerHTML = "";
    this.tiles = [];
    for (let v = 1; v < this.n * this.n; v++) {
      const el = document.createElement("div");
      el.className = "tile";
      el.textContent = String(v);
      el.setAttribute("data-value", String(v));
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "-1");
      el.setAttribute("aria-label", `Tile ${v}`);
      this.board.appendChild(el);
      this.tiles.push({ value: v, el });
    }

    this._placeAll(false);

    // Listeners
    window.addEventListener("resize", this._onResize, { passive: true });
    window.addEventListener("keydown", this._onKey);
    this.board.addEventListener("pointerdown", this._onPointerDown);
  }

  _layout() {
    const rect = this.board.getBoundingClientRect();
    // padding/gap adapts to size — smaller boards have larger gap
    this.gap = Math.max(4, Math.round(rect.width * (this.n <= 4 ? 0.018 : 0.012)));
    this.board.style.setProperty("--gap", this.gap + "px");
    const inner = rect.width - this.gap * 2;
    this.cellSize = (inner - this.gap * (this.n - 1)) / this.n;
  }

  _onResize() {
    this._layout();
    this._placeAll(false);
  }

  _placeAll(animated) {
    for (let i = 0; i < this.grid.length; i++) {
      const v = this.grid[i];
      if (v === 0) continue;
      const tile = this.tiles[v - 1];
      this._placeTile(tile, i, animated);
    }
  }

  _placeTile(tile, idx, animated) {
    const { x, y } = this._coordOf(idx);
    const tx = `translate3d(${x}px, ${y}px, 0)`;
    tile.el.style.setProperty("--tx", tx);
    tile.el.style.transform = tx;
    tile.el.style.width = this.cellSize + "px";
    tile.el.style.height = this.cellSize + "px";
    tile.el.style.transition = animated
      ? "transform var(--tile-anim), background var(--tile-anim), box-shadow var(--tile-anim)"
      : "none";
    tile.el.classList.remove("dragging");

    // Mark whether tile is in its solved position (value v should sit at index v)
    if (tile.value === idx) tile.el.classList.add("placed");
    else tile.el.classList.remove("placed");
  }

  _markMovable() {
    // Highlight tiles that share row/column with empty (gives mouse users a clear hover hint)
    const n = this.n;
    const er = Math.floor(this.emptyIdx / n), ec = this.emptyIdx % n;
    for (let i = 0; i < this.grid.length; i++) {
      const v = this.grid[i];
      if (v === 0) continue;
      const r = Math.floor(i / n), c = i % n;
      const movable = !this.solved && (r === er || c === ec);
      this.tiles[v - 1].el.classList.toggle("movable", movable);
    }
  }

  _coordOf(idx) {
    const r = Math.floor(idx / this.n);
    const c = idx % this.n;
    return {
      x: this.gap + c * (this.cellSize + this.gap) - this.gap,
      y: this.gap + r * (this.cellSize + this.gap) - this.gap,
    };
    // Note: gap is already applied via padding on the board; net offset is c*(size+gap)
  }

  /* ---------------- Movement ---------------- */
  _neighbors(idx) {
    const r = Math.floor(idx / this.n), c = idx % this.n;
    const out = [];
    if (r > 0)             out.push(idx - this.n);
    if (r < this.n - 1)    out.push(idx + this.n);
    if (c > 0)             out.push(idx - 1);
    if (c < this.n - 1)    out.push(idx + 1);
    return out;
  }

  _isMovable(idx) {
    return this._neighbors(this.emptyIdx).includes(idx);
  }

  /**
   * Slide tiles in a row/column toward the empty cell.
   * If the clicked tile shares a row/column with the empty cell,
   * all tiles between them shift by one toward the empty.
   */
  _slideTowardEmpty(targetIdx) {
    if (this.solved) return false;
    const n = this.n;
    const tr = Math.floor(targetIdx / n), tc = targetIdx % n;
    const er = Math.floor(this.emptyIdx / n), ec = this.emptyIdx % n;
    if (targetIdx === this.emptyIdx) return false;

    let path = [];
    if (tr === er) {
      const step = tc < ec ? -1 : 1; // direction empty moves toward target
      for (let c = ec + step; c !== tc + step; c += step) path.push(tr * n + c);
    } else if (tc === ec) {
      const step = tr < er ? -1 : 1;
      for (let r = er + step; r !== tr + step; r += step) path.push(r * n + tc);
    } else {
      return false;
    }

    // Move each tile along the path one cell toward where empty currently is.
    // Process tiles in order from nearest-to-empty to farthest.
    for (const idx of path) {
      this._swapEmptyWith(idx);
    }
    this.moves += path.length;
    this._updateMoves();
    this._startTimerIfNeeded();
    this._checkSolved();
    this._markMovable();
    return true;
  }

  _swapEmptyWith(idx) {
    const v = this.grid[idx];
    if (v === 0) return;
    this.grid[this.emptyIdx] = v;
    this.grid[idx] = 0;
    const tile = this.tiles[v - 1];
    this._placeTile(tile, this.emptyIdx, true);
    this.emptyIdx = idx;
  }

  /* ---------------- Pointer / Touch / Mouse ---------------- *
   * Tiles can be slid by either:
   *   (a) clicking/tapping a tile in the empty's row or column
   *   (b) dragging a tile (mouse or touch) toward the empty cell —
   *       the tile and any tiles between it and the empty follow the
   *       cursor in real time, and commit on release if dragged far enough.
   */

  /** Build chain of grid indices from target → toward empty (target included, empty excluded).
   *  Returns null if target is not in the same row/col as empty. */
  _slideChain(targetIdx) {
    if (targetIdx === this.emptyIdx) return null;
    const n = this.n;
    const tr = Math.floor(targetIdx / n), tc = targetIdx % n;
    const er = Math.floor(this.emptyIdx / n), ec = this.emptyIdx % n;
    const chain = [];
    if (tr === er) {
      const step = tc < ec ? 1 : -1;       // how columns advance from target → empty
      const dir = step;                    // visual movement direction along x: +1 right, -1 left
      for (let c = tc; c !== ec; c += step) chain.push(tr * n + c);
      return { axis: "x", dir, chain };
    }
    if (tc === ec) {
      const step = tr < er ? 1 : -1;
      const dir = step;
      for (let r = tr; r !== er; r += step) chain.push(r * n + tc);
      return { axis: "y", dir, chain };
    }
    return null;
  }

  _onPointerDown(e) {
    if (this.solved) return;
    const tileEl = e.target.closest(".tile");
    if (!tileEl) return;
    const value = Number(tileEl.getAttribute("data-value"));
    const idx = this.grid.indexOf(value);
    const slide = this._slideChain(idx);

    e.preventDefault();
    try { tileEl.setPointerCapture(e.pointerId); } catch {}

    this.dragState = {
      pointerId: e.pointerId,
      tileEl,
      value,
      startIdx: idx,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      slide,        // null if tile is not slidable (different row & column than empty)
      offset: 0,
    };

    if (slide) {
      // Mark all chain tiles as actively being dragged (no transition during follow)
      for (const cellIdx of slide.chain) {
        const v = this.grid[cellIdx];
        if (v === 0) continue;
        const t = this.tiles[v - 1];
        t.el.classList.add("dragging");
        t.el.style.transition = "none";
      }
    }

    window.addEventListener("pointermove", this._onPointerMove, { passive: false });
    window.addEventListener("pointerup", this._onPointerUp);
    window.addEventListener("pointercancel", this._onPointerUp);
  }

  _onPointerMove(e) {
    const ds = this.dragState;
    if (!ds || e.pointerId !== ds.pointerId) return;
    const dx = e.clientX - ds.startX;
    const dy = e.clientY - ds.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) ds.moved = true;
    if (!ds.slide) return;

    e.preventDefault();
    const max = this.cellSize + this.gap;
    const delta = ds.slide.axis === "x" ? dx : dy;
    // Positive when dragging in the slide direction; clamp [0, max]
    let offset = delta * ds.slide.dir;
    offset = Math.max(0, Math.min(max, offset));
    ds.offset = offset;

    for (const cellIdx of ds.slide.chain) {
      const v = this.grid[cellIdx];
      if (v === 0) continue;
      const tile = this.tiles[v - 1];
      const base = this._coordOf(cellIdx);
      const ox = ds.slide.axis === "x" ? offset * ds.slide.dir : 0;
      const oy = ds.slide.axis === "y" ? offset * ds.slide.dir : 0;
      tile.el.style.transform = `translate3d(${base.x + ox}px, ${base.y + oy}px, 0)`;
    }
  }

  _onPointerUp(e) {
    const ds = this.dragState;
    if (!ds || e.pointerId !== ds.pointerId) return;
    this.dragState = null;
    window.removeEventListener("pointermove", this._onPointerMove);
    window.removeEventListener("pointerup", this._onPointerUp);
    window.removeEventListener("pointercancel", this._onPointerUp);

    // Clean up dragging class on all tiles
    this.board.querySelectorAll(".tile.dragging").forEach(el => el.classList.remove("dragging"));

    if (!ds.slide) {
      // Tile not in same row/col as empty — ignore (no slide possible)
      return;
    }

    const idx = this.grid.indexOf(ds.value);
    if (idx === -1) return;

    const max = this.cellSize + this.gap;
    const passedThreshold = ds.offset > max * 0.4;

    if (!ds.moved || passedThreshold) {
      // Click without drag = full slide; or drag past 40% threshold = commit slide
      this._slideTowardEmpty(idx);
    } else {
      // Snap back to original positions
      this._placeAll(true);
    }
  }

  _slideByDirection(dir) {
    const n = this.n;
    const er = Math.floor(this.emptyIdx / n), ec = this.emptyIdx % n;
    let target = -1;
    if (dir === "right" && ec > 0)        target = er * n + (ec - 1);
    else if (dir === "left" && ec < n - 1) target = er * n + (ec + 1);
    else if (dir === "down" && er > 0)    target = (er - 1) * n + ec;
    else if (dir === "up" && er < n - 1)  target = (er + 1) * n + ec;
    if (target !== -1) {
      this._swapEmptyWith(target);
      this.moves += 1;
      this._updateMoves();
      this._startTimerIfNeeded();
      this._checkSolved();
      this._markMovable();
    }
  }

  _onKey(e) {
    if (currentPage !== "game" || this.solved) return;
    const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
    const dir = map[e.key];
    if (!dir) return;
    e.preventDefault();
    this._slideByDirection(dir);
  }

  /* ---------------- Shuffle (always solvable) ---------------- */
  shuffle(animated) {
    this._stopTimer();
    this.moves = 0;
    this.solved = false;
    this.board.classList.remove("solved");
    this.startTime = 0;
    this._updateMoves();
    this._updateTime(0);

    // Reset to solved
    this.grid = Array.from({ length: this.n * this.n }, (_, i) => i);
    this.emptyIdx = 0;

    // Random walk: perform many legal moves to guarantee solvability
    const steps = this.n * this.n * 40;
    let lastEmpty = -1;
    for (let i = 0; i < steps; i++) {
      const neigh = this._neighbors(this.emptyIdx).filter(x => x !== lastEmpty);
      const pick = neigh[Math.floor(Math.random() * neigh.length)];
      lastEmpty = this.emptyIdx;
      this._swapNoAnim(pick);
    }
    if (this._isSolved()) {
      // Extremely unlikely, but bump once more
      const neigh = this._neighbors(this.emptyIdx);
      this._swapNoAnim(neigh[0]);
    }

    this._placeAll(animated);
    this._markMovable();
  }

  _swapNoAnim(idx) {
    const v = this.grid[idx];
    this.grid[this.emptyIdx] = v;
    this.grid[idx] = 0;
    this.emptyIdx = idx;
  }

  _isSolved() {
    if (this.grid[0] !== 0) return false;
    for (let i = 1; i < this.grid.length; i++) {
      if (this.grid[i] !== i) return false;
    }
    return true;
  }

  _checkSolved() {
    if (!this._isSolved()) return;
    this.solved = true;
    this._stopTimer();
    this.board.classList.add("solved");
    const elapsed = Date.now() - (this.startTime || Date.now());
    const isBest = recordBest(this.n, { moves: this.moves, time: elapsed });
    this.updateBestDisplay();
    setTimeout(() => showWinOverlay(this.n, this.moves, elapsed, isBest), 380);
    launchConfetti();
  }

  /* ---------------- Timer ---------------- */
  _startTimerIfNeeded() {
    if (this.timer || this.solved) return;
    this.startTime = Date.now();
    this.timer = setInterval(() => {
      this._updateTime(Date.now() - this.startTime);
    }, 250);
  }
  _stopTimer() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }
  _updateTime(ms) { this.timeEl.textContent = formatTime(ms); }
  _updateMoves() { this.movesEl.textContent = String(this.moves); }
  updateBestDisplay() {
    const best = getBest(this.n);
    this.bestEl.textContent = best ? `${best.moves}m / ${formatTime(best.time)}` : "—";
  }

  destroy() {
    this._stopTimer();
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("keydown", this._onKey);
    window.removeEventListener("pointermove", this._onPointerMove);
    window.removeEventListener("pointerup", this._onPointerUp);
    window.removeEventListener("pointercancel", this._onPointerUp);
    if (this.board) this.board.removeEventListener("pointerdown", this._onPointerDown);
  }
}

/* =========================================================================
 * Win overlay & confetti
 * ========================================================================= */
function showWinOverlay(n, moves, ms, isBest) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="You solved the puzzle">
      <h2 class="modal-title">${isBest ? "New best!" : "Solved!"}</h2>
      <p class="modal-sub">You completed the ${n} × ${n} puzzle.</p>
      <div class="modal-stats">
        <div class="modal-stat"><div class="v">${moves}</div><div class="l">Moves</div></div>
        <div class="modal-stat"><div class="v">${formatTime(ms)}</div><div class="l">Time</div></div>
      </div>
      <div class="btn-row">
        <button class="btn" id="ov-home">Choose Size</button>
        <button class="btn primary" id="ov-again">Play Again</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector("#ov-again").addEventListener("click", () => {
    overlay.remove();
    if (game) game.shuffle(true);
  });
  overlay.querySelector("#ov-home").addEventListener("click", () => {
    overlay.remove();
    renderHome();
  });
}

function launchConfetti() {
  const wrap = document.createElement("div");
  wrap.className = "confetti";
  const colors = ["#7c3aed", "#06b6d4", "#ec4899", "#f59e0b", "#10b981", "#ffffff"];
  const count = 90;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("i");
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = (1.6 + Math.random() * 1.6) + "s";
    piece.style.animationDelay = (Math.random() * 0.4) + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    wrap.appendChild(piece);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 3500);
}

/* =========================================================================
 * Helpers
 * ========================================================================= */
function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getBests() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}
function getBest(n) {
  const all = getBests();
  return all[String(n)] || null;
}
function recordBest(n, record) {
  const all = getBests();
  const key = String(n);
  const cur = all[key];
  // "Best" = fewer moves; ties broken by faster time
  let isBest = false;
  if (!cur) isBest = true;
  else if (record.moves < cur.moves) isBest = true;
  else if (record.moves === cur.moves && record.time < cur.time) isBest = true;
  if (isBest) {
    all[key] = record;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch {}
  }
  return isBest;
}

function cleanup() {
  if (game) {
    game.destroy();
    game = null;
  }
  // Remove any leftover overlays / confetti
  document.querySelectorAll(".overlay, .confetti").forEach(n => n.remove());
}

/* =========================================================================
 * Boot
 * ========================================================================= */
function boot() {
  const hash = window.location.hash.replace("#", "");
  const m = hash.match(/^play\/(\d+)$/);
  if (m) {
    const n = Number(m[1]);
    if (SIZES.some(s => s.n === n)) { renderGame(n); return; }
  }
  renderHome();
}
window.addEventListener("hashchange", boot);
boot();

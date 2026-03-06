import "./styles/index.scss";

// ============================================================
// Spindle RPG UI — Panel System
// ============================================================
// The HUD (resource bars, character info, nav) lives in the
// StoryInterface passage and uses native Spindle macros.
// This script only handles the slide-out panel drawers for
// Skills, Inventory, Journal, Character, and Settings.
// ============================================================

const ICONS: Record<string, string> = {
  hp: "\u2764",
  mp: "\u2666",
  sta: "\u26A1",
  xp: "\u2605",
  gold: "\u2B22",
  character: "\uD83D\uDC64",
  sword: "\u2694",
  shield: "\uD83D\uDEE1",
  potion: "\uD83E\uDDEA",
  scroll: "\uD83D\uDCDC",
  ring: "\uD83D\uDC8D",
  torch: "\uD83D\uDD25",
  close: "\u2715",
};

const ITEM_ICONS: Record<string, string> = {
  weapon: ICONS.sword,
  armor: ICONS.shield,
  consumable: ICONS.potion,
  quest: ICONS.scroll,
  accessory: ICONS.ring,
  utility: ICONS.torch,
};

let activePanel = "none";

function sv(name: string): any {
  try { return window.Story?.get(name); } catch { return undefined; }
}

function pct(val: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, (val / max) * 100));
}

function esc(str: string): string {
  const el = document.createElement("span");
  el.textContent = str;
  return el.innerHTML;
}

// ============================================================
// Panel overlay + drawer (created once)
// ============================================================

function createPanelElements(): void {
  const overlay = document.createElement("div");
  overlay.className = "rpg-panel-overlay";
  overlay.id = "rpg-panel-overlay";
  overlay.addEventListener("click", closePanel);

  const panel = document.createElement("div");
  panel.className = "rpg-panel";
  panel.id = "rpg-panel";
  panel.innerHTML = `
    <div class="panel-header">
      <h2 id="panel-title">Panel</h2>
      <button class="panel-close" id="panel-close" aria-label="Close">${ICONS.close}</button>
    </div>
    <div class="panel-body" id="panel-body"></div>
  `;
  panel.querySelector("#panel-close")!.addEventListener("click", closePanel);

  document.body.appendChild(overlay);
  document.body.appendChild(panel);
}

// ============================================================
// Panel open/close
// ============================================================

function togglePanel(panelId: string): void {
  if (activePanel === panelId) { closePanel(); return; }
  openPanel(panelId);
}

function openPanel(panelId: string): void {
  activePanel = panelId;

  const overlay = document.getElementById("rpg-panel-overlay")!;
  const panel = document.getElementById("rpg-panel")!;
  const title = document.getElementById("panel-title")!;
  const body = document.getElementById("panel-body")!;

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", (btn as HTMLElement).dataset.panel === panelId);
  });

  const titles: Record<string, string> = {
    character: "Character", skills: "Skills",
    inventory: "Inventory", journal: "Journal", settings: "Settings",
  };
  title.textContent = titles[panelId] || "Panel";
  body.innerHTML = renderPanelContent(panelId);

  overlay.classList.add("open");
  panel.classList.add("open");
}

function closePanel(): void {
  activePanel = "none";
  document.getElementById("rpg-panel-overlay")?.classList.remove("open");
  document.getElementById("rpg-panel")?.classList.remove("open");
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"));
}

// ============================================================
// Panel content renderers
// ============================================================

function renderPanelContent(id: string): string {
  switch (id) {
    case "character": return renderCharacter();
    case "skills":    return renderSkills();
    case "inventory": return renderInventory();
    case "journal":   return renderJournal();
    case "settings":  return renderSettings();
    default:          return "";
  }
}

function renderCharacter(): string {
  const name = sv("playerName") || "Unknown";
  const cls = sv("playerClass") || "Adventurer";
  const level = sv("level") || 1;
  const hp = sv("hp") || 0, hpMax = sv("hpMax") || 1;
  const mp = sv("mp") || 0, mpMax = sv("mpMax") || 1;
  const sta = sv("stamina") || 0, staMax = sv("staminaMax") || 1;
  const xp = sv("xp") || 0, xpMax = sv("xpMax") || 1;
  const gold = sv("gold") || 0;

  return `
    <div class="char-stats">
      <div class="char-portrait">
        <div class="char-portrait-frame">${ICONS.character}</div>
        <div class="char-name-display">${esc(name)}</div>
        <div class="char-class-display">${esc(cls)} &middot; Level ${level}</div>
      </div>
      <div class="char-resource-bars">
        ${charBar("Health", ICONS.hp, hp, hpMax, "hp")}
        ${charBar("Mana", ICONS.mp, mp, mpMax, "mp")}
        ${charBar("Stamina", ICONS.sta, sta, staMax, "sta")}
        ${charBar("Experience", ICONS.xp, xp, xpMax, "xp")}
      </div>
      <div>
        <div class="char-stat-row"><span class="char-stat-label">Gold</span><span class="char-stat-value">${ICONS.gold} ${gold}</span></div>
        <div class="char-stat-row"><span class="char-stat-label">Level</span><span class="char-stat-value">${level}</span></div>
        <div class="char-stat-row"><span class="char-stat-label">Class</span><span class="char-stat-value">${esc(cls)}</span></div>
      </div>
    </div>`;
}

function charBar(label: string, icon: string, val: number, max: number, cls: string): string {
  return `<div class="char-bar-row">
    <div class="char-bar-label"><span>${icon} ${label}</span><span>${val} / ${max}</span></div>
    <div class="char-bar resource-bar ${cls}"><div class="resource-bar-fill" style="width:${pct(val, max)}%"></div></div>
  </div>`;
}

function renderSkills(): string {
  const skills: any[] = sv("skills") || [];
  if (!skills.length) return '<p style="color:var(--text-muted)">No skills learned yet.</p>';
  return `<div class="skill-list">${skills.map((s) => `
    <div class="skill-card">
      <div class="skill-card-header">
        <span class="skill-name">${esc(s.name)}</span>
        <span class="skill-cost">${s.cost} MP</span>
      </div>
      <span class="skill-type ${s.type}">${s.type}</span>
      <div class="skill-desc">${esc(s.desc)}</div>
    </div>`).join("")}</div>`;
}

function renderInventory(): string {
  const inv: any[] = sv("inventory") || [];
  if (!inv.length) return '<p style="color:var(--text-muted)">Your pack is empty.</p>';

  const groups: Record<string, any[]> = {};
  const typeOrder = ["weapon", "armor", "accessory", "consumable", "quest", "utility"];
  for (const item of inv) {
    const t = item.type || "misc";
    if (!groups[t]) groups[t] = [];
    groups[t].push(item);
  }

  let html = '<div class="inventory-grid">';
  for (const type of typeOrder) {
    const items = groups[type];
    if (!items) continue;
    html += `<div class="inventory-category">
      <div class="inventory-category-header">${type.charAt(0).toUpperCase() + type.slice(1)}s</div>
      ${items.map((item) => `
        <div class="inventory-item">
          <div class="item-icon">${ITEM_ICONS[item.type] || "\u2B1B"}</div>
          <div class="item-info">
            <div class="item-name">${esc(item.name)}</div>
            <div class="item-desc">${esc(item.desc || "")}</div>
          </div>
          ${item.qty > 1 ? `<div class="item-qty">x${item.qty}</div>` : ""}
        </div>`).join("")}
    </div>`;
  }
  return html + "</div>";
}

function renderJournal(): string {
  const journal: any[] = sv("journal") || [];
  if (!journal.length) return '<p style="color:var(--text-muted)">No journal entries yet.</p>';

  const active = journal.filter((j) => j.status === "active");
  const complete = journal.filter((j) => j.status === "complete");

  let html = '<div class="journal-list">';
  if (active.length) {
    html += '<div class="journal-section-title">Active Quests</div>';
    html += active.map((j) => journalCard(j, false)).join("");
  }
  if (complete.length) {
    html += '<div class="journal-section-title">Completed</div>';
    html += complete.map((j) => journalCard(j, true)).join("");
  }
  return html + "</div>";
}

function journalCard(j: any, done: boolean): string {
  return `<div class="journal-entry${done ? " complete" : ""}">
    <div class="journal-entry-header">
      <span class="journal-status ${done ? "complete" : "active"}"></span>
      <span class="journal-title">${esc(j.title)}</span>
    </div>
    <div class="journal-text">${esc(j.text)}</div>
  </div>`;
}

function renderSettings(): string {
  return `
    <div class="settings-list">
      <div class="settings-item"><span class="settings-label">Dark Theme</span><span class="settings-control"><input type="checkbox" checked disabled></span></div>
      <div class="settings-item"><span class="settings-label">Font Size</span><span class="settings-control"><select disabled><option>Small</option><option selected>Medium</option><option>Large</option></select></span></div>
      <div class="settings-item"><span class="settings-label">Animations</span><span class="settings-control"><input type="checkbox" checked disabled></span></div>
    </div>
    <button class="settings-action-btn" onclick="window.Story?.save()">Quick Save</button>
    <button class="settings-action-btn" onclick="window.Story?.load()">Quick Load</button>
    <button class="settings-action-btn danger" onclick="if(confirm('Restart the story?')) window.Story?.restart()">Restart Story</button>`;
}

// ============================================================
// Keyboard shortcuts
// ============================================================

function setupKeyboard(): void {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activePanel !== "none") {
      closePanel(); e.preventDefault();
    }
  });
}

// ============================================================
// Wire up nav buttons + init
// ============================================================

function init(): void {
  createPanelElements();
  setupKeyboard();

  // Hook nav button clicks (buttons are in the StoryInterface passage)
  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest(".nav-btn") as HTMLElement;
    if (!btn?.dataset.panel) return;
    e.preventDefault();
    togglePanel(btn.dataset.panel);
  });

  // Refresh open panel when variables change
  if (window.Story?.on) {
    window.Story.on("variableChanged", () => {
      if (activePanel !== "none") {
        const body = document.getElementById("panel-body");
        if (body) body.innerHTML = renderPanelContent(activePanel);
      }
    });
  }
}

// Boot: wait for Spindle's :storyready event
document.addEventListener(":storyready", () => init(), { once: true });

/* =========================================================
   SCRIPT.JS — logika interaksi.
   Biasanya nggak perlu diubah — semua konten ada di config.js
   ========================================================= */
(function(){
  "use strict";

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  document.addEventListener("DOMContentLoaded", () => {
    populateContent();
    buildPetals(16);
    setupProgressBar();
    setupEnvelope();
    setupCounter();
    setupTimelineReveal();
    setupGallery();
    setupReasons();
    setupLetterSignature();
    setupGame();
    setupCountdown();
    setupGuestbook();
    setupMusic();
    setupHug();
    setupNavDots();
  });

  /* ---------- Isi konten dari CONFIG ---------- */
  function populateContent(){
    const c = CONFIG;
    setText("#gate-recipient", c.recipientName);
    setText("#hero-eyebrow", c.heroEyebrow);
    setText("#hero-names", c.coupleNames);
    setText("#hero-title", c.heroTitle);
    setText("#hero-sub", c.heroSub);

    // timeline
    const tlist = $("#timeline-list");
    c.timeline.forEach(item => {
      const el = document.createElement("div");
      el.className = "timeline-item";
      el.innerHTML = `<span class="dot"></span><div class="t-date"></div><div class="t-title"></div><div class="t-desc"></div>`;
      el.querySelector(".t-date").textContent = item.date;
      el.querySelector(".t-title").textContent = item.title;
      el.querySelector(".t-desc").textContent = item.desc;
      tlist.appendChild(el);
    });

    // gallery
    const grid = $("#gallery-grid");
    c.gallery.forEach((g, i) => {
      const el = document.createElement("div");
      el.className = "polaroid";
      el.dataset.index = i;
      el.innerHTML = `<img src="${g.src}" alt="${escapeAttr(g.caption)}" loading="lazy"><div class="cap"></div>`;
      el.querySelector(".cap").textContent = g.caption;
      grid.appendChild(el);
    });

    // reasons
    const rgrid = $("#reasons-grid");
    c.reasons.forEach((r, i) => {
      const el = document.createElement("div");
      el.className = "flip-card";
      el.innerHTML = `
        <div class="flip-inner">
          <div class="flip-front"><div class="n">${String(i+1).padStart(2,"0")}</div><div class="t">tap untuk lihat</div></div>
          <div class="flip-back"></div>
        </div>`;
      el.querySelector(".flip-back").textContent = r;
      el.addEventListener("click", () => el.classList.toggle("flipped"));
      rgrid.appendChild(el);
    });

    // letter
    setText("#letter-greet", c.letterGreeting);
    const lbody = $("#letter-body");
    c.letterParagraphs.forEach(p => {
      const para = document.createElement("p");
      para.textContent = p;
      lbody.appendChild(para);
    });
    setText("#letter-sign", `${c.letterClosing} ${c.letterSignature}`);

    // game
    setText("#game-question", c.gameQuestion);
    setText("#game-result", c.gameYesReply);

    // countdown label
    setText("#cd-label", c.nextEventLabel);

    // guestbook title
    setText("#gb-title", c.guestbookTitle);

    // footer
    setText("#footer-text", c.footerText);

    // hug message
    setText("#hug-msg", c.hugMessage);

    if (!c.musicSrc) {
      const m = $("#music-toggle");
      if (m) m.style.display = "none";
    }
  }

  function setText(sel, text){ const el = $(sel); if (el) el.textContent = text; }
  function escapeAttr(s){ return String(s).replace(/"/g, "&quot;"); }

  /* ---------- Kelopak melayang (ambient) ---------- */
  function buildPetals(n){
    const layer = $("#petal-layer");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const colors = ["var(--rose)", "var(--lilac-deep)", "var(--sky-deep)", "var(--gold)"];
    for (let i = 0; i < n; i++){
      const p = document.createElement("div");
      p.className = "petal";
      p.style.left = Math.random()*100 + "vw";
      p.style.background = colors[i % colors.length];
      const dur = 9 + Math.random()*10;
      p.style.animationDuration = dur + "s, " + (2 + Math.random()*2) + "s";
      p.style.animationDelay = (Math.random()*dur) + "s, 0s";
      p.style.opacity = 0.35 + Math.random()*0.35;
      const size = 10 + Math.random()*8;
      p.style.width = size + "px"; p.style.height = size + "px";
      layer.appendChild(p);
    }
  }

  /* ---------- Progress bar scroll ---------- */
  function setupProgressBar(){
    const bar = $("#progress-bar");
    window.addEventListener("scroll", () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = (scrolled || 0) + "%";
    });
  }

  /* ---------- Amplop pembuka ---------- */
  function setupEnvelope(){
    const gate = $("#envelope-gate");
    const envelope = $("#envelope");
    const openBtn = $("#open-btn");
    document.body.style.overflow = "hidden";

    function openEnvelope(){
      if (envelope.classList.contains("opening")) return;
      envelope.classList.add("opening");
      burstConfettiAt(window.innerWidth/2, window.innerHeight/2 - 60, 22);
      setTimeout(() => {
        gate.classList.add("hidden");
        document.body.style.overflow = "";
        tryPlayMusic();
      }, 750);
    }
    envelope.addEventListener("click", openEnvelope);
    openBtn.addEventListener("click", openEnvelope);
  }

  /* ---------- Hitungan "sudah bersama" ---------- */
  function setupCounter(){
    const start = new Date(CONFIG.togetherSince).getTime();
    function tick(){
      const diff = Math.max(0, Date.now() - start);
      renderDiff(diff, "c-days", "c-hours", "c-mins", "c-secs");
    }
    tick();
    setInterval(tick, 1000);
  }

  function renderDiff(diff, dId, hId, mId, sId){
    const s = Math.floor(diff/1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    setText("#"+dId, days);
    setText("#"+hId, String(hours).padStart(2,"0"));
    setText("#"+mId, String(mins).padStart(2,"0"));
    setText("#"+sId, String(secs).padStart(2,"0"));
  }

  /* ---------- Countdown ke event berikutnya ---------- */
  function setupCountdown(){
    const target = new Date(CONFIG.nextEventDate).getTime();
    function tick(){
      const diff = target - Date.now();
      if (diff <= 0){
        renderDiff(0, "d-days", "d-hours", "d-mins", "d-secs");
        return;
      }
      renderDiff(diff, "d-days", "d-hours", "d-mins", "d-secs");
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Reveal timeline saat discroll ---------- */
  function setupTimelineReveal(){
    const items = $$(".timeline-item");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in-view"); });
    }, { threshold: 0.25 });
    items.forEach(i => obs.observe(i));
  }

  /* ---------- Galeri + lightbox ---------- */
  function setupGallery(){
    const items = $$(".polaroid");
    const lightbox = $("#lightbox");
    const img = $("#lightbox img");
    const cap = $("#lightbox .cap");
    let current = 0;

    function show(i){
      current = (i + CONFIG.gallery.length) % CONFIG.gallery.length;
      const g = CONFIG.gallery[current];
      img.src = g.src; img.alt = g.caption;
      cap.textContent = g.caption;
    }
    items.forEach(el => {
      el.addEventListener("click", () => {
        show(parseInt(el.dataset.index, 10));
        lightbox.classList.add("open");
      });
    });
    $(".lb-close").addEventListener("click", () => lightbox.classList.remove("open"));
    $(".lb-prev").addEventListener("click", () => show(current - 1));
    $(".lb-next").addEventListener("click", () => show(current + 1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("open"); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") lightbox.classList.remove("open");
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---------- Reasons: sudah di-attach saat populateContent ---------- */
  function setupReasons(){ /* click handler already added in populateContent */ }

  /* ---------- Tanda tangan surat (garis bawah animasi) ---------- */
  function setupLetterSignature(){
    const sign = $("#letter-sign");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting){ sign.style.transition = "opacity .8s ease, transform .8s ease"; sign.style.opacity = 1; sign.style.transform = "translateY(0)"; }
      });
    }, { threshold: 0.5 });
    sign.style.opacity = 0; sign.style.transform = "translateY(10px)";
    obs.observe(sign);
  }

  /* ---------- Game "kamu masih sayang aku?" ---------- */
  function setupGame(){
    const box = $(".game-box");
    const btnNo = $("#btn-no");
    const btnYes = $("#btn-yes");
    const result = $("#game-result");
    let dodgeIndex = 0;

    function dodge(){
      // gerakin pakai transform (bukan position/left/top) biar nggak
      // tergantung sama containing block mana pun — lebih aman.
      const boxRect = box.getBoundingClientRect();
      const rangeX = Math.min(120, boxRect.width / 2 - 70);
      const x = (Math.random() * 2 - 1) * Math.max(rangeX, 30);
      const y = Math.random() * 50 - 10;
      btnNo.style.transform = `translate(${x}px, ${y}px)`;
      const replies = CONFIG.gameNoReplies;
      dodgeIndex = (dodgeIndex + 1) % replies.length;
      btnNo.textContent = replies[dodgeIndex];
    }
    btnNo.addEventListener("mouseenter", dodge);
    btnNo.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });

    btnYes.addEventListener("click", () => {
      result.classList.add("show");
      burstConfettiAt(window.innerWidth/2, box.getBoundingClientRect().top + window.scrollY + 100, 26);
    });
  }

  /* ---------- Buku balasan (localStorage) ---------- */
  const GB_KEY = "love_letter_guestbook_entries";
  function setupGuestbook(){
    const form = $("#gb-form");
    const list = $("#gb-list");

    function load(){
      try { return JSON.parse(localStorage.getItem(GB_KEY)) || []; }
      catch(e){ return []; }
    }
    function save(entries){
      localStorage.setItem(GB_KEY, JSON.stringify(entries));
    }
    function render(){
      const entries = load();
      list.innerHTML = "";
      if (entries.length === 0){
        list.innerHTML = `<p class="gb-empty">Belum ada balasan... jadi yang pertama, yuk! 🎀</p>`;
        return;
      }
      entries.slice().reverse().forEach((entry) => {
        const originalIndex = entries.indexOf(entry);
        const el = document.createElement("div");
        el.className = "gb-entry";
        el.innerHTML = `<button class="del" aria-label="Hapus">&times;</button>
          <div class="who"></div><div class="when"></div><div class="msg"></div>`;
        el.querySelector(".who").textContent = entry.name;
        el.querySelector(".when").textContent = entry.date;
        el.querySelector(".msg").textContent = entry.msg;
        el.querySelector(".del").addEventListener("click", () => {
          const all = load();
          all.splice(originalIndex, 1);
          save(all);
          render();
        });
        list.appendChild(el);
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#gb-name").value.trim();
      const msg = $("#gb-msg").value.trim();
      if (!name || !msg) return;
      const entries = load();
      entries.push({ name, msg, date: new Date().toLocaleString("id-ID", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) });
      save(entries);
      form.reset();
      render();
    });

    render();
  }

  /* ---------- Musik latar ---------- */
  function setupMusic(){
    const btn = $("#music-toggle");
    const audio = $("#bg-audio");
    if (!CONFIG.musicSrc) return;
    audio.src = CONFIG.musicSrc;
    let failed = false;
    audio.addEventListener("error", () => { failed = true; btn.style.display = "none"; });

    btn.addEventListener("click", () => {
      if (failed) return;
      if (audio.paused){ audio.play().catch(()=>{}); btn.classList.add("playing"); }
      else { audio.pause(); btn.classList.remove("playing"); }
    });
  }
  function tryPlayMusic(){
    const audio = $("#bg-audio");
    const btn = $("#music-toggle");
    if (!CONFIG.musicSrc || !audio.src) return;
    audio.play().then(() => btn.classList.add("playing")).catch(() => { /* autoplay blocked, biarkan user tap tombol */ });
  }

  /* ---------- Pelukan virtual (finale) ---------- */
  function setupHug(){
    const btn = $("#hug-btn");
    const msg = $("#hug-msg");
    const waPhone = "6281236212688";
    const waText = "zanzan... cini aku peyukk 🫂 ama kiss, muaa 😘";
    let clickedOnce = false;
    const firstLabel = btn.textContent;
    const secondLabel = "Teken lagi sekali sayang";

    btn.addEventListener("click", () => {
      msg.classList.add("show");
      const r = btn.getBoundingClientRect();
      burstConfettiAt(r.left + r.width/2, r.top + window.scrollY, 40);

      if (!clickedOnce) {
        clickedOnce = true;
        btn.textContent = secondLabel;
        return;
      }

      const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`;
      window.open(url, "_blank");
      btn.textContent = firstLabel;
      clickedOnce = false;
    });
  }

  /* ---------- Confetti generator ---------- */
  function burstConfettiAt(x, y, count){
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const layer = $("#confetti-layer");
    const colors = ["#FF9FB8", "#E7D9F7", "#D3ECF4", "#F3CD8A", "#FFC1D3"];
    for (let i = 0; i < count; i++){
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      const size = 6 + Math.random()*8;
      piece.style.width = size + "px";
      piece.style.height = size + "px";
      piece.style.left = x + "px";
      piece.style.top = y + "px";
      piece.style.background = colors[Math.floor(Math.random()*colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "3px";
      layer.appendChild(piece);

      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random()*180;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 60;

      const anim = piece.animate([
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy + 220}px) rotate(${Math.random()*480 - 240}deg)`, opacity: 0 }
      ], { duration: 1100 + Math.random()*700, easing: "cubic-bezier(.2,.7,.3,1)" });
      anim.onfinish = () => piece.remove();
    }
  }

  /* ---------- Titik navigasi ---------- */
  function setupNavDots(){
    const dots = $$("#nav-dots button");
    if (dots.length === 0) return;
    const sections = dots.map(d => $(d.dataset.target)).filter(Boolean);

    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        const target = $(dot.dataset.target);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting){
          const idx = sections.indexOf(e.target);
          dots.forEach(d => d.classList.remove("active"));
          if (dots[idx]) dots[idx].classList.add("active");
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(s => obs.observe(s));
  }

})();

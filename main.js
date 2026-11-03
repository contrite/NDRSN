/*
 * Rive slot loader.
 *
 * Each `.rive-slot` element declares:
 *   data-rive-src       path to a local .riv file (drop yours into assets/rive/)
 *   data-rive-fallback  "demo"        -> load Rive's public vehicles.riv demo
 *                       "placeholder" -> keep the animated CSS placeholder
 *   data-state-machine  optional state machine name to run (default: first animation)
 *
 * Local files win; the fallback only kicks in when the local file is missing,
 * so the page looks alive before any real work is dropped in.
 */

const DEMO_RIV = "https://cdn.rive.app/animations/vehicles.riv";
const DEMO_STATE_MACHINE = "bumpy";

const instances = [];

function mountCanvas(slot) {
  const canvas = document.createElement("canvas");
  const rect = slot.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  slot.appendChild(canvas);
  return canvas;
}

function loadRive(slot, src, stateMachine, onError) {
  const canvas = mountCanvas(slot);
  const fit = slot.classList.contains("rive-contain")
    ? rive.Fit.Contain
    : rive.Fit.Cover;

  const instance = new rive.Rive({
    src,
    canvas,
    autoplay: true,
    stateMachines: stateMachine || undefined,
    layout: new rive.Layout({ fit, alignment: rive.Alignment.Center }),
    onLoad: () => {
      slot.classList.remove("is-placeholder");
      instance.resizeDrawingSurfaceToCanvas();
    },
    onLoadError: () => {
      canvas.remove();
      onError();
    },
  });
  instances.push(instance);
}

async function initSlot(slot) {
  slot.classList.add("is-placeholder");
  const src = slot.dataset.riveSrc;
  const fallback = slot.dataset.riveFallback || "placeholder";
  const stateMachine = slot.dataset.stateMachine;

  // Check whether a local .riv actually exists before handing it to Rive,
  // so a missing file falls through to the fallback without console noise.
  let localExists = false;
  if (src) {
    try {
      const head = await fetch(src, { method: "HEAD" });
      const type = head.headers.get("content-type") || "";
      localExists = head.ok && !type.includes("text/html");
    } catch {
      localExists = false;
    }
  }

  if (localExists) {
    loadRive(slot, src, stateMachine, () => applyFallback(slot, fallback));
  } else {
    applyFallback(slot, fallback);
  }
}

function applyFallback(slot, fallback) {
  if (fallback === "demo") {
    loadRive(slot, DEMO_RIV, DEMO_STATE_MACHINE, () => {
      /* offline: leave the CSS placeholder */
    });
  }
  // "placeholder": nothing to do — the CSS placeholder stays.
}

/* Keep canvases crisp when the window resizes. */
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    instances.forEach((r) => r.resizeDrawingSurfaceToCanvas());
  }, 150);
});

/* Scroll-in reveal. */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
document.querySelectorAll(".rive-slot").forEach(initSlot);

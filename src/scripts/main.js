import { sagas } from "../data/sagas.js";
import { bindSongPreviews } from "./audioPlayer.js";
import { renderSagaNav, renderSagaRoute, setActiveSaga } from "./components/sagaRoute.js";

const sagaNav = document.querySelector("#sagaNav");
const sagaRoute = document.querySelector("#sagaRoute");
const scrollProgress = document.querySelector("#scrollProgress");
const pulseButton = document.querySelector("#pulseButton");

function bindRevealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function bindActiveSaga() {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveSaga(sagaNav, visible.target.dataset.sagaId);
      }
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0.18, 0.35, 0.55],
    },
  );

  document.querySelectorAll(".saga-card").forEach((card) => observer.observe(card));
}

function bindScrollProgress() {
  window.addEventListener(
    "scroll",
    () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      scrollProgress.style.transform = `scaleX(${progress})`;
    },
    { passive: true },
  );
}

function bindMoments() {
  pulseButton.addEventListener("click", () => {
    document.body.classList.toggle("oath-lit");
    pulseButton.textContent = document.body.classList.contains("oath-lit")
      ? "Guardar juramento"
      : "Encender juramento";
  });
}

renderSagaNav(sagas, sagaNav);
renderSagaRoute(sagas, sagaRoute);
setActiveSaga(sagaNav, sagas[0].id);
bindSongPreviews(sagaRoute);
bindRevealOnScroll();
bindActiveSaga();
bindScrollProgress();
bindMoments();

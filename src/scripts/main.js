import { sagas } from "../data/sagas.js";
import { bindSongPreviews } from "./audioPlayer.js";
import { renderSagaNav, renderSagaRoute, setActiveSaga } from "./components/sagaRoute.js";

const sagaNav = document.querySelector("#sagaNav");
const sagaRoute = document.querySelector("#sagaRoute");
const sagaViewport = document.querySelector("#sagaViewport");
const prevSaga = document.querySelector("#prevSaga");
const nextSaga = document.querySelector("#nextSaga");
const sagaCounter = document.querySelector("#sagaCounter");
const scrollProgress = document.querySelector("#scrollProgress");
const pulseButton = document.querySelector("#pulseButton");

let activeSagaIndex = 0;

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

function updateSagaCarousel(index) {
  activeSagaIndex = (index + sagas.length) % sagas.length;
  const activeSaga = sagas[activeSagaIndex];

  sagaRoute.style.setProperty("--active-index", activeSagaIndex);
  sagaCounter.textContent = `${activeSaga.order} / ${String(sagas.length).padStart(2, "0")}`;
  setActiveSaga(sagaNav, activeSaga.id);

  document.querySelectorAll(".saga-card").forEach((card, cardIndex) => {
    const isActive = cardIndex === activeSagaIndex;
    card.classList.toggle("is-active", isActive);
    card.setAttribute("aria-hidden", String(!isActive));
    card.inert = !isActive;
  });
}

function bindSagaCarousel() {
  prevSaga.addEventListener("click", () => updateSagaCarousel(activeSagaIndex - 1));
  nextSaga.addEventListener("click", () => updateSagaCarousel(activeSagaIndex + 1));

  sagaViewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") updateSagaCarousel(activeSagaIndex - 1);
    if (event.key === "ArrowRight") updateSagaCarousel(activeSagaIndex + 1);
  });

  let touchStartX = 0;
  let touchStartY = 0;

  sagaViewport.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true },
  );

  sagaViewport.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      updateSagaCarousel(activeSagaIndex + (deltaX < 0 ? 1 : -1));
    },
    { passive: true },
  );
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

renderSagaNav(sagas, sagaNav, updateSagaCarousel);
renderSagaRoute(sagas, sagaRoute);
updateSagaCarousel(0);
bindSongPreviews(sagaRoute);
bindRevealOnScroll();
bindSagaCarousel();
bindScrollProgress();
bindMoments();

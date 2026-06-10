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

function setActiveSagaIndex(index) {
  activeSagaIndex = (index + sagas.length) % sagas.length;
  const activeSaga = sagas[activeSagaIndex];

  sagaCounter.textContent = `${activeSaga.order} / ${String(sagas.length).padStart(2, "0")}`;
  setActiveSaga(sagaNav, activeSaga.id);

  document.querySelectorAll(".saga-card").forEach((card, cardIndex) => {
    const isActive = cardIndex === activeSagaIndex;
    card.classList.toggle("is-active", isActive);
  });
}

function scrollToSaga(index) {
  const nextIndex = (index + sagas.length) % sagas.length;
  const nextCard = sagaRoute.querySelectorAll(".saga-card")[nextIndex];

  nextCard?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "start",
  });

  setActiveSagaIndex(nextIndex);
}

function updateActiveSagaFromScroll() {
  const cards = [...sagaRoute.querySelectorAll(".saga-card")];
  const viewportLeft = sagaViewport.getBoundingClientRect().left;

  const nearestIndex = cards
    .map((card, index) => ({
      index,
      distance: Math.abs(card.getBoundingClientRect().left - viewportLeft),
    }))
    .sort((a, b) => a.distance - b.distance)[0]?.index;

  if (Number.isInteger(nearestIndex) && nearestIndex !== activeSagaIndex) {
    setActiveSagaIndex(nearestIndex);
  }
}

function bindSagaCarousel() {
  prevSaga.addEventListener("click", () => scrollToSaga(activeSagaIndex - 1));
  nextSaga.addEventListener("click", () => scrollToSaga(activeSagaIndex + 1));

  sagaViewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") scrollToSaga(activeSagaIndex - 1);
    if (event.key === "ArrowRight") scrollToSaga(activeSagaIndex + 1);
  });

  sagaViewport.addEventListener("scroll", updateActiveSagaFromScroll, { passive: true });
  sagaViewport.addEventListener(
    "touchend",
    () => window.setTimeout(updateActiveSagaFromScroll, 160),
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

renderSagaNav(sagas, sagaNav, scrollToSaga);
renderSagaRoute(sagas, sagaRoute);
setActiveSagaIndex(0);
bindSongPreviews(sagaRoute);
bindRevealOnScroll();
bindSagaCarousel();
bindScrollProgress();
bindMoments();

function slugifySongTitle(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function songRows(saga) {
  const songs = saga.songs;

  return songs
    .map(
      (song, index) => `
        <li class="song-row" data-song-title="${song.title}" data-audio-src="assets/audio/${saga.id}/${slugifySongTitle(song.title)}.mp3">
          <span class="song-row__index">${index + 1}</span>
          <button class="song-row__play" type="button" aria-label="Reproducir ${song.title}">
            <span class="song-row__play-icon" aria-hidden="true"></span>
          </button>
          <strong class="song-row__title">${song.title}</strong>
          <span class="song-row__progress" aria-hidden="true">
            <span class="song-row__progress-fill"></span>
          </span>
          <span class="song-row__duration">${song.duration}</span>
        </li>
      `,
    )
    .join("");
}

export function renderSagaNav(sagas, navElement) {
  navElement.innerHTML = sagas
    .map(
      (saga) => `
        <button class="saga-chip" type="button" data-saga-target="${saga.id}" aria-pressed="false">
          <span>${saga.order}</span>
          ${saga.title.replace("The ", "")}
        </button>
      `,
    )
    .join("");

  navElement.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-saga-target]");
    if (!chip) return;

    document.querySelector(`#saga-${chip.dataset.sagaTarget}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

export function renderSagaRoute(sagas, routeElement) {
  routeElement.innerHTML = sagas
    .map(
      (saga) => `
        <article class="saga-card reveal" id="saga-${saga.id}" data-saga-id="${saga.id}" style="--saga-color: ${saga.color}">
          <div class="saga-card__media">
            <img src="${saga.image}" alt="Escena ilustrada de ${saga.title}" loading="lazy" />
            <span class="saga-card__number">${saga.order}</span>
          </div>
          <div class="saga-card__body">
            <div class="saga-card__header">
              <p class="eyebrow">${saga.album} · ${saga.year}</p>
              <h3>${saga.title}</h3>
              <p class="saga-card__setting">${saga.setting}</p>
            </div>

            <div class="saga-card__texts">
              <p>${saga.myth}</p>
              <blockquote>${saga.romance}</blockquote>
            </div>

            <div class="songs-block">
              <div class="songs-block__header">
                <strong>${saga.songs.length} canciones</strong>
                <span>${saga.motif}</span>
              </div>
              <ol class="song-list">
                ${songRows(saga)}
              </ol>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

export function setActiveSaga(navElement, sagaId) {
  navElement.querySelectorAll(".saga-chip").forEach((chip) => {
    const isActive = chip.dataset.sagaTarget === sagaId;
    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });
}

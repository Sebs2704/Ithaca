const audio = new Audio();

let activeRow = null;

function setProgress(row, value) {
  row?.querySelector(".song-row__progress-fill")?.style.setProperty(
    "transform",
    `scaleX(${Math.min(Math.max(value, 0), 1)})`,
  );
}

function resetRow(row) {
  if (!row) return;

  row.classList.remove("is-playing", "is-loading", "is-unavailable");
  row
    .querySelector(".song-row__play")
    ?.setAttribute("aria-label", `Reproducir ${row.dataset.songTitle}`);
  setProgress(row, 0);
}

function setActiveRow(row) {
  if (activeRow && activeRow !== row) {
    resetRow(activeRow);
  }

  activeRow = row;
  activeRow.classList.add("is-loading");
}

function updateActiveProgress() {
  if (!activeRow) return;

  const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  setProgress(activeRow, duration > 0 ? audio.currentTime / duration : 0);
}

function toggleSong(row) {
  if (!row) return;

  if (activeRow === row && !audio.paused) {
    audio.pause();
    row.classList.remove("is-playing");
    return;
  }

  setActiveRow(row);

  if (audio.src !== new URL(row.dataset.audioSrc, window.location.href).href) {
    audio.src = row.dataset.audioSrc;
    audio.currentTime = 0;
  }

  audio
    .play()
    .then(() => {
      row.classList.remove("is-loading", "is-unavailable");
      row.classList.add("is-playing");
      row.querySelector(".song-row__play")?.setAttribute("aria-label", `Pausar ${row.dataset.songTitle}`);
    })
    .catch(() => {
      row.classList.remove("is-loading", "is-playing");
      row.classList.add("is-unavailable");
    });
}

export function bindSongPreviews(container) {
  container.addEventListener("click", (event) => {
    const playButton = event.target.closest(".song-row__play");
    if (!playButton) return;

    toggleSong(playButton.closest(".song-row"));
  });

  audio.addEventListener("timeupdate", updateActiveProgress);
  audio.addEventListener("loadedmetadata", updateActiveProgress);
  audio.addEventListener("ended", () => resetRow(activeRow));
  audio.addEventListener("error", () => {
    activeRow?.classList.remove("is-loading", "is-playing");
    activeRow?.classList.add("is-unavailable");
  });
}

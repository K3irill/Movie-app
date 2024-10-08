const API_KEY = "53cec016-7743-4165-8e20-537b2cb7130c";
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=1";
const API_URl_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
getMovies(API_URL_POPULAR);

const API_URL_MOVIE_DETAILS =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

let value = "items";

async function getMovies(url, isSearch = false) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  console.log(respData);

  value = isSearch ? "films" : "items";

  showMovies(respData[value]);
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movies");
  document.querySelector(".movies").innerHTML = "";
  if (Array.isArray(data)) {
    data.forEach((film) => {
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
      movieEl.innerHTML = `
             <div class="movie__cover-inner">
                <img
                  src="${film.posterUrlPreview}"
                  alt="${film.nameRu}"
                  class="movie__cover"
                />
              </div>
              <div class="movie__info">
                <div class="movie__title">${film.nameRu}</div>
                <div class="movie__category">${film.genres.map(
                  (genre) => ` ${genre.genre}`
                )}</div>
                <div class="movie__average movie__average--${defineRate(
                  +film.ratingKinopoisk
                )}">${
        film.ratingKinopoisk == undefined ? "n/n" : film.ratingKinopoisk
      }</div>
              </div>`;
      movieEl.addEventListener("click", () => {
        openModal(film.kinopoiskId);
      });
      moviesEl.appendChild(movieEl);
    });
  }
}

function defineRate(rate) {
  if (rate >= 7) {
    return "green";
  } else if (rate >= 5) {
    return "orange";
  } else if (rate < 5) {
    return "red";
  } else {
    return "grey";
  }
}

const form = document.querySelector("form");
const searchInput = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URl_SEARCH}${searchInput.value}`;
  if (searchInput.value) {
    getMovies(apiSearchUrl, true);
  }
});

//ModL

const modalEl = document.querySelector(".modal");

async function openModal(id) {
  const res = await fetch(API_URL_MOVIE_DETAILS + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const resData = await res.json();

  modalEl.classList.add("modal--show");
  document.body.classList.add("stop-scrolling");
  modalEl.innerHTML = `
        <div class="modal__card">
          <img src="${
            resData.posterUrlPreview
          }" alt="" class="modal__movie-backdrop">
          <h2>
            <span class="modal__movie-title">${resData.nameRu}</span>
            <span class="modal__movie-release-year">${resData.year}</span>
          </h2>
          <ul class="modal__movie-info">
            <div class="loader"></div>
            <li class="modal__movie-genre">${resData.genres.map(
              (el) => `<span>${el.genre}</span>`
            )}</li>
            ${
              resData.filmLength
                ? `<li class="modal__movie-runtime">${resData.filmLength}</li>`
                : ""
            }
            <li><a href="${resData.webUrl}" class="modal__movie-site">${
    resData.webUrl
  }</a></li>
            <li class="modal__movie-overview">${resData.description}</li>
          </ul>
          <button class="modal__button-close">Закртыть</button>
        </div>
`;
  const btnClose = document.querySelector(".modal__button-close");
  btnClose.addEventListener("click", () => closeModal());
}

function closeModal() {
  modalEl.classList.remove("modal--show");
  document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 27) {
    closeModal();
  }
});

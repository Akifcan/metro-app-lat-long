import { fn } from "./fn.js";
import { firstDot } from "./components/firstDot.component.js";
import { twoDot } from "./components/twoDot.component.js";
import { lastDot } from "./components/lastDot.component.js";
import { mockCoords } from "../data/index.js";

const stationWrapper = document.querySelector("[station-wrapper]");
const stationList = stationWrapper.querySelector("[station-list]");
const stationName = stationWrapper.querySelector("[station-name]");

async function renderStations(coords) {
  const { stations, prependDot, appendDot, currentStation, nextStation } =
    await fn(coords);
  stationList.innerHTML = lastDot;

  if (!prependDot && appendDot) {
    stationList.innerHTML = lastDot;
  } else if (!appendDot && prependDot) {
    stationList.innerHTML = firstDot;
  } else {
    stationList.innerHTML = twoDot;
  }
  stationName.textContent = nextStation?.Adi ?? "Lütfen trenden inin";
  stations.forEach((station, index) => {
    const text = stationList
      .querySelector(`#station-${index + 1}-name`)
      .querySelector("tspan");

    if (station.Adi === currentStation.Adi) {
      const circle = stationList.querySelector(`#station-${index + 1}-circle`);
      circle.classList.add("active-station");
    }

    if (index !== stations.length - 1) {
      text.textContent = station.Adi;
    } else {
      const words = station.Adi.match(/[a-zA-Zİ]{0,9}/g).filter((x) => x);
      const x = +text.getAttribute("x");
      const y = +text.getAttribute("y");

      text.innerHTML = words
        .map((word, i) => `<tspan x="${x}" y="${y + 20 * i}">${word}</tspan>`)
        .join("");
    }
  });
}

mockCoords.forEach((coords, index) => {
  setTimeout(() => {
    renderStations(coords);
  }, index * 3000);
});

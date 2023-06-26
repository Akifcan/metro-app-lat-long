const API_URL = "https://openapi.izmir.bel.tr/api/metro/istasyonlar";
const SHOW_STATION_COUNT = 2;
const MIN_LIMIT = 5;
const DOT_LIMIT = 3;

export const calculateDistance = (currentCoords, stationCoords) => {
  const R = 6371e3; // metres
  const φ1 = (stationCoords.lat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (currentCoords.lat * Math.PI) / 180;
  const Δφ = ((currentCoords.lat - stationCoords.lat) * Math.PI) / 180;
  const Δλ = ((currentCoords.long - stationCoords.long) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
};

export const fn = async (coords) => {
  const response = await fetch(API_URL);
  const data = await response.json();
  const stations = data.map((station) => {
    return {
      ...station,
      meter: calculateDistance(coords, {
        lat: station.Enlem,
        long: station.Boylam,
      }),
    };
  });

  const firstStation = stations[0];
  const lastStation = stations.at(-1);
  const currentStationIndex =
    [...stations].sort((a, b) => (a.meter > b.meter ? 1 : -1))[0].Sira - 1;
  // const currentStationIndex = 5;
  const list = [];

  console.assert(
    currentStationIndex >= 0 && currentStationIndex < stations.length,
    "station length exceeded"
  );

  if (currentStationIndex <= MIN_LIMIT) {
    for (let i = 0; i < 7; i++) {
      list.push(stations[i]);
    }
  } else if (currentStationIndex > stations.length - MIN_LIMIT) {
    for (let i = stations.length - 7; i < stations.length; i++) {
      list.push(stations[i]);
    }
  } else {
    list.push(firstStation);

    for (
      let i = currentStationIndex;
      i > currentStationIndex - SHOW_STATION_COUNT;
      i--
    ) {
      if (stations[i - 1] !== undefined) {
        list.push(stations[i - 1]);
      }
    }

    list.push(stations[currentStationIndex]);

    for (
      let i = currentStationIndex;
      i < currentStationIndex + SHOW_STATION_COUNT;
      i++
    ) {
      if (stations[i + 1] !== undefined) {
        list.push(stations[i + 1]);
      }
    }

    list.push(lastStation);
  }

  list[0] = firstStation;
  list[list.length - 1] = lastStation;

  return {
    prependDot: currentStationIndex > DOT_LIMIT,
    appendDot: currentStationIndex < stations.length - 1 - DOT_LIMIT,
    stations: list,
    currentStation: stations[currentStationIndex],
    nextStation: stations[currentStationIndex + 1] ?? null,
  };
};

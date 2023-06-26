import { fn } from "../scripts/fn.js";
import { response, testCoords } from "../data/index.js";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(response),
  })
);

function sum(a, b) {
  return a + b;
}

test("current station name should be Evka 3 if Evka 3 data passed", async () => {
  const { currentStation, nextStation } = await fn(testCoords.evka3);
  expect(currentStation).toHaveProperty("Adi", "Evka - 3");
  expect(nextStation).toHaveProperty("Adi", "Ege Üniversitesi");
});

test("current station name should be Fahrettin Altay  if Fahrettin Altay data passed", async () => {
  const { currentStation, nextStation } = await fn(testCoords.fahrettinAltay);
  expect(currentStation).toHaveProperty("Adi", "Fahrettin Altay");
  expect(nextStation).toBe(null);
});

test("current station name should be İzmirspor  if İzmirspor data passed", async () => {
  const { currentStation, nextStation } = await fn(testCoords.izmirSpor);
  expect(currentStation).toHaveProperty("Adi", "İzmirspor");
  expect(nextStation).toHaveProperty("Adi", "İzmirspor");
});

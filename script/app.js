// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = '0' + date.getHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
// let placeSunAndStartMoving = (totalMinutes, sunrise) => {
//   // In de functie moeten we eerst wat zaken ophalen en berekenen.
//   // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
//   // Bepaal het aantal minuten dat de zon al op is.
//   // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
//   // We voegen ook de 'is-loaded' class toe aan de body-tag.
//   // Vergeet niet om het resterende aantal minuten in te vullen.
//   // Nu maken we een functie die de zon elke minuut zal updaten
//   // Bekijk of de zon niet nog onder of reeds onder is
//   // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
//   // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
//   const now = new Date();
//   const sunriseDate = new Date(sunrise * 1000);
//   const minutesLeft = now.getHours() * 60 + now.getMinutes() - (sunriseDate.getHours() * 60 + sunriseDate.getMinutes());

//   const percentage = (minutesLeft / totalMinutes) * 100;

//   const sunLeftPosition = 50;
//   const sunBottomPosition = 50;

//   document.querySelector('.js-sun').style.left = `${sunLeftPosition}%`;
//   document.querySelector('.js-sun').style.bottom = `${sunBottomPosition}%`;
// };

let placeSunAndStartMoving = (totalMinutes, sunrise) => {
  // In de functie moeten we eerst wat zaken ophalen en berekenen.

  // calculations
  let sun = document.querySelector('.js-sun');
  let currentTime = new Date(Date.now());
  let SunUp = new Date(Date.now() - sunrise);
  let sunuptotal = SunUp.getHours() * 60 + SunUp.getMinutes();
  let procent = 100 - ((SunUp.getHours() * 60 + SunUp.getMinutes()) / totalMinutes) * 10;

  //print
  console.log('x' + procent);
  console.log('x' + totalMinutes);
  console.log('x' + sunuptotal);

  // We zetten de zon op de juiste plek
  if (sunuptotal <= totalMinutes + 1) {
    sun.dataset.time = currentTime.getHours() + ':' + currentTime.getMinutes();
    sun.style.left = procent + '%';
    if (procent < 50) {
      sun.style.bottom = 2 * procent + '%';
    } else {
      sun.style.bottom = 2 * (100 - procent) + '%';
    }
  }

  //   let interval = setInterval(function () {
  //     updateSun(sun, sunuptotal, currentTime, interval);
  //   }, 1000);
  // We vullen het resterende aantal minuten in

  // Bekijk of de zon niet nog onder of reeds onder is
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

const updateTimeAndTimeLeft = (timeLeftTimeStamp) => {
  console.log(timeLeftTimeStamp);
  document.querySelector('.js-sun').setAttribute('data-time', _parseMillisecondsIntoReadableTime(timeLeftTimeStamp));
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = (queryResponse) => {
  // We gaan eerst een paar onderdelen opvullen
  const sunrise = document.querySelector('.js-sunrise');
  const sunset = document.querySelector('.js-sunset');
  const location = document.querySelector('.js-location');
  const timeLeft = document.querySelector('.js-time-left');
  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  location.innerHTML = `${queryResponse.city.name}, ${queryResponse.city.country}`;
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  sunrise.innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise);
  sunset.innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunset);
  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
  let totalDayTime = new Date(sunset - sunrise);
  //   const totalMinutes = Math.round((queryResponse.city.sunset - queryResponse.city.sunrise) / 360, 0);
  const totalMinutes = totalDayTime.getHours() * 60 + totalDayTime.getMinutes();
  timeLeft.innerHTML = totalMinutes + ' minutes';

  placeSunAndStartMoving(totalMinutes, sunrise);

  updateTimeAndTimeLeft(queryResponse.city.sunset - queryResponse.city.sunrise);
};

const getData = async (endpoint) => {
  return fetch(endpoint)
    .then((r) => r.json())
    .catch((e) => console.error(e));
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
  // Eerst bouwen we onze url op
  // Met de fetch API proberen we de data op te halen.
  const data = await getData(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=bc036cebf152fd2fd4034f04ba9be57a&units=metric&lang=nl&cnt=1`);
  console.log(data);
  // Als dat gelukt is, gaan we naar onze showResult functie.
  showResult(data);
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('Test');
  // 1 We will query the API with longitude and latitude.
  const { city } = getAPI(50.8027841, 3.2097454);
});

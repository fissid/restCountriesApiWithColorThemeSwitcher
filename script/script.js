const countryCards = document.querySelector(".country-cards");
const searchInput = document.querySelector(".search");
const displayModeBtn = document.querySelector(".display-mode");
const body = document.querySelector("body");
const header = document.querySelector("header");
const eaches = document.querySelectorAll(".each");
const dropdownBtn = document.querySelector(".dropdown-toggle");
const dropdownMenu = document.querySelector(".dropdown-menu");
const dropdownItems = document.querySelectorAll(".dropdown-item");
const sortBtn = document.querySelector(".sort-btn");
const countryInfoBtn = document.querySelector(".back-btn");
const mainPage = document.querySelector(".main-page");
const countryInfoPage = document.querySelector(".conutry-info");

const countryInfo = async function (name) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${name}`);
    const data = await response.json();
    const [countryData] = data;
    const currencies = Object.values(countryData.currencies).map((each) => each.name);
    let borders;
    let eachCountryData = [];

    if (!countryData.borders) {
      borders = [];
    } else {
      borders = Object.values(countryData.borders);
      const bordersResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borders}`);
      const bordersData = await bordersResponse.json();
      bordersData.forEach((each) => {
        eachCountryData.push(each.name.common);
      });
    }

    const countryDataHtml = `
          <div class="bottom py-5">
            <div class="d-flex align-items-center justify-content-between w-100 bottom-inside">
              <div class="flag-containe ">
                <img src="${countryData.flags.png}" alt="${countryData.cca3}" class="flag " />
              </div>
              <div class="d-flex flex-column w-50 bottom-inside-bottom">
                <div>
                  <h3>${countryData.name.common}, ${countryData.cca3}</h3>
                </div>
                <div class="d-flex justify-content-between bottom-inside-bottom-info">
                  <div>
                    <h6>Native Name: <span class="text-capitalize">${Object.values(countryData.name.nativeName)[0].common}</span></h6>
                    <h6>Population: <span>${Number(countryData.population).toLocaleString()}</span></h6>
                    <h6>Region: <span class="text-capitalize">${countryData.region}</span></h6>
                    <h6>Sub Region: <span class="text-capitalize">${countryData.subregion}</span></h6>
                    <h6>Capital: <span class="text-capitalize">${countryData.capital}</span></h6>
                    <h6>Google Maps: <span class=""><a href="${countryData.maps.googleMaps}" target="_blank">${countryData.name.common}</a></span></h6>
                  </div>
                  <div>
                    <h6>Top Level Domain: <span class="text-lowercase">${countryData.tld[0]}</span></h6>
                    <h6>Currencies: <span class="text-capitalize">${currencies}</span></h6>
                    <h6>Languages: <span class="text-capitalize">${Object.values(countryData.languages)}</span></h6>
                    
                    <h6>Timezone: <span>${countryData.timezones}</span></h6>
                    <h6>
                      Calling Code: <span><a href="tel:${countryData.idd.root + countryData.idd.suffixes}" class="text-primary">${countryData.idd.root + countryData.idd.suffixes}</a></span>
                    </h6>
                    <h6>Start Of Week: <span class="text-capitalize">${countryData.startOfWeek}</span></h6>
                  </div>
                </div>
                <div class="mt-5">
                  <h6 class="borders">
                    Border Countries:
                  </h6>
                </div>
              </div>
            </div>
        </div>`;
    countryInfoPage.insertAdjacentHTML("beforeend", countryDataHtml);

    // insert border countries
    eachCountryData.forEach((each) => {
      const borderHtml = `
        <object class="text-capitalize dark-mode-elements py-1 rounded-0 px-4 mx-1 small">
          <span>${each}</span>
        </object>
      `;
      document.querySelector(".borders").insertAdjacentHTML("beforeend", borderHtml);
    });
    mainPage.classList.add("d-none");
    countryInfoPage.classList.remove("d-none");
    window.scrollTo(0, 0);
    const bottom = document.querySelector(".bottom");
    // backBtn
    countryInfoBtn.addEventListener("click", function () {
      if (bottom) {
        bottom.remove();
      }
      mainPage.classList.remove("d-none");
      countryInfoPage.classList.add("d-none");
    });
  } catch (err) {
    console.log(err);
  }
};

const addCards = async function (api) {
  try {
    const response = await fetch(`${api}`);
    const data = await response.json();
    data.forEach((each) => {
      const cardHtml = `
        <div class="card dark-mode-elements">
            <img src="${each.flags.png}" alt="${each.cca3}" class="card-img-top flag" />
            <div class="card-body">
              <h5>${each.name.common}, <span class="cca3">${each.cca3}</span></h5>
              <div class="info">
                <h6>Population: <span>${Number(each.population).toLocaleString()}</span></h6>
                <h6>Region: <span class="text-capitalize">${each.region}</span></h6>
                <h6>Capital: <span class="text-capitalize">${each.capital}</span></h6>
              </div>
            </div>
          </div> `;
      countryCards.insertAdjacentHTML("afterbegin", cardHtml);
    });
    const allCards = document.querySelectorAll(".card");

    await searchApp(allCards);
    await displayMode(allCards);
    allCards.forEach((each) => {
      each.addEventListener("click", function (e) {
        const countryName = e.target.closest(".card").querySelector(".cca3");
        countryInfo(countryName.textContent);
      });
    });
    // console.log(allCards);
  } catch (err) {
    console.log(err);
  }
};

const sortByRegion = async function (each) {
  try {
    dropdownItems.forEach((each) => {
      each.addEventListener("click", async function () {
        sortBtn.textContent = each.textContent;
        // remove all the cards in the page
        countryCards.querySelectorAll(".card").forEach((each) => {
          each.remove();
        });
        // add cards w.r.t region that user selected
        await addCards(`https://restcountries.com/v3.1/region/${each.textContent}`);
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const getCountries = async function () {
  try {
    // get all countries for main page
    await addCards("https://restcountries.com/v3.1/all");
    await sortByRegion();
  } catch (err) {
    console.log(err);
  }
};

const searchApp = async function (allCards) {
  searchInput.addEventListener("input", function (e) {
    const insertedStr = String(e.target.value).toLowerCase();
    allCards.forEach((eachCard) => {
      if (eachCard.querySelector("h5").textContent.toLowerCase().includes(insertedStr)) {
        eachCard.classList.remove("d-none");
      } else {
        eachCard.classList.add("d-none");
      }
    });
  });
};

const displayMode = async function (allCards) {
  displayModeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    // when page is on dark mode
    if (body.classList.contains("dark-mode-body")) {
      this.querySelector("small").textContent = "🌙 dark mode";
      this.classList.remove("text-white");
      this.classList.add("text-dark");
      body.classList.remove("dark-mode-body", "text-white");
      body.classList.add("light-mode-body", "text-dark");
      header.classList.remove("dark-mode-header");
      header.classList.add("light-mode-header");
      searchInput.classList.remove("text-white");
      searchInput.classList.add("text-dark");
      eaches.forEach((each) => {
        each.classList.remove("dark-mode-elements");
        each.classList.add("light-mode-header");
      });
      dropdownBtn.classList.remove("btn-dark");
      dropdownBtn.classList.add("btn-light");
      dropdownMenu.classList.remove("dark-mode-elements");
      dropdownMenu.classList.add("light-mode-header");
      dropdownItems.forEach((each) => {
        each.classList.remove("text-white");
        each.classList.add("text-dark");
      });
      allCards.forEach((each) => {
        each.classList.remove("dark-mode-elements");
        each.classList.add("light-mode-header");
      });

      countryInfoBtn.classList.remove("btn-dark");
      countryInfoBtn.classList.add("btn-light");
      countryInfoBtn.classList.remove("dark-mode-elements");
      countryInfoBtn.classList.add("light-mode-header");

      const objs = countryInfoPage.querySelectorAll("object");
      objs.forEach((each) => {
        each.classList.remove("dark-mode-elements");
        each.classList.add("light-mode-header");
      });
    }
    // when page is on light mode
    else {
      this.querySelector("small").textContent = "🌞 light mode";
      body.classList.add("dark-mode-body", "text-white");
      body.classList.remove("light-mode-body", "text-dark");
      header.classList.add("dark-mode-header");
      header.classList.remove("light-mode-header");
      this.classList.add("text-white");
      this.classList.remove("text-dark");
      searchInput.classList.add("text-white");
      searchInput.classList.remove("text-dark");
      eaches.forEach((each) => {
        each.classList.add("dark-mode-elements");
        each.classList.remove("light-mode-header");
      });
      dropdownBtn.classList.add("btn-dark");
      dropdownBtn.classList.remove("btn-light");
      dropdownMenu.classList.add("dark-mode-elements");
      dropdownMenu.classList.remove("light-mode-header");
      dropdownItems.forEach((each) => {
        each.classList.add("text-white");
        each.classList.remove("text-dark");
      });
      allCards.forEach((each) => {
        each.classList.add("dark-mode-elements");
        each.classList.remove("light-mode-header");
      });

      countryInfoBtn.classList.add("btn-dark");
      countryInfoBtn.classList.remove("btn-light");
      countryInfoBtn.classList.add("dark-mode-elements");
      countryInfoBtn.classList.remove("light-mode-header");

      const objs = countryInfoPage.querySelectorAll("object");
      objs.forEach((each) => {
        each.classList.add("dark-mode-elements");
        each.classList.remove("light-mode-header");
      });
    }
  });
};

const initApp = function () {
  getCountries();
};
initApp();

// Selecting required DOM elements
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather_container");
const grantAccessContainer = document.querySelector(".grant-locationContainer");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading_container");
const userInfoContainer = document.querySelector(".userInfo_container");

// Initial variables
let currentTab = userTab;
const API_key = "35a8d61608cb8558b801d17670a796c0";
currentTab.classList.add("current-tab");
getFromSessionStorage();



function switchTab(clickedTab) {
    if (clickedTab !== currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // Check local storage for weather info
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    // Pass clicked tab as input
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    // Pass clicked tab as input
    switchTab(searchTab);
});




// Checks if coordinates are already present in the session storage
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}



async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    // Make grant container invisible
    grantAccessContainer.classList.remove("active");
    // Make loader active
    loadingScreen.classList.add("active");

    // API call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        loadingScreen.classList.remove("active");
    }
}



function renderWeatherInfo(weatherInfo) {
    // Firstly, we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    // temp.innerText = `${weatherInfo?.main?.temp} °C `;

    const kelvinTemp = weatherInfo?.main?.temp;
    const celsiusTemp = kelvinTemp ? (kelvinTemp - 273.15).toFixed(2) : "N/A";
    temp.innerText = `${celsiusTemp}°C`;

    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}



function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        // Show an alert for no geolocation support available
        alert("No geolocation support available");
    }
}



function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}



const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click", getLocation);



const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName === "") {
        return;
    } else {
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        loadingScreen.classList.remove("active");
    }
}









// const API_key = "35a8d61608cb8558b801d17670a796c0";

// async function showweather() {
//     let lat = 15.3333;
//     let lon = 74.0833;
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
//     const data = await response.json();
//     console.log("weather data is ", data);

//     //code to create a new para in document through js
//     let newpara = document.createElement('p');
//     newpara.textContent = `${data?.main?.temp.toFixed(2)} C`;

//     //to append it to document 
//     document.body.appendChild(newpara);
// }

// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }

//     else{
//         console.log("No geolocation support");
//     }
// }

// function showPosition(position){
//      let lat = position.coords.latitude;
//      let lon =position.coords.longitude;
//      console.log(lat);
//      console.log(lon);
// }

const usertab=document.querySelector("[data-userweather]");
const searchtab=document.querySelector("[data-searchweather]");
const usercontainer=document.querySelector(".weather_container");

const grantaccesscontainer=document.querySelector(".grant_location_container");
const searchform=document.querySelector("[data-searchform]");
const loadingscreen=document.querySelector(".loading_container");
const userinfocontainer=document.querySelector(".user_info_container");

 const apikey="3719eeb6abf3f167a7755834ea439e93";
  
let oldtab=usertab;
oldtab.classList.add("current-tab");
getfromsessionstorage();


function switchtab(newtab)
{
    if(newtab!=oldtab)
        {
            oldtab.classList.remove("current-tab");
            oldtab=newtab;
            oldtab.classList.add("current-tab");

           if(!searchform.classList.contains("active"))
            {
                userinfocontainer.classList.remove("active");
                grantaccesscontainer.classList.remove("active");
                searchform.classList.add("active");
            }
            else{
                searchform.classList.remove("active");
                userinfocontainer.classList.remove("active");
                getfromsessionstorage();
            }


        }

}

usertab.addEventListener("click",()=>
    {
        switchtab(usertab);
    });
    
    searchtab.addEventListener("click",()=>
        {
            switchtab(searchtab);
        });


function getfromsessionstorage()

{
    const localcoordinates=sessionStorage.getItem("user_coordinates");
    if(!localcoordinates)
        {
            grantaccesscontainer.classList.add("active");
           

        }
        else{
            const coordinates=JSON.parse(localcoordinates);
            fetchuserweatherinfo(coordinates);
        }

}
 async function fetchuserweatherinfo(coordinates)
{
    const {lat,lon}=coordinates;
    grantaccesscontainer.classList.remove("active");
    loadingscreen.classList.add("active");
     try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`
          );
        const  data = await response.json();
            loadingscreen.classList.remove("active");
            userinfocontainer.classList.add("active");
            renderweatherinfo(data);
}
     catch(err)
     {
        loadingscreen.classList.remove("active");
     }
}

function renderweatherinfo( weatherInfo)
{
    const cityname = document.querySelector("[data-cityname]");
    const countryicon = document.querySelector("[data-countryicon]");
    const desc = document.querySelector("[data-weatherdesc]");
    const weathericon = document.querySelector("[data-weathericon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    cityname.innerText = weatherInfo?.name;
    countryicon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weathericon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}


function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        
        alert(' was not found');
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchuserweatherinfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchform.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`
          );
        const data = await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err) {
       
    }
}




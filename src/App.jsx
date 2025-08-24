import { useEffect, useState } from 'react'
import './App.css'
import searchIcon from "./assets/image/search.png"
import clearIcon from './assets/image/clear.png'
import cloudIcon from './assets/image/cloud.png'
import drizzleIcon from './assets/image/drizzle.png'
import humidityIcon from './assets/image/humidity.png'
import rainIcon from './assets/image/rain.png'
import windIcon from './assets/image/wind.png'
import snowIcon from './assets/image/snow.png'

const WeatherDetails = ({icon, temp, city, country, lat, lon, humidity, wind}) => {
  return <>
    <div className="image">
      <img src={icon} alt="image" />
    </div>
    <div className="temp">{temp}°C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div>
        <span className="lat">Latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className="lon">Longitude</span>
        <span>{lon}</span>
      </div>
    </div>
    <div className="data-container">
      <div className='element'>
        <img src={humidityIcon} alt="humidity" className='icon' />
        <div className="data">
          <div className="humidity-percent">{humidity}%</div>
          <div className="text">Humidity</div>
        </div>
      </div>
      <div className='element'>
        <img src={windIcon} alt="wind" className='icon' />
        <div className="data">
          <div className="wind-speed">{wind} km/h</div>
          <div className="text">Wind speed</div>
        </div>
      </div>
    </div>
  </>
}



function App() {
  let api_key = "b75c591e7f65e207b7fa9662c5b5726a";
  const [text, setText] = useState("Nagapattinam")

  const [icon, setIcon] = useState(clearIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":drizzleIcon,
    "04n":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
  };

  const search = async () => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try{
      setLoading(true);

      let res = await fetch(url);
      let data = await res.json();
      if(data.cod === "404"){
        console.log("City Not Found")
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLon(data.coord.lon);
      setLat(data.coord.lat);
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    }catch(error){
      console.log("An error occured:", error.message);
      setError("An error occured while fetching weather data.")
    }finally{
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e)=>{
    if(e.key === "Enter"){
      search();
    }
  }

  useEffect(function(){
    search();
  }, [])

  return (
    <>
      <div className='container'>
        <div className="input-container">
          <input type="text" className='cityInput' placeholder='Enter city name' value={text} onChange={handleCity} onKeyDown={handleKeyDown}/>
          <div className="search-icon">
          <img src={searchIcon} alt="search" onClick={search}/>
          </div>
        </div>
        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} lon={lon} humidity={humidity} wind={wind}/>}

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className='error-message'>{error}</div>}
        {cityNotFound && <div className="city-not-found">"City not found"</div>}

        <div className="copy-write">
         
        </div>
      </div>
    </>
  )
}

export default App

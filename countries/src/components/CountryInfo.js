import { useEffect, useState } from 'react';
import axios from 'axios';

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${
          country.capitalInfo.latlng[0]
        }&lon=${country.capitalInfo.latlng[1]}&appid=${
          process.env.REACT_APP_API_KEY || null
        }`
      )
      .then((response) => {
        setWeather(response.data);
      });
  }, [country]);

  return (
    <div>
      <h2>{country.name.official}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <p>Population: {country.population}</p>
      <p>Languages:</p>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        alt={country.name.official}
        style={{ height: '5%', width: '15%' }}
      />
      <br />
      {weather.weather && (
        <>
          <b>Weather in {country.capital[0]}:</b>
          <br />
          <p>Temperature {Math.round(weather.main.temp - 273.15)}&#8451;</p>

          <img
            style={{ backgroundColor: 'lightgray', borderRadius: 30 }}
            alt={weather.weather[0].main}
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          />
          {/* {weather.weather[0].main} */}
          <p>Wind {weather.wind.speed} m/s </p>
        </>
      )}
    </div>
  );
};

export default CountryInfo;

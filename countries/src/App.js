import { useState, useEffect } from 'react';
import axios from 'axios';
import CountriesList from './components/CountriesList';
const App = () => {
  const [value, setValue] = useState('');
  const [countriesList, setCountriesList] = useState([]);
  // const [filteredCountries, setFilteredCountries] = useState([]);
  //const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((r) => {
        // const cs = r.data.map((c) => c.name.common);
        setCountriesList(r.data);
        console.log(typeof countriesList);
      });
    // .catch((err) => {});
  }, []);
  // useEffect(() => {}, [value]);
  const changeHandler = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="App">
      <label htmlFor="inputValue">Find countries:</label>
      <input
        type="text"
        id="inputValue"
        value={value}
        onChange={changeHandler}
      />
      <CountriesList countries={countriesList} countryFilter={value} />
    </div>
  );
};

export default App;

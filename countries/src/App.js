import { useState, useEffect } from 'react';
import axios from 'axios';
import CountriesList from './components/CountriesList';
const App = () => {
  const [value, setValue] = useState('');
  const [countriesList, setCountriesList] = useState([]);
  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((r) => {
        setCountriesList(r.data);
      });
    // .catch((err) => {});
  }, []);
  const changeHandler = (e) => {
    setValue(e.target.value);
  };
  const handleShow = (c) => {
    setValue(c.name.common);
  };
  return (
    <div className="App">
      <label>Find countries:</label>
      <input type="text" value={value} onChange={changeHandler} />
      <CountriesList
        countries={countriesList}
        countryFilter={value}
        handleShow={handleShow}
      />
    </div>
  );
};

export default App;

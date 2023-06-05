const CountryInfo = ({ country }) => (
  <div>
    <h2>{country.name.official}</h2>
    <b>Capital:</b> {country.capital}
    <br />
    <b>Area:</b> {country.area}
    <br />
    <b>Population:</b> {country.population}
    <br />
    <b>Languages:</b>
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
  </div>
);

export default CountryInfo;

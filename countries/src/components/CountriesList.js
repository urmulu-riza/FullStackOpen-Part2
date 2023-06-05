import CountryInfo from './CountryInfo';

const CountriesList = ({ countries, countryFilter, handleShow }) => {
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(countryFilter.toLowerCase())
  );
  console.log(filteredCountries);
  return (
    <>
      {filteredCountries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}
      {filteredCountries.length < 1 && (
        <p>No matches, specify another filter.</p>
      )}
      {filteredCountries.length > 1 && filteredCountries.length <= 10 && (
        <table>
          <tbody>
            {filteredCountries.map((country) => (
              <tr key={country.name.official}>
                <td>{country.name.common} </td>
                <td>
                  <button onClick={() => handleShow(country)}>Show</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {filteredCountries.length === 1 && (
        <CountryInfo country={filteredCountries[0]} />
      )}
    </>
  );
};

export default CountriesList;

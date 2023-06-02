import { useState } from 'react';

const Numbers = ({ persons }) => (
  <div>
    <h2>Numbers</h2>
    <ul>
      {persons.map((p) => (
        <li key={p.name}>
          {p.name} {p.number}
        </li>
      ))}
    </ul>
  </div>
);
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' },
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const handleChange = (e, type) => {
    switch (type) {
      case 'name':
        setNewName(e.target.value);
        break;
      case 'number':
        setNewNumber(e.target.value);
        break;
      default:
        break;
    }
  };
  const addPerson = (e) => {
    e.preventDefault();
    if (persons.filter((p) => p.name === newName)[0])
      //'some' method can be used too
      return alert(`${newName} is already added to phonebook`);
    setPersons(persons.concat({ name: newName, number: newNumber }));
    setNewName('');
    setNewNumber('');
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name:
          <input value={newName} onChange={(e) => handleChange(e, 'name')} />
        </div>
        <div>
          number:
          <input
            value={newNumber}
            onChange={(e) => handleChange(e, 'number')}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      {/* <p>debug:{newName}</p> */}
      <Numbers persons={persons} />
    </div>
  );
};

export default App;

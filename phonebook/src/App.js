import { useState } from 'react';

const Numbers = ({ persons, filtered }) => (
  <div>
    <h2>Numbers</h2>
    <ul>
      {persons
        .filter((p) => p.name.toLowerCase().includes(filtered.toLowerCase()))
        .map((p) => (
          <li key={p.name}>
            {p.name} {p.number}
          </li>
        ))}
    </ul>
  </div>
);
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' },
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filtered, setFiltered] = useState('');

  const handleChange = (e, type) => {
    switch (type) {
      case 'name':
        setNewName(e.target.value);
        break;
      case 'number':
        setNewNumber(e.target.value);
        break;
      case 'filtered':
        setFiltered(e.target.value);
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
          filter shown with:
          <input
            value={filtered}
            onChange={(e) => handleChange(e, 'filtered')}
          />
        </div>
        <h2>Add a new contact:</h2>
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
      <Numbers persons={persons} filtered={filtered} />
    </div>
  );
};

export default App;

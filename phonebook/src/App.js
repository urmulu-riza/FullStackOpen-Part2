import { useState } from 'react';

const Numbers = ({ persons }) => (
  <div>
    <h2>Numbers</h2>
    <ul>
      {persons.map((p) => (
        <li key={p.name}>{p.name}</li>
      ))}
    </ul>
  </div>
);
const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas' }]);
  const [newName, setNewName] = useState('');
  const handleChange = (e) => {
    setNewName(e.target.value);
  };
  const addPerson = (e) => {
    e.preventDefault();
    setPersons(persons.concat({ name: newName }));
    setNewName('');
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name:
          <input value={newName} onChange={handleChange} />
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

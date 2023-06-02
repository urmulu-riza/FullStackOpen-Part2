import { useState } from 'react';
import Form from './components/Form';
import Numbers from './components/Number';
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
      <Form {...{ addPerson, filtered, handleChange, newName, newNumber }} />
      {/* <p>debug:{newName}</p> */}
      <Numbers persons={persons} filtered={filtered} />
    </div>
  );
};

export default App;

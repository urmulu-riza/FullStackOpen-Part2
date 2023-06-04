import { useState, useEffect } from 'react';
import Form from './components/Form';
import Numbers from './components/Numbers';
import Persons from './services/persons';
const App = () => {
  const [persons, setPersons] = useState([]);
  // [{ name: 'Arto Hellas', number: '040-123456' },
  // { name: 'Ada Lovelace', number: '39-44-5323523' },
  // { name: 'Dan Abramov', number: '12-43-234345' },
  // { name: 'Mary Poppendieck', number: '39-23-6423122' },]
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filtered, setFiltered] = useState('');

  useEffect(() => {
    Persons.getAll().then((initalPersons) => {
      setPersons(initalPersons);
    });
  }, []);

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
  const duplicate = (dup) => {
    if (dup.number === newNumber)
      return alert(`${newName} is already added to phonebook`);
    if (
      window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      )
    )
      Persons.update(dup.id, { ...dup, number: newNumber }).then((r) =>
        setPersons(persons.map((p) => (p.id !== dup.id ? p : r)))
      );
  };
  const addPerson = (e) => {
    e.preventDefault();
    const dup = persons.filter((p) => p.name === newName)[0];
    //'some' method can be used too
    if (dup) {
      duplicate(dup);
    } else {
      Persons.create({ name: newName, number: newNumber }).then((r) => {
        setPersons(persons.concat(r));
        setNewName('');
        setNewNumber('');
      });
    }
  };
  const deletePerson = (id) => {
    window.confirm(`Delete ${persons.find((p) => p.id === id).name}?`) &&
      Persons.deleteAxios(id)
        .then((r) => setPersons(persons.filter((p) => p.id !== id)))
        .catch((err) => {
          alert(err);
        });
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Form {...{ addPerson, filtered, handleChange, newName, newNumber }} />
      {/* <p>debug:{newName}</p> */}
      <Numbers {...{ persons, filtered, deletePerson }} />
    </div>
  );
};

export default App;

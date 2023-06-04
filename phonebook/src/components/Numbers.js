const Numbers = ({ persons, filtered, deletePerson }) => (
  <div>
    <h2>Numbers</h2>
    <ul>
      {persons
        .filter((p) => p.name.toLowerCase().includes(filtered.toLowerCase()))
        .map((p) => (
          <li key={p.name}>
            {p.name} {p.number}
            <button onClick={() => deletePerson(p.id)}>Delete</button>
          </li>
        ))}
    </ul>
  </div>
);

export default Numbers;

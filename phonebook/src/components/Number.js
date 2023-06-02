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

export default Numbers;

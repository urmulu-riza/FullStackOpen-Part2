const Filter = ({ addPerson, filtered, handleChange, newName, newNumber }) => (
  <>
    <form onSubmit={addPerson}>
      <div>
        filter shown with:
        <input value={filtered} onChange={(e) => handleChange(e, 'filtered')} />
      </div>
      <h2>Add a new contact:</h2>
      <div>
        name:
        <input value={newName} onChange={(e) => handleChange(e, 'name')} />
      </div>
      <div>
        number:
        <input value={newNumber} onChange={(e) => handleChange(e, 'number')} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </>
);
export default Filter;

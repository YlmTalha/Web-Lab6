function FilterForm({ value, onChange }) {
  return (
    <form style={{ marginBottom: '16px' }} onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="filter">Filter by title: </label>
      <input
        id="filter"
        type="text"
        placeholder="Type a word..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </form>
  )
}

export default FilterForm

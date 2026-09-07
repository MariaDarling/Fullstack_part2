import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filterTerm, handleFilterChange }) => {
  return (
    <div>
      filter shown with: <input value={filterTerm} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ personsToShow }) => {
  return (
    <ul>
      {personsToShow.map(person => (
        <li key={person.id || person.name}>
          {person.name} {person.number}
        </li>
      ))}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterTerm, setFilterTerm] = useState('')


  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
      .catch(error => {
        console.error('Error al obtener los datos de la agenda:', error)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterTerm(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = persons.some(
      person => person.name.toLowerCase() === newName.trim().toLowerCase()
    )

    if (nameExists) {
      alert(`${newName.trim()} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName.trim(),
      number: newNumber.trim()
    }

   
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }


  const personsToShow = filterTerm === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(filterTerm.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filterTerm={filterTerm} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App
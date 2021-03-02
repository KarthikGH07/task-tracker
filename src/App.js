import Header from './components/Header'
import './App.css'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import { useState, useEffect } from 'react'

function App() {
  const [showAddTask, setShowAddTask] = useState()
  const [tasks, setTasks] = useState([])

  useEffect( () => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  //Fetch tasks from json-server
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

//Add task
const addTask = async (task) => {
  const res = await fetch('http://localhost:5000',
  {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(task)
  })

  const data = await res.json()

  setTasks([...Tasks, data])
  // const id = Math.floor(Math.random() * 10000 ) + 1;
  // const newTask = { id, ...task }
  // setTasks([ ...tasks, newTask ])
}

//delete task
const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'DELETE',
  })

  setTasks(tasks.filter((task) => task.id !== id));
}

const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await res.json()

  return data
}

const toggleReminder = async (id) => {
  const taskToToggle = await fetchTask(id)
  const updTask = {...taskToToggle,
  reminder: !taskToToggle.reminder }

  const res = await fetch(`http://localhost:5000/tasks/${id}`,
  {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(updTask)
  })

  const data = await res.json()

  setTasks( 
    tasks.map((task) => 
    task.id === id ? { ...task, reminder: data.reminder} : task))
}

  return (
    <div className="container">
      <Header onAdd={ () => 
        setShowAddTask(!showAddTask)} showAdd = {showAddTask}/>
      { showAddTask && <AddTask onAdd={addTask}/> }
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete = {deleteTask} onToggle = {toggleReminder}/> : 'No Tasks to Show'}
    </div>
  );
}



export default App;

import { useState, useEffect } from 'react'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import about from './components/about'
import { BrowserRouter as Router, Route } from 'react-router-dom'
function App() {
  const [showAddTask, setShowAddtask] = useState(false);
  const [tasks, settasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      settasks(tasksFromServer)
    }
    getTasks()
  }, [])

  //fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }
  //Add toggle form
  const onAdd = () => {
    setShowAddtask(!showAddTask);
  }

  //add task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    settasks([...tasks, data])

    // const id = tasks.length+1;
    // const newTask = {id,...task}
    // settasks([...tasks, newTask])

  }

  // delete task
  const deleteTask = async (id) => {

    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
    settasks(tasks.filter((task) => task.id !== id))
  }

  //toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTasks(id)
    const updTask = { ...taskToToggle[0], reminder: !taskToToggle[0].reminder }


    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })

    const data = await res.json()

    settasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    )
  }
  return (
    <Router>
      <div className="container">
      <Header onAdd={onAdd} showAddTask={showAddTask} />
      <Route path='/' exact render={(props) => (
          <>
            
            {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'There is no task to show'}
            {showAddTask ? <AddTask onAdd={addTask} /> : ''}
          </>
        )} />
        
        <Route path='/about' component={about} />
        <Footer/>
      </div>
    </Router>
  );
}

export default App;

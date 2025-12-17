import { useState } from 'react'
import './App.css'

type Category = 'Health' | 'Work' | 'Mental Health' | 'Others'

interface Todo {
  id: number
  text: string
  completed: boolean
  category: Category
  time?: string
}

interface CategoryInfo {
  name: Category
  icon: string
  color: string
  count: number
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Drink 8 glasses of water', completed: false, category: 'Health', time: '6:00' },
    { id: 2, text: 'Edit the PDF', completed: false, category: 'Work', time: '' },
    { id: 3, text: 'Get a notebook', completed: false, category: 'Mental Health', time: '9:00' },
    { id: 4, text: 'Work', completed: false, category: 'Work', time: '10:00' },
  ])
  const [inputValue, setInputValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>('Health')
  const [selectedTime, setSelectedTime] = useState('')
  const [currentView, setCurrentView] = useState<'tasks' | 'calendar'>('tasks')

  const getCategoryInfo = (): CategoryInfo[] => {
    const categories: Category[] = ['Health', 'Work', 'Mental Health', 'Others']
    const categoryColors = {
      'Health': '#8B7FE8',
      'Work': '#4CAF50',
      'Mental Health': '#FF89B5',
      'Others': '#9E9E9E'
    }
    const categoryIcons = {
      'Health': '💊',
      'Work': '💼',
      'Mental Health': '🧠',
      'Others': '📋'
    }

    return categories.map(cat => ({
      name: cat,
      icon: categoryIcons[cat],
      color: categoryColors[cat],
      count: todos.filter(t => t.category === cat).length
    }))
  }

  const addTodo = () => {
    if (inputValue.trim() === '') return

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      category: selectedCategory,
      time: selectedTime
    }

    setTodos([...todos, newTodo])
    setInputValue('')
    setSelectedTime('')
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const categoryInfo = getCategoryInfo()
  const currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })

  return (
    <div className="app">
      <div className="header">
        <h1>{currentView === 'tasks' ? 'Tasks' : 'Calendar'} <span className="date">{currentDate}</span></h1>
        <div className="view-toggle">
          <button
            className={currentView === 'tasks' ? 'active' : ''}
            onClick={() => setCurrentView('tasks')}
          >
            Tasks
          </button>
          <button
            className={currentView === 'calendar' ? 'active' : ''}
            onClick={() => setCurrentView('calendar')}
          >
            Calendar
          </button>
        </div>
      </div>

      {currentView === 'tasks' ? (
        <>
          <div className="category-grid">
            {categoryInfo.map(cat => (
              <div key={cat.name} className="category-card" style={{ backgroundColor: cat.color + '20' }}>
                <div className="category-icon" style={{ backgroundColor: cat.color }}>
                  {cat.icon}
                </div>
                <div className="category-info">
                  <div className="category-count">{cat.count}</div>
                  <div className="category-name">{cat.name}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="add-task-section">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="task-input"
            />
            <div className="task-options">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as Category)}
                className="category-select"
              >
                <option value="Health">Health</option>
                <option value="Work">Work</option>
                <option value="Mental Health">Mental Health</option>
                <option value="Others">Others</option>
              </select>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="time-input"
              />
              <button onClick={addTodo} className="add-btn">+ Add</button>
            </div>
          </div>

          <div className="tasks-list">
            {todos.map(todo => (
              <div key={todo.id} className="task-item">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="task-checkbox"
                />
                <div className="task-content">
                  <div className="task-text">{todo.text}</div>
                  <div className="task-category" style={{
                    color: categoryInfo.find(c => c.name === todo.category)?.color
                  }}>
                    {todo.category.toUpperCase()}
                  </div>
                </div>
                <button onClick={() => deleteTodo(todo.id)} className="delete-btn">×</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="calendar-view">
          <div className="week-selector">
            {[25, 26, 27, 28, 29].map(day => (
              <div key={day} className={`day-chip ${day === 26 ? 'active' : ''}`}>
                <div className="day-label">{['WED', 'THU', 'FRI', 'SAT', 'SUN'][day - 25]}</div>
                <div className="day-number">{day}</div>
              </div>
            ))}
          </div>

          <div className="timeline">
            {['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00'].map(time => (
              <div key={time} className="time-slot">
                <div className="time-label">{time}</div>
                <div className="time-events">
                  {todos.filter(t => t.time === time).map(todo => (
                    <div
                      key={todo.id}
                      className="calendar-event"
                      style={{
                        backgroundColor: categoryInfo.find(c => c.name === todo.category)?.color
                      }}
                    >
                      {categoryInfo.find(c => c.name === todo.category)?.icon} {todo.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App

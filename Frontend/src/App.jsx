import { useReducer } from 'react'
import './App.css'

function App() {
  const reducer = (state, action) => {
    switch (action) {
      case 'UP':
        return state + 1
      case 'DOWN':
        return state - 1
      default:
        throw new Error('Unknown action: ' + action)
    }

  }

  const UP = 'UP'
  const DOWN = 'DOWN'

  const [count, dispatch] = useReducer(reducer, 0)

  return (
    <>
      <div>
        <h1>{count}</h1>
        <button onClick={() => dispatch(UP)}>Up</button>
        <button onClick={() => dispatch(DOWN)}>Down</button>
      </div>
    </>
  )
}

export default App

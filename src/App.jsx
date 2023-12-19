import './App.css'
import Authentication from './pages/Authentication'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import TodoList from './pages/TodoList'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Authentication />
    },
    {
      path: '/todo',
      element: <TodoList />
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App

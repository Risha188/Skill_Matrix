import {RouterProvider} from 'react-router-dom'
import router from './router/AppRouter.jsx';
import './index.css'
import React from 'react'
const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App

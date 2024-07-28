import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import './index.css'
import { ThemeProvider } from './components/theme-provider.tsx'

const router = createBrowserRouter([{
  path:"/",
  element:<App/>
}])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      
    <RouterProvider router={router}/>
    </ThemeProvider>
  </React.StrictMode>,
)

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/theme-provider.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { SocketProvider } from './context/SocketContext.tsx'

createRoot(document.getElementById('root')!).render(

    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <BrowserRouter>

      <AuthProvider>
        <SocketProvider>
        <App />
        </SocketProvider>
        <ToastContainer/>

      </AuthProvider>
        </BrowserRouter>
    </ThemeProvider>
 
)

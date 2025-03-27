import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './src/index.css'
import App from './src/App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './src/context/AdminContext.jsx'
import DoctorContextProvider from './src/context/DoctorContext.jsx'
import AppContextProvider from './src/context/Appcontext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>

  </BrowserRouter>,
)

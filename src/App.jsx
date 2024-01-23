import './App.css'
import Router from './router/router'
import { RouterProvider } from 'react-router-dom'
import  { Toaster } from "react-hot-toast";
function App() {

  return (
    <>
      <main>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={Router}></RouterProvider>
      </main>
    </>
  )
}

export default App

import { BrowserRouter } from "react-router-dom"
import Alert from "./components/alert"
import { AlertProvider } from "./contexts/alertContext"
import Router from "./routers/router"


function App() {

  return (
    <>
      <AlertProvider>
        <BrowserRouter>
          <Router />
          <Alert />
        </BrowserRouter>
      </AlertProvider>
    </>
  )
}

export default App

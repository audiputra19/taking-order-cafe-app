import { BrowserRouter } from "react-router-dom"
import Router from "./routers/router"
import { AlertProvider } from "./contexts/alertContext"
import Alert from "./components/alert"
import LoadingPage from "./components/loadingPage"


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

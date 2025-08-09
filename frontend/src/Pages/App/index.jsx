import { useRoutes, BrowserRouter } from 'react-router-dom'
import NotFound from '../NotFound'
import Signin from '../Signin'
import DashBoard from '../DashBoard'
import Clients from '../Clients'
import ChatBot from '../ChatBot'
import ListClients from '../ListClients'
import Prompt from '../Prompt'
import ListPrompt from '../ListPrompt'
import './App.css'


const AppRoutes = () => {
  let routes = useRoutes([
    {path:'/', element: <Signin /> },
    {path:'/*', element: <NotFound />},
    {path:'/DashBoard', element: <DashBoard />},
    {path:'/Clients', element: <Clients />},
    {path:'/Clients/list', element: <ListClients />},
    {path:'/ChatBot', element: <ChatBot />},
    {path:'/prompt', element: <Prompt />},
    {path:'/prompt/list', element: <ListPrompt />},
  ])
  return routes
}

const App = () => {
  return (
    <BrowserRouter>
    <AppRoutes />
    </BrowserRouter>
  )
}

export default App


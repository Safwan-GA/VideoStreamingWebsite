import { useState, useEffect } from 'react'
import Home from './components/Home'
import './App.css'
import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from './components/Loading';
import { RouterProvider } from 'react-router-dom';
import ErrorPage from './components/ErrorPage';
import { Provider } from 'react-redux';
import { store } from './components/redux/store';
import Menu from './components/Menu';

const Upload=lazy(()=>import('./components/Upload'))
const Login=lazy(()=>import('./components/Login'))
const Register=lazy(()=>import('./components/Register'))
const CreateChannel=lazy(()=>import('./components/Channel').then(module=>({default:module.CreateChannel})))
const Channel=lazy(()=>import('./components/Channel'))
const VideoPlayer = lazy(() => import('./components/VideoPlayer'));

function RootLayout(){
  return(
    <>
    <Suspense fallback={<Loading />}>
    <Menu />
    <Outlet />
    </Suspense>
    </>
  )
}

const routes=createBrowserRouter([{
  path:'/',
  element:<RootLayout/>,
  errorElement: <ErrorPage />,
  children:[
    {path:'/',element:<Home/>},
    {path:'/upload', element:<Upload />},
    {path:'/Register', element:<Register />},
    {path:'/Login', element:<Login />},
    {path:'/CreateChannel', element:<CreateChannel />},
    {path:'/Channel', element:<Channel />},
    {path:'/video', element: <VideoPlayer /> }
  ]
}])

function App() {
  const [theme, setTheme] = useState(()=>
  localStorage.getItem('theme') || 'light'
  )

  useEffect(()=>{
    document.documentElement.setAttribute('theme',theme);
    localStorage.setItem('theme',theme)
  },[theme]);
  const toggleTheme=()=>{
    setTheme((prev)=>prev=='light'?'dark':'light')
  }

  return (
    <Provider store={store}>
      <RouterProvider router={routes}/>
    </Provider>
  )
}

export default App

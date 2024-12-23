import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MyLibraryPage from "./pages/MyLibraryPage.jsx"
import DiscoverPage from "./pages/DiscoverPage.jsx";
import RegistrationPage from "./pages/Registration.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element:<LoginPage />,
  },
  {
    path: "/registration",
    element: <RegistrationPage/>,
  },
  {
    path: "/home",
    element:
    <>
      <Header/>
      <HomePage />,
      <Footer/>
   </>
  }, 
 
 {
    path: "/mylibrary",
    element: <MyLibraryPage/>,
  },
  {
    path: "/discoverpage",
    element: <DiscoverPage />,
  },
// /------------------Componets------------------------/ 
 


]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
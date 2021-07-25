import "reflect-metadata";

import React, {useState} from "react";
import "./App.css";
import Login from "./components/Login";
import SignIn from "./components/SignIn";


function App() {
  const [login, setLogin] = useState(true);
  return (
    <div className="App">
      {
        login ?
        <Login />
        :
        <SignIn/>
      }
    </div>
  );
}

export default App;

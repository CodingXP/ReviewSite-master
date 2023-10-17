import React, { Component, useState, useEffect, useLayoutEffect } from 'react';
import './css/Header.css';
import Home from './pages/Home';
import Temp from './pages/Temp';
import NoPage from './pages/NoPage';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Popup from 'reactjs-popup';
import $ from 'jquery';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="appHeader">
            <div className="navBar">
              <NavLink route="/" btn="Home" />
              <NavLink route="/temp" btn="Temp" />
              <NavBarAuth />
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/temp" element={<Temp />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

function NavLink({ route, btn }) {
  return (
    <div>
      <Link to={route}>
        <button className="button">{btn}</button>
      </Link>
    </div>
  );
}


function NavBarAuth () {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(() => {
    const initial = JSON.parse(localStorage.getItem("USERNAME"));
    return initial || "";
  });
  const [isLoggedin, setIsLoggedIn] = useState(() => {
    const initial = JSON.parse(localStorage.getItem('LOGIN_STATUS'));
    return initial || false;  
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    const initial = JSON.parse(localStorage.getItem("ADMIN_STATUS"));
    return initial || false;
  })

  useEffect(() => {
    const data = window.localStorage.getItem("LOGIN_STATUS");
    if (data !== null){
      setIsLoggedIn(JSON.parse(data));
      window.localStorage.setItem("LOGIN_STATUS", JSON.stringify(isLoggedin));
    }
  }, [])

  useEffect(() => {
    const data = window.localStorage.getItem("USERNAME");
    if (data !== ""){
      setUsername(JSON.parse(data));
      window.localStorage.setItem("USERNAME", JSON.stringify(username));
    }
  }, [])

  useEffect(() => {
    const admin = window.localStorage.getItem("ADMIN_STATUS");
    if (admin !== null){
      setIsAdmin(JSON.parse(admin));
      window.localStorage.setItem("ADMIN_STATUS", JSON.stringify(isAdmin));
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem("ADMIN_STATUS", JSON.stringify(isAdmin));
  }, [isAdmin])

  useEffect(() => {
    window.localStorage.setItem("LOGIN_STATUS", JSON.stringify(isLoggedin));
  }, [isLoggedin]);

  useEffect(() => {
    window.localStorage.setItem("USERNAME", JSON.stringify(username));
  }, [username]);

  const handleUsernameChange = function(e) {
    setUsername(e.target.value);
  }
  const handlePasswordChange = function(e) {
    setPassword(e.target.value);
  }

  function handleLogout() {
    localStorage.setItem("LOGIN_STATUS", false);
    localStorage.setItem("USERNAME", null);
    localStorage.setItem('ADMIN_STATUS', false);
    window.location.reload(true);
  }

  const handleSubmit = function(e){
    e.preventDefault();
    const form = $(e.target);
    setUsername("");
    setPassword("");

    $.ajax({
      type: "POST",
      url: form.attr("action"),
      data: form.serialize(),
      success(data) {
      if (data) {
        try {
          data = JSON.parse(data);
          console.log(data);
          if (data['username'] === username){
            if (data['isAdmin'] === 1){
              setIsAdmin(true);
              window.localStorage.setItem("ADMIN_STATUS", JSON.stringify(true)); 
            }
            setIsLoggedIn(true);
            window.localStorage.setItem("USERNAME", JSON.stringify(username));
            window.location.reload(true);
          } 
        } catch (error) {
          console.log(error);
        }
      }
      else {
        alert("Incorrect login data!");
      }
      },
    });
  }

  return (
    <div className='userBtns'>
      <div>
        {!isLoggedin && <Popup trigger={
          <button className='button'>Register</button>
        } position={'bottom center'}>{
          close => (
            <div className='registerPopup'>
              <form action="http://localhost:8000/php/users.php" method='POST' onSubmit={(event) => handleSubmit(event)}>
                <input className='input' type='text' id='username' name='username' value={username} onChange={(event) => handleUsernameChange(event)} placeholder='username'></input>
                <input className='input' type='text' id='password' name='password' value={password} onChange={(event) => handlePasswordChange(event)} placeholder='password'></input>
                <button className="button" type="submit" name="register">Register</button>
              </form>
            </div>
          )
        }
        </Popup>}

        {!isLoggedin && <Popup trigger={
          <button className='button'>Login</button>
        } position={'bottom center'}>{
          close => (
            <div className='loginPopup'>
              <form action="http://localhost:8000/php/login.php" method='POST' onSubmit={(event) => handleSubmit(event)}>
                <input className='input' type='text' id='username' name='username' value={username} onChange={(event) => handleUsernameChange(event)} placeholder='username'></input>
                <input className='input' type='password' id='password' name='password' value={password} onChange={(event) => handlePasswordChange(event)} placeholder='password'></input>
                <button className="button" type="submit" name="register">Login</button>
              </form>
            </div>
          )
        }
        </Popup>}
        {isLoggedin && <li className='dropdown'>
          <div>
              <button className='button' style={{color: isAdmin ? '#f54257' : ''}}>{username}</button> 
              <div className='dropdownContent'>
                <button className='button'>Profile</button>
                <button className='button' onClick={handleLogout}>Logout</button>
              </div>
          </div>  
        </li>}
      </div>
    </div>
  );
}

export default App;

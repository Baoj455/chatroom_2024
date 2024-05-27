import React, { useState } from 'react';
import { Login, Signup } from './login';
import { Chatroom } from './chatroom';

function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const switchToSignup = () => {
    setIsSignUp(true);
  };
  const switchToSignin = () => {
    setIsSignUp(false);
  };
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? <Chatroom onLogout={handleLogout}/> 
      : isSignUp ? <Signup onLogin={handleLogin} onSwitchToSignin={switchToSignin} /> 
      : <Login onLogin={handleLogin} onSwitchToSignup={switchToSignup} />}
    </div>
  );
}

export default App;

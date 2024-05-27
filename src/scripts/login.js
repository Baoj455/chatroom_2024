import { auth, googleAuth } from "../config"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { useState } from "react";
import '../login.css';

export const Login = ({ onLogin, onSwitchToSignup }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignupPage, setIsSignupPage] = useState(false);


    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                onLogin();
                alert("Sign in successful!");
            })
            .catch((error) => {
                console.error("Sign in error:", error.message);
            });
    };
    
    
    const signInGoogle = () => {
        signInWithPopup(auth, googleAuth)
            .then((userCredential) => {
                onLogin();
                alert("Sign in successful!");
            })
            .catch((error) => {
                console.error("Sign in error:", error.message);
            });
    };

    return (
        <div className="auth">
            <div className="button-container">
                <button className={!isSignupPage ? "button-active" : "button-normal"} onClick={() => setIsSignupPage(false)}>Sign In</button>
                <button className={isSignupPage ? "button-active" : "button-normal"} onClick={onSwitchToSignup}>Sign Up</button>
            </div>
            <input 
                className="input-field"
                type="email" 
                id="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}>
            </input>
            <input 
                className="input-field"
                type="password" 
                id="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}>
            </input>
            <button className="function-button" onClick={signIn}>Sign In</button>
            <button className="function-button" onClick={signInGoogle}>Sign In With Google</button>
        </div>
    );
}

export const Signup = ({ onLogin, onSwitchToSignin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [isSignupPage, setIsSignupPage] = useState(true);

    const signUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                updateProfile(user, {
                    displayName: nickname
                }).then(() => {
                    onLogin();
                })
                alert("Sign in successful!");
            })
            .catch((error) => {
                console.error("Sign up error:", error.message);
            });
    };

    return (
        <div className="auth">
            <div className="button-container">
                <button className={!isSignupPage ? "button-active" : "button-normal"} onClick={onSwitchToSignin}>Sign In</button>
                <button className={isSignupPage ? "button-active" : "button-normal"} onClick={() => setIsSignupPage(true)}>Sign Up</button>
            </div>
            <input 
                className="input-field"
                type="email" 
                id="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}>
            </input>
            <input 
                className="input-field"
                type="password" 
                id="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}>
            </input>
            <input 
                className="input-field"
                type="text" 
                id="nickname" 
                placeholder="Nickname" 
                value={nickname} 
                onChange={(e) => setNickname(e.target.value)}>
            </input>
            <button className="function-button" onClick={signUp}>Finished!</button>
        </div>
    );
}

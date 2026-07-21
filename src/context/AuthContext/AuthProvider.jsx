import React from 'react';
import { AuthContext } from './AuthContext';
import { auth } from '../../firebase/firebase.init';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const AuthProvider = ({ children }) => {

    const registerUser = (email, password) => {
        // Implement user registration logic here
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const loginUser = (email, password) => {
        // Implement user login logic here
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logoutUser = () => {
        // Implement user logout logic here
        return signOut(auth);
    }

    const authInfo = {
        registerUser,
        loginUser,
        logoutUser,
        // Add any authentication-related state or functions here
    };

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;
import React, {useEffect, useState} from 'react';
import { AuthContext } from './AuthContext';
import { auth } from '../../firebase/firebase.init';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const registerUser = (email, password) => {
        setLoading(true);
        // Implement user registration logic here
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const loginUser = (email, password) => {
        setLoading(true);
        // Implement user login logic here
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logoutUser = () => {
        setLoading(true);
        // Implement user logout logic here
        return signOut(auth);
    }
    const signInWithGoogle = () => {
        setLoading(true);
        // Implement Google sign-in logic here
        return signInWithPopup(auth, googleProvider);
    }

    // Set up an authentication state observer to track user login status
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);


    const authInfo = {
        user,
        loading,
        registerUser,
        loginUser,
        logoutUser,
        signInWithGoogle,
        // Add any authentication-related state or functions here
    };

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;
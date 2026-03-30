import React, { createContext, useState, useEffect } from 'react';
import { auth, isConfigured } from '../utils/firebaseConfig';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const LOCAL_USER_KEY = '@match_recorder_local_user';

    useEffect(() => {
        if (!isConfigured) {
            // Local Mock Auth
            const checkLocalUser = async () => {
                const localUser = await AsyncStorage.getItem(LOCAL_USER_KEY);
                if (localUser) setUser(JSON.parse(localUser));
                setIsLoading(false);
            };
            checkLocalUser();
            return;
        }

        // Firebase Auth
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    username: firebaseUser.displayName || firebaseUser.email.split('@')[0]
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (username, password, email) => {
        setIsLoading(true);
        try {
            if (!isConfigured) {
                const localUser = { uid: 'local-' + Date.now(), email, username };
                await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
                setUser(localUser);
                return localUser;
            }
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
            return userCredential.user;
        } catch (e) {
            console.error('Signup Error:', e.message);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            if (!isConfigured) {
                const localUser = { uid: 'local-session', email, username: email.split('@')[0] };
                await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
                setUser(localUser);
                return localUser;
            }
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
            return userCredential.user;
        } catch (e) {
            console.error('Login Error:', e.message);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            if (!isConfigured) {
                await AsyncStorage.removeItem(LOCAL_USER_KEY);
                setUser(null);
                return;
            }
            await signOut(auth);
        } catch (e) {
            console.error('Logout Error:', e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

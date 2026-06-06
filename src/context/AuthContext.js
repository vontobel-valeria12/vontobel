import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig'; 
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

const AuthContext = createContext();


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth muss innerhalb eines AuthProviders verwendet werden");
  }
  return context;
}

export function AuthProvider({ children }) {
  
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

 
  function registrieren(email, passwort) {
    return createUserWithEmailAndPassword(auth, email, passwort);
  }

  function anmelden(email, passwort) {
    return signInWithEmailAndPassword(auth, email, passwort);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
   
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);


  const value = {
    currentUser,
    registrieren,
    anmelden,
    logout 
  };

  return (
    <AuthContext.Provider value={value}>
     
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', fontFamily: 'serif' }}>
          Laden...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
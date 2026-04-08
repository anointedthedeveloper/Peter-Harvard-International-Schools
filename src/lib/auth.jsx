import { createContext, useContext, useState } from 'react';

const ADMIN_PASSWORD = 'phis@admin2017';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('phis_admin') === 'true');

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('phis_admin', 'true');
      setAuthed(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('phis_admin');
    setAuthed(false);
  };

  return <AuthContext.Provider value={{ authed, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

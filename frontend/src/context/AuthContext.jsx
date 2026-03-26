import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [securityMode, setSecurityMode] = useState("secure");
  const [lastExchange, setLastExchange] = useState(null);

  const value = useMemo(
    () => ({
      user,
      token,
      securityMode,
      setUser,
      setToken,
      setSecurityMode,
      lastExchange,
      setLastExchange
    }),
    [user, token, securityMode, lastExchange]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

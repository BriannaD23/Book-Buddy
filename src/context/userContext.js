import { createContext, useContext } from "react";
import decodeTokenPayload from "../utils/cookieUtils.js";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const payload = decodeTokenPayload();

  return (
    <UserContext.Provider value={payload}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

import "../asset/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import { createContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import ReactTooltip from "react-tooltip";

export const Store = createContext();

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const SignInUser = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };
  useEffect(() => {
    //set thoi gian xoa token
    const userStorage = JSON.parse(localStorage.getItem("user"));
    if (userStorage) {
      setUser(userStorage);
    }
  }, []);
  return (
    <>
      <Store.Provider value={{ user, SignInUser }}>
        <ReactTooltip place="bottom" type="info" effect="float" />
        <Navbar {...{ user, SignInUser }} />
        <div className="min-h-full-remove-nav">
          <Component {...pageProps} />
        </div>
        <ToastContainer />
      </Store.Provider>
    </>
  );
}

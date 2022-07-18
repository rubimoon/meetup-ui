import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Container } from "semantic-ui-react";
import HomePage from "../../features/home/HomePage";

import ModalManager from "../common/modals/ModalManager";
import { setAppLoaded } from "../store/commonSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import AppRoutes from "./AppRoutes";
import LoadingComponent from "./LoadingComponent";
import NavBar from "./NavBar";

const App = () => {
  const dispatch = useAppDispatch();
  const { token, appLoaded } = useAppSelector((state) => state.common);
  const location = useLocation();

  useEffect(() => {
    if (token) {
      window.localStorage.setItem("jwt", token);
    } else {
      window.localStorage.removeItem("jwt");
    }
    dispatch(setAppLoaded());
  }, [dispatch, token]);

  if (!appLoaded) return <LoadingComponent content="Loading app..." />;

  return (
    <>
      <ModalManager />
      <ToastContainer position="bottom-right" hideProgressBar />
      <AppRoutes location={location} />
    </>
  );
};

export default App;

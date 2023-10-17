import "./App.scss";
import MainLayout from "./view/MainLayout";
import { HashRouter } from "react-router-dom";
import { NotificationContextProvider } from "./context/NotificationContext";

function App() {
  return (
    <HashRouter>
      <NotificationContextProvider>
        <MainLayout />
      </NotificationContextProvider>
    </HashRouter>
  );
}

export default App;

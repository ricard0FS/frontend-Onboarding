import "./App.css";

import { ROUTERS } from "./utils/constants";
import ClientListPage from "./presentation/pages/dashboard/clients/list";
import Header from "./presentation/layout/header/Header";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Footer from "./presentation/layout/footer";
import Sidebar from "./presentation/layout/sidebar";
import DetailClientPage from "./presentation/pages/dashboard/clients/detail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { DASHBOARD } = ROUTERS;

function App() {
  return (
    <Router>
      <ToastContainer />
      <div className="app">
        <Header />
        <Sidebar />
        <div className="content">
          <Routes>
            <Route
              path="*"
              element={<Navigate to={DASHBOARD.CLIENTS.LIST} />}
            />
            <Route path={DASHBOARD.CLIENTS.LIST} element={<ClientListPage />} />
            <Route
              path={DASHBOARD.CLIENTS.DETAIL}
              element={<DetailClientPage />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

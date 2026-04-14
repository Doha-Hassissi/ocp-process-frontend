import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Accueil from "./pages/Accueil.jsx";
import Footer from "./components/Footer.jsx";
import FicheProcessList from "./pages/FicheProcessList";
import ChecklistList from "./pages/ChecklistList";
import ChecklistView from "./components/ChecklistView.jsx";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import FicheProcessForm from "./pages/FicheProcessForm.jsx";
import ChecklistForm from "./pages/ChecklistForm.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div className="dark:bg-slate-900 transition-colors duration-300 min-h-screen">
      <Navbar isLoggedIn={isAuthenticated} user={user} onLogout={logout} />

      <div className="min-h-[80vh]">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          <Route path="/ficheprocesslist" element={<ProtectedRoute><FicheProcessList /></ProtectedRoute>} />
          <Route path="/ficheprocessform" element={<ProtectedRoute><FicheProcessForm /></ProtectedRoute>} />
          
          <Route path="/checklistlist" element={<ProtectedRoute><ChecklistList /></ProtectedRoute>} />
          <Route path="/checklistform" element={<ProtectedRoute><ChecklistForm /></ProtectedRoute>} />
          <Route path="/checklistform/:id" element={<ProtectedRoute><ChecklistForm /></ProtectedRoute>} />
          <Route path="/checklistview/:id" element={<ProtectedRoute><ChecklistView /></ProtectedRoute>} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;

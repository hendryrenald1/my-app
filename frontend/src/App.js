import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Home from "./routes/home/home.component"
import Navigation from "./routes/navigation/navigation.component"
import ProtectedRoute from "./routes/protected/protected.component";
import Authentication from "./routes/authentication/authentication.component";
import FamilyTree from "./routes/family-tree/family-tree.component";

import { UserContext } from "./components/context/user.context";


const Shopping = () => {
  return (
    <div>
      <h1>Shopping</h1>
    </div>
  );
};


const App = () => {

  const { user,setUser } = useContext(UserContext);


  const handleLogout = () => {
    setUser(null);
  };
  return (
    <Routes>

      <Route path="/login" element={
        user === null ? (
          <Authentication />
        ) : (
          <Navigate to="/home/dashboard" replace />
        )
      } />


      <Route
        path="/home/*"
        element={
          <ProtectedRoute isAuthenticated={!!user}>
            <Navigation onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        {/* Nested Routes */}
        <Route path="dashboard" element={<Home />} />
        <Route path="shop" element={<Shopping />} />
        <Route path="family-tree" element={<FamilyTree />} />
      </Route>

      {/* <Route path="/" element={<Navigation />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shopping />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/family-tree" element={<FamilyTree />} />
      </Route> */}

  <Route path="*" element={<Navigate to="/login" replace />} />


    </Routes>
  )
}

export default App;
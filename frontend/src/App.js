import { Routes, Route } from "react-router-dom";
import Home from "./routes/home/home.component"
import  Navigation  from "./routes/navigation/navigation.component"
import SignIn from "./routes/sign-in/sign-in.component";
import FamilyTree from "./routes/family-tree/family-tree.component";

const Shopping = () => {
  return (
    <div>
      <h1>Shopping</h1>
    </div>
  );
};


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shopping />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/family-tree" element={<FamilyTree />} />
      </Route>


    </Routes>
  )
}

export default App;
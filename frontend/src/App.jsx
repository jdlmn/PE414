import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import WelcomePage from "./pages/WelcomePage";
import BreedsPage from "./pages/BreedsPage";
import ChosenBreed from "./pages/ChosenBreedPage";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/breeds" element={<BreedsPage />} />
        <Route path="/breeds/:breed" element={<ChosenBreed />} />
      </Routes>
    </Router>
  );
}

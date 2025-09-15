import DogCard from "../components/DogCard";
import "./WelcomePage.css";

export default function WelcomePage() {
  return (
    <div className="welcome-container">
      <div className="welcome-inner">
        <h1 className="welcome-title">🐾 Dog Facts </h1>
        <DogCard />
      </div>
    </div>
  );
}

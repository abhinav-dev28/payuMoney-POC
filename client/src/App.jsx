import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Status from "./pages/Status";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment/:status/:id" element={<Status />} />
      </Routes>
    </Router>
  );
}

export default App;

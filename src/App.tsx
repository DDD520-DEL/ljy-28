import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Record from "@/pages/Record";
import Detail from "@/pages/Detail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/record" element={<Record />} />
        <Route path="/record/:id" element={<Record />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </Router>
  );
}

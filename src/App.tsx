import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Record from "@/pages/Record";
import Detail from "@/pages/Detail";
import Discover from "@/pages/Discover";
import { ToastContainer } from "@/components/Toast";
import BottomNav from "@/components/BottomNav";

export default function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/record" element={<Record />} />
        <Route path="/record/:id" element={<Record />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
      <BottomNav />
    </Router>
  );
}

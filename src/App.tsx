import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Record from "@/pages/Record";
import Detail from "@/pages/Detail";
import Discover from "@/pages/Discover";
import Settings from "@/pages/Settings";
import { ToastContainer } from "@/components/Toast";
import BottomNav from "@/components/BottomNav";
import { useTheme } from "@/hooks/useTheme";

function ThemeInitializer() {
  useTheme();
  return null;
}

export default function App() {
  return (
    <Router>
      <ThemeInitializer />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/record" element={<Record />} />
        <Route path="/record/:id" element={<Record />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <BottomNav />
    </Router>
  );
}

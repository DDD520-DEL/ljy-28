import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "@/pages/Home";
import Record from "@/pages/Record";
import Detail from "@/pages/Detail";
import Discover from "@/pages/Discover";
import Settings from "@/pages/Settings";
import Onboarding from "@/pages/Onboarding";
import BoxSizeRecommender from "@/pages/BoxSizeRecommender";
import { ToastContainer } from "@/components/Toast";
import BottomNav from "@/components/BottomNav";
import { useTheme } from "@/hooks/useTheme";
import { loadFromStorage, ONBOARDING_SHOWN_KEY } from "@/utils/storage";

function ThemeInitializer() {
  useTheme();
  return null;
}

function OnboardingChecker() {
  const [isChecking, setIsChecking] = useState(true);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onboardingShown = loadFromStorage<boolean>(ONBOARDING_SHOWN_KEY, false);
    if (!onboardingShown && location.pathname !== '/onboarding') {
      setShouldShowOnboarding(true);
    } else {
      setShouldShowOnboarding(false);
    }
    setIsChecking(false);
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!isChecking && shouldShowOnboarding) {
      navigate('/onboarding', { replace: true });
    }
  }, [isChecking, shouldShowOnboarding, navigate]);

  if (isChecking) {
    return null;
  }

  return null;
}

function AppContent() {
  const location = useLocation();
  const showBottomNav = location.pathname !== '/onboarding';

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Home />} />
        <Route path="/box-size-recommender" element={<BoxSizeRecommender />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/record" element={<Record />} />
        <Route path="/record/:id" element={<Record />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeInitializer />
      <OnboardingChecker />
      <AppContent />
    </Router>
  );
}

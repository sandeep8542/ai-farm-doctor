import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import WeatherPage from "./pages/WeatherPage";
import VoiceQuery from "./pages/VoiceQuery";
import ProtectedRoute from "./components/ProtectedRoute";
import CropAdvice from "./pages/CropAdvice";
import ScanHistory from "./pages/ScanHistory";
import Profile from "./pages/Profile";

function CropPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef2f1] text-gray-700">
      Crop Advice page coming soon
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/> 
        <Route
  path="/history"
  element={
    <ProtectedRoute>
      <ScanHistory />
    </ProtectedRoute>
  }
/>

        <Route
          path="/weather"
          element={
            <ProtectedRoute>
              <WeatherPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/voice"
          element={
            <ProtectedRoute>
              <VoiceQuery />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crop"
          element={
            <ProtectedRoute>
              <CropAdvice />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
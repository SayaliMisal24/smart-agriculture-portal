import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyFarms from './pages/MyFarms';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import FarmDetail from './pages/FarmDetail';
import ProtectedRoute from './components/ProtectedRoute';
import SoilHealth from './pages/SoilHealth';
import CropRecommendation from './pages/CropRecommendation';
import CropDetail from './pages/CropDetail';
import Weather from './pages/Weather';
import SmartIrrigation from './pages/SmartIrrigation';
import Features from './pages/Features';
import CropCalendar from './pages/CropCalendar';
import WeatherDetail from './pages/WeatherDetail';
import TipDetail from './pages/TipDetail';
import MarketTrendsDetail from './pages/MarketTrendsDetail';
import SuccessStoryDetail from './pages/SuccessStoryDetail';
function Layout() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/profile');

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tip-detail" element={<TipDetail />} />
        <Route path="/market-trends-detail" element={<MarketTrendsDetail />} />
        <Route path="/success-story-detail" element={<SuccessStoryDetail />} />
        <Route path="/weather-detail" element={<WeatherDetail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
       <Route
  path="/dashboard/farms/:farmId/soil-health"
  element={
    <ProtectedRoute>
      <SoilHealth />
    </ProtectedRoute>
  }
/>
<Route path="/features" element={<Features />} />
<Route
  path="/dashboard/farms/:farmId/crop-recommendation"
  element={
    <ProtectedRoute>
      <CropRecommendation />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/farms/:farmId/calendar"
  element={
    <ProtectedRoute>
      <CropCalendar />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/farms/:farmId/weather"
  element={
    <ProtectedRoute>
      <Weather />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/farms/:farmId/crop-recommendation/details/:index"
  element={
    <ProtectedRoute>
      <CropDetail />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/farms/:farmId/irrigation"
  element={
    <ProtectedRoute>
      <SmartIrrigation />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/farms/:farmId"
  element={
    <ProtectedRoute>
      <FarmDetail />
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
  path="/dashboard/farms"
  element={
    <ProtectedRoute>
      <MyFarms />
    </ProtectedRoute>
  }
/>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
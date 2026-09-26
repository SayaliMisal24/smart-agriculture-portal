import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const About = lazy(() => import('./pages/About'));
const Features = lazy(() => import('./pages/Features'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MyFarms = lazy(() => import('./pages/MyFarms'));
const FarmDetail = lazy(() => import('./pages/FarmDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const SoilHealth = lazy(() => import('./pages/SoilHealth'));
const CropRecommendation = lazy(() => import('./pages/CropRecommendation'));
const CropDetail = lazy(() => import('./pages/CropDetail'));
const CropGrowingGuide = lazy(() => import('./pages/CropGrowingGuide'));
const Weather = lazy(() => import('./pages/Weather'));
const SmartIrrigation = lazy(() => import('./pages/SmartIrrigation'));
const CropCalendar = lazy(() => import('./pages/CropCalendar'));
const DiseaseDetection = lazy(() => import('./pages/DiseaseDetection'));
const FertilizerRecommendation = lazy(() => import('./pages/FertilizerRecommendation'));
const YieldPrediction = lazy(() => import('./pages/YieldPrediction'));
const MarketFinder = lazy(() => import('./pages/MarketFinder'));
const MarketPricePrediction = lazy(() => import('./pages/MarketPricePrediction'));
const WeatherDetail = lazy(() => import('./pages/WeatherDetail'));
const TipDetail = lazy(() => import('./pages/TipDetail'));
const MarketTrendsDetail = lazy(() => import('./pages/MarketTrendsDetail'));
const SuccessStoryDetail = lazy(() => import('./pages/SuccessStoryDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));
function Layout() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/profile');

  return (
    <>
      {!hideLayout && <Navbar />}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
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
<Route
  path="/dashboard/farms/:farmId/fertilizer"
  element={
    <ProtectedRoute>
      <FertilizerRecommendation />
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
  path="/dashboard/farms/:farmId/disease-detection"
  element={
    <ProtectedRoute>
      <DiseaseDetection />
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
  path="/dashboard/farms/:farmId/crop-guide"
  element={
    <ProtectedRoute>
      <CropGrowingGuide />
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
<Route
  path="/dashboard/farms/:farmId/market-price-prediction"
  element={<ProtectedRoute><MarketPricePrediction /></ProtectedRoute>}
/>
<Route
  path="/dashboard/farms/:farmId/yield-prediction"
  element={
    <ProtectedRoute>
      <YieldPrediction />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/farms/:farmId/market"
  element={<ProtectedRoute><MarketFinder /></ProtectedRoute>}
/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
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
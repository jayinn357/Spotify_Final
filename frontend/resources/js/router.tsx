import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomeIndex from './pages/Home/Index';
import AboutIndex from './pages/About/index';
import MembersIndex from './pages/Members/Index';
import RandomSongIndex from './pages/RandomSong/Index';
import SpotifyIdFinder from './pages/SpotifyIdFinder';
import PreviewTest from './pages/PreviewTest';

// Auth pages
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';
import VerifyEmail from './pages/auth/verify-email';
import ConfirmPassword from './pages/auth/confirm-password';

// Settings pages
import ProfileIndex from './pages/settings/profile';

export function AppRouter() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Routes with layout */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomeIndex />} />
          <Route path="about" element={<AboutIndex />} />
          <Route path="members" element={<MembersIndex />} />
          <Route path="random-song" element={<RandomSongIndex />} />
          <Route path="spotify-finder" element={<SpotifyIdFinder />} />
          <Route path="preview-test" element={<PreviewTest />} />
          <Route path="profile" element={<ProtectedRoute><ProfileIndex /></ProtectedRoute>} />
        </Route>

        {/* Auth routes (without layout) */}
        <Route path="login" element={<Login status={undefined} canResetPassword={true} />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword status={undefined} />} />
        <Route path="reset-password" element={<ResetPassword token="" email="" />} />
        <Route path="verify-email" element={<VerifyEmail status={undefined} />} />
        <Route path="confirm-password" element={<ConfirmPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

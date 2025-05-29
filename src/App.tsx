import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import SettingsPage from "./pages/SettingsPage";
import HowToPlayPage from "./pages/HowToPlayPage";
import MultiplayerPage from "./pages/MultiplayerPage";
import LocalMultiplayerPage from "./pages/LocalMultiplayerPage";
import OnlineMultiplayerPage from "./pages/OnlineMultiplayerPage";
import NotFound from "./pages/NotFound";
import SignupPage from "./pages/SignupPage";
import ChooseUsernamePage from "./pages/ChooseUsernamePage";
import LoginFormPage from "./pages/LoginFormPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginFormPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/choose-username" element={<ChooseUsernamePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/game" element={<Index />} />
            <Route path="/leaderboards" element={<LeaderboardsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/how-to-play" element={<HowToPlayPage />} />
            <Route path="/multiplayer" element={<MultiplayerPage />} />
            <Route path="/multiplayer/local" element={<LocalMultiplayerPage />} />
            <Route path="/multiplayer/online" element={<OnlineMultiplayerPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

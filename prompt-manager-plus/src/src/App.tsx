
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Prompts from "./pages/Prompts";
import LinksPage from "./pages/Links";
import LyricsPage from "./pages/Lyrics";
import ConverterPage from "./pages/Converter";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/AuthProvider";
import { useAuth } from "./components/AuthProvider";
import { Toaster } from "sonner";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/prompts"
            element={
              <ProtectedRoute>
                <Prompts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/links"
            element={
              <ProtectedRoute>
                <LinksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lyrics"
            element={
              <ProtectedRoute>
                <LyricsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/converter"
            element={
              <ProtectedRoute>
                <ConverterPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import MainPage from "./pages/MainPage";
import BrowsePage from "./pages/BrowsePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SellPage from "./pages/SellPage";
import EditPage from "./pages/EditPage";
import ProductInfo from "./pages/ProductInfo";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="browse">
              <Route index element={<BrowsePage />} />
              <Route path=":id" element={<ProductInfo />} />
              <Route path="sell" element={<SellPage />} />
              <Route path="edit" element={<EditPage />} />
            </Route>
            <Route path="user" element={<UserPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import MainLayout from "../layout/Mainlayout";
import FarmPalHome from "../pages/Home";
import Chat from "../pages/chat"
import Login from "../pages/Login";
import Signup from "../pages/signup";
import Dashboard from "../pages/ContactExpert";
import WeatherRec from "../pages/WeatherRec";
import ProtectedRoute from "../components/ProtectedRoute";
import ExpertRegister from "../pages/Expert/ExpertRegister"; 
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<FarmPalHome />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/expert-register" element={<ExpertRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/expert/register" element={<ExpertRegister />} />
        <Route path="/weather" element={<WeatherRec />} />
      </Route>
    </>
  )
);

export default router;

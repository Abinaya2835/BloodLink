import {
    BrowserRouter,
    Routes,
    Route,
    Outlet,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SearchDonors from "./pages/SearchDonors";
import BloodRequest from "./pages/BloodRequest";
import MyBloodRequests from "./pages/MyBloodRequests";
import BloodInventory from "./pages/BloodInventory";
import BloodBankRequests from "./pages/BloodBankRequests";
import AdminDashboard from "./pages/AdminDashboard";

function MainLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/blood-inventory" element={<BloodInventory />} />
                    <Route path="/blood-bank-requests" element={<BloodBankRequests />} />
                    <Route path="/search-donors" element={<SearchDonors />} />
                    <Route path="/blood-request" element={<BloodRequest />} />
                    <Route path="/my-blood-requests" element={<MyBloodRequests />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

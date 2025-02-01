import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/user/Login';
import Signup from '../pages/user/Signup';
import Profile from '../pages/user/Profile';
import Home from '../pages/user/Home';
import AdminDashbord from '../pages/admin/AdminDashbord';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} >
                    <Route></Route>
                </Route >
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/adminDashboard" element={<AdminDashbord />} />
            </Routes>
        </Router >
    );
};

export default AppRoutes;

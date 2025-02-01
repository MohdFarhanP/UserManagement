import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser, userLogout } from "../../api/auth";
import { logout } from "../../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store.js";
import { toast } from "react-toastify";

interface User {
    data: {
        userName: string;
        email: string;
        profileImage?: string;
    }

}

const Home = () => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                toast.error(`error on userfetch from home:${error}`);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        loadUser();

    }, [navigate]);

    const userstate = useSelector((state: RootState) => state.auth.user);
    const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);

    useEffect(() => {
        if (userstate) {
            if (isAdmin) {
                navigate('/adminDashboard');
            } else {
                console.log('aalnd')
                navigate('/home');
            }
        }

    }, [userstate, isAdmin, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        userLogout();
        navigate('/login');
    }
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-xl"></span>
                <p className="text-gray-500 mt-4">Loading user data...</p>
            </div>
        );
    }

    if (!user) {
        return <div className="text-center mt-10 text-red-500">Failed to load user data</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[380px] h-[470px] ">

                <div className="relative bg-gradient-to-b from-blue-600 to-blue-400 h-32">
                    <div className="absolute inset-x-0 -bottom-12 flex justify-center">
                        <img
                            className="w-32 h-32 rounded-full border-4 border-white"
                            src={user.data.profileImage || 'https://avatars.mds.yandex.net/i?id=f0cccd52e4dc59003f83e12a00f85f3ce8f398657a676728-11951399-images-thumbs&n=13'}
                            alt="Profile"
                        />
                    </div>
                </div>

                <div className="mt-14 text-center px-6 pb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{user.data.userName}</h2>
                    <h2 className="text-sm mt-6 text-gray-800">{user.data.email}</h2>

                    <div className="flex flex-col justify-end gap-4 mt-6 h-[140px]">
                        <button className="bg-blue-600 text-white px-3 py-3 rounded-full font-medium shadow hover:bg-blue-700" onClick={() => navigate('/profile')}>
                            Profile
                        </button>
                        <button className="bg-gray-200 text-gray-700 px-3 py-3 rounded-full font-medium shadow hover:bg-gray-300" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Home

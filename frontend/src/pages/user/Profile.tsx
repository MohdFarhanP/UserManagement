import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfileImage, fetchUser } from "../../api/auth";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';


export interface User {
    data: {
        userName: string;
        email: string;
        profileImage?: string;
    };
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [profileLoading, setProfileLoading] = useState<boolean>(false);
    const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                toast.error("Error loading user");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [navigate]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setNewProfileImage(file);
            setPreviewImage(URL.createObjectURL(file)); // Temporary preview
        }
    };

    const handleSaveChanges = async () => {
        if (!newProfileImage) {
            toast.info("Please select an image to upload");
            return;
        }
        const formData = new FormData();
        formData.append("profileImage", newProfileImage);
        console.log('from data for checking :', [...formData.entries()]);

        setProfileLoading(true)
        try {
            await updateProfileImage(formData);
            toast.success("Profile image updated successfully!");
            navigate("/home");
        } catch (error) {
            console.error(error);
            toast.error("Error updating profile image");
        } finally {
            setProfileLoading(false)
        }
    };

    if (loading) {
        return <div className="text-center mt-10 text-lg">Loading...</div>;
    }

    if (!user) {
        return <div className="text-center mt-10 text-red-500">Failed to load user data</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[380px] h-[550px]">
                <div className="relative bg-gradient-to-b from-blue-600 to-blue-400 h-32">
                    <div className="absolute inset-x-0 -bottom-12 flex justify-center">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <img
                                className="w-32 h-32 rounded-full border-4 border-white hover:opacity-80"
                                src={
                                    previewImage ||
                                    user.data.profileImage ||
                                    "https://avatars.mds.yandex.net/i?id=f0cccd52e4dc59003f83e12a00f85f3ce8f398657a676728-11951399-images-thumbs&n=13"
                                }
                                alt="Profile"
                            />
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                </div>

                <div className="mt-14 text-center px-6 pb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{user.data.userName}</h2>
                    <h2 className="text-sm mt-6 text-gray-800">{user.data.email}</h2>

                    <div className="flex flex-col justify-end gap-4 mt-6 h-[180px]">
                        <button disabled={profileLoading}
                            className={`px-3 py-3 rounded-full font-medium shadow ${profileLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                            onClick={handleSaveChanges}
                        >
                            {profileLoading ? <AiOutlineLoading3Quarters className="animate-spin flex justify-center" /> : "Save Changes"}
                        </button>
                        <button
                            className="bg-gray-200 text-gray-700 px-3 py-3 rounded-full font-medium shadow hover:bg-gray-300"
                            onClick={() => navigate("/home")}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Profile;

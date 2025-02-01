import { useEffect, useState } from "react"
import { adminLogout, deleteUser, fetchUserDetails } from "../../api/auth";
import EditUserModal from '../../components/EditUserModal';
import CreateUserModal, { NewUser } from "../../components/CreateUserModal";
import SearchBar from "../../components/SearchBar.js";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/authSlice.js";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store.js";
import { toast } from "react-toastify";


export interface User {
    _id: string;
    userName: string;
    email: string;
    password: string;
    profileImage?: string;
    isAdmin: boolean;
}

const AdminDashbord: React.FC = () => {

    const [userData] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await fetchUserDetails();

                setFilteredUsers(data)
                console.log(data);
            } catch (error) {
                toast.error(`Error loading users: ${error}`);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);


    const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);

    useEffect(() => {

        if (isAdmin) {
            navigate('/adminDashboard');
        } else {
            navigate('/login');
        }

    }, [isAdmin, navigate]);

    const updateUserDataInState = (updatedUser: User) => {
        setFilteredUsers((prevUsers) =>
            prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
        );
    };

    const addUserToState = (newUser: NewUser) => {
        if (!newUser._id) {
            newUser._id = crypto.randomUUID();
        }
        setFilteredUsers((prevUsers) => [...prevUsers, newUser as User]);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            setFilteredUsers(filteredUsers.filter((user) => (
                user._id !== id
            )))
            console.log()
            toast.success("User deleted")

        } catch (error) {
            toast.error(`Failed to delete user:${error}`);
        }
    };

    const handleSearch = (query: string) => {
        if (query.trim() === "") {
            setFilteredUsers(userData);
        } else {
            const filtered = userData.filter(
                (user) =>
                    user.userName.toLowerCase().includes(query.toLowerCase()) ||
                    user.email.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        adminLogout();
        navigate('/login');
    }

    if (loading) {
        return <div className="text-center mt-10 text-lg">Loading...</div>;
    }

    if (!userData) {
        return <div className="text-center mt-10 text-red-500">Failed to load user data</div>;
    }

    return (
        <>

            {/*---------------- Search bar Component ------------------- */}
            <SearchBar onSearch={handleSearch} />

            <div className="mt-3 flex items-center w-full justify-center gap-[180px] ">
                <button
                    onClick={handleLogout}
                    className="px-10 btn btn-error"
                >
                    Logout
                </button>
                < button
                    onClick={() => setIsCreateModalOpen(true)}
                    className=" px-10 btn btn-success" >
                    Add User
                </button >
            </div>

            {/* ---------------Create User Modal ----------------*/}
            <CreateUserModal
                isOpen={isCreateModalOpen}
                closeModal={() => setIsCreateModalOpen(false)}
                addUserToState={addUserToState}
            />

            {/*---------------- user table ------------------- */}
            <div className="flex justify-center mt-[10px] w-auto ">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[62%]">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        {/* Table Head */}
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-3">#</th>
                                <th className="p-3">Profile</th>
                                <th className="p-3 pl-[2%]">Name</th>
                                <th className="p-3 pl-[3%]">Email</th>
                                <th className="p-3 pl-[13%]" colSpan={2}>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers?.filter((user) => !user.isAdmin)?.map((user, index) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" >
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src={user.profileImage || `https://avatars.mds.yandex.net/i?id=f0cccd52e4dc59003f83e12a00f85f3ce8f398657a676728-11951399-images-thumbs&n=13`}
                                                        alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">{user.userName}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 text-center" colSpan={2}>
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsModalOpen(true);
                                            }}
                                            className="btn btn-outline px-4 py-2 rounded mx-1"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="btn btn-outline px-4 py-2 rounded mx-1">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div >

            {/* --------------Edit User Modal----------------- */}
            {
                selectedUser && (
                    <EditUserModal
                        user={selectedUser}
                        isOpen={isModalOpen}
                        closeModal={() => setIsModalOpen(false)}
                        updateUserDataInState={updateUserDataInState}
                    />
                )
            }
        </>
    )
}

export default AdminDashbord

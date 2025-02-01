import { FormEvent, useEffect, useState } from 'react';
import { updateUser } from '../api/auth.js';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { User } from '../pages/admin/AdminDashbord.js'

interface EditUserModalProps {
    user: User;
    isOpen: boolean;
    closeModal: () => void;
    updateUserDataInState: (updatedUser: User) => void;

}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, closeModal, updateUserDataInState }) => {

    const [userName, setUserName] = useState<string>(user?.userName || '');
    const [email, setEmail] = useState<string>(user?.email || '');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');


    useEffect(() => {
        if (user) {
            setUserName(user.userName);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!user) return;

        const updatedUser = { ...user, userName, email };

        setLoading(true);
        try {
            const result = await updateUser(user._id, updatedUser);
            console.log("User updated:", result);
            updateUserDataInState(updatedUser);
            closeModal();
        } catch (err) {
            console.error("Failed to update user", err);
            setError("Failed to update user");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    if (loading) {
        return <div className="text-center mt-10 text-lg">Loading...</div>;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex justify-center items-center h-screen bg-black bg-opacity-50 backdrop-blur-md overflow-x-hidden"
        >
            <div className="relative p-4 w-full max-w-md">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-xl font-semibold mx-auto text-gray-900 dark:text-white">
                            Edit user information
                        </h3>
                        <button
                            onClick={closeModal}
                            type="button"
                            className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-4 md:p-5">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="userName"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    UserName
                                </label>
                                <input
                                    type="text"
                                    name="userName"
                                    id="userName"
                                    placeholder="userName"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <div className="text-red-500">{error}</div>}

                            <button
                                type="submit"
                                className="mt-3 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : 'Save Updates'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;

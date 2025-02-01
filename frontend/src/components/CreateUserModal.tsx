import { FormEvent, useState } from 'react';
import { createUser } from '../api/auth.js';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { User } from '../pages/admin/AdminDashbord.js';


export interface NewUser {
    _id?: string;
    userName: string;
    email: string;
    password: string
}

interface CreateUserModalProps {
    isOpen: boolean;
    closeModal: () => void;
    addUserToState: (newUser: NewUser) => void;
}


const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, closeModal, addUserToState }) => {

    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const newUser = { userName, email, password };

        setLoading(true);
        try {
            const createdUser: User = await createUser(newUser);
            addUserToState(createdUser);
            closeModal();
        } catch (err) {
            console.error("Failed to create user", err);
            setError("Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    if (loading) {
        return <div className="text-center mt-10 text-lg">Loading...</div>;
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 backdrop-blur-md">
            <div className="relative p-4 w-full max-w-md">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-xl font-semibold mx-auto text-gray-900 dark:text-white">
                            Add New User
                        </h3>
                        <button
                            onClick={closeModal}
                            type="button"
                            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-4 md:p-5">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <div className="text-red-500">{error}</div>}

                            <button
                                type="submit"
                                className="mt-3 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : 'Create User'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateUserModal;

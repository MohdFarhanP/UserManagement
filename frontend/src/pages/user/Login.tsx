import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login as loginAPI } from '../../api/auth';
import { login } from '../../features/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store.js';



const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const user = useSelector((state: RootState) => state.auth.user);
    const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);

    useEffect(() => {
        console.log(user, isAdmin)
        if (user) {
            if (isAdmin) {
                navigate('/adminDashboard');
            } else {
                console.log('aalnd')
                navigate('/home');
            }
        }

    }, [user, isAdmin, navigate]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setEmailError('');
        setPasswordError('');


        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email || !emailRegex.test(email)) {
            setEmailError('Please enter a valid email');
            return;
        }

        if (!password || password.length < 4) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        try {
            const data = await loginAPI({ email, password });
            dispatch(login(data));
            if (data.isAdmin) {
                navigate("/adminDashboard")
            } else {
                navigate("/home")
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                        <h1 className="text-center mb-10 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>

                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            {error && <p className="text-red-500">{error}</p>}
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@company.com"

                                />
                                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    id="password"
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                                />
                                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-3 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Sign in
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don't have an account yet?{" "}
                                <Link
                                    to='/signup'
                                    className="font-medium text-primary-600  hover:underline dark:text-primary-500"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </form>

                    </div>
                </div>
            </div>
        </section >

    );
};

export default Login;

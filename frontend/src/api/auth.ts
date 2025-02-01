import axios from "axios";
import { AxiosError } from 'axios';
import { NewUser } from "../components/CreateUserModal";
import { toast } from "react-toastify";

const User_API_URL = `http://localhost:3000/api/users`
const Admin_API_URL = `http://localhost:3000/api/admin`

export const login = async (data: { email: string; password: string }) => {
    try {
        const response = await axios.post(`${User_API_URL}/login`, data);

        const token = response.data.token;

        if (!response.data.isAdmin) {
            localStorage.setItem('UserToken', token);
        } else {
            localStorage.setItem('AdminTocken', token)
        }

        return response.data;

    } catch (error) {
        if (error instanceof AxiosError) {
            if (error?.response?.status) {
                toast(error.response.data.message || 'Bad Request. Please check your input.');

            }
        }
    }

};


export const signup = async (data: { userName: string; email: string; password: string }) => {
    try {
        const response = await axios.post(`${User_API_URL}/signup`, data);
        const token = response.data.token;

        if (token) {
            localStorage.setItem('UserToken', token);
        }
        return response.data;
    } catch (error) {

        if (error instanceof AxiosError) {
            if (error?.response?.status) {
                toast(error.response.data.message || 'Bad Request. Please check your input.');

            }
        }
    }

}


export const fetchUser = async () => {
    try {
        const token = localStorage.getItem('UserToken');
        if (!token) throw new Error('No token found');
        const response = await axios.get(`${User_API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast(error.response?.data?.message);
        }
        throw error;
    }
}

export const userLogout = () => {
    localStorage.removeItem('UserToken');
};

export const adminLogout = () => {
    localStorage.removeItem('AdminTocken')
};

export const updateProfileImage = async (formData: FormData) => {
    try {
        const token = localStorage.getItem('UserToken')
        const response = await axios.patch(`${User_API_URL}/updateProfile`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {

    }
}

export const fetchUserDetails = async () => {
    try {
        const token = localStorage.getItem('AdminTocken');
        const response = await axios.get(`${Admin_API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('response from the admin passing user data', response);
        return response.data;
    } catch (error) {

    }
}

export const updateUser = async (id: string, userData: { userName: string; email: string; }) => {
    try {
        const token = localStorage.getItem('AdminTocken'); // Get token from local storage
        const response = await axios.patch(`${Admin_API_URL}/users/${id}`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};


export const createUser = async (user: NewUser) => {
    try {
        const token = localStorage.getItem('AdminTocken')
        const response = await axios.post(`${Admin_API_URL}/createUser`, user, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export const deleteUser = async (userId: string) => {
    try {
        const token = localStorage.getItem("AdminTocken");
        const response = await axios.delete(`${Admin_API_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}
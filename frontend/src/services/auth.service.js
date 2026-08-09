import api from "../api/axios";
import axios from "axios";

const register = async (userData) => {
    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;
};

const login = async (userData) => {
    const response = await api.post(
        "/auth/login",
        userData
    );

    return response.data;
};

const getCurrentUser = async () => {
    const response = await api.get(
        "/auth/current-user",
        {
            _skipAuthRefresh: true,
        }
    );

    return response.data;
};

const logout = async () => {

    const response = await api.post("/auth/logout");

    return response.data;
};

const uploadResume = async (file) => {
    const formData = new FormData();

    formData.append("resume", file);

    const response = await api.post(
        "/auth/upload-resume",
        formData
    );

    return response.data;
};

const refreshAccessToken = async () => {
    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
        {},
        {
            withCredentials: true,
        }
    );

    return response.data;
};

const removeResume = async () => {
    const response = await api.delete(
        "/auth/remove-resume"
    );

    return response.data;
};

export {
    register, login, logout, getCurrentUser, uploadResume, refreshAccessToken, removeResume
};
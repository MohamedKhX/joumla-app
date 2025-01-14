import {Platform} from "react-native";
import axios from "../utils/axios";
import {setToken} from "./TokenService";

export async function login(credentials) {
    try {
        const {data} = await axios.post('/login', credentials);
        
        if (!data.token) {
            throw new Error('No token received from server');
        }
        
        await setToken(data.token);
        return data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
}

export async function loadUser() {
    try {
        const {data: user} = await axios.get('/user');
        console.log('User data from API:', user);
        return user;
    } catch (error) {
        console.error('Load user error:', error.response?.data || error.message);
        throw error;
    }
}

export async function logout() {
    try {
        await axios.post('/logout', {});
        await setToken(null);
    } catch (error) {
        console.error('Logout error:', error.response?.data || error.message);
        throw error;
    }
}
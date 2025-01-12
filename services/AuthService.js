import {Platform} from "react-native";
import axios from "../utils/axios";
import {setToken} from "./TokenService";

export async function login(credentials) {
    const {data} = await axios.post('/login', credentials);
    await setToken(data.token);
}

export async function loadUser() {
    const {data: user} = await axios.get('/user');
    return user;
}

export async function logout() {
    await axios.post('/logout', {});
    await setToken(null);
}
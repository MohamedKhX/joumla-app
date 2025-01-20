import {useEffect} from "react";
import {loadUser} from "../services/AuthService";
import {useState} from "react";
import SplashScreen from "./SplashScreen";
import {Redirect} from "expo-router";
import AuthContext from "../contexts/AuthContext";
import { CartProvider } from '../contexts/CartContext';

export default function () {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        async function runEffect() {
            try {
                const userData = await loadUser();
                console.log('Loaded user data:', userData); // Debug log
                setUser(userData);
            } catch (e) {
                console.error('Error loading user:', e);
                setUser(null);
            } finally {
                setStatus('idle');
            }
        }

        runEffect();
    }, []);

    if (status === 'loading') {
        return <SplashScreen/>;
    }

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {!user ? (
                <Redirect href="/auth/LoginScreen"/>
            ) : user.type === 'Driver' ? (
                <Redirect href="/driver"/>
            ) : (
                <Redirect href="/trader"/>
            )}
        </AuthContext.Provider>
    );
}
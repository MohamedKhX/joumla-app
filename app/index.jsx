import {useEffect} from "react";
import {loadUser} from "../services/AuthService";
import {useState} from "react";
import SplashScreen from "./SplashScreen";
import {Redirect} from "expo-router";
import AuthContext from "../contexts/AuthContext";
import { CartProvider } from '../contexts/CartContext';

export default function () {
    const [user, setUser] = useState();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        async function runEffect() {
            try {
                const user = await loadUser();
                setUser(user);
            } catch (e) {
                console.error('Error to get user', e);
            }

            setStatus('idle');
        }

        runEffect();
    }, [])

    if (status === 'loading') {
        return <SplashScreen/>;
    }

    return (
        <AuthContext.Provider value={{user, setUser}}>
            <CartProvider>
                {!user ? (
                    <Redirect href="/auth/LoginScreen"/>
                ) : (
                    <Redirect href="/trader"/>
                )}
            </CartProvider>
        </AuthContext.Provider>
    )
}
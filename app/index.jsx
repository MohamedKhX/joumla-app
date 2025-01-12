import {SafeAreaView, Text} from "react-native";
import {Link} from "expo-router";
import AuthContext from "../contexts/AuthContext";
import {loadUser} from "../services/AuthService";
import {useState, useEffect} from "react";
import SplashScreen from "./SplashScreen";

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
            <SafeAreaView>
                <Text>Welcome</Text>

                {!user ? (
                    <>
                        <Link href="/auth/RegisterScreen">register</Link>
                        <Link href="/auth/LoginScreen">login</Link>
                    </>
                ) : (
                    <>
                        <Link href="/trader">Trader</Link>
                        <Link href="/trader/WholesaleStoresScreen">WholesaleStore</Link>
                        <Link href="/trader/ProductScreen">Product</Link>
                        <Link href="/trader/CartScreen">cart</Link>
                        <Link href='/trader/OrdersScreen'>ordersScreen</Link>
                        <Link href='/trader/NotificationsScreen'>notificationsScreen</Link>
                    </>
                )}



            </SafeAreaView>
        </AuthContext.Provider>

    )
}
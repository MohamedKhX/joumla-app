import {SafeAreaView, Text} from "react-native";
import {Link} from "expo-router";

export default function () {
    return (
        <SafeAreaView>
            <Text>Welcome</Text>
            <Link href="/trader">Trader</Link>
            <Link href="/auth/RegisterScreen">register</Link>
            <Link href="/auth/LoginScreen">login</Link>
            <Link href="/trader/WholesaleStoresScreen">WholesaleStore</Link>
            <Link href="/trader/ProductScreen">Product</Link>
            <Link href="/trader/CartScreen">cart</Link>
            <Link href='/trader/OrdersScreen'>ordersScreen</Link>
            <Link href='/trader/NotificationsScreen'>notificationsScreen</Link>
        </SafeAreaView>
    )
}
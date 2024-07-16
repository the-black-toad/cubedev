import { Link, useRouter } from 'expo-router';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

const AccountPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const handleLoginLogout = () => {
        if (isLoggedIn) {
            setIsLoggedIn(false);
        } else {
            router.push('/accountScreens/loginScreen');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Account Page</Text>
            <View style={styles.button}>
                <Button
                    title={isLoggedIn ? 'Logout' : 'Login'}
                    onPress={handleLoginLogout}
                />
            </View>
            <Link href="accountScreens/settings" style={styles.link}>
                <Text style={styles.linkText}>Settings</Text>
            </Link>
            <Link href="accountScreens/activityScreen" style={styles.link}>
                <Text style={styles.linkText}>Activity</Text>
            </Link>
            <Link href="accountScreens/payments" style={styles.link}>
                <Text style={styles.linkText}>Payments</Text>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        marginVertical: 10,
    },
    link: {
        marginVertical: 10,
    },
    linkText: {
        fontSize: 18,
        color: 'blue',
    },
});

export default AccountPage;

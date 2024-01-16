import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import PolyfillCrypto from 'react-native-webview-crypto';
import { ThemeProvider } from 'styled-components/native';
import BottomLine from './src/components/BottomLine';
import stylesConfig from './src/config/styles';
import { AppProvider } from './src/contexts/AppContext';
import './src/locale';
import RootStack from './src/stacks/RootStack';
import { theme as styles } from './src/theme';

const cacheFonts = (fonts) => {
    return fonts.map((font) => Font.loadAsync(font));
};

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const getNotificationPermissions = async () => {
    await Notifications.requestPermissionsAsync({
        ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
        },
    });
};

const Providers = ({ children }) => {
    const colorScheme = useColorScheme();
    const [theme, setTheme] = useState(colorScheme === 'light' ? styles.light : styles.dark);

    useEffect(() => {
        setTheme(colorScheme === 'light' ? styles.light : styles.dark);
    }, [colorScheme]);

    return (
        <GestureHandlerRootView style={{ ...containerStyles, backgroundColor: theme.color.primary }}>
            <SafeAreaProvider initialWindowMetrics={initialWindowMetrics}>
                <ThemeProvider theme={theme}>
                    <NavigationContainer>
                        <AppProvider>
                            <PolyfillCrypto />
                            {children}
                        </AppProvider>
                    </NavigationContainer>
                </ThemeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

const App = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        const loadResourcesAndDataAsync = async () => {
            try {
                SplashScreen.preventAutoHideAsync();
                const fontAssets = cacheFonts([FontAwesome.font, Entypo.font, AntDesign.font, MaterialIcons.font, Ionicons.font]);
                await Promise.all([...fontAssets]);
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
                SplashScreen.hideAsync();
            }
        };
        loadResourcesAndDataAsync();
        getNotificationPermissions();
    }, []);

    if (!appIsReady) {
        return null;
    }

    return (
        <Providers>
            <StatusBar barStyle={stylesConfig.style.statusBar} />
            <RootStack />
            <BottomLine />
        </Providers>
    );
};

const containerStyles = StyleSheet.create({
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    position: 'relative',
});

export default App;

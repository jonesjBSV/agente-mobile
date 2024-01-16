import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { transparentize } from 'polished';
import React, { useCallback, useEffect } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { CopilotStep, copilot, walkthroughable } from 'react-native-copilot';
import styled, { useTheme } from 'styled-components/native';
import { shallow } from 'zustand/shallow';
import { useApplicationStore } from '../contexts/useApplicationStore';
import i18n from '../locale';
import { StateType } from '../models';
import Credentials from '../screens/main/Credentials';
import Entities from '../screens/main/Entities';

const TabWrapper = styled.View`
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: 10px;
`;

const CopilotWrapper = walkthroughable(TabWrapper);

const Tab = createBottomTabNavigator();
const ButtonScreen = () => null;

const TabStack = ({ start, copilotEvents, route }) => {
    const { state, tutorial } = useApplicationStore((state) => ({ state: state.state, tutorial: state.tutorial }), shallow);
    const theme = useTheme();

    useEffect(() => {
        if (state !== StateType.UNAUTHENTICATED && route.params?.tutorial) {
            setTimeout(() => {
                start();
            }, 500);
        }
    }, [state]);

    const finishTutorial = useCallback(async () => {
        tutorial.skip();
    }, []);

    useEffect(() => {
        copilotEvents.on('stop', finishTutorial);
        return () => {
            copilotEvents.off('stop', finishTutorial);
        };
    }, []);

    return (
        <Tab.Navigator
            initialRouteName="Credentials"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: theme.color.secondary,
                tabBarStyle: {
                    paddingBottom: Platform.OS === 'android' ? 0 : 15,
                    paddingTop: Platform.OS === 'android' ? 0 : 15,
                    height: Platform.OS === 'android' ? 65 : 80,
                    bottom: Platform.OS === 'android' ? 10 : 25,
                    backgroundColor: theme.color.footer,
                    borderTopColor: 'transparent',
                    shadowColor: 'black',
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    shadowOffset: {
                        height: 0,
                        width: 0,
                    },
                    position: 'relative',
                    paddingHorizontal: 0,
                    width: '90%',
                    left: '5%',
                    borderRadius: 50,
                },
                tabBarItemStyle: {},
            }}
        >
            <Tab.Screen
                name="Credentials"
                component={Credentials}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color, size }) => (
                        <CopilotStep text={i18n.t('tabStack.credentialsMessage')} order={1} name="credentials" active={true}>
                            <CopilotWrapper>
                                <Ionicons
                                    name="wallet"
                                    size={size}
                                    style={{
                                        height: 32,
                                    }}
                                    color={color}
                                />
                                <TabText color={color}>{i18n.t('tabStack.credentials')}</TabText>
                            </CopilotWrapper>
                        </CopilotStep>
                    ),
                }}
            />

            <Tab.Screen
                name="ScanButton"
                component={ButtonScreen}
                options={({ navigation }) => ({
                    tabBarIcon: ({ size }) => <MaterialIcons name="qr-code-scanner" size={size + 12} color={'white'} />,
                    tabBarLabel: () => null,
                    tabBarButton: ({ children }) => (
                        <CopilotStep order={3} text={i18n.t('tabStack.scanMessage')} name={'scan'}>
                            <CopilotWrapper>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Scan')}
                                    style={{
                                        height: 70,
                                        width: 70,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: transparentize(0.6, theme.color.secondary),
                                        borderRadius: 50,
                                        padding: 5,
                                    }}
                                    activeOpacity={0.5}
                                >
                                    <View
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'relative',
                                            borderRadius: 50,
                                            backgroundColor: theme.color.secondary,
                                        }}
                                    >
                                        {children}
                                    </View>
                                </TouchableOpacity>
                            </CopilotWrapper>
                        </CopilotStep>
                    ),
                })}
            />

            <Tab.Screen
                name="Entities"
                component={Entities}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color, size }) => (
                        <CopilotStep order={2} text={i18n.t('tabStack.entitiesMessage')} name="entities">
                            <CopilotWrapper>
                                <FontAwesome
                                    name="building"
                                    size={size}
                                    style={{
                                        height: 32,
                                    }}
                                    color={color}
                                />
                                <TabText color={color}>{i18n.t('tabStack.entities')}</TabText>
                            </CopilotWrapper>
                        </CopilotStep>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const TabText = styled.Text`
    font-size: 12px;
    color: ${(props) => props.color};
`;

export default copilot({
    tooltipStyle: {
        borderRadius: 5,
    },
    labels: {
        previous: i18n.t('previous'),
        next: i18n.t('next'),
        skip: i18n.t('skip'),
        finish: i18n.t('done'),
    },
    verticalOffset: Platform.OS === 'android' ? 30 : 0,
    stepNumberComponent: () => null,
})(TabStack);

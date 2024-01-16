import React, { useCallback, useEffect, useState } from 'react';

import { Alert, BackHandler, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import BasicLayout from '../../components/BasicLayout';
// Libs
import { lighten, transparentize } from 'polished';
import styled, { useTheme } from 'styled-components/native';

// Providers
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../../components/Button';
import CredentialAbstract from '../../components/CredentialAbstract';
import EntityHeader from '../../components/EntityHeader';
import { useApplicationStore, websocketTransport } from '../../contexts/useApplicationStore';
import i18n from '../../locale';

const PresentSection = ({ descriptor, credentials, selectCredential }) => {
    const theme = useTheme();

    const [creds, setCreds] = useState([]);

    const setSelected = useCallback(
        (index) => {
            const creds = (credentials || []).map((credential, i) => ({
                credential,
                selected: i === index,
            }));
            setCreds(creds);
            selectCredential(creds[index].credential);
        },
        [selectCredential]
    );

    useEffect(() => {
        const creds = (credentials || []).map((credential, index) => ({
            credential,
            selected: index === 0,
        }));
        setCreds(creds);
        if (creds.length) {
            selectCredential(creds[0].credential);
        }
    }, [credentials]);

    return (
        <ListWrapper>
            <View
                style={{
                    marginBottom: 10,
                    width: '100%',
                    paddingHorizontal: 5,
                }}
            >
                {descriptor.name && (
                    <Text
                        style={{
                            ...theme?.font.subtitle,
                            width: '100%',
                            color: transparentize(0.5, 'black'),
                        }}
                    >
                        {descriptor.name}
                    </Text>
                )}
                {descriptor.purpose && (
                    <Text
                        style={{
                            width: '100%',
                            marginTop: 5,
                            color: transparentize(0.7, 'black'),
                        }}
                    >
                        {descriptor.purpose}
                    </Text>
                )}
            </View>
            {creds.length > 0 ? (
                creds.map((item, index) => {
                    return (
                        <View
                            key={index}
                            style={{
                                width: '100%',
                            }}
                        >
                            {!!index && <View style={{ height: 10 }} />}
                            <CredentialAbstract
                                minimal
                                credential={item.credential}
                                children={
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelected(index);
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 32,
                                                height: 32,
                                                marginRight: 5,
                                                borderRadius: 20,
                                                borderWidth: item?.selected ? 2 : 1,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderColor: item?.selected ? '#97CC00' : transparentize(0.6, item?.styles?.text?.color || 'black'),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 23,
                                                    height: 23,
                                                    borderRadius: 20,
                                                    backgroundColor: item?.selected ? '#97CC00' : 'transparent',
                                                }}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                }
                            />
                        </View>
                    );
                })
            ) : (
                <View
                    style={{
                        width: '100%',
                    }}
                >
                    <CredentialAbstract children={<Ionicons name="wallet" size={20} color={transparentize(0.7, 'black')} />} />
                </View>
            )}
        </ListWrapper>
    );
};

const ListWrapper = styled.View`
    align-items: center;
    margin-bottom: 15px;
    width: 100%;
`;

const PresentCredentials = ({ route }) => {
    const theme = useTheme();
    const navigation = useNavigation();

    const { resolve, inputs, credentialsToReceive, issuer } = route.params;
    const [selectedCredentials, setSelectedCredentials] = useState(Array(inputs.length).fill(null));
    const { setIsConnected } = useApplicationStore((state) => ({
        setIsConnected: state.setIsConnected,
    }));

    const acceptCredentials = useCallback(() => {
        const credentialsToSend = selectedCredentials.map((credential) => credential.data);
        resolve(credentialsToSend);
        navigation.goBack();
    }, [selectedCredentials, resolve]);

    const selectCredential = useCallback(
        (crendetial, index) => {
            setSelectedCredentials((prev) => {
                const newSelectedCredentials = [...prev];
                newSelectedCredentials[index] = crendetial;
                return newSelectedCredentials;
            });
        },
        [selectedCredentials]
    );

    useEffect(() => {
        setIsConnected(false);
    }, []);

    const rejectCredentials = useCallback(() => {
        Alert.alert(i18n.t('acceptCredentialsScreen.reject'), i18n.t('acceptCredentialsScreen.rejectDescription'), [
            {
                text: i18n.t('back'),
            },
            {
                text: i18n.t('reject'),
                onPress: () => {
                    websocketTransport.dispose();
                    navigation.goBack();
                },
            },
        ]);
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            rejectCredentials();
            return true;
        });

        return () => backHandler.remove();
    }, []);

    return (
        <BasicLayout
            title={i18n.t('credentials')}
            contentStyle={{
                paddingBottom: 30,
            }}
            onlyTitle
            bottomTab={false}
            onBack={() => {
                rejectCredentials();
            }}
        >
            <Container>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        width: '100%',
                    }}
                >
                    {issuer?.styles && <EntityHeader entityStyles={issuer.styles} />}
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '90%',
                            }}
                        >
                            {credentialsToReceive?.length > 0 && (
                                <>
                                    <Title>
                                        {issuer?.name || issuer?.id || issuer} {i18n.t('presentCredentialsScreen.emit')}
                                    </Title>
                                    {credentialsToReceive.map((credentialToReceive, index) => {
                                        return (
                                            <View key={index}>
                                                {!!index && <View style={{ height: 10 }} />}
                                                <CredentialAbstract credential={credentialToReceive} />
                                            </View>
                                        );
                                    })}
                                </>
                            )}

                            {credentialsToReceive?.length > 0 && inputs?.length > 0 && (
                                <View
                                    style={{
                                        width: '100%',
                                        height: 1,
                                        marginTop: 20,
                                        backgroundColor: transparentize(0.8, 'black'),
                                    }}
                                />
                            )}

                            {inputs?.length > 0 && (
                                <>
                                    <Title
                                        style={{
                                            marginTop: 15,
                                            marginBottom: 10,
                                        }}
                                    >
                                        {i18n.t('presentCredentialsScreen.present')}{' '}
                                    </Title>

                                    {inputs.map((input, index) => {
                                        return (
                                            <PresentSection
                                                selectCredential={(credential) => selectCredential(credential, index)}
                                                key={index}
                                                credentials={input.credentials}
                                                descriptor={input.descriptor}
                                            />
                                        );
                                    })}
                                </>
                            )}
                        </View>
                    </View>
                </ScrollView>

                <ButtonWrapper>
                    <Button
                        style={{ width: '47%' }}
                        backgroundColor={lighten(0.1, 'red')}
                        onPress={() => {
                            rejectCredentials();
                        }}
                    >
                        {i18n.t('cancel')}
                    </Button>
                    <Button
                        style={{ width: '47%' }}
                        backgroundColor={theme.color.secondary}
                        onPress={acceptCredentials}
                        disabled={inputs.length > 0 && selectedCredentials.some((credential) => credential === null)}
                    >
                        {`${i18n.t('accept')}`}
                    </Button>
                </ButtonWrapper>
            </Container>
        </BasicLayout>
    );
};

const Container = styled.View`
    width: ${Dimensions.get('window').width}px;
    height: 100%;
    align-items: center;
`;

const ButtonWrapper = styled.View`
    flex-direction: row;
    margin-top: 25px;
    width: 90%;
    position: relative;
    justify-content: space-between;
`;

const Title = styled.Text`
    margin: 15px 0;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: ${transparentize(0.3, 'black')};
`;

export default PresentCredentials;

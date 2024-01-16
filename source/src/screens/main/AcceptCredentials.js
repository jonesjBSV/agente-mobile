import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Alert, BackHandler, Dimensions, ScrollView, View } from 'react-native';
import BasicLayout from '../../components/BasicLayout';
// Libs
import Checkbox from 'expo-checkbox';
import { lighten, transparentize } from 'polished';
import styled, { useTheme } from 'styled-components/native';

// Providers
import Button from '../../components/Button';
import i18n from '../../locale';

// import { useStorageProvider } from '../../contexts/StorageContext';
import CredentialAbstract from '../../components/CredentialAbstract';

import { shallow } from 'zustand/shallow';
import EntityHeader from '../../components/EntityHeader';
import { useApplicationStore, websocketTransport } from '../../contexts/useApplicationStore';

const AcceptCredentials = ({ navigation, route }) => {
    const theme = useTheme();
    const [credentials, setCredentials] = useState(
        () =>
            route.params?.credentials?.map((credential) => ({
                ...credential,
                selected: true,
            })) || []
    );
    const count = useMemo(() => credentials.filter((credential) => credential.selected).length || 0, [credentials]);
    const issuer = useMemo(() => route.params?.issuer, [route.params?.issuer]);
    const { credential } = useApplicationStore(
        (state) => ({
            credential: state.credential,
        }),
        shallow
    );

    const setSelected = useCallback(
        (index) => {
            setCredentials((prev) => {
                const newCredentials = [...prev];
                newCredentials[index].selected = !newCredentials[index].selected;
                return newCredentials;
            });
        },
        [credentials]
    );

    const acceptCredentials = useCallback(async () => {
        try {
            const selectedCredentials = credentials
                .filter((item) => item.selected)
                .map((item) => ({
                    data: item.data,
                    display: item.display,
                    styles: item.styles,
                }));

            for (let index = 0; index < selectedCredentials.length; index++) {
                const element = selectedCredentials[index];
                await credential.add(element);
            }

            navigation.navigate('Credentials');
        } catch (error) {
            console.log(error);
        }
    }, [credentials]);

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
            title={i18n.t('acceptCredentialsScreen.header')}
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
                            <Title>
                                {issuer?.name || issuer?.id || issuer} {i18n.t('acceptCredentialsScreen.description')}
                            </Title>
                            {credentials?.map((credential, index) => (
                                <View key={index}>
                                    {!!index && <View style={{ height: 10 }} />}
                                    <CredentialAbstract
                                        key={index}
                                        credential={credential}
                                        children={
                                            <Checkbox
                                                value={credential.selected}
                                                color={credential.selected ? '#97CC00' : transparentize(0.6, credential.styles?.text?.color || 'black')}
                                                onValueChange={() => setSelected(index)}
                                                style={{
                                                    padding: 14,
                                                    borderColor: transparentize(0.8, 'black'),
                                                }}
                                            />
                                        }
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                <ButtonWrapper>
                    <Button
                        backgroundColor={lighten(0.1, 'red')}
                        onPress={rejectCredentials}
                        style={{
                            width: '47%',
                            position: 'relative',
                        }}
                    >
                        {i18n.t('cancel')}
                    </Button>
                    <Button
                        onPress={acceptCredentials}
                        disabled={count <= 0}
                        backgroundColor={theme.color.secondary}
                        style={{
                            width: '47%',
                            position: 'relative',
                        }}
                    >
                        {i18n.t('acceptCredentialsScreen.accept')} ({count})
                    </Button>
                </ButtonWrapper>
            </Container>
        </BasicLayout>
    );
};

const Container = styled.View`
    align-items: center;
    width: ${Dimensions.get('window').width}px;
    height: 100%;
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

export default AcceptCredentials;

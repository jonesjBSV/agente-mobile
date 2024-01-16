// Libs
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { transparentize } from 'polished';
import React, { FC, useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import styled from 'styled-components/native';

// Contexts
import BasicLayout from '../../components/BasicLayout';
import ListLayout from '../../components/ListLayout';
// import { useStorageProvider } from '../../contexts/StorageContext';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import app from '../../../app.json';
import Button from '../../components/Button';
import CredentialAbstract from '../../components/CredentialAbstract';
import { useApplicationStore } from '../../contexts/useApplicationStore';
import i18n from '../../locale';

interface CredentialsProps {
    navigation: NavigationProp<any>;
    route: RouteProp<any, any>;
}

const Credentials: FC<CredentialsProps> = ({ navigation, route }) => {
    const theme: any = useTheme();
    const { credentials } = useApplicationStore((state) => ({
        credentials: state.credentials,
    }));

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return false;
        });

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (!!route.params?.credentialId) {
            const credential = credentials.find((credential) => credential.data.id === route.params?.credentialId);
            if (credential) {
                navigation.navigate('CredentialDetails', {
                    credential,
                    remove: true,
                });
            } else {
                Alert.alert(i18n.t('credentialsScreen.deleted'), i18n.t('credentialsScreen.deletedDescription'));
            }
        }
    }, [route.params?.credentialId]);

    return (
        <BasicLayout title={app.expo.name} principal>
            <ListLayout
                title={i18n.t('credentialsScreen.title')}
                data={credentials}
                contentContainerStyle={{ paddingTop: 10 }}
                onPressButton={() => navigation.navigate('AddCredential')}
                RenderItemComponent={({ item }) => <CredentialAbstract credential={item} remove minimal />}
                EmptyComponent={() => (
                    <>
                        <IoniconsStyled
                            name="wallet"
                            size={60}
                            color={transparentize(0.6, 'black')}
                            style={{
                                marginBottom: 20,
                            }}
                        />
                        <EmptyText>{i18n.t('credentialsScreen.empty')}</EmptyText>
                        <Button
                            backgroundColor={theme.color.secondary}
                            style={{
                                width: 'auto',
                            }}
                            onPress={() => navigation.navigate('AddCredential')}
                        >
                            <ViewStyled>
                                <AntDesignStyled name="plus" size={14} color={'white'} />
                                <TextStyled>{i18n.t('credentialsScreen.add')}</TextStyled>
                            </ViewStyled>
                        </Button>
                    </>
                )}
            />
        </BasicLayout>
    );
};

const IoniconsStyled = styled(Ionicons)``;
const ViewStyled = styled.View`
    flex-direction: row;
    align-items: center;
`;
const AntDesignStyled = styled(AntDesign)``;
const TextStyled = styled.Text`
    color: white;
    margin-left: 5px;
`;
const EmptyText = styled.Text`
    color: ${transparentize(0.6, 'black')};
    text-align: center;
    font-size: 15px;
    width: 90%;
    margin-bottom: 30px;
`;

export default Credentials;

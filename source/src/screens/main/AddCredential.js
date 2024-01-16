import React from 'react';

import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { transparentize } from 'polished';
import { Dimensions, Text, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import BasicLayout from '../../components/BasicLayout';
import List from '../../components/List';
import i18n from '../../locale';

import { shallow } from 'zustand/shallow';
import Button from '../../components/Button';
import EntityItem from '../../components/EntityItem';
import { useApplicationStore } from '../../contexts/useApplicationStore';

const AddCredential = ({ navigation }) => {
    const theme = useTheme();
    const { entities } = useApplicationStore(
        (state) => ({
            entities: state.entities,
        }),
        shallow
    );

    return (
        <BasicLayout
            title={i18n.t('addCredentialScreen.title')}
            contentStyle={{
                paddingBottom: 30,
                paddingTop: 10,
            }}
            onlyTitle
            bottomTab={false}
            onBack={() => navigation.goBack()}
        >
            <Container>
                <Text
                    style={{
                        textAlign: 'center',
                        marginTop: 10,
                        color: transparentize(0.4, 'black'),
                    }}
                >
                    {i18n.t('addCredentialScreen.entityTitle')}
                </Text>

                <List
                    showsVerticalScrollIndicator={true}
                    data={entities}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                        width: '100%',
                        height: '100%',
                    }}
                    EmptyComponent={() => (
                        <>
                            <FontAwesome name="building" size={50} color={transparentize(0.5, 'black')} />
                            <Text style={{ color: transparentize(0.5, 'black') }}>{i18n.t('entitiesScreen.empty')}</Text>
                        </>
                    )}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        paddingTop: 15,
                        width: '100%',
                    }}
                    RenderItemComponent={({ item }) => <EntityItem data={item} navigation={navigation} />}
                />

                <Text
                    style={{
                        textAlign: 'center',
                        marginBottom: 10,
                        marginTop: 20,
                        color: transparentize(0.4, 'black'),
                    }}
                >
                    {i18n.t('addCredentialScreen.scanTitle')}
                </Text>

                <ButtonWrapper>
                    <Button
                        backgroundColor={theme.color.secondary}
                        onPress={() => navigation.navigate('Scan')}
                        style={{
                            width: '100%',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <MaterialIcons name="qr-code-scanner" size={20} color={'white'} style={{ marginRight: 5 }} />
                            <Text
                                style={{
                                    color: 'white',
                                }}
                            >
                                {i18n.t('addCredentialScreen.button')}
                            </Text>
                        </View>
                    </Button>
                </ButtonWrapper>
            </Container>
        </BasicLayout>
    );
};

const Container = styled.View`
    align-items: center;
    width: 100%;
    height: 100%;
`;

const ButtonWrapper = styled.View`
    width: ${Dimensions.get('window').width * 0.8}px;
`;

export default AddCredential;

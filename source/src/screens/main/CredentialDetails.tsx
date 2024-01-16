import { Ionicons } from '@expo/vector-icons';
import { lighten, transparentize } from 'polished';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import BasicLayout from '../../components/BasicLayout';
import i18n from '../../locale';
// import { useStorageProvider } from '../../contexts/StorageContext';
import { useTheme } from 'styled-components';
import validator from 'validator';
import CredentialAbstract from '../../components/CredentialAbstract';
import { useApplicationStore } from '../../contexts/useApplicationStore';
import { formatField } from '../../utils';

const ImageItem = ({ item }) => {
    const theme: any = useTheme();
    const [error, setError] = useState(false);
    return (
        <>
            <Label
                style={{
                    color: theme.color.secondary,
                }}
            >
                {item.label}
            </Label>
            {!error ? (
                <ImageWrapper>
                    <ImageStyled
                        style={{
                            width: Dimensions.get('window').width / 2.5,
                            height: Dimensions.get('window').width / 2.5,
                            borderRadius: 10,
                        }}
                        resizeMode={'cover'}
                        source={{
                            uri: item.value,
                        }}
                        onError={() => {
                            setError(true);
                        }}
                    />
                    <Separator />
                </ImageWrapper>
            ) : (
                <>
                    <Value ellipsizeMode="tail" numberOfLines={3}>
                        {item.value}
                    </Value>
                    <Separator />
                </>
            )}
        </>
    );
};

const ImageStyled = styled(Image)``;

const CredentialDetails = ({ navigation, route }) => {
    const [contentHeight, setContentHeight] = useState(0);
    const { credential } = useApplicationStore((state) => ({
        credential: state.credential,
    }));
    const theme: any = useTheme();
    const [credentialHeight, setCredentialHeight] = useState(0);
    const [titlesHeight, setTitlesHeight] = useState(0);

    const currentCredential = useMemo(() => route.params?.credential, []);

    const styles = useMemo(() => route.params?.credential.styles, []);

    const properties = useMemo(() => {
        return currentCredential.display?.properties
            ?.map((prop) => {
                const value = formatField(currentCredential.data, prop);
                if (!validator.isDataURI(value)) {
                    return {
                        label: prop.label,
                        value,
                    };
                }
            })
            .filter((prop) => prop);
    }, [currentCredential]);

    const media = useMemo(() => {
        return currentCredential.display?.properties
            ?.map((prop) => {
                const value = formatField(currentCredential.data, prop);
                if (validator.isDataURI(value)) {
                    return {
                        label: prop.label,
                        value,
                    };
                }
            })
            .filter((prop) => prop);
    }, [currentCredential]);

    const deleteCredential = useCallback((id) => {
        Alert.alert(i18n.t('credentialDetailsScreen.remove'), i18n.t('credentialDetailsScreen.removeMessage'), [
            { text: i18n.t('cancel') },
            {
                text: i18n.t('remove'),
                onPress: async () => {
                    await credential.remove(id);
                    navigation.goBack();
                },
            },
        ]);
    }, []);

    return (
        <BasicLayout
            title={i18n.t('credentialDetailsScreen.title')}
            contentStyle={{
                paddingTop: 10,
            }}
            onlyTitle
            bottomTab={false}
            onBack={() => navigation.goBack()}
            setContentHeight={setContentHeight}
        >
            <DataWrapper>
                <CredentialAbstract
                    disabled
                    credential={currentCredential}
                    style={{
                        marginVertical: 10,
                    }}
                    children={
                        route.params?.remove ? (
                            <TouchableOpacityStyled onPress={() => deleteCredential(currentCredential.data.id)}>
                                <IoniconsStyled name="md-trash" size={30} color={transparentize(0.5, styles?.text?.color || 'black')} />
                            </TouchableOpacityStyled>
                        ) : (
                            <></>
                        )
                    }
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setCredentialHeight(height.toFixed(0));
                    }}
                />
                <Info>
                    <Titles
                        onLayout={(event) => {
                            const { height } = event.nativeEvent.layout;
                            setTitlesHeight(height.toFixed(0));
                        }}
                    >
                        {currentCredential.display?.title && (
                            <Title
                                style={{
                                    color: theme.color.secondary,
                                }}
                            >
                                {formatField(currentCredential.data, currentCredential.display.title)}
                            </Title>
                        )}

                        {currentCredential.display?.subtitle && <SubTitle>{formatField(currentCredential.data, currentCredential.display.subtitle)}</SubTitle>}

                        {currentCredential.display?.description && (
                            <Description>{formatField(currentCredential.data, currentCredential.display.description)}</Description>
                        )}
                    </Titles>
                    <ListWrapper
                        style={{
                            height: contentHeight - titlesHeight - credentialHeight - 70,
                        }}
                    >
                        <FlatListStyled
                            data={properties}
                            renderItem={({ item, index }) => (
                                <Container>
                                    <Label
                                        style={{
                                            color: theme.color.secondary,
                                        }}
                                    >
                                        {item.label}
                                    </Label>
                                    <Value ellipsizeMode="tail" numberOfLines={3}>
                                        {item.value}
                                    </Value>
                                </Container>
                            )}
                            scrollEnabled={true}
                            numColumns={2}
                            ItemSeparatorComponent={() => <Separator />}
                            keyExtractor={(item, index) => index}
                            columnWrapperStyle={{
                                justifyContent: 'space-between',
                            }}
                            ListHeaderComponent={
                                <>
                                    {media?.map((item, index) => (
                                        <ImageItem item={item} key={index} />
                                    ))}
                                </>
                            }
                        />
                    </ListWrapper>
                </Info>
            </DataWrapper>
        </BasicLayout>
    );
};

const FlatListStyled = styled(FlatList)``;
const IoniconsStyled = styled(Ionicons)``;

const TouchableOpacityStyled = styled(TouchableOpacity)``;

const Info = styled.View`
    width: 95%;
`;

const Separator = styled.View`
    width: 100%;
    height: 5px;
`;

const ImageWrapper = styled.View`
    border-radius: 10px;
    position: relative;
    margin-top: 8px;
    margin-bottom: 8px;
    width: 100%;
`;

const Titles = styled.View`
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
`;

const ListWrapper = styled.View`
    width: 100%;
    position: relative;
`;

const DataWrapper = styled.View`
    align-items: center;
    width: 90%;
    padding-top: 5px;
`;

const Container = styled.View`
    flex: 0.47;
`;

const Title = styled.Text`
    font-weight: bold;
    font-size: 18px;
    width: 100%;
    margin-bottom: 8px;
`;

const Label = styled.Text`
    font-size: 14px;
    font-weight: bold;
`;

const SubTitle = styled.Text`
    font-size: 16px;
    margin-bottom: 5px;
    width: 100%;
    color: ${lighten(0.2, 'black')};
`;

const Description = styled.Text`
    font-size: 14px;
    color: ${lighten(0.4, 'black')};
    margin-bottom: 5px;
`;

const Value = styled.Text`
    font-size: 13px;
    color: ${lighten(0.2, 'black')};
`;

export default CredentialDetails;

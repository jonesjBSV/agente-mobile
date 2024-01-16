import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { lighten, transparentize } from 'polished';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, Platform } from 'react-native';
import Picker from 'react-native-picker-select';
import { useWebViewMessage } from 'react-native-react-bridge';
import WebView from 'react-native-webview';
import styled, { useTheme } from 'styled-components/native';
import { shallow } from 'zustand/shallow';
import Button from '../../components/Button';
import WebModule from '../../components/WebModule';
import agentConfig from '../../config/agent';
import stylesConfig from '../../config/styles';
import { useApplicationStore } from '../../contexts/useApplicationStore';
import i18n from '../../locale';
import { Layout } from '../../styled-components/Layouts';

interface CreateDidProps {}

const CreateDid: FC<CreateDidProps> = () => {
    const theme = useTheme();
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [isBbsBlsCreated, setIsBbsBlsCreated] = useState(true);
    const { did } = useApplicationStore((state) => ({ did: state.did }), shallow);
    const [didMethods, setDidMethods] = useState<string[]>([agentConfig.didMethod]);
    const multiMethod = useMemo(() => stylesConfig.features.find((e) => e.name === 'multi-method'), []);
    const [didMethodSelected, setDidMethodSelected] = useState(() => (!multiMethod ? agentConfig.didMethod : ''));

    const { setIsLoading } = useApplicationStore((state) => ({ setIsLoading: state.setIsLoading }), shallow);

    const { ref, onMessage, emit } = useWebViewMessage(async (message: { type: string; data: any }) => {
        switch (message.type) {
            case 'sendBbsBlsSecrets':
                setIsBbsBlsCreated(true);
                setLoading(true);
                try {
                    await did.create(didMethodSelected || agentConfig.didMethod, [message.data]);
                } catch (error) {
                    setIsBbsBlsCreated(false);
                    Alert.alert('Error', i18n.t('didStack.errorMessage'));
                } finally {
                    setLoading(false);
                }
                break;
            default:
                break;
        }
    });

    const getMethods = useCallback(async () => {
        setFetching(true);
        try {
            const { data } = await axios.get(agentConfig.universalResolverUrl + '/mappings');
            const sorted = data.list.sort((a: any) => (a.pattern === agentConfig.didMethod ? -1 : 1)).map((e) => e.pattern);
            setDidMethods(sorted);
        } catch (error) {
            console.log(error);
        }
        setFetching(false);
    }, []);

    useEffect(() => {
        if (multiMethod) {
            getMethods();
        }

        if (Platform.OS === 'ios') {
            setIsBbsBlsCreated(false);
        } else {
            setIsLoading(true);
            setTimeout(() => {
                setIsBbsBlsCreated(false);
                setIsLoading(false);
            }, 2000);
        }
    }, []);

    const onCreate = useCallback(async () => {
        setLoading(true);
        try {
            emit({ type: 'getBbsBlsSecrets' } as any);
        } catch (error) {
            Alert.alert('Error', i18n.t('didStack.errorMessage'));
            setLoading(false);
        }
    }, [didMethodSelected, did]);

    const onImport = useCallback(async () => {
        setLoading(true);
        try {
            const document = await DocumentPicker.getDocumentAsync();
            if (document.type === 'success') {
                const file = JSON.parse(await FileSystem.readAsStringAsync(document.uri));
                did.import(file);
            }
        } catch (error) {
            Alert.alert('Error', i18n.t('errorDescription'));
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <Layout
            style={{
                paddingTop: Platform.OS === 'ios' ? 0 : 10,
            }}
        >
            <ItemContainer>
                <ItemWrapper>
                    <ImageContainer backgroundColor={theme.color.primary}>
                        <StepWrapper
                            backgroundColor={theme.color.tertiary}
                            style={{
                                transform: [{ translateX: width * -0.5 }, { translateY: height * 0.5 }],
                            }}
                            onLayout={(event) => {
                                const { height, width } = event.nativeEvent.layout;
                                setHeight(height);
                                setWidth(width);
                            }}
                        >
                            <Step>{i18n.t('step').toUpperCase()} 1</Step>
                        </StepWrapper>
                        <ImageWrapper>
                            <ImageStyled
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                source={stylesConfig.steps[0]}
                                resizeMode="contain"
                            />
                        </ImageWrapper>
                    </ImageContainer>
                    <TextWrapper>
                        <Title style={{ ...theme.font.title }}>{i18n.t('didStack.createDid')}</Title>
                        <Description style={{ ...theme.font.subtitle }}>{i18n.t('didStack.haveDid')}</Description>
                    </TextWrapper>
                </ItemWrapper>
                {multiMethod && (
                    <PickerWrapper>
                        <PickerLabel>{i18n.t('didStack.methodPlaceholder')}:</PickerLabel>
                        <PickerStyled
                            onValueChange={(value) => setDidMethodSelected(value)}
                            items={didMethods.map((method) => ({
                                label: method,
                                value: method,
                            }))}
                            placeholder={{ label: i18n.t('didStack.method'), value: null }}
                            disabled={loading || fetching}
                            useNativeAndroidPickerStyle={false}
                            fixAndroidTouchableBug
                        />
                    </PickerWrapper>
                )}
                {!isBbsBlsCreated && <WebViewStyled ref={ref} source={{ html: WebModule }} onMessage={onMessage} />}
                <ButtonWrapper>
                    <Button
                        style={{ width: '100%' }}
                        backgroundColor={theme.color.secondary}
                        color={theme.color.white}
                        loading={loading || fetching}
                        onPress={onCreate}
                        disabled={!didMethodSelected}
                    >
                        {i18n.t('didStack.create')}
                    </Button>
                    <TouchableOpacityStyled
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginTop: 10,
                        }}
                        disabled={loading || fetching}
                        onPress={onImport}
                    >
                        <TextStyled>{i18n.t('didStack.import')}</TextStyled>
                        <EntypoStyled name="chevron-small-down" size={25} color={transparentize(0.5, 'black')} />
                    </TouchableOpacityStyled>
                </ButtonWrapper>
            </ItemContainer>
        </Layout>
    );
};

const WebViewStyled = styled(WebView)``;

const PickerStyled = styled(Picker)``;

const PickerWrapper = styled.View`
    flex-direction: row;
    align-items: center;
`;

const PickerLabel = styled.Text`
    color: ${lighten(0.4, 'black')};
    margin-right: 5px;
`;

const TouchableOpacityStyled = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-top: 10px;
`;

const TextStyled = styled.Text`
    color: ${transparentize(0.5, 'black')};
`;

const EntypoStyled = styled(Entypo)``;

const ImageWrapper = styled.View`
    width: 70%;
    height: 70%;
    justify-content: center;
    align-items: center;
`;

const ImageStyled = styled.Image``;

const StepWrapper = styled.View`
    background-color: ${(props) => props.backgroundColor};
    padding: 10px;
    position: absolute;
    bottom: 0;
    left: 50%;
    border-radius: 10px;
`;

const Step = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #fff;
`;

const ItemContainer = styled.View`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    position: relative;
    padding-bottom: 20px;
`;

const ImageContainer = styled.View`
    width: 100%;
    height: ${Dimensions.get('window').height * 0.5}px;
    background-color: ${(props) => props.backgroundColor};
    justify-content: center;
    align-items: center;
    position: relative;
`;

const ItemWrapper = styled.View`
    width: 100%;
`;

const TextWrapper = styled.View`
    padding: 35px 20px;
    align-items: center;
`;

const Title = styled.Text`
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 10px;
    text-align: center;
`;
const Description = styled.Text`
    color: ${lighten(0.4, 'black')};
    text-align: center;
`;

const ButtonWrapper = styled.View`
    width: 80%;
`;

export default CreateDid;

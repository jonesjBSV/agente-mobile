import { NavigationProp, RouteProp } from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import { transparentize } from 'polished';
import React, { FC, useMemo } from 'react';
import styled, { useTheme } from 'styled-components/native';
import BasicLayout from '../../components/BasicLayout';
import Button from '../../components/Button';
import i18n from '../../locale';

interface VerificationResultProps {
    navigation: NavigationProp<any>;
    route: RouteProp<any, any>;
}

const VerificationResult: FC<VerificationResultProps> = ({ navigation, route }) => {
    const result = useMemo(() => route.params?.data, [route.params?.data]);
    const theme = useTheme();

    return (
        <BasicLayout
            title={i18n.t('verificationResultScreen.title')}
            contentStyle={{
                justifyContent: 'space-between',
                paddingBottom: 30,
            }}
            onlyTitle
            bottomTab={false}
            onBack={() => navigation.goBack()}
        >
            <ViewStyled></ViewStyled>
            <TextWrapper>
                <LottieStyled
                    autoPlay
                    loop={false}
                    autoSize
                    source={result.status ? require('../../assets/animations/success.json') : require('../../assets/animations/fail.json')}
                />
                <Title>{result.status ? i18n.t('verificationResultScreen.success') : i18n.t('verificationResultScreen.error')}</Title>
                <Body>
                    {result.status
                        ? i18n.t('verificationResultScreen.successMessage')
                        : i18n.t(`verificationError.${result.code}`, {
                              defaultValue: '',
                          }) || i18n.t('verificationError.default')}
                </Body>
            </TextWrapper>
            <Button
                backgroundColor={theme.color.secondary}
                onPress={() => navigation.goBack()}
                style={{
                    width: '80%',
                }}
            >
                {i18n.t('accept')}
            </Button>
        </BasicLayout>
    );
};

const LottieStyled = styled(Lottie)`
    margin-bottom: 20px;
`;

const ViewStyled = styled.View``;

const TextWrapper = styled.View`
    width: 95%;
    align-items: center;
    justify-content: center;
`;

const Title = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: black;
    text-align: center;
`;

const Body = styled.Text`
    font-size: 16px;
    margin-top: 10px;
    color: ${transparentize(0.4, 'black')};
    text-align: center;
    width: 90%;
`;

export default VerificationResult;

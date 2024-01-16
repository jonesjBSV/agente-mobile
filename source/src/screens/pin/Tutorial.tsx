import { NavigationProp } from '@react-navigation/native';
import { lighten } from 'polished';
import React, { FC, useState } from 'react';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import Button from '../../components/Button';
import i18n from '../../locale';
import { Layout } from '../../styled-components/Layouts';

interface TutorialPinProps {
    navigation: NavigationProp<any>;
}

const TutorialPin: FC<TutorialPinProps> = ({ navigation }) => {
    const theme = useTheme();
    const { top, bottom } = useSafeAreaInsets();
    const [headerHeight, setHeaderHeight] = useState(30);

    return (
        <Layout>
            <Wrapper headerHeight={headerHeight} safeAreaHeight={top + bottom}>
                <TitleWrapper>
                    <Title style={{ ...theme.font.title }}>{i18n.t('pinStack.welcome')}</Title>
                </TitleWrapper>
                <ImageStyled
                    style={{
                        width: Dimensions.get('window').width * 0.5,
                        height: Dimensions.get('window').height * 0.3,
                    }}
                    source={theme.images.logo}
                    resizeMode="contain"
                />
                <TitleWrapper>
                    <Title
                        style={{
                            ...theme.font.text,
                            paddingBottom: 20,
                            color: lighten(0.4, theme.color.font),
                        }}
                    >
                        {i18n.t('pinStack.welcomeMessage')}
                    </Title>
                    <Button backgroundColor={theme.color.secondary} color={theme.color.white} onPress={() => navigation.navigate('CreatePin')}>
                        {i18n.t('pinStack.createPin')}
                    </Button>
                </TitleWrapper>
            </Wrapper>
        </Layout>
    );
};

const ImageStyled = styled.Image``;

const Wrapper = styled.View`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
`;

const Title = styled.Text`
    color: ${(props) => props.theme.color.font};
    text-align: center;
`;

const TitleWrapper = styled.View`
    align-items: center;
    width: 80%;
`;

export default TutorialPin;

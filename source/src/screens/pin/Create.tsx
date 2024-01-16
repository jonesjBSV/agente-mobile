import { NavigationProp } from '@react-navigation/native';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import Draft from '../../components/Draft';
import NumberPad from '../../components/NumberPad';
import PinItems from '../../components/PinItems';
import i18n from '../../locale';
import { Layout } from '../../styled-components/Layouts';

interface CreatePinProps {
    navigation: NavigationProp<{
        ConfirmPin: { authenticationPin: string };
    }>;
}

const CreatePin: FC<CreatePinProps> = ({ navigation }) => {
    const theme = useTheme();
    const { top, bottom } = useSafeAreaInsets();
    const [value, setValue] = useState('');
    const [headerHeight, setHeaderHeight] = useState(30);
    const maxLength = useMemo(() => 8, []);

    const handlePin = useCallback((authPin: string) => {
        if (authPin.length <= maxLength) {
            setValue(authPin);
            if (authPin.length === maxLength) {
                setValue('');
                navigation.navigate('ConfirmPin', { authenticationPin: authPin });
            }
        }
    }, []);

    return (
        <Draft navigation={navigation} color={theme.color.white} setHeight={setHeaderHeight} backgroundColor={theme.color.primary}>
            <Layout>
                <Wrapper>
                    <TitleWrapper>
                        <Title style={{ ...theme.font.title }}>{i18n.t('pinStack.createPin')}</Title>
                    </TitleWrapper>
                    <ImageStyled
                        style={{
                            width: Dimensions.get('window').width * 0.5,
                            height: Dimensions.get('window').height * 0.3,
                        }}
                        source={theme.images.logo}
                        resizeMode="contain"
                    />

                    <PinItems length={maxLength} value={value} color={theme.color.secondary} style={{ marginBottom: 15 }} />
                    <NumberPad
                        style={{
                            width: '90%',
                        }}
                        value={value}
                        setValue={handlePin}
                        maxLength={maxLength}
                    />
                </Wrapper>
            </Layout>
        </Draft>
    );
};

const ImageStyled = styled.Image``;

const Wrapper = styled.View`
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding-bottom: 20px;
`;

const Title = styled.Text`
    color: ${(props) => props.theme.color.font};
    font-size: 24px;
    padding: 20px;
`;

const TitleWrapper = styled.View`
    align-items: center;
    width: 100%;
`;

export default CreatePin;

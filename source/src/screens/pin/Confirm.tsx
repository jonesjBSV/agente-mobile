import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, Vibration } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import { shallow } from 'zustand/shallow';
import Draft from '../../components/Draft';
import NumberPad from '../../components/NumberPad';
import PinItems from '../../components/PinItems';
import { useApplicationStore } from '../../contexts/useApplicationStore';
import i18n from '../../locale';
import { Layout } from '../../styled-components/Layouts';

const ConfirmPin = ({ navigation, route }) => {
    const theme = useTheme();
    const authenticationPin = useMemo<string>(() => route.params?.authenticationPin, []);
    const { pin } = useApplicationStore((state) => ({ pin: state.pin }), shallow);
    const { top, bottom } = useSafeAreaInsets();
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [disabled, setDisabled] = useState(false);

    const handlePin = useCallback((authPin: string) => {
        if (authPin.length <= authenticationPin.length && !disabled) {
            setValue(authPin);
            if (authPin.length === authenticationPin.length) {
                if (authPin === authenticationPin) {
                    pin.set(authPin);
                } else {
                    Vibration.vibrate(50);
                    setError(true);
                    setDisabled(true);
                    setTimeout(() => {
                        setError(false);
                        setDisabled(false);
                        setValue('');
                    }, 500);
                }
            }
        }
    }, []);

    return (
        <Draft navigation={navigation} color={theme.color.white} setHeight={setHeaderHeight} backgroundColor={theme.color.primary}>
            <Layout>
                <Wrapper headerHeight={headerHeight} safeAreaHeight={top + bottom}>
                    <TitleWrapper>
                        <Title style={{ ...theme.font.title }}>{i18n.t('pinStack.confirmPin')}</Title>
                    </TitleWrapper>
                    <ImageStyled
                        style={{
                            width: Dimensions.get('window').width * 0.5,
                            height: Dimensions.get('window').height * 0.3,
                        }}
                        source={theme.images.logo}
                        resizeMode="contain"
                    />

                    <PinItems length={authenticationPin.length} value={value} error={error} color={theme.color.secondary} style={{ marginBottom: 15 }} />
                    <NumberPad
                        style={{
                            width: '90%',
                        }}
                        value={value}
                        setValue={handlePin}
                        maxLength={authenticationPin.length}
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

export default ConfirmPin;

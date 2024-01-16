import { Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { darken, lighten, transparentize } from 'polished';
import React, { FC, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CSSProperties } from 'styled-components';
import { shallow } from 'zustand/shallow';
import { useApplicationStore } from '../contexts/useApplicationStore';
import i18n from '../locale';
import { ContainerLayout } from '../styled-components/Layouts';

interface BasicLayoutProps {
    title?: string;
    children?: React.ReactNode;
    onlyTitle?: boolean;
    headerStyle?: CSSProperties;
    contentStyle?: CSSProperties;
    onBack?: () => void;
    style?: CSSProperties;
    bottomTab?: boolean;
    setContentHeight?: (height: number) => void;
    principal?: boolean;
}

const BasicLayout: FC<BasicLayoutProps> = ({
    title,
    children,
    onlyTitle = false,
    headerStyle,
    contentStyle,
    onBack,
    style,
    bottomTab = true,
    setContentHeight = () => {},
    principal = false,
    ...props
}) => {
    const theme = useTheme();
    const { top } = useSafeAreaInsets();
    const navigation = useNavigation<
        NativeStackNavigationProp<{
            Notifications: undefined;
            Settings: undefined;
        }>
    >();
    const { notifications } = useApplicationStore(
        (state) => ({
            notifications: state.notifications,
        }),
        shallow
    );

    const notificationsCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);

    return (
        <ContainerLayout
            backgroundColor={theme.color.primary}
            style={{
                ...style,
                paddingTop: top,
            }}
            {...props}
        >
            <HeaderContainer style={headerStyle}>
                {principal && (
                    <TouchableOpacityStyled
                        style={{
                            position: 'relative',
                            flex: 1 / 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <IoniconsStyled
                            name="notifications"
                            size={25}
                            style={{
                                color: lighten(0.5, theme.color.font),
                                position: 'relative',
                            }}
                        />
                        {notificationsCount > 0 && (
                            <ViewStyled
                                style={{
                                    position: 'absolute',
                                    top: 5,
                                    left: 10,
                                    backgroundColor: 'red',
                                    borderRadius: 10,
                                    width: 10,
                                    height: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            />
                        )}
                    </TouchableOpacityStyled>
                )}
                {theme.images.logoSmall && !onlyTitle && (
                    <ImageStyled source={theme.images.logoSmall} resizeMode="contain" style={{ height: '80%', flex: 6 / 8 }} />
                )}
                {onBack && (
                    <BackWrapper onPress={onBack} style={{ flex: 1 / 2 }}>
                        <EntypoStyled name="chevron-small-left" size={25} color={transparentize(0.4, theme.color.font)} />
                        <BackText>{i18n.t('back')}</BackText>
                    </BackWrapper>
                )}

                {title && (!theme.images.logoSmall || onlyTitle) && <HeaderText>{title}</HeaderText>}
                {onBack && <ViewStyled style={{ flex: 1 / 2 }} />}

                {principal && (
                    <TouchableOpacityStyled
                        style={{
                            position: 'relative',
                            flex: 1 / 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <IoniconsStyled
                            name="ios-settings-sharp"
                            size={25}
                            style={{
                                color: lighten(0.5, theme.color.font),
                                position: 'relative',
                            }}
                        />
                    </TouchableOpacityStyled>
                )}
            </HeaderContainer>

            <ContentWrapper
                style={contentStyle}
                onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setContentHeight(height.toFixed(0));
                }}
            >
                {children}
            </ContentWrapper>
        </ContainerLayout>
    );
};

const ImageStyled = styled.Image``;

const ViewStyled = styled.View``;

const IoniconsStyled = styled(Ionicons)``;
const EntypoStyled = styled(Entypo)``;
const TouchableOpacityStyled = styled.TouchableOpacity``;

const HeaderContainer = styled.View`
    padding: 10px 0;
    flex-direction: row;
    justify-content: center;
    height: 60px;
    position: relative;
`;

const BackWrapper = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding-left: 8px;
`;

const BackText = styled.Text`
    font-size: 14px;
    color: ${(props) => transparentize(0.4, props.theme.color.font)};
`;

const HeaderText = styled.Text`
    font-size: 16px;
    color: ${(props) => props.theme.color.font};
    align-self: center;
    text-align: center;
    flex: 1;
`;

const ContentWrapper = styled.View`
    align-items: center;
    background-color: ${darken(0.03, '#fff')};
    position: relative;
    width: 100%;
    flex: 1;
    position: relative;
`;

export default BasicLayout;

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Localization from 'expo-localization';
import { transparentize } from 'polished';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components/native';
import { shallow } from 'zustand/shallow';
import BasicLayout from '../../components/BasicLayout';
import ListLayout from '../../components/ListLayout';

import { useApplicationStore } from '../../contexts/useApplicationStore';
import i18n from '../../locale';

const NotificationItem = ({ item }) => {
    const [widthBadge, setWidthBadge] = useState(0);
    const [heightBadge, setHeightBadge] = useState(0);
    const navigation = useNavigation<
        NativeStackNavigationProp<{
            Credentials: { credentialId: string };
        }>
    >();
    const { notification, processMessage } = useApplicationStore((state) => ({
        notification: state.notification,
        processMessage: state.processMessage,
    }));

    const issuer = useMemo(() => item?.extra?.issuer, [item?.data?.issuer]);
    const credential = useMemo(
        () => ({
            id: item?.data?.credentialId,
            title: item?.data?.credentialTitle,
        }),
        [item?.data]
    );

    const onPress = useCallback(() => {
        try {
            notification.read(item.id);
            if (item?.extra?.message) {
                processMessage({ message: item.extra.message });
            }
        } catch (error) {
            console.log(error);
        }
    }, [item]);

    return (
        <ItemContainer>
            <Item read={item.read} disabled={item.read} activeOpacity={0.5} onPress={onPress}>
                {!item.read && (
                    <Badge
                        onLayout={(event) => {
                            const { width, height } = event.nativeEvent.layout;
                            setWidthBadge(width);
                            setHeightBadge(height);
                        }}
                        height={heightBadge}
                        width={widthBadge}
                    >
                        <TextStyled>{i18n.t('new')}</TextStyled>
                    </Badge>
                )}
                <Title numberOfLines={1}>
                    {i18n.t(item.title)}
                    {credential?.title && ' - ' + credential.title}
                </Title>
                <Body numberOfLines={2}>
                    {item.date && new Date(item.date).toLocaleDateString(Localization.locale.slice(0, 2)) + ' - '}
                    {i18n.t(item.body)}
                    {issuer && ' - ' + (issuer?.name || issuer?.id || issuer)}
                </Body>
            </Item>
        </ItemContainer>
    );
};

const ItemContainer = styled.View`
    position: relative;
`;

const TextStyled = styled.Text``;

const Notifications = ({ navigation }) => {
    const { notifications } = useApplicationStore(
        (state) => ({
            notifications: state.notifications,
        }),
        shallow
    );
    return (
        <BasicLayout headerStyle={{ width: '100%' }} title={i18n.t('notificationsScreen.title')} onlyTitle onBack={() => navigation.goBack()}>
            <ListLayout
                data={notifications}
                RenderItemComponent={NotificationItem}
                contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
                EmptyComponent={() => (
                    <>
                        <IoniconsStyled name="notifications" size={50} color={transparentize(0.5, 'black')} />
                        <TextStyled style={{ color: transparentize(0.5, 'black') }}>{i18n.t('notificationsScreen.empty')}</TextStyled>
                    </>
                )}
            />
        </BasicLayout>
    );
};

const IoniconsStyled = styled(Ionicons)``;

const Badge = styled.Text`
    padding: 2px 5px;
    position: absolute;
    background-color: ${(props) => props.theme.color.secondary};
    color: white;
    top: 0;
    right: 10px;
    font-weight: bold;
    transform: ${(props) => `translateY(-${(props.height / 2).toFixed(0)}px)`};
    border-radius: 5px;
    overflow: hidden;
`;

const Item = styled.TouchableOpacity`
    width: 100%;
    position: relative;
    padding: 15px 10px;
    opacity: ${(props) => (props.read ? 0.7 : 1)};
    border-radius: 5px;
    border: 1px ${(props) => (!props.read ? props.theme.color.secondary : transparentize(0.8, 'black'))};
`;

const Title = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

const Body = styled.Text`
    font-size: 14px;
`;

export default Notifications;

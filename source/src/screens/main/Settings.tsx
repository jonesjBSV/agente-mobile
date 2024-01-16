// Imports
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { transparentize } from 'polished';
import React, { FC, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { shallow } from 'zustand/shallow';
import app from '../../../app.json';
import i18n from '../../locale';

// Components
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { Alert, Share } from 'react-native';
import BasicLayout from '../../components/BasicLayout';
import { useApplicationStore } from '../../contexts/useApplicationStore';

interface SettingsProps {
    navigation: NavigationProp<any>;
}

const Settings: FC<SettingsProps> = ({ navigation }) => {
    const theme = useTheme();

    const { did, reset } = useApplicationStore((state) => ({ did: state.did, reset: state.reset }), shallow);

    const [isLoading, setIsLoading] = useState(false);

    const items = [
        {
            title: i18n.t('settingsScreen.export.title'),
            body: i18n.t('settingsScreen.export.description'),
            onPress: async () => {
                setIsLoading(true);
                try {
                    const exportedKeys = await did.export();
                    const fileUri = FileSystem.documentDirectory + `keys-backup`;
                    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(exportedKeys));
                    await Sharing.shareAsync(fileUri);
                } catch (error) {
                    console.log(error);
                }
                setIsLoading(false);
            },
            icon: <EntypoStyled name="export" size={20} color={theme.color.secondary} />,
        },

        {
            title: i18n.t('settingsScreen.share.title'),
            body: i18n.t('settingsScreen.share.description'),
            onPress: async () => {
                setIsLoading(true);
                try {
                    const currentDid = await did.current();
                    const message = currentDid.isLongDID() ? currentDid.value.slice(0, currentDid.value.lastIndexOf(':')) : currentDid.value;

                    const result = await Share.share({
                        message,
                    });
                    if (result.action === Share.sharedAction) {
                        if (result.activityType) {
                        } else {
                        }
                    } else if (result.action === Share.dismissedAction) {
                    }
                } catch (error) {
                    alert(error.message);
                }
                setIsLoading(false);
            },
            icon: <EntypoStyled name="share" size={20} color={theme.color.secondary} />,
        },

        {
            title: i18n.t('settingsScreen.config.title'),
            body: i18n.t('settingsScreen.config.description'),
            onPress: async () => {
                navigation.navigate('Configuration');
            },

            icon: <MaterialIconsStyled name="settings-applications" size={20} color={theme.color.secondary} />,
        },

        {
            title: i18n.t('settingsScreen.reset.title'),
            body: i18n.t('settingsScreen.reset.description'),
            onPress: async () => {
                Alert.alert(i18n.t('settingsScreen.reset.title'), i18n.t('settingsScreen.reset.message'), [
                    { text: i18n.t('cancel') },
                    {
                        text: i18n.t('settingsScreen.reset.ok'),
                        onPress: async () => {
                            reset();
                        },
                    },
                ]);
            },
            warning: true,
            icon: <MaterialIconsStyled name="delete" size={20} color={'red'} />,
        },
    ];

    return (
        <BasicLayout
            title={i18n.t('settingsScreen.title')}
            contentStyle={{
                paddingTop: 10,
                paddingBottom: 10,
                justifyContent: 'space-between',
            }}
            onlyTitle
            onBack={() => navigation.goBack()}
        >
            <ItemWrapper>
                {items.map((item, index) => (
                    <Item key={index} onPress={item.onPress} warning={item.warning} disabled={isLoading}>
                        <IconWrapper>{item.icon}</IconWrapper>
                        <TextWrapper>
                            {item.title && <Title warning={item.warning}>{item.title}</Title>}
                            {item.body && <Body warning={item.warning}>{item.body}</Body>}
                        </TextWrapper>
                    </Item>
                ))}
            </ItemWrapper>
            <Version>
                {app.expo.name} v{app.expo.version}
            </Version>
        </BasicLayout>
    );
};

const EntypoStyled = styled(Entypo)``;

const MaterialIconsStyled = styled(MaterialIcons)``;

const ItemWrapper = styled.View`
    width: 100%;
`;

const Item = styled.TouchableOpacity`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px 14px 10px;
    background-color: ${(props) => (props.warning ? transparentize(0.95, 'red') : 'transparent')};
`;

const Version = styled.Text`
    font-size: 12px;
    color: ${transparentize(0.5, 'black')};
    padding-right: 10px;
    width: 100%;
    text-align: right;
`;

const IconWrapper = styled.View`
    width: 10%;
    background-color: 'red';
    justify-content: center;
    align-items: center;
`;

const TextWrapper = styled.View`
    width: 90%;
    padding: 0 10px;
    justify-content: center;
`;

const Title = styled.Text`
    font-size: 16px;
    color: ${(props) => (props.warning ? 'red' : props.theme.color.secondary)};
`;

const Body = styled.Text`
    font-size: 14px;
    color: ${transparentize(0.4, 'black')};
`;

export default Settings;

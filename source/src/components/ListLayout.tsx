import { AntDesign } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Platform } from 'react-native';
import { CSSProp } from 'styled-components';
import styled, { useTheme } from 'styled-components/native';
import i18n from '../locale';
import List from './List';

interface ListLayoutProps {
    title?: string;
    headerButton?: boolean;
    data: any[];
    onPressButton?: () => void;
    onPressItem?: (item: any) => void;
    RenderItemComponent: React.FC<any>;
    EmptyComponent?: React.FC<any>;
    contentContainerStyle?: any;
    showsVerticalScrollIndicator?: boolean;
    numColumns?: number;
    columnWrapperStyle?: CSSProp;
}

const ListLayout: FC<ListLayoutProps> = ({
    title,
    headerButton,
    data,
    onPressButton,
    onPressItem = () => {},
    RenderItemComponent,
    EmptyComponent,
    contentContainerStyle,
    ...props
}) => {
    const theme = useTheme();
    return (
        <>
            {(title || headerButton) && (
                <HeaderWrapper>
                    {title && (
                        <HeaderText numberOfLines={1} ellipsizeMode="tail">
                            {title}
                        </HeaderText>
                    )}
                    {onPressButton && (
                        <HeaderButton
                            onPress={() => {
                                onPressButton();
                            }}
                        >
                            <AntDesignStyled name="plus" size={15} color={theme.color.secondary} style={{ marginRight: 8 }} />
                            <HeaderButtonText style={{ color: theme.color.secondary }}>{i18n.t('add')}</HeaderButtonText>
                        </HeaderButton>
                    )}
                </HeaderWrapper>
            )}
            <List
                data={data}
                EmptyComponent={EmptyComponent}
                RenderItemComponent={RenderItemComponent}
                onPressItem={onPressItem}
                contentContainerStyle={{
                    paddingHorizontal: 15,
                    paddingBottom: Platform.OS === 'android' ? 20 : 40,
                    ...contentContainerStyle,
                }}
                style={{
                    paddingTop: title || headerButton ? 0 : 10,
                }}
                {...props}
            />
        </>
    );
};

const AntDesignStyled = styled(AntDesign)``;

const HeaderWrapper = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 16px;
    height: 60px;
    justify-content: space-between;
`;

const HeaderText = styled.Text`
    font-size: 17px;
    max-width: 80%;
    font-weight: bold;
    color: black;
`;

const HeaderButton = styled.TouchableOpacity`
    padding: 5px 0px;
    border-radius: 4px;
    flex-direction: row;
    align-items: center;
`;

const HeaderButtonText = styled.Text`
    color: white;
    font-size: 14px;
    font-weight: bold;
`;

export default ListLayout;

import * as WebBrowser from 'expo-web-browser';
import { transparentize } from 'polished';
import React, { FC, useCallback, useMemo } from 'react';
import styled, { useTheme } from 'styled-components/native';
import BasicLayout from '../../components/BasicLayout';
import Button from '../../components/Button';
import i18n from '../../locale';

import { NavigationProp, RouteProp } from '@react-navigation/native';
import EntityHeader from '../../components/EntityHeader';

interface EntityDetailsProps {
    navigation: NavigationProp<any>;
    route: RouteProp<any, any>;
}

const EntityDetails: FC<EntityDetailsProps> = ({ navigation, route }) => {
    const theme = useTheme();
    const entity = useMemo(() => route.params?.entity, []);

    const redirect = useCallback(async () => {
        WebBrowser.openBrowserAsync(entity.link, {
            toolbarColor: entity.style?.background?.color,
        });
    }, []);

    return (
        <BasicLayout title={i18n.t('entityDetailsScreen.title')} onlyTitle bottomTab={false} onBack={() => navigation.goBack()}>
            <DataWrapper>
                <EntityHeader entityStyles={entity.style} />

                <Content>
                    <Wrapper>
                        <Title>{entity.title}</Title>
                        {entity.subtitle && <Subtitle>{entity.subtitle}</Subtitle>}
                        <Key>{i18n.t('entityDetailsScreen.description')}</Key>
                        <Value>{entity.description}</Value>
                        <Key>{i18n.t('entityDetailsScreen.website')}</Key>
                        <Value>{entity.link}</Value>
                        <Key>{"Contact"}</Key>
                        <Value>{entity.contact}</Value>
                    </Wrapper>
                    <Wrapper
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingBottom: 10,
                        }}
                    >
                        <Button
                            backgroundColor={theme.color.secondary}
                            onPress={redirect}
                            style={{
                                width: '80%',
                            }}
                        >
                            {i18n.t('entityDetailsScreen.button')}
                        </Button>
                    </Wrapper>
                </Content>
            </DataWrapper>
        </BasicLayout>
    );
};

const Wrapper = styled.View`
    width: 100%;
    position: relative;
`;

const Content = styled.View`
    width: 100%;
    padding: 20px;
    height: 100%;
    justify-content: space-between;
    flex: 1;
`;

const Key = styled.Text`
    font-size: 14px;
    font-weight: bold;
    color: ${transparentize(0.4, 'black')};
`;

const Value = styled.Text`
    font-size: 12px;
    margin-bottom: 10px;
    color: ${transparentize(0.4, 'black')};
`;

const Title = styled.Text`
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: bold;
    color: ${transparentize(0.3, 'black')};
`;

const Subtitle = styled.Text`
    font-size: 16px;
    margin-bottom: 10px;
    color: ${transparentize(0.3, 'black')};
`;

const DataWrapper = styled.View`
    align-items: center;
    width: 100%;
    flex: 1;
    position: relative;
`;

export default EntityDetails;

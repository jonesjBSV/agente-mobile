import { transparentize } from 'polished';
import React from 'react';
import { ActivityIndicator, Dimensions, Image } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

const Loading = () => {
    const theme = useTheme();
    return (
        <Container>
            <Image
                style={{
                    width: Dimensions.get('window').width * 0.7,
                    height: Dimensions.get('window').height * 0.3,
                }}
                source={theme.images.logo}
                resizeMode="contain"
            />
            <ActivityIndicator color={theme.statusBar === 'dark-content' ? transparentize(0.5, 'black') : 'white'} size={'large'} />
        </Container>
    );
};

const Container = styled.View`
    background-color: ${(props) => props.theme.color.primary};
    height: ${Dimensions.get('screen').height.toFixed(0)}px;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
`;

export default Loading;

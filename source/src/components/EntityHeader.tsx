import { LinearGradient } from 'expo-linear-gradient';
import { transparentize } from 'polished';
import React, { FC } from 'react';
import styled from 'styled-components/native';

interface EntityHeaderProps {
    setHeaderHeight?: (height: string) => void;
    entityStyles: any;
}

const EntityHeader: FC<EntityHeaderProps> = ({ setHeaderHeight, entityStyles }) => {
    return (
        <Container
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setHeaderHeight && setHeaderHeight(height.toFixed(0));
            }}
        >
            <ImageStyled
                source={{
                    uri: entityStyles?.hero?.uri,
                }}
                style={{
                    width: '100%',
                    height: 100,
                    position: 'relative',
                }}
                resizeMode="cover"
            />
            <LinearGradient
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                }}
                colors={
                    entityStyles?.background?.color
                        ? [transparentize(0.2, entityStyles.background?.color), transparentize(0.8, entityStyles.background?.color)]
                        : ['transparent', 'transparent']
                }
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
            />

            <ImageBackground
                style={{
                    zIndex: 2,
                }}
            >
                <ImageStyled
                    source={{
                        uri: entityStyles?.thumbnail?.uri || 'https://upload.wikimedia.org/wikipedia/commons/c/c6/No_Logo.png',
                    }}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    resizeMode="contain"
                />
            </ImageBackground>
        </Container>
    );
};

const ImageStyled = styled.Image``;

const Container = styled.View`
    width: 100%;
    position: relative;
    justify-content: center;
    align-items: center;
`;

const ImageBackground = styled.View`
    justify-content: center;
    align-items: center;
    position: absolute;
    overflow: hidden;
    height: 70%;
    width: 900%;
    border-radius: 50px;
    padding: 10px;
`;

export default EntityHeader;

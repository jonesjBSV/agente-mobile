import { Entypo } from '@expo/vector-icons';
import * as Localization from 'expo-localization';
import { lighten, transparentize } from 'polished';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import { shallow } from 'zustand/shallow';
import Button from '../components/Button';
import config from '../config/styles';
import { useApplicationStore } from '../contexts/useApplicationStore';
import i18n from '../locale';

interface ItemContainerProps {
    image?: any;
}

const ImageContainer: FC<ItemContainerProps> = ({ image }) => {
    const theme = useTheme();
    const { top } = useSafeAreaInsets();

    return (
        <ImageWrapper
            style={
                theme.introductionType === 'all'
                    ? {
                          position: 'absolute',
                          width: Dimensions.get('screen').width,
                          height: Dimensions.get('screen').height,
                      }
                    : {
                          position: 'relative',
                          marginTop: top,
                          width: Dimensions.get('window').width,
                          height: Dimensions.get('window').height / 2 - top,
                      }
            }
        >
            {image && (
                <ImageStyled
                    style={{
                        height: '100%',
                        width: '100%',
                    }}
                    source={image}
                    resizeMode={theme.introductionType === 'all' ? 'cover' : theme.introductionResizeMode}
                />
            )}
        </ImageWrapper>
    );
};

const Introduction: FC = () => {
    const theme = useTheme();
    const { top, bottom } = useSafeAreaInsets();
    const { introduction } = useApplicationStore(
        (state) => ({
            introduction: state.introduction,
        }),
        shallow
    );
    const locale = useMemo(() => Localization.locale.slice(0, 2), []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);
    const [introductionScreens, setIntroductionScreens] = useState([]);
    const onViewRef = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index);
    });
    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
    const listRef = useRef<any>();

    useEffect(() => {
        if (config) {
            const introduction = config.introduction[locale] || config.introduction.en;
            setIntroductionScreens(introduction);
        }
    }, [locale]);

    const skipIntroduction = async () => {
        introduction.skip();
    };

    const RenderItem = ({ item, index }) => {
        return (
            <ItemContainer footerHeight={footerHeight} safeAreaHeight={bottom || 25}>
                <ItemWrapper>
                    <ImageContainer image={item.image} />
                    <TextWrapper>
                        <Title
                            style={{
                                ...theme.font.title,
                                marginTop: theme.introductionType === 'all' ? Dimensions.get('window').height * 0.15 : 0,
                                fontSize: theme.introductionType === 'all' ? 30 : 20,
                                color: theme.introductionType === 'all' ? theme.color.secondary : 'black',
                            }}
                        >
                            {item.title}
                        </Title>
                        {item.subtitle && <Subtitle style={{ ...theme.font.subtitle }}>{item.subtitle}</Subtitle>}
                        {item.description && <Description style={{ ...theme.font.text }}>{item.description}</Description>}
                    </TextWrapper>
                </ItemWrapper>
                {introductionScreens.length - 1 === index && (
                    <ButtonWrapper>
                        <Button backgroundColor={theme.color.secondary} color={theme.color.white} onPress={skipIntroduction}>
                            {i18n.t('introductionStack.start')}
                        </Button>
                    </ButtonWrapper>
                )}
            </ItemContainer>
        );
    };

    return (
        <Container>
            <FlatListStyled
                ref={listRef}
                data={introductionScreens}
                renderItem={RenderItem}
                keyExtractor={(item, index: number) => index}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewConfigRef.current}
            />

            <SkipButtonWrapper
                style={{
                    top: top,
                }}
            >
                <Button
                    backgroundColor={'transparent'}
                    color={theme.color.secondary}
                    onPress={skipIntroduction}
                    textStyle={{
                        fontWeight: 'bold',
                    }}
                    style={{
                        shadowColor: 'transparent',
                    }}
                >
                    {i18n.t('introductionStack.skip')}
                </Button>
            </SkipButtonWrapper>

            {introductionScreens.length > 1 && (
                <FooterWrapper
                    style={{
                        bottom: bottom || 0,
                    }}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setFooterHeight(height.toFixed(0));
                    }}
                >
                    {currentIndex !== 0 ? (
                        <ChevronWrapper
                            onPress={() => {
                                listRef?.current?.scrollToIndex({
                                    index: currentIndex - 1,
                                    animated: true,
                                });
                            }}
                        >
                            <EntypoStyled name="chevron-left" size={24} color={theme.color.secondary} />
                        </ChevronWrapper>
                    ) : (
                        <ChevronWrapper>
                            <EntypoStyled name="chevron-left" size={24} color="transparent" />
                        </ChevronWrapper>
                    )}
                    <BubblesWrapper>
                        {introductionScreens.map((e, index) => (
                            <Bubble key={index} active={currentIndex === index} color={theme.color.secondary} />
                        ))}
                    </BubblesWrapper>
                    {currentIndex !== introductionScreens.length - 1 ? (
                        <ChevronWrapper
                            onPress={() => {
                                listRef.current.scrollToIndex({
                                    index: currentIndex + 1,
                                    animated: true,
                                });
                            }}
                        >
                            <EntypoStyled name="chevron-right" size={24} color={theme.color.secondary} />
                        </ChevronWrapper>
                    ) : (
                        <ChevronWrapper>
                            <EntypoStyled name="chevron-left" size={24} color="transparent" />
                        </ChevronWrapper>
                    )}
                </FooterWrapper>
            )}
        </Container>
    );
};

const EntypoStyled = styled(Entypo)``;

const ImageStyled = styled.Image``;

const FlatListStyled = styled.FlatList``;

const Container = styled.View`
    position: relative;
    flex: 1;
`;

const ImageWrapper = styled.View``;

const SkipButtonWrapper = styled.View`
    position: absolute;
    right: 0px;
    padding: 5px;
`;

const Item = styled.View``;

const ItemContainer = styled.View`
    align-items: center;
    width: ${Dimensions.get('window').width}px;
    position: relative;
    height: ${(props) => Dimensions.get('window').height - props.footerHeight - props.safeAreaHeight}px;
    justify-content: space-between;
`;

const ItemWrapper = styled.View`
    width: 100%;
    align-items: center;
`;

const TextWrapper = styled.ScrollView`
    padding: 20px 0;
    width: 90%;
`;

const Title = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
`;

const Subtitle = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: ${lighten(0.4, 'black')};
    margin-bottom: 10px;
    text-align: center;
`;

const Description = styled.Text`
    font-size: 14px;
    color: ${lighten(0.4, 'black')};
    text-align: center;
`;

const ButtonWrapper = styled.View`
    position: relative;
    width: 80%;
    padding-bottom: 10px;
`;

const BubblesWrapper = styled.View`
    padding: 20px 0;
    flex-direction: row;
    justify-content: center;
`;

const Bubble = styled.View`
    border-radius: 8px;
    height: 8px;
    width: 8px;
    border-color: ${(props) => (props.active ? props.color : transparentize(0.9, 'black'))};
    background-color: ${(props) => (props.active ? props.color : 'transparent')};
    border-width: 1px;
    margin: 0 6%;
`;

const FooterWrapper = styled.View`
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 0 10px;
    position: absolute;
`;

const ChevronWrapper = styled.TouchableOpacity`
    padding: 5px;
`;

export default Introduction;

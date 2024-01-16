import { transparentize } from 'polished';
import React, { FC, useState } from 'react';
import { CSSProperties } from 'styled-components';
import styled from 'styled-components/native';
import keys from '../utils/keys';

interface NumberPadProps {
    maxLength?: number;
    value: string;
    setValue: (value: string) => void;
    fingerPrint?: boolean;
    authenticate?: () => void;
    style?: CSSProperties;
}

const NumberPad: FC<NumberPadProps> = ({ maxLength = 10, value, setValue, fingerPrint = false, authenticate, style }) => {
    const [width, setWidth] = useState(0);

    return (
        <KeysWrapper
            onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setWidth(width);
            }}
            style={style}
        >
            {keys.map((key, index) => (
                <KeyContainer key={index}>
                    <KeyWrapper
                        width={width}
                        disabled={typeof key === 'object' && key.type === 'finger-print' && !fingerPrint}
                        onPress={() => {
                            typeof key === 'string'
                                ? value.length < maxLength
                                    ? setValue(value + key)
                                    : null
                                : key.type === 'delete'
                                ? setValue(value.slice(0, value.length - 1))
                                : fingerPrint
                                ? authenticate()
                                : null;
                        }}
                    >
                        {typeof key === 'string' ? <KeyText>{key}</KeyText> : key.type !== 'finger-print' || fingerPrint ? key.content : null}
                    </KeyWrapper>
                </KeyContainer>
            ))}
        </KeysWrapper>
    );
};

const KeysWrapper = styled.View`
    flex-direction: row;
    position: relative;
    flex-wrap: wrap;
    width: 90%;
    gap: 20px;
`;

interface KeyWrapperProps {
    disabled: boolean;
}

const KeyWrapper = styled.TouchableOpacity<KeyWrapperProps>`
    width: 100%;
    height: 100%;
    background-color: ${(props: KeyWrapperProps) => (props.disabled ? 'transparent' : transparentize(0.7, 'black'))};
    justify-content: center;
    align-items: center;
    border-radius: 5px;
`;

const KeyContainer = styled.TouchableOpacity`
    position: relative;
    padding: 1%;
    width: 33%;
    height: 60px;
`;

const KeyText = styled.Text`
    text-align: center;
    color: white;
    font-size: 20px;
`;

export default NumberPad;

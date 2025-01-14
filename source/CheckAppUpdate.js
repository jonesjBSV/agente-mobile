import React, { useCallback } from "react";
import { Dimensions, Platform } from "react-native";

import Button from "./src/components/Button";
import BasicLayout from "./src/components/BasicLayout";
import styled, { useTheme } from "styled-components/native";
import i18n from "./src/locale";
import Logo from "./src/assets/icons/Logo";
import * as WebBrowser from "expo-web-browser";
import UpdateIcon from "./src/assets/icons/UpdateIcon";

const CheckAppUpdate = ({ storesUrls }) => {
  const theme = useTheme();

  const redirect = useCallback(async () => {
    const url = Platform.OS === "ios" ? storesUrls[1] : storesUrls[0];
    WebBrowser.openBrowserAsync(url, {
      toolbarColor: "white",
    });
    //WebBrowser.openBrowserAsync('https://expo.io')
  }, []);

  return (
    <BasicLayout onlyTitle backText={false}>
      <ItemContainer>
        <ItemWrapper style={{ height: "80%" }}>
          <Logo
            style={{ marginLeft: "auto", marginRight: "auto", marginTop: -30 }}
          />

          <TextWrapper
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontFamily: "Manrope-Bold",
                width: 300,
                marginBottom: 50,
                color: "#404267",
                fontSize: 23,
                lineHeight: 25,
              }}
            >
              {i18n.t("updateVersion.title")}
            </Text>
            <UpdateIcon
              name="credentials"
              size={200}
              /*color={'black'}*/
            />
          </TextWrapper>
        </ItemWrapper>
        <ButtonWrapper>
          <Button
            backgroundColor={"#404267"}
            color={theme.color.white}
            style={{
              paddingTop: 16,
              paddingBottom: 16,
              width: Dimensions.get("window").width - 64,
              borderRadius: 50,
              marginBottom: 20,
            }}
            textStyle={{
              fontFamily: "Manrope-Bold",
              fontSize: 16,
              letterSpacing: 0.32,
              lineHeight: 20,
            }}
            loading={false}
            onPress={redirect}
          >
            {i18n.t("updateVersion.updateButton")}
          </Button>
          {false && (
            <Button
              backgroundColor={"#DEE6EF"}
              color={"#404267"}
              style={{
                paddingTop: 16,
                paddingBottom: 16,
                width: Dimensions.get("window").width - 64,
                borderRadius: 50,
              }}
              textStyle={{
                fontFamily: "Manrope-Bold",
                fontSize: 16,
                letterSpacing: 0.32,
                lineHeight: 20,
              }}
              loading={false}
              onPress={() => {}}
            >
              {i18n.t("updateVersion.supportButton")}
            </Button>
          )}
        </ButtonWrapper>
      </ItemContainer>
    </BasicLayout>
  );
};

const ItemContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  position: relative;
  padding-bottom: 32px;
`;

const ItemWrapper = styled.View`
  margin: 0 30px;
`;

const ButtonWrapper = styled.View`
  paddingbottom: 50;
`;

const TextWrapper = styled.ScrollView`
  padding: 20px 0;
`;

const Text = styled.Text`
  font-size: 20px;
  text-align: center;
  color: "#404267";
  line-height: 25px;
  font-weight: bold;
`;

export default CheckAppUpdate;

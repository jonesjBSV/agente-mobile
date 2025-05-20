import { MaterialIcons } from "@expo/vector-icons";
import { lighten } from "polished";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
  View,
  Platform,
  ActivityIndicator, // Added for loading indicator
} from "react-native";
import styled from "styled-components/native";
import BasicLayout from "../../components/BasicLayout";
import i18n from "../../locale";
// import { useStorageProvider } from '../../contexts/StorageContext';
import { useTheme } from "styled-components";
import validator from "validator";
import CredentialAbstract from "../../components/CredentialAbstract";
import { useApplicationStore } from "../../contexts/useApplicationStore";
import { formatField, isImgUrl } from "../../utils";
import Popup from "../../components/Popup";
import { Brightness } from "react-native-color-matrix-image-filters";
import ListLayout from "../../components/ListLayout";
import ForwardIcon from "../../assets/icons/ForwardIcon";
import { ExtrimianVCAttachmentAgentPlugin } from "@extrimian/vc-attachments-agent-plugin";
import { AttachmentFileStorage } from "../../storages/fs-storage";
import { VerifiableCredentialWithInfo } from "../../models/credential";

interface CredentialDetailsProperties {
  label: string;
  value: string;
}

const ImageItem = ({ navigation, item }) => {
  const theme: any = useTheme();
  const [error, setError] = useState(false);
  return (
    <>
      <Label
        style={{
          color: theme.color.secondary,
        }}
      >
        {item.label}
      </Label>
      {!error ? (
        <ImageWrapper
          onPress={() => navigation.navigate("ImageDetails", { item })}
        >
          <ImageBkgStyled
            style={{
              width: Dimensions.get("window").width / 2.5,
              height: Dimensions.get("window").width / 2.5,
              borderRadius: 10,
            }}
            resizeMode={"cover"}
            source={{
              uri: item.value,
              cache: "force-cache",
            }}
            onError={() => setError(true)}
          />
        </ImageWrapper>
      ) : (
        <Value
          style={{
            color: theme.color.secondary,
          }}
        >
          {i18n.t("imageError")}
        </Value>
      )}
    </>
  );
};

const CredentialDetails = ({ navigation, route }) => {
  const [bsvStatus, setBsvStatus] = useState<string | null>(null); // Added for BSV status
  const [contentHeight, setContentHeight] = useState(0);
  const [hasAttachments, setHasAttachments] = useState(false);
  const [hasOneAttachment, setHasOneAttachment] = useState(false);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isDocAvailable, setIsDocAvailable] = useState(false);
  const [owner, setOwner] = useState(false);
  const [operationalDidString, setOperationalDidString] = useState<string | null>(null);
  const { credential, did } = useApplicationStore((state) => ({
    credential: state.credential, // credential store slice
    did: state.did,
  }));
  const theme: any = useTheme();

  const [currentCredential, setCurrentCredential] =
    useState<VerifiableCredentialWithInfo | null>(null); // local state for the VC being displayed
  const [popupVisible, setPopupVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  const attachmentPlugin = new ExtrimianVCAttachmentAgentPlugin({
    attachmentStorage: new AttachmentFileStorage(),
  });

  useEffect(() => {
    const fetchOperationalDid = async () => {
      if (did?.current) { // 'did' is state.did from the store
        try {
          const opDid = await did.current();
          setOperationalDidString(opDid?.value || null);
        } catch (error) {
          console.error("Error fetching operational DID:", error);
          setOperationalDidString(null);
        }
      } else {
        setOperationalDidString(null);
      }
    };
    fetchOperationalDid();
  }, [did]);

  useEffect(() => {
    let isOwner = false;
    if (currentCredential?.data && operationalDidString) {
      if (currentCredential.data.credentialStatus?.type === "BRC52RevocationStatus2024") {
        const issuer = currentCredential.data.issuer;
        if (typeof issuer === 'string' && issuer === operationalDidString) {
          isOwner = true;
        } else if (typeof issuer === 'object' && issuer?.id === operationalDidString) {
          isOwner = true;
        }
      }
    }
    setOwner(isOwner);
  }, [currentCredential, operationalDidString]);

  useEffect(() => {
    // This existing useEffect sets currentCredential
    const vcFromParams = route.params?.credential;
    if (vcFromParams) {
      setCurrentCredential(vcFromParams);
    } else if (route.params?.credentialId) {
      credential.get(route.params.credentialId).then(foundVc => {
        if (foundVc) {
          setCurrentCredential(foundVc);
        }
      });
    }
  }, [route.params?.credential, route.params.credentialId, credential]);

  useEffect(() => {
    // New useEffect to fetch BSV status when currentCredential is set and is BRC52 type
    if (currentCredential && currentCredential.data.credentialStatus?.type === "BRC52RevocationStatus2024") {
      setBsvStatus(i18n.t("credentialDetailsScreen.bsvStatusLoading", "Loading BSV Status..."));
      credential.getBsvCredentialStatus(currentCredential.data.id)
        .then(status => {
          setBsvStatus(status || i18n.t("credentialDetailsScreen.bsvStatusUnknown", "Unknown"));
        })
        .catch(error => {
          console.error("Error fetching BRC52 status in component:", error);
          setBsvStatus(i18n.t("credentialDetailsScreen.bsvStatusError", "Error fetching status"));
        });
    } else {
      setBsvStatus(null); // Reset if not BRC52 or currentCredential is null
    }
  }, [currentCredential, credential]);
  
  useEffect(() => {
    async function getAttachments() {
      if (currentCredential) {
        const result = await attachmentPlugin.getAttachments({
          vc: currentCredential.data,
        });

        setHasAttachments(result && result.length > 0);
        setHasOneAttachment(result && result.length === 1);
        setPdfFiles(result);
        setAttachments(result);

        if (result && result.length > 0) {
          result.forEach((element) => {
            if (
              element &&
              element.content &&
              element.content.type &&
              element.content.type.startsWith("application/pdf")
            ) {
              setIsDocAvailable(true);
            }
          });
        }
      }
    }
    getAttachments();
  }, [currentCredential]);

  const currentCredentialProperties: CredentialDetailsProperties[] =
    useMemo(() => {
      let temp: CredentialDetailsProperties[] = [];

      // Add BSV Status if available and relevant
      if (bsvStatus && currentCredential?.data.credentialStatus?.type === "BRC52RevocationStatus2024") {
        temp.push({
          label: i18n.t("credentialDetailsScreen.bsvStatusLabel", "BSV Chain Status"),
          value: bsvStatus,
        });
      }

      if (currentCredential?.data?.issuer) {
        const issuer = currentCredential.data.issuer;
        temp.push({
          label: i18n.t("credentialDetailsScreen.issuer"),
          value: typeof issuer === "string" ? issuer : issuer.name || issuer.id,
        });
      }

      if (currentCredential?.data?.issuanceDate) {
        temp.push({
          label: i18n.t("credentialDetailsScreen.issuanceDate"),
          value: new Date(
            currentCredential.data.issuanceDate
          ).toLocaleDateString(),
        });
      }
      if (currentCredential?.data?.expirationDate) {
        temp.push({
          label: i18n.t("credentialDetailsScreen.expirationDate"),
          value: new Date(
            currentCredential.data.expirationDate
          ).toLocaleDateString(),
        });
      }
      // Avoid duplicating if status is already shown as BSV status
      if (currentCredential?.data?.credentialStatus && currentCredential?.data.credentialStatus?.type !== "BRC52RevocationStatus2024") { 
        temp.push({
          label: i18n.t("credentialDetailsScreen.statusType"),
          value: currentCredential.data.credentialStatus.type,
        });
        temp.push({
          label: i18n.t("credentialDetailsScreen.statusId"),
          value: currentCredential.data.credentialStatus.id,
        });
      }

      const images = currentCredential?.display?.properties
        ?.map((prop) => {
          const value = currentCredential?.credentialSubject[prop.path?.[0]];
          if (validator.isDataURI(value) || isImgUrl(value)) {
            return {
              label: prop.label,
              value,
            };
          }
        })
        .filter((prop) => prop);

      if (currentCredential?.credentialSubject) {
        Object.keys(currentCredential.credentialSubject).forEach((key) => {
          if (key !== "id" && key !== "type" && key !== "isRelatedTo") {
            const value = currentCredential.credentialSubject[key];
            // Skip if it's already processed as an image by the images logic above
            if (images?.find((img) => img.value === value && currentCredential?.display?.properties?.find(p => p.path?.[0] === key && p.label === img.label))) return; 
            const field = formatField(key, value);
            temp.push(field);
          }
        });
      }

      return temp;
    }, [currentCredential, theme.color.secondary, bsvStatus]);

  const images = useMemo(() => {
    return currentCredential?.display?.properties
      ?.map((prop) => {
        const value = currentCredential?.credentialSubject[prop.path?.[0]];
        if (validator.isDataURI(value) || isImgUrl(value)) {
          return {
            label: prop.label,
            value,
          };
        }
      })
      .filter((prop) => prop);
  }, [currentCredential]);

  const [logo, setLogo] = useState({
    width: "50%",
    height: 35,
    opacity: 1,
    enabled: true,
  });

  const deleteCredential = useCallback(async (id) => {
    await credential.remove(id);
    navigation.goBack();
  }, []);

  const Document = ({ attachment, position }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          !isDocAvailable && // This condition seems incorrect, should probably be isDocAvailable or based on attachment type
          navigation.navigate("DocumentVisualization", {
            pdfFiles, // This seems to imply all attachments are PDFs for visualization
            hasOneAttachment,
            attachments,
            position,
            title: currentCredential.display?.title?.fallback,
          })
        }
      >
        <DocumentView>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "90%",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(193, 193, 198, 0.5)",
                paddingBottom: 4,
                paddingLeft: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#505E70",
                  fontFamily: "Manrope-Bold",
                }}
              >
                {attachment.title}
              </Text>
            </View>
          </View>
          <HeaderText style={{ marginTop: Platform.OS === "ios" ? 20 : 0 }}>
            <ForwardIcon color="#505E70" />
          </HeaderText>
        </DocumentView>
      </TouchableOpacity>
    );
  };

  if (!currentCredential) {
    return (
      <BasicLayout
        onBack={() => navigation.goBack()}
        setContentHeight={setContentHeight}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.color.primary} />
        </View>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout
      onBack={() => navigation.goBack()}
      setContentHeight={setContentHeight}
    >
      <Popup
        title={i18n.t("error")}
        description={i18n.t("errorDescription")}
        visible={popupVisible}
        declineHandler={() => setPopupVisible(false)}
      />
      <Popup
        title={i18n.t("settingsScreen.mainSettings.removeCredentialTitle")}
        description={i18n.t(
          "settingsScreen.mainSettings.removeCredentialDescription"
        )}
        visible={deletePopupVisible}
        declineHandler={() => setDeletePopupVisible(false)}
        acceptHandler={() => deleteCredential(currentCredential.data.id)}
        warning={true}
      />

      <DataWrapper>
        <ImageBkgStyled
          source={
            currentCredential?.styles?.background?.color
              ? null
              : currentCredential.styles?.hero?.uri && {
                  uri: currentCredential.styles.hero.uri,
                }
          }
          imageStyle={{ borderRadius: 15 }}
          style={
            currentCredential?.styles?.background?.color && {
              backgroundColor: currentCredential.styles.background.color,
              borderRadius: 15,
            }
          }
        >
          <Brightness contrast={1.1} brightness={1.1}>
            <CredentialAbstract
              disabled
              credential={currentCredential}
            />
          </Brightness>
        </ImageBkgStyled>

        <Info>
          {currentCredentialProperties.length > 0 && (
            <Titles
              style={{ borderBottomColor: "gray", borderBottomWidth: 0 }}
            >
              <FlatListStyled
                data={currentCredentialProperties}
                ItemSeparatorComponent={() => (
                  <Separator
                    style={{ backgroundColor: theme.color.secondary }}
                  />
                )}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                  <CredentialItem
                    style={{
                      paddingVertical: 10,
                      borderBottomColor: "rgba(193, 193, 198, 0.5)",
                      borderBottomWidth: 1,
                    }}
                  >
                    <Container>
                      <Label
                        style={{
                          color: theme.color.secondary,
                        }}
                      >
                        {item.label}
                      </Label>
                    </Container>
                    <Value
                      style={{
                        color:
                          currentCredential?.styles?.text?.color ||
                          lighten(0.2, "black"),
                      }}
                    >
                      {item.value}
                    </Value>
                  </CredentialItem>
                )}
              />
            </Titles>
          )}
          {images && images.length > 0 && (
            <ListWrapper>
              <ListLayout
                title={i18n.t("images")}
                data={images}
                horizontal
                renderItem={({ item }) => (
                  <ImageItem navigation={navigation} item={item} />
                )}
              />
            </ListWrapper>
          )}
          {hasAttachments && (
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "rgba(193, 193, 198, 0.5)",
                marginTop: 10,
                paddingTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Manrope-Bold",
                  color: "#131F3C",
                  paddingBottom: 10,
                }}
              >
                {i18n.t("documents")}
              </Text>
              {attachments.map((attachment, index) => (
                <Document
                  key={index}
                  attachment={attachment}
                  position={index}
                />
              ))}
            </View>
          )}

          {operationalDidString && currentCredential?.data?.issuer && (operationalDidString === currentCredential.data.issuer ||
          (typeof currentCredential.data.issuer !== "string" &&
            operationalDidString === currentCredential.data.issuer?.id)) ? (
            <></>
          ) : (
            <TouchableOpacityStyled
              onPress={() => {
                setDeletePopupVisible(true);
              }}
              style={{
                flexDirection: "row",
                marginBottom: 10,
                marginTop: 10,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.color.primary,
              }}
            >
              <MaterialIconsStyled name="delete" size={24} color={"black"} />
              <Label>{i18n.t("remove")}</Label>
            </TouchableOpacityStyled>
          )}
        </Info>
      </DataWrapper>
    </BasicLayout>
  );
};

const FlatListStyled = styled(FlatList)``; // Note: Backticks are used here
const MaterialIconsStyled = styled(MaterialIcons)``; // Note: Backticks are used here

const TouchableOpacityStyled = styled(TouchableOpacity)``; // Note: Backticks are used here
const ImageBkgStyled = styled(ImageBackground)``; // Note: Backticks are used here
const ViewStyled = styled.View``; // Note: Backticks are used here

const Info = styled.View` 
  width: 95%;
`;

const CredentialItem = styled.View``; 

const Separator = styled.View`
  width: 100%;
  height: 2px;
`;

const ImageWrapper = styled(TouchableOpacity)`
  border-radius: 10px;
  position: relative;
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
`;

const Titles = styled.View`
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ListWrapper = styled.View`
  width: 100%;
`;

const DataWrapper = styled.View`
  align-items: center;
  width: 90%;
  padding-top: 15px;
`;

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 18px;
  width: 100%;
  margin-bottom: 8px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

const Value = styled.Text`
  font-size: 13px;
  color: ${lighten(0.2, "black")};
`;

const HeaderText = styled.Text`
  font-size: 20px;
  line-height: 25px;
  padding: 12px 0;
  font-family: Manrope-Bold;
  margin-right: 20px;
`;

const DocumentView = styled.View`
  padding-left: 20px;
`;

const Text = styled.Text`
  font-style: normal;
`;

export default CredentialDetails;
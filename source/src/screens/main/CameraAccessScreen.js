import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Alert,
  Linking,
  Platform,
  AppState,
} from "react-native";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions"; // For bare React Native
import { useNavigation } from "@react-navigation/native"; // Navigation to home
import Button from "../../components/Button";
import i18n from "../../locale";
import { borderRadius, padding } from "polished";

const CameraAccessScreen = ({ setHasPermission }) => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const [appState, setAppState] = useState(AppState.currentState);

  const checkCameraPermission = async () => {
    const cameraPermissionByOS =
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    const result = await check(cameraPermissionByOS);

    setCameraPermission(result);

    if (
      result === RESULTS.DENIED ||
      result === RESULTS.BLOCKED ||
      result === RESULTS.UNAVAILABLE
    ) {
      setShowModal(true); // Show modal if permission is denied or blocked
      setHasPermission(false);
    } else {
      setShowModal(false); // Don't show modal if permission is granted
      setHasPermission(true);
    }
  };

  // Check camera permission when the component mounts
  useEffect(() => {
    checkCameraPermission();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        // App has come to the foreground, re-check camera permission
        checkCameraPermission();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const handleRequestPermission = async () => {
    const cameraPermissionByOS =
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    const result = await request(cameraPermissionByOS);
    if (result === RESULTS.GRANTED) {
      Alert.alert("Success", "Camera permission granted!");
      setShowModal(false); // Close modal on success
    } else {
      Alert.alert("Permission Denied", "Camera permission is required!");
    }
  };

  const handleOpenSettings = async () => {
    openSettings().catch(() => Alert.alert("Error", "Unable to open settings"));
  };

  const handleCancel = () => {
    setShowModal(false); // Close modal
    navigation.goBack(); // Navigate back to home
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Modal visible={true} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 1)",
          }}
        >
          <View
            style={{
              width: 100,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
              width: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 20,
                color: "#404267",
                textAlign: "center",
                fontFamily: "Manrope-Bold",
                width: 225,
              }}
            >
              {i18n.t("cameraAccessRequest.title")}
            </Text>
            <Text
              style={{
                marginBottom: 20,
                textAlign: "center",
                color: "#6B6C89",
                fontFamily: "Manrope-Regular",
              }}
            >
              {i18n.t("cameraAccessRequest.description")}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: 70,
                width: 250,
              }}
            >
              <Button
                onPress={handleCancel}
                color="#5F5F5F"
                backgroundColor="#D5D5D5"
                style={{
                  width: "40%",
                  borderRadius: 50,
                  paddingTop: 8,
                  paddingRight: 12,
                  paddingBottom: 8,
                  paddingLeft: 12,
                  height: 51,
                }}
              >
                {i18n.t("cameraAccessRequest.continue")}
              </Button>
              <Button
                onPress={handleOpenSettings}
                color="white"
                backgroundColor={"#404267"}
                style={{
                  width: "50%",
                  borderRadius: 50,
                  paddingTop: 8,
                  paddingRight: 12,
                  paddingBottom: 8,
                  paddingLeft: 12,
                  height: 51,
                }}
              >
                {i18n.t("cameraAccessRequest.settings")}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CameraAccessScreen;

import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { getToken } from "../service/tokenStorage";

export default function IndexScreen() {
  useEffect(function () {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    const token = await getToken();

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    router.replace("/discover");
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
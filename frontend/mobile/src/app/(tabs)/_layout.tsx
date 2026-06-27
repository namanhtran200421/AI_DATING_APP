import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { getToken } from "../../service/tokenStorage";

export default function TabsLayout() {
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(function () {
    checkToken();
  }, []);

  async function checkToken() {
    const token = await getToken();

    if (token) {
      setHasToken(true);
    }

    setIsChecking(false);
  }

  if (isChecking) {
    return null;
  }

  if (!hasToken) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="discover" options={{ title: "Discover" }} />
      <Tabs.Screen name="matches" options={{ title: "Matches" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
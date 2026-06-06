import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colors, fontSize, palette } from "@/design-system";

export default function TabLayout() {
  return (
  
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: palette.black,
          tabBarInactiveTintColor: colors.textDisabled,
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Ionicons color={color} name="home" size={size} />,
          }}
        />
        <Tabs.Screen
          name="apply"
          options={{
            title: "My Apps",
            tabBarIcon: ({ color }) => <Ionicons color={color} name="add-circle" size={fontSize["3xl"]} />,
          }}
        />
        <Tabs.Screen
          name="repayments"
          options={{
            title: "Support",
            tabBarIcon: ({ color, size }) => <Ionicons color={color} name="card" size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => <Ionicons color={color} name="person" size={size} />,
          }}
        />
      </Tabs>

  );
}

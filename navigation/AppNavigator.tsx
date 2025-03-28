import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "../screens/WelcomeScreen";
import BottomTabNavigator from "../navigation/BottomTabNavigator";
import ApplicationForm from "../screens/ApplicationForm";
import JobDetailsScreen from "../screens/JobDetailsScreen";
import type { RootStackParamList } from "../types/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ApplicationForm" 
          component={ApplicationForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobFinder"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobDetails"
          component={JobDetailsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SavedJobsProvider } from "./context/SavedJobsContext";
import AppNavigator from "./navigation/AppNavigator";
import { DarkModeProvider } from "./context/DarkModeContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <SavedJobsProvider>
        <DarkModeProvider>
          <AppNavigator />
        </DarkModeProvider>
      </SavedJobsProvider>
    </SafeAreaProvider>
  );
}
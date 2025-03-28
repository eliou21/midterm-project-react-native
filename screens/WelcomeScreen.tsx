import React from "react";
import { View, Text, TouchableOpacity, StyleSheet} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/types";

export default function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>

      <Image 
        source={require("../assets/background red.png")} 
        style={styles.background} 
        contentFit="cover"
      /> 
      
      <TouchableOpacity
        onPress={() => navigation.navigate("JobFinder")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Let’s Get Started</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  overlay: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginTop: 600,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
});

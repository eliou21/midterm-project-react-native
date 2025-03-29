import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/types";
import { useDarkMode } from "../context/DarkModeContext";
import Icon from "react-native-vector-icons/Ionicons";

type ApplicationFormRouteProp = RouteProp<RootStackParamList, "ApplicationForm">;

type Props = {
  route: ApplicationFormRouteProp;
  navigation: any;
};

export default function ApplicationForm({ route, navigation }: Props) {
  const { job } = route.params;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [hiringReason, setHiringReason] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [hiringReasonError, setHiringReasonError] = useState("");

  const { isDarkMode } = useDarkMode();

  const handleSubmit = () => {
    let isValid = true;
    setNameError("");
    setEmailError("");
    setContactError("");
    setHiringReasonError("");

    if (!name) {
      setNameError("Name is required");
      isValid = false;
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    }

    if (!contact) {
      setContactError("Contact number is required");
      isValid = false;
    } else if (!/^\d{11}$/.test(contact)) {
      setContactError("Invalid contact number (should be 11 digits)");
      isValid = false;
    }

    if (!hiringReason) {
      setHiringReasonError("This field is required");
      isValid = false;
    }

    if (!isValid) return;

    Alert.alert(
      "Success",
      `Application for ${job.title} at ${job.companyName} submitted!`,
      [{ text: "OK", onPress: () => navigation.navigate("JobFinder") }]
    );
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, isDarkMode && styles.containerDark]}>
          <StatusBar
            barStyle={isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={isDarkMode ? "#121212" : "#EFDFC5"}
          />

          {/* Header */}
          <View style={[styles.header, isDarkMode && styles.headerDark]}>
            <TouchableOpacity
              style={[styles.backButton, isDarkMode && styles.backButtonDark]}
              onPress={() => navigation.goBack()}
            >
              <Icon
                name="arrow-back"
                size={24}
                color={isDarkMode ? "#EFDFC5" : "white"}
              />
            </TouchableOpacity>
            <Text style={[styles.headerText, isDarkMode && styles.headerTextDark]}>
              Application Form
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.headerSeparator} />

          {/* Scrollable Form */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.formContainer, isDarkMode && styles.formContainerDark]}>
              {/* Job Info */}
              <View style={styles.jobInfoContainer}>
                <Text style={[styles.job, isDarkMode && styles.jobDark]}>
                  {job.title}
                </Text>
                <Text
                  style={[styles.companyName, isDarkMode && styles.companyNameDark]}
                >
                  {job.companyName}
                </Text>
              </View>

              <View style={[styles.infoSeparator, isDarkMode && styles.infoSeparatorDark]} />

              {/* Full Name Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>
                  Full Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
                />
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              </View>

              {/* Email Address Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>
                  Email Address <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="Enter your email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              {/* Contact Number Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>
                  Contact Number <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="Enter your contact number"
                  value={contact}
                  onChangeText={setContact}
                  keyboardType="phone-pad"
                  placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
                />
                {contactError ? <Text style={styles.errorText}>{contactError}</Text> : null}
              </View>

              {/* Hiring Reason Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isDarkMode && styles.labelDark]}>
                  Why Should We Hire You? <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark, styles.tallerInput]}
                  placeholder="Enter your reason"
                  value={hiringReason}
                  onChangeText={setHiringReason}
                  multiline
                  placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
                />
                {hiringReasonError ? <Text style={styles.errorText}>{hiringReasonError}</Text> : null}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.applyButton, isDarkMode && styles.applyButtonDark]}
                onPress={handleSubmit}
              >
                <Text style={[styles.applyText, isDarkMode && styles.applyTextDark]}>
                  Submit Application
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#EFDFC5",
  },

  containerDark: {
    backgroundColor: "#121212",
  },

  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    width: 380
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    backgroundColor: "#EFDFC5",
  },

  headerDark: {
    backgroundColor: "#121212",
  },

  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8E0B13",
    letterSpacing: 2,
  },

  headerTextDark: {
    color: "#EFDFC5",
  },

  backButton: {
    backgroundColor: "#8E0B13",
    padding: 8,
    borderRadius: 20,
  },

  backButtonDark: {
    backgroundColor: "#8E0B13",
  },

  headerSeparator: {
    height: 2,
    backgroundColor: "#8E0B13",
    marginBottom: 10,
  },

  headerSeparatorDark: {
    height: 2,
    backgroundColor: "white",
    marginBottom: 10,
  },

  required: {
    color: "red",
  },

  jobInfoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  job: {
    fontSize: 25,
    color: "#8E0B13",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 15,
  },

  jobDark: {
    color: "#EFDFC5",
  },

  companyName: {
    fontSize: 18,
    color: "#4C4F54",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },

  companyNameDark: {
    color: "#EFDFC5",
  },

  infoSeparator: {
    height: 2,
    backgroundColor: "#8E0B13",
    marginBottom: 20,
  },

  infoSeparatorDark: {
    height: 2,
    backgroundColor: "white",
    marginBottom: 20,
  },

  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  formContainerDark: {
    backgroundColor: "#333",
  },

  inputContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },

  labelDark: {
    color: "#EFDFC5",
  },

  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },

  inputDark: {
    backgroundColor: "#333",
    borderColor: "white",
    color: "#EFDFC5",
  },

  errorText: {
    fontSize: 14,
    color: "red",
    marginTop: 7,
    marginLeft: 6
  },

  applyButton: {
    backgroundColor: "#8E0B13",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },

  applyButtonDark: {
    backgroundColor: "#8E0B13",
  },

  applyText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },

  applyTextDark: {
    color: "#EFDFC5",
  },
  
  tallerInput: {
    height: 150,
    textAlignVertical: "top",
  },
});

import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDarkMode } from '../context/DarkModeContext';
import { Job, RootStackParamList } from '../types/types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type JobDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'JobDetails'>;
type JobDetailsRouteProp = RouteProp<RootStackParamList, 'JobDetails'>;

export default function JobDetailsScreen() {
  const { params } = useRoute<JobDetailsRouteProp>(); 
  const navigation = useNavigation<JobDetailsScreenNavigationProp>();
  const { isDarkMode } = useDarkMode();
  const job: Job = params.job;
  
  const handleApplyNow = () => {
    navigation.navigate("ApplicationForm", { job });
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#000' : '#fff'} />

      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity
          style={[styles.backButton, isDarkMode && styles.backButtonDark]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={isDarkMode ? '#EFDFC5' : 'white'} />
        </TouchableOpacity>
        <Text style={[styles.headerText, isDarkMode && styles.headerTextDark]}>Job Details</Text>
      </View>

      {/* Divider */}
      <View style={styles.headerSeparator} />

      {/* Job Info */}
      <ScrollView style={styles.scrollContainer}>
        <Image source={{ uri: job.companyLogo }} style={styles.logo} />
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>{job.title}</Text>
        <Text style={[styles.company, isDarkMode && styles.companyDark]}>{job.companyName}</Text>

        <View style={styles.infoContainer}>
          <Text style={[styles.label, isDarkMode && styles.labelDark]}>Job Type:</Text>
          <Text style={[styles.value, isDarkMode && styles.valueDark]}>{job.jobType}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.label, isDarkMode && styles.labelDark]}>Work Model:</Text>
          <Text style={[styles.value, isDarkMode && styles.valueDark]}>{job.workModel}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.label, isDarkMode && styles.labelDark]}>Seniority Level:</Text>
          <Text style={[styles.value, isDarkMode && styles.valueDark]}>{job.seniorityLevel}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.label, isDarkMode && styles.labelDark]}>Salary Range:</Text>
          <Text style={[styles.value, isDarkMode && styles.valueDark]}>
            ${job.minSalary} - ${job.maxSalary}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Description</Text>

        {/* Description Container */}
        <View style={[styles.descriptionContainer, isDarkMode && styles.descriptionContainerDark]}>
          {/* WebView for HTML Description */}
            <Text style={[styles.value, isDarkMode && styles.valueDark]}>No description available at this moment.</Text>
            <Text style={[styles.value, isDarkMode && styles.valueDark]}>Thank you for understanding!</Text>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <TouchableOpacity
        style={[styles.applyButton, isDarkMode && styles.applyButtonDark]}
        onPress={handleApplyNow}
      >
        <Text style={[styles.applyText, isDarkMode && styles.applyTextDark]}>Apply Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#EFDFC5',
  },

  containerDark: {
    backgroundColor: '#121212',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: '#EFDFC5',
  },

  headerDark: {
    backgroundColor: '#121212',
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8E0B13',
    letterSpacing: 2,
  },

  headerTextDark: {
    color: '#EFDFC5',
  },

  backButton: {
    backgroundColor: '#8E0B13',
    padding: 8,
    borderRadius: 20,
  },

  backButtonDark: {
    backgroundColor: '#8E0B13',
  },

  headerSeparator: {
    height: 2,
    backgroundColor: '#8E0B13',
    marginBottom: 10,
  },

  scrollContainer: {
    paddingBottom: 20,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 20,
    borderWidth: 3, 
    borderColor: "#4C4F54",
    marginBottom: 10,
    marginTop: 15,
    alignSelf: 'center',
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#8E0B13',
    textAlign: 'center',
  },

  titleDark: {
    color: '#EFDFC5',
  },

  company: {
    fontSize: 20,
    color: '#4C4F54',
    fontWeight: "bold",
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15,
  },

  companyDark: {
    color: '#aaa',
  },

  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4C4F54',
  },

  labelDark: {
    color: '#aaa',
  },

  value: {
    fontSize: 16,
    color: '#4C4F54',
  },

  valueDark: {
    color: '#EFDFC5',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#8E0B13',
  },

  sectionTitleDark: {
    color: '#EFDFC5',
  },

  webView: {
    marginTop: 5,
    backgroundColor: 'red',
  },

  applyButton: {
    backgroundColor: '#8E0B13',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },

  applyButtonDark: {
    backgroundColor: '#8E0B13',
  },

  applyText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },

  applyTextDark: {
    color: '#EFDFC5',
  },

  descriptionContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#8E0B13',
    alignItems: "center"
  },

  descriptionContainerDark: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
});

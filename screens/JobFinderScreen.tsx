import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Modal
} from "react-native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ToastAndroid } from "react-native";
import { useSavedJobs } from "../context/SavedJobsContext";
import { useDarkMode } from "../context/DarkModeContext";
import type { Job, RootStackParamList } from "../types/types";
import Icon from 'react-native-vector-icons/Ionicons';

const PLACEHOLDER_LOGO = "https://via.placeholder.com/50";

const popularCategories = ["Software Engineer", "Manager", "Senior", "Sales", "Marketing", "Developer", "Analyst"];

export default function JobFinderScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"Company Name" | "Job Title" | "Salary" | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { saveJob, savedJobs, removeJob } = useSavedJobs();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => filterJobs(searchText), 300);
    return () => clearTimeout(timer);
  }, [searchText, jobs, sortBy]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://empllo.com/api/v1");
      if (!response.ok) throw new Error(`Failed to fetch jobs: ${response.status}`);

      const data = await response.json();
      const jobList = Array.isArray(data) ? data : data.jobs || [];

      const mappedJobs: Job[] = jobList
        .map((job: any) => ({
          id: job.id || uuidv4(),
          title: job.title || "No title",
          description: job.description || "No description",
          companyName: job.companyName || "Unknown company",
          companyLogo: job.companyLogo || PLACEHOLDER_LOGO,
          minSalary: job.minSalary || 0,
          maxSalary: job.maxSalary || 0,
          jobType: capitalize(job.jobType) || "Unknown",
          workModel: capitalize(job.workModel) || "Unknown",
          seniorityLevel: capitalize(job.seniorityLevel) || "Unknown",
        }))
        .filter(
          (job: Job, index: number, self: Job[]) =>
            index === self.findIndex((j: Job) => j.id === job.id)
        );

      setJobs(mappedJobs);
      setFilteredJobs(mappedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (text: string) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  const filterJobs = (text: string) => {
    let filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(text.toLowerCase()) ||
        job.companyName.toLowerCase().includes(text.toLowerCase())
    );
  
    if (sortBy) {
      filtered = filtered.sort((a, b) => {
        if (sortBy === "Company Name") {
          return a.companyName.localeCompare(b.companyName);
        }
        if (sortBy === "Job Title") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "Salary") {
          const salaryA = (a.minSalary + a.maxSalary) / 2;
          const salaryB = (b.minSalary + b.maxSalary) / 2;
          return salaryA - salaryB;
        }
        return 0;
      });
    }
  
    setFilteredJobs(filtered);
  };

  const handleSort = (criteria: "Company Name" | "Job Title" | "Salary") => {
    setSortBy(criteria);
  };

  const handleSaveJob = (job: Job) => {
    if (!savedJobs.some((savedJob) => savedJob.id === job.id)) {
      saveJob(job);
      ToastAndroid.show("Job saved", ToastAndroid.SHORT);
    } else {
      removeJob(job.id); 
      ToastAndroid.show("Job removed", ToastAndroid.SHORT);
    }
  };  

  const handleViewDetails = (job: Job) => {
    navigation.navigate("JobDetails", { job });
  };

  const filterByCategory = (category: string) => {
    setSearchText(category);
  };

  return (

    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#000" : "#fff"}
      />

      {/* Header */}

      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <Text style={[styles.headerText, isDarkMode && styles.headerTextDark]}>Dashboard</Text>
        <TouchableOpacity onPress={toggleDarkMode} style={[styles.darkModeIcon, isDarkMode && styles.darkModeIconDark]}>
          <Icon
            name={isDarkMode ? "sunny" : "moon"}
            size={24}
            color={isDarkMode ? "#EFDFC5" : "white"}
          />
        </TouchableOpacity>
      </View>

      {/* Line Under Header */}

      <View style={styles.headerSeparator} />

      {/* Search and Sort */}

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isDarkMode && styles.searchBarDark]}>
          <Icon name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            placeholder="Search Jobs..."
            value={searchText}
            onChangeText={setSearchText}
            style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
            placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
          />
        </View>

        {/* Sort Filter */}

        <TouchableOpacity style={styles.sortButton} onPress={() => setModalVisible(true)}>
          <Text style={[styles.sortButtonText, isDarkMode && styles.sortButtonTextDark]}>Sort By</Text>
          <Icon 
            name="filter" 
            size={18} 
            color={isDarkMode ? "#EFDFC5" : "white"} 
          />
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
              <Text style={[styles.modalTitle, isDarkMode && styles.sortOptionDark]}>Sort By</Text>
              <TouchableOpacity onPress={() => { handleSort("Job Title"); setModalVisible(false); }}>
                <Text style={[styles.sortOption, isDarkMode && styles.sortOptionDark]}>Job Title</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { handleSort("Company Name"); setModalVisible(false); }}>
                <Text style={[styles.sortOption, isDarkMode && styles.sortOptionDark]}>Company Name</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { handleSort("Salary"); setModalVisible(false); }}>
                <Text style={[styles.sortOption, isDarkMode && styles.sortOptionDark]}>Salary</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

      </View>

      <View style={styles.searchSeparator} />

      {/* Popular Categories */}

      <Text style={[styles.sectionTitlePopular, isDarkMode && styles.sectionTitlePopularDark]}>Popular Categories</Text>

      <View style={styles.popularCategoriesContainer}>
        <FlatList
          data={popularCategories}
          horizontal
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => filterByCategory(item)}
            >
              <Text style={[styles.categoryText, isDarkMode && styles.categoryTextDark]}>{item}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </View>

      {/* Job List */}

      <Text style={[styles.sectionTitleAll, isDarkMode && styles.sectionTitleAllDark]}>All Available Jobs</Text>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => {
          const isSaved = savedJobs.some((savedJob) => savedJob.id === item.id);

          return (
            <View style={[styles.jobItem, isDarkMode && styles.jobItemDark]}>
              <Image source={{ uri: item.companyLogo }} style={styles.logo} />
              
              {/* Make container flex and aligned */}
              <View style={styles.jobInfoContainer}>
                <Text
                  style={[styles.title, isDarkMode && styles.titleDark]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.title}
                </Text>
                
                <View style={styles.jobInfo}>
                  <Text style={[styles.text, isDarkMode && styles.textDark]}>
                    {item.companyName}
                  </Text>
                  <Text style={[styles.text, isDarkMode && styles.textDark]}>
                    {item.jobType}
                  </Text>
                </View>
              </View>

              {/* Save Icon */}
              <TouchableOpacity
                style={styles.saveIcon}
                onPress={() => handleSaveJob(item)}
              >
                <Icon
                  name={isSaved ? "bookmark" : "bookmark-outline"}
                  size={24}
                  color={isSaved ? "#8E0B13" : "#8E0B13"}
                />
              </TouchableOpacity>

              {/* View More Details */}
              <TouchableOpacity
                style={styles.viewDetails}
                onPress={() => handleViewDetails(item)}
              >
                <Text style={[styles.viewDetailsText, isDarkMode && styles.viewDetailsTextDark]}>View Details</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#1E90FF" />
          ) : (
            <Text style={styles.noResults}>No jobs available</Text>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 25,
    backgroundColor: "#EFDFC5",
  },

  containerDark: {
    backgroundColor: "#121212",
  },

  header: {
    paddingVertical: 15,
    backgroundColor: "#EFDFC5",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  headerDark: {
    backgroundColor: "#121212"
  },

  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8E0B13",
    letterSpacing: 2
  },

  headerTextDark: {
    color: "#EFDFC5"
  },

  darkModeIcon: {
    padding: 6,
    borderRadius: 15,
    backgroundColor: "#8E0B13",
  },

  darkModeIconDark: {
    padding: 6,
    borderRadius: 15,
    backgroundColor: "#8E0B13",
  },

  headerSeparator: {
    height: 2,
    backgroundColor: "#8E0B13",
    marginBottom: 10,
  },

  searchSeparator: {
    height: 2,
    backgroundColor: "#8E0B13",
    marginBottom: 10,
    marginTop: 10
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10
  },

  searchContainerDark: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#4C4F54",
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
  },

  searchInputDark: {
    flex: 1,
    fontSize: 15,
    color: "white"
  },

  sortButton: {
    flexDirection: "row",
    backgroundColor: "#8E0B13",
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  sortButtonText: {
    color: "white",
    marginRight: 4,
    fontSize: 15
  },

  sortButtonTextDark: {
    color: "#EFDFC5",
    marginRight: 4,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "black",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10, 
    alignItems: "center",
  },

  modalContentDark:{
    width: "80%",
    padding: 20,
    backgroundColor: "#121212",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#EFDFC5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10, 
    alignItems: "center",
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  
  sortOption: {
    fontSize: 16,
    paddingVertical: 12,
    color: "#8E0B13",
    textAlign: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  
  "sortOption:last-child": {
    borderBottomWidth: 0,
  },

  sortOptionDark: {
    fontSize: 16,
    paddingVertical: 12,
    color: "#EFDFC5",
    textAlign: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  
  "sortOptionDark:last-child": {
    borderBottomWidth: 0,
  },

  searchBarDark: {
    backgroundColor: "#121212",
    borderColor: "#8E0B13",
  },

  sectionTitlePopular: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8E0B13",
    marginBottom: 15,
    marginTop: 10,
    letterSpacing: 1
  },

  sectionTitlePopularDark: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EFDFC5",
    marginBottom: 15,
    marginTop: 10,
    letterSpacing: 1
  },

  sectionTitleAll: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8E0B13",
    marginBottom: 15,
    marginTop: 10,
    letterSpacing: 1
  },

  sectionTitleAllDark: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EFDFC5",
    marginBottom: 15,
    marginTop: 10,
    letterSpacing: 1
  },

  popularCategoriesContainer: {
    height: 45,
  },

  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "#8E0B13",
    borderRadius: 30,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 30, 
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },  

  categoryText: {
    color: "#fff",
    fontSize: 14, 
    fontWeight: "bold",
    lineHeight: 18, 
  },

  categoryTextDark: {
    color: "#EFDFC5",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 18, 
  },

  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  noResults: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "500",
  },

  jobInfoContainer: {
    flex: 1,
    justifyContent: "center",
  },

  jobItem: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#4C4F54",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  jobItemDark: {
    backgroundColor: "rgb(37, 37, 37)",
    borderWidth: 2,
    borderColor: "#8E0B13",
  },

  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 8
  },

  jobInfo: {
    flex: 1,
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  applyButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 1,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
  },

  detailsButton: {
    backgroundColor: "#1E90FF",
    padding: 8,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 8,
  },

  viewDetails: {
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: "#8E0B13",
    borderRadius: 15,
    alignSelf: "center",
  },

  saveIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 7,
    color: "#333",
  },

  titleDark: {
    color: "#EFDFC5",
  },

  text: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },

  textDark: {
    color: "#EFDFC5",
  },

  viewDetailsText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1
  },

  viewDetailsTextDark: {
    color: "#EFDFC5",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  buttonTextDark: {
    color: "#EFDFC5",
    fontSize: 14,
    fontWeight: "500",
  },
});
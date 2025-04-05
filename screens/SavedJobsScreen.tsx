import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  Modal,
  StatusBar,
  Image
} from "react-native";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSavedJobs } from "../context/SavedJobsContext";
import { useDarkMode } from "../context/DarkModeContext";
import type { Job, RootStackParamList } from "../types/types";
import Icon from 'react-native-vector-icons/Ionicons';

export default function SavedJobsScreen() {
  const { savedJobs, removeJob } = useSavedJobs();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<"Company Name" | "Job Title" | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); 
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  useEffect(() => {
    if (savedJobs.length > 0) {
      setLoading(false); 
    }
  }, [savedJobs]);

  const handleRemove = (id: string) => {
    Alert.alert("Remove Job", "Are you sure you want to remove this job?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", onPress: () => removeJob(id) },
    ]);
  };

  const handleViewDetails = (job: Job) => {
    navigation.navigate("JobDetails", { job });
  };

  const filteredJobs = savedJobs
    .filter((job) =>
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Company Name") {
        return a.companyName.localeCompare(b.companyName);
      }
      if (sortBy === "Job Title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#000" : "#fff"}
      />

      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <Text style={[styles.headerText, isDarkMode && styles.headerTextDark]}>Saved Jobs</Text>
        <TouchableOpacity onPress={toggleDarkMode} style={[styles.darkModeIcon, isDarkMode && styles.darkModeIconDark]}>
          <Icon
            name={isDarkMode ? "sunny" : "moon"}
            size={24}
            color={isDarkMode ? "#EFDFC5" : "white"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerSeparator} />

      {/* Search and Sort Bar */}
      <View style={styles.searchAndSortContainer}>
        {/* Search Bar */}
        <View style={[styles.searchBar, isDarkMode && styles.searchBarDark]}>
          <Icon 
            name="search" 
            size={18} 
            color="#999" 
            style={styles.searchIcon} 
          />
          <TextInput
            placeholder="Search Saved Jobs..."
            value={searchText}
            onChangeText={setSearchText}
            style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
            placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
          />
        </View>

        {/* Sort Filter */}
        <TouchableOpacity style={styles.sortButton} onPress={() => setModalVisible(true)}>
          <Text style={[styles.sortButtonText, isDarkMode && styles.sortButtonTextDark]}>Sort By</Text>
          <Icon name="filter" size={18} color={isDarkMode ? "#EFDFC5" : "white"} />
        </TouchableOpacity>
      </View>

      <View style={styles.headerSeparator} />

      {/* Modal for Sorting */}
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
            <TouchableOpacity onPress={() => { setSortBy("Job Title"); setModalVisible(false); }}>
              <Text style={[styles.sortOption, isDarkMode && styles.sortOptionDark]}>Job Title</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSortBy("Company Name"); setModalVisible(false); }}>
              <Text style={[styles.sortOption, isDarkMode && styles.sortOptionDark]}>Company Name</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Job List */}
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => {
          return (
            <View style={[styles.jobContainer, isDarkMode && styles.jobContainerDark]}>
              {/* Job Logo */}
              <Image source={{ uri: item.companyLogo }} style={styles.logo} />
              
              {/* Job Info Container */}
              <View style={styles.jobInfoContainer}>
                <Text
                  style={[styles.jobTitle, isDarkMode && styles.jobTitleDark]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.title}
                </Text>
          
                <View style={styles.jobInfo}>
                  <Text style={[styles.companyName, isDarkMode && styles.companyNameDark]}>
                    {item.companyName}
                  </Text>
                </View>
              </View>
          
              {/* Remove Job Button */}
              <TouchableOpacity
                onPress={() => handleRemove(item.id)}
                style={styles.removeButton}
              >
                <Icon name="close" size={20} color="#E74C3C" />
              </TouchableOpacity>
          
              {/* View Job Details Button */}
              <View style={styles.jobActions}>
                <TouchableOpacity
                  style={styles.viewDetailsButton}
                  onPress={() => handleViewDetails(item)}
                >
                  <Text style={[styles.viewDetailsText, isDarkMode && styles.viewDetailsTextDark]}>
                    View Job Details
                  </Text>
                </TouchableOpacity>
              </View>          
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
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#EFDFC5",
    padding: 16,
    paddingHorizontal: 25,
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

  headerSeparator: {
    height: 2,
    backgroundColor: "#8E0B13",
    marginBottom: 20,
  },

  darkModeIcon: {
    padding: 6,
    borderRadius: 15,
    backgroundColor: "#8E0B13",
  },

  darkModeIconDark: {
    backgroundColor: "#333",
  },

  searchAndSortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderColor: "#4C4F54",
    borderWidth: 2,
    flex: 1,
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
    marginRight: 10
  },

  searchBarDark: {
    backgroundColor: "#121212",
    borderColor: "#8E0B13",
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
    alignItems: "center",
    padding: 11,
    backgroundColor: "#8E0B13",
    borderRadius: 8,
  },

  sortButtonText: {
    color: "#fff",
    fontSize: 15,
    marginRight: 10,
  },

  sortButtonTextDark: {
    color: "#EFDFC5",
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

  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  jobInfoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  jobContainer: {
    width: "48%",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    position: "relative",
  },

  jobContainerDark: {
    backgroundColor: "#333",
    borderColor: "#555",
  },

  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  jobTitleDark: {
    color: "#fff",
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

  companyName: {
    fontSize: 16,
    color: "#555",
    marginVertical: 5,
  },

  companyNameDark: {
    color: "#ccc",
  },

  jobActions: {
    marginTop: 15,
  },

  viewDetailsButton: {
    backgroundColor: "#8E0B13",
    padding: 10,
    borderRadius: 8,
  },

  viewDetailsText: {
    color: "#fff",
    textAlign: "center",
  },

  viewDetailsTextDark: {
    color: "#EFDFC5",
  },

  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 50,
    zIndex: 1,
  },
  
  noResults: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
  },
});

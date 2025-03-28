import React, { createContext, useContext, useState, ReactNode } from "react";
import { Job } from "../types/types";

type SavedJobsContextType = {
  savedJobs: Job[];
  setSavedJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  saveJob: (job: Job) => void;
  removeJob: (id: string) => void;
};

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export const SavedJobsProvider = ({ children }: { children: ReactNode }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const saveJob = (job: Job) => {
    setSavedJobs((prevJobs) => [...prevJobs, job]);
  };

  const removeJob = (id: string) => {
    setSavedJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, setSavedJobs, saveJob, removeJob }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error("useSavedJobs must be used within a SavedJobsProvider");
  }
  return context;
};

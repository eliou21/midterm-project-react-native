export type Job = {
    id: string;
    title: string;
    description: string;
    companyName: string;
    companyLogo: string;
    minSalary: number;
    maxSalary: number;
    jobType: string;
    workModel: string;
    seniorityLevel: string;
    applicationLink: string;
  };  

  export type RootStackParamList = {
    JobFinder: undefined;
    SavedJobs: undefined;
    Welcome: undefined;
    JobDetails: { job: Job };
    ApplicationForm: { job: Job };
  };  
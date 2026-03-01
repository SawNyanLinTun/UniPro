
export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'remote' | 'hybrid' | 'onsite';
  duration: string;
  category: string;
  description: string;
  stipend: string;
  tags: string[];
  postedDate: string;
  deadline: string;
  requirements?: string[];
  skills?: string[];
}

export enum InternshipCategory {
  SOFTWARE = 'Software Development',
  DESIGN = 'Design',
  MARKETING = 'Marketing',
  DATA_SCIENCE = 'Data Science',
  BUSINESS = 'Business',
  FINANCE = 'Finance'
}

export type ApplicationStatus = 'applied' | 'under_review' | 'interview' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  internshipId: string;
  status: ApplicationStatus;
  appliedDate: string;
}

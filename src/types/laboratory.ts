export type DepartmentId =
  | 'chemistry'
  | 'biology'
  | 'microbiology'
  | 'genetics'
  | 'physics'
  | 'microscopy'
  | 'forensics'
  | 'medical'
  | 'astronomy'
  | 'earth-science'
  | 'ecology'
  | 'environmental'
  | 'engineering'
  | 'famous-experiments'
  | 'neuroscience-materials';

export interface Department {
  id: DepartmentId;
  name: string;
  iconName: string;
  shortDescription: string;
  experimentsCount: number;
  highlightColor: string;
  experiments: ExperimentSummary[];
}

export interface ExperimentSummary {
  id: string;
  title: string;
  departmentId: DepartmentId;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string; // e.g. "10-15 min"
  brief: string;
  keyEquipment: string[];
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'Optics' | 'Glassware' | 'Thermal & Measurement' | 'Electronics' | 'Biological' | 'Analytical';
  specs: string;
  operatingPrinciple: string;
  safetyRating: string;
  usedInDepartments: DepartmentId[];
  icon: string;
}

export interface Challenge {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface ExperimentDetail {
  id: string;
  title: string;
  departmentId: DepartmentId;
  departmentName: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  introduction: string;
  learningObjectives: string[];
  requiredEquipment: string[];
  scientificFormula?: string;
  theoryExplanation: string;
  challenges: Challenge[];
  suggestedRelated: string[]; // ids of related experiments
}

export interface ObservationLog {
  id: string;
  experimentId: string;
  experimentTitle: string;
  timestamp: string;
  notes: string;
  parameters: Record<string, string | number | boolean>;
  resultSummary: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isHint?: boolean;
}

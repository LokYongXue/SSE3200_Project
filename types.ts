export interface User {
  id: string;
  name: string;
  email: string;
  isAnonymous: boolean;
  ageGroup?: string;
  academicLoad?: 'Low' | 'Medium' | 'High';
  goals?: string;
}

export interface Counsellor {
  id: string;
  name: string;
  role: 'Senior Counsellor' | 'Trainee';
  strengths: string[];
  mission: string;
  imageUrl: string;
  isOnline: boolean;
}

export interface JournalEntry {
  id: string;
  content: string;
  mood: string; // Emoji
  triggers: string[];
  createdAt: string;
  isBottled: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface Habit {
  id: string;
  title: string;
  completed: boolean;
}

export enum Page {
  HOME = 'home',
  COUNSELLOR = 'counsellor',
  SELF_CARE = 'self-care',
  JOURNAL = 'journal',
  PROFILE = 'profile',
  LOGIN = 'login'
}

export interface SelfCareCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  exercises: SelfCareExercise[];
}

export interface SelfCareExercise {
  id: string;
  title: string;
  duration: string;
  type: 'audio' | 'reading' | 'action';
}
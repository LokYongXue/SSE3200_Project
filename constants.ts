import { Counsellor, SelfCareCategory } from './types';

export const COUNSELLORS: Counsellor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'Senior Counsellor',
    strengths: ['Anxiety', 'Academic Pressure', 'Trauma'],
    mission: "Helping students navigate the complexities of academic life with resilience.",
    imageUrl: 'https://picsum.photos/id/64/200/200',
    isOnline: true
  },
  {
    id: '2',
    name: 'Mark Robinson',
    role: 'Trainee',
    strengths: ['Relationship', 'Loneliness', 'Adjustment'],
    mission: "A listening ear for those feeling lost in the crowd.",
    imageUrl: 'https://picsum.photos/id/91/200/200',
    isOnline: false
  },
  {
    id: '3',
    name: 'Emily Davis',
    role: 'Senior Counsellor',
    strengths: ['Burnout', 'Depression', 'Self-Esteem'],
    mission: "Empowering you to find your inner light again.",
    imageUrl: 'https://picsum.photos/id/129/200/200',
    isOnline: true
  },
  {
    id: '4',
    name: 'James Wilson',
    role: 'Trainee',
    strengths: ['Career Guidance', 'Stress Management'],
    mission: "Building bridges between your present struggles and future success.",
    imageUrl: 'https://picsum.photos/id/177/200/200',
    isOnline: true
  }
];

export const SELF_CARE_CATEGORIES: SelfCareCategory[] = [
  {
    id: 'academic',
    title: 'Academic Pressure',
    icon: '📚',
    color: 'bg-blue-100 text-blue-800',
    exercises: [
      { id: 'a1', title: 'Pomodoro Focus Timer', duration: '25 min', type: 'action' },
      { id: 'a2', title: 'Exam Anxiety Breathing', duration: '5 min', type: 'audio' },
    ]
  },
  {
    id: 'loneliness',
    title: 'Loneliness',
    icon: '🫂',
    color: 'bg-purple-100 text-purple-800',
    exercises: [
      { id: 'l1', title: 'Loving-Kindness Meditation', duration: '10 min', type: 'audio' },
      { id: 'l2', title: 'Connect with a Friend', duration: '15 min', type: 'action' },
    ]
  },
  {
    id: 'relationship',
    title: 'Relationships',
    icon: '❤️',
    color: 'bg-pink-100 text-pink-800',
    exercises: [
      { id: 'r1', title: 'Setting Boundaries', duration: 'Reading', type: 'reading' },
      { id: 'r2', title: 'Reflective Journaling', duration: '10 min', type: 'action' },
    ]
  },
  {
    id: 'burnout',
    title: 'Burnout',
    icon: '🔋',
    color: 'bg-orange-100 text-orange-800',
    exercises: [
      { id: 'b1', title: 'Progressive Muscle Relaxation', duration: '15 min', type: 'audio' },
      { id: 'b2', title: 'Digital Detox Challenge', duration: '1 hour', type: 'action' },
    ]
  }
];

export const MOODS = ['😊', '😐', '😔', '😡', '😰', '😴', '😭', '🤯'];

export const TRIGGERS = [
  'Exams', 'Assignments', 'Sleep', 'Social', 'Family', 'Finances', 'Health', 'Future'
];
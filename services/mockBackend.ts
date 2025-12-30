import { User, JournalEntry, Habit } from '../types';

const STORAGE_KEY_USERS = 'mind.IO_users_db';
const STORAGE_KEY_SESSION = 'mind.IO_session';

// Helper to simulate data isolation per user
const getUserKey = (prefix: string) => {
  const user = AuthService.getCurrentUser();
  return user ? `${prefix}_${user.id}` : prefix;
};

// --- DUMMY DATA SEEDING ---
const initializeDummyData = () => {
  if (typeof window === 'undefined') return; // SSR check
  
  if (!localStorage.getItem(STORAGE_KEY_USERS)) {
    const dummyUsers = [
      {
        id: 'user_ali',
        name: 'Ali Bin Ahmad',
        email: 'ali@student.edu.my',
        password: 'password123', // In a real app, hash this!
        isAnonymous: false,
        ageGroup: '20-22',
        academicLoad: 'High',
        goals: 'Reduce exam anxiety'
      },
      {
        id: 'user_mei',
        name: 'Mei Ling',
        email: 'mei@student.edu.my',
        password: 'password123',
        isAnonymous: true, // Anonymous user
        ageGroup: '17-19',
        academicLoad: 'Medium',
        goals: 'Better sleep habits'
      }
    ];
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(dummyUsers));
    console.log("Dummy data initialized. Try logging in with ali@student.edu.my / password123");
  }
};

initializeDummyData();

const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', title: 'Sleep 8 Hours', completed: false },
  { id: 'h2', title: 'Drink 2L Water', completed: false },
  { id: 'h3', title: '15min Walk', completed: false },
];

export const AuthService = {
  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    
    const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    const users: any[] = usersStr ? JSON.parse(usersStr) : [];
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (user) {
      // Remove password before storing in session
      const { password, ...safeUser } = user;
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(safeUser));
      return safeUser as User;
    }
    
    throw new Error("Invalid email or password");
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    const users: any[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Email already registered");
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      password,
      isAnonymous: false,
      ageGroup: '',
      academicLoad: 'Medium',
      goals: ''
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

    const { password: pw, ...safeUser } = newUser;
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(safeUser));
    
    return safeUser as User;
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) throw new Error("No session found");

    // Update in Session
    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updatedUser));

    // Update in DB
    const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    if (usersStr) {
      const users: any[] = JSON.parse(usersStr);
      const index = users.findIndex(u => u.id === currentUser.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      }
    }

    return updatedUser;
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  },

  deleteAccount: async () => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return;

    // Remove from DB
    const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    if (usersStr) {
      const users: any[] = JSON.parse(usersStr);
      const newUsers = users.filter(u => u.id !== currentUser.id);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(newUsers));
    }

    // Clear User Data
    localStorage.removeItem(`mind.IO_journal_${currentUser.id}`);
    localStorage.removeItem(`mind.IO_habits_${currentUser.id}`);
    
    // Logout
    await AuthService.logout();
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY_SESSION);
    return stored ? JSON.parse(stored) : null;
  }
};

export const DatabaseService = {
  getJournalEntries: async (): Promise<JournalEntry[]> => {
    const key = getUserKey('mind.IO_journal');
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  },

  addJournalEntry: async (content: string, mood: string, triggers: string[]): Promise<JournalEntry> => {
    const entries = await DatabaseService.getJournalEntries();
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content,
      mood,
      triggers,
      createdAt: new Date().toISOString(),
      isBottled: true,
    };
    const updated = [newEntry, ...entries];
    
    const key = getUserKey('mind.IO_journal');
    localStorage.setItem(key, JSON.stringify(updated));
    return newEntry;
  },

  getHabits: async (): Promise<Habit[]> => {
    const key = getUserKey('mind.IO_habits');
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : DEFAULT_HABITS;
  },

  toggleHabit: async (id: string): Promise<Habit[]> => {
    const habits = await DatabaseService.getHabits();
    const updated = habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h);
    
    const key = getUserKey('mind.IO_habits');
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  },

  addHabit: async (title: string): Promise<Habit[]> => {
    const habits = await DatabaseService.getHabits();
    // Avoid duplicates based on title
    if (habits.some(h => h.title.toLowerCase() === title.toLowerCase())) {
        return habits;
    }
    const newHabit: Habit = { 
        id: 'h_' + Date.now(), 
        title, 
        completed: false 
    };
    const updated = [...habits, newHabit];
    const key = getUserKey('mind.IO_habits');
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  },

  removeHabit: async (id: string): Promise<Habit[]> => {
    const habits = await DatabaseService.getHabits();
    const updated = habits.filter(h => h.id !== id);
    const key = getUserKey('mind.IO_habits');
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  }
};
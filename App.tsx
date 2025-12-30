import React, { useState, useEffect } from 'react';
import { 
  User, Page, JournalEntry, Habit, Counsellor, SelfCareCategory, SelfCareExercise 
} from './types';
import { AuthService, DatabaseService } from './services/mockBackend';
import { GeminiService } from './services/geminiService';
import { COUNSELLORS, SELF_CARE_CATEGORIES, MOODS, TRIGGERS } from './constants';
import Layout from './components/Layout';
import ChatBot from './components/ChatBot';
import BottleAnimation from './components/BottleAnimation';
import Logo from './components/Logo';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ArrowLeft, Play, Book, Music, UserCheck, Calendar, Lock, CheckCircle, Circle, Sparkles, AlertTriangle, Phone, Mail, Key, LogOut, X, Plus, Trash2, Edit3 } from 'lucide-react';

// --- SUB-PAGES COMPONENTS ---

const LoginPage: React.FC<{ onLogin: (u: User) => void }> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill for testing convenience if it's the first load
  useEffect(() => {
    if (!isRegistering && email === '') {
      setEmail('');
    }
  }, [isRegistering]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let user: User;
      if (isRegistering) {
        if (!name || !email || !password) throw new Error("All fields are required");
        user = await AuthService.register(name, email, password);
      } else {
        if (!email || !password) throw new Error("All fields are required");
        user = await AuthService.login(email, password);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-teal-50 px-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-6">
           <Logo className="h-16 w-auto" />
        </div>
        
        <h1 className="text-xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-500 mb-6 text-sm">
          {isRegistering ? 'Create your safe space' : 'Sign in to continue your journey'}
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs rounded-lg flex items-center gap-2 justify-center">
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="relative">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <UserCheck className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
          )}
          
          <div className="relative">
            <input
              type="email"
              placeholder="Student Email"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Key className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isRegistering ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
           <button 
             onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
             className="text-sm text-gray-500 hover:text-primary transition-colors"
           >
             {isRegistering ? 'Already have an account? Sign In' : 'New here? Create Account'}
           </button>
        </div>

        {/* Dummy Data Hint */}
        {!isRegistering && (
           <div className="mt-4 text-[10px] text-gray-400 bg-gray-50 p-2 rounded">
             <span className="font-bold">Demo Login:</span> ali@student.edu.my / password123
           </div>
        )}
      </div>
    </div>
  );
};

const ProfilePage: React.FC<{ user: User; onUpdate: (u: User) => void; onLogout: () => void }> = ({ user, onUpdate, onLogout }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    ageGroup: user.ageGroup || '',
    academicLoad: user.academicLoad || 'Medium',
    goals: user.goals || '',
    isAnonymous: user.isAnonymous || false
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const updated = await AuthService.updateProfile(formData);
    onUpdate(updated);
    setSaving(false);
    alert('Profile saved!');
  };

  const handleDelete = async () => {
    if(confirm("Are you sure you want to delete your account? This will permanently delete your journal entries and habits. This cannot be undone.")) {
       await AuthService.deleteAccount();
       onLogout();
    }
  };

  return (
    <div className="p-6 space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
       
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Name</label>
            <input 
              className="w-full p-2 border-b border-gray-200 focus:border-primary outline-none" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-gray-700">Anonymous Mode</span>
            <button 
              onClick={() => setFormData({...formData, isAnonymous: !formData.isAnonymous})}
              className={`w-12 h-6 rounded-full transition-colors relative ${formData.isAnonymous ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isAnonymous ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Age Group</label>
            <select 
              className="w-full p-2 bg-gray-50 rounded mt-1"
              value={formData.ageGroup}
              onChange={e => setFormData({...formData, ageGroup: e.target.value})}
            >
              <option value="">Select Age</option>
              <option value="17-19">17-19</option>
              <option value="20-22">20-22</option>
              <option value="23+">23+</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Academic Load</label>
             <div className="flex gap-2 mt-2">
              {['Low', 'Medium', 'High'].map(load => (
                <button
                  key={load}
                  onClick={() => setFormData({...formData, academicLoad: load as any})}
                  className={`flex-1 py-2 text-xs rounded-lg border ${formData.academicLoad === load ? 'bg-indigo-100 border-indigo-200 text-primary font-bold' : 'border-gray-200 text-gray-500'}`}
                >
                  {load}
                </button>
              ))}
             </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Wellness Goals</label>
            <textarea 
               className="w-full p-2 bg-gray-50 rounded mt-1 text-sm h-20"
               placeholder="e.g., Sleep better, manage exam stress..."
               value={formData.goals}
               onChange={e => setFormData({...formData, goals: e.target.value})}
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
       </div>

       <button 
          onClick={onLogout}
          className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:text-primary transition-all flex items-center justify-center gap-2 shadow-sm"
       >
         <LogOut size={18} /> Sign Out
       </button>

       <button onClick={handleDelete} className="w-full text-red-400 text-xs font-medium py-2 hover:text-red-600 transition-colors">
         Delete Account (Irreversible)
       </button>
    </div>
  );
};

const ManageHabitsModal: React.FC<{ 
  habits: Habit[], 
  onClose: () => void,
  onAdd: (t: string) => void,
  onRemove: (id: string) => void
}> = ({ habits, onClose, onAdd, onRemove }) => {
  const [customInput, setCustomInput] = useState('');
  const suggestions = [
    "Sleep 8 Hours 😴", "Drink 2L Water 💧", "15min Walk 🚶", 
    "No Social Media 1h 📵", "Read 10 pages 📖", "Meditate 5 min 🧘",
    "Eat a fruit 🍎", "Call a friend 📞", "Tidy Room 🧹"
  ];

  // Filter out suggestions that are already in habits
  const availableSuggestions = suggestions.filter(s => !habits.some(h => h.title === s));

  const handleAddCustom = () => {
    if(customInput.trim()) {
      onAdd(customInput.trim());
      setCustomInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800">Manage Goals</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><X size={20}/></button>
        </div>
        
        <div className="p-4 overflow-y-auto space-y-6">
          {/* Current List */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">My Goals</h4>
            <div className="space-y-2">
              {habits.map(h => (
                <div key={h.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-sm text-gray-700">{h.title}</span>
                  <button onClick={() => onRemove(h.id)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {habits.length === 0 && <p className="text-xs text-gray-400 italic">No active goals.</p>}
            </div>
          </div>

          {/* Add Custom */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Add Custom</h4>
            <div className="flex gap-2">
              <input 
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                placeholder="e.g. Yoga"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
              />
              <button onClick={handleAddCustom} className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90">
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Suggestions</h4>
            <div className="flex flex-wrap gap-2">
              {availableSuggestions.map(s => (
                <button 
                  key={s}
                  onClick={() => onAdd(s)}
                  className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 border border-indigo-100 transition-colors"
                >
                  + {s}
                </button>
              ))}
              {availableSuggestions.length === 0 && <p className="text-xs text-gray-400">All suggestions added!</p>}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100">
           <button onClick={onClose} className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium">Done</button>
        </div>
      </div>
    </div>
  )
};

const HomePage: React.FC<{ user: User; onNavigate: (p: Page) => void }> = ({ user, onNavigate }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showManage, setShowManage] = useState(false);

  useEffect(() => {
    DatabaseService.getHabits().then(setHabits);
  }, []);

  const toggleHabit = async (id: string) => {
    const updated = await DatabaseService.toggleHabit(id);
    setHabits(updated);
  };

  const addHabit = async (title: string) => {
    const updated = await DatabaseService.addHabit(title);
    setHabits(updated);
  };

  const removeHabit = async (id: string) => {
    const updated = await DatabaseService.removeHabit(id);
    setHabits(updated);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-primary to-indigo-400 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">
             {user.isAnonymous ? 'Hello, Friend 👋' : `Hello, ${user.name.split(' ')[0]} 👋`}
          </h2>
          <p className="text-indigo-100 opacity-90">How is your heart feeling today?</p>
        </div>
        <div className="absolute right-0 top-0 opacity-10 text-9xl">🌿</div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-3">Daily Inspiration</h3>
        <p className="italic text-gray-500 text-sm leading-relaxed">
          "You don't have to control your thoughts. You just have to stop letting them control you."
        </p>
      </div>

      {showManage && (
         <ManageHabitsModal 
           habits={habits} 
           onClose={() => setShowManage(false)} 
           onAdd={addHabit}
           onRemove={removeHabit}
         />
       )}

      {/* Habit Snippet */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">Your Goals</h3>
          <div className="flex gap-3">
             <button onClick={() => setShowManage(true)} className="text-xs text-gray-500 font-medium flex items-center gap-1 hover:text-primary">
               <Edit3 size={12} /> Edit
             </button>
             <button onClick={() => onNavigate(Page.SELF_CARE)} className="text-xs text-primary font-medium">View All</button>
          </div>
        </div>
        <div className="space-y-2">
          {habits.slice(0, 5).map(h => (
            <div key={h.id} onClick={() => toggleHabit(h.id)} className="flex items-center gap-3 cursor-pointer group">
              {h.completed ? <CheckCircle size={18} className="text-secondary flex-shrink-0" /> : <Circle size={18} className="text-gray-300 flex-shrink-0 group-hover:text-primary transition-colors" />}
              <span className={`text-sm ${h.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{h.title}</span>
            </div>
          ))}
          {habits.length === 0 && <span className="text-xs text-gray-400 italic">No goals set. Click edit to add some!</span>}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => onNavigate(Page.SELF_CARE)}>
            <span className="text-2xl">🧘</span>
            <span className="text-sm font-medium text-orange-800">Breathing</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => onNavigate(Page.JOURNAL)}>
            <span className="text-2xl">📝</span>
            <span className="text-sm font-medium text-blue-800">New Entry</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CounsellorPage: React.FC = () => {
  const [chatContext, setChatContext] = useState<string | null>(null);

  const handleBook = (name: string) => {
    alert(`Booking request sent for ${name}. You will receive a confirmation email shortly.`);
  };

  const handleChat = (name: string) => {
    setChatContext(`chatting with ${name}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Counsellors</h2>
          <p className="text-sm text-gray-500">Find the right support for you</p>
        </div>
        <button 
          onClick={() => setChatContext(chatContext ? null : 'general assistance')}
          className="bg-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm hover:bg-teal-600 transition-colors"
        >
          {chatContext ? 'Hide AI' : 'AI Match'}
        </button>
      </div>

      {chatContext && (
        <div className="mb-6 animate-in slide-in-from-top-4 duration-300">
          <ChatBot initialMessage={chatContext} />
        </div>
      )}

      <div className="space-y-4">
        {COUNSELLORS.map(c => (
          <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
            <img src={c.imageUrl} alt={c.name} className="w-16 h-16 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{c.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.role === 'Senior Counsellor' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                    {c.role}
                  </span>
                </div>
                {c.isOnline && <span className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>}
              </div>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">"{c.mission}"</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {c.strengths.slice(0, 2).map(s => (
                  <span key={s} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-nowrap">{s}</span>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => handleBook(c.name)}
                  className="flex-1 bg-gray-900 text-white text-xs py-2 rounded-lg font-medium hover:bg-gray-800"
                >
                  Book Session
                </button>
                <button 
                  onClick={() => handleChat(c.name)}
                  className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                >
                   Chat AI
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SelfCarePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SelfCareCategory | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    DatabaseService.getHabits().then(setHabits);
  }, []);

  const toggleHabit = async (id: string) => {
    const updated = await DatabaseService.toggleHabit(id);
    setHabits(updated);
  };

  if (selectedCategory) {
    return (
      <div className="p-6 min-h-full bg-white">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6"
        >
          <ArrowLeft size={20} /> <span className="text-sm font-medium">Back to Categories</span>
        </button>
        
        <div className={`p-6 rounded-2xl mb-6 ${selectedCategory.color} bg-opacity-20`}>
          <div className="text-4xl mb-2">{selectedCategory.icon}</div>
          <h2 className="text-2xl font-bold">{selectedCategory.title}</h2>
          <p className="opacity-80 text-sm mt-1">Curated exercises for you</p>
        </div>

        <div className="space-y-3">
          {selectedCategory.exercises.map(ex => (
            <div key={ex.id} className="border border-gray-100 p-4 rounded-xl flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${ex.type === 'audio' ? 'bg-orange-100 text-orange-500' : ex.type === 'reading' ? 'bg-blue-100 text-blue-500' : 'bg-green-100 text-green-500'}`}>
                   {ex.type === 'audio' ? <Music size={20}/> : ex.type === 'reading' ? <Book size={20}/> : <Play size={20}/>}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{ex.title}</h4>
                  <p className="text-xs text-gray-400">{ex.duration} • {ex.type}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-300">
                 ▶
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Self Care</h2>
      
      {/* Habits Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
           Daily Habits
        </h3>
        <div className="space-y-2">
          {habits.map(h => (
            <div key={h.id} onClick={() => toggleHabit(h.id)} className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                 {h.completed ? <CheckCircle size={20} className="text-secondary" /> : <Circle size={20} className="text-gray-300" />}
                 <span className={`text-sm ${h.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{h.title}</span>
              </div>
            </div>
          ))}
          {habits.length === 0 && <span className="text-xs text-gray-400">No habits set.</span>}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4 font-semibold">Categories</p>
      <div className="grid grid-cols-2 gap-4">
        {SELF_CARE_CATEGORIES.map(cat => (
          <div 
            key={cat.id} 
            onClick={() => setSelectedCategory(cat)}
            className={`p-5 rounded-2xl ${cat.color} bg-opacity-20 hover:bg-opacity-30 transition-colors cursor-pointer flex flex-col items-center justify-center text-center gap-3 aspect-square`}
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className="font-semibold text-sm">{cat.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newContent, setNewContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [isBottling, setIsBottling] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const data = await DatabaseService.getJournalEntries();
    setEntries(data);
  };

  const handleSave = async () => {
    if (!newContent || !selectedMood) return;
    setIsBottling(true);
  };

  const handleAnimationComplete = async () => {
    if (!selectedMood) return;
    await DatabaseService.addJournalEntry(newContent, selectedMood, selectedTriggers);
    setNewContent('');
    setSelectedMood(null);
    setSelectedTriggers([]);
    setIsBottling(false);
    loadEntries();
  };

  const toggleTrigger = (t: string) => {
    if (selectedTriggers.includes(t)) {
      setSelectedTriggers(prev => prev.filter(i => i !== t));
    } else {
      setSelectedTriggers(prev => [...prev, t]);
    }
  };

  const handleAnalyze = async () => {
    if (entries.length === 0) return;
    setIsAnalyzing(true);
    const result = await GeminiService.analyzeMood(entries);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  // Mock data for chart if empty
  const chartData = entries.length > 0 
    ? entries.slice(0, 7).reverse().map((e, i) => ({ 
        name: `Day ${i+1}`, 
        moodScore: MOODS.indexOf(e.mood) === -1 ? 3 : 5 - MOODS.indexOf(e.mood) 
      }))
    : [
        { name: 'Mon', moodScore: 3 },
        { name: 'Tue', moodScore: 4 },
        { name: 'Wed', moodScore: 2 },
        { name: 'Thu', moodScore: 5 },
        { name: 'Fri', moodScore: 4 },
      ];

  return (
    <div className="p-6 relative pb-24">
      {isBottling && <BottleAnimation onAnimationComplete={handleAnimationComplete} />}

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mood Journal</h2>

      {/* Mood Tracker Graph */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
             <Calendar size={16}/> Trends
           </h3>
           <button 
             onClick={handleAnalyze} 
             className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md flex items-center gap-1 hover:bg-indigo-100"
           >
             <Sparkles size={12}/> {isAnalyzing ? 'Analyzing...' : 'AI Insights'}
           </button>
        </div>
        
        {aiAnalysis && (
          <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-teal-50 rounded-lg text-xs text-gray-700 leading-relaxed border border-indigo-100 animate-in fade-in">
             <span className="font-bold text-indigo-700">Insight:</span> {aiAnalysis}
          </div>
        )}

        <div className="h-40 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={chartData}>
               <XAxis dataKey="name" tick={{fontSize: 10}} stroke="#cbd5e1"/>
               <YAxis hide domain={[0, 8]}/>
               <Tooltip />
               <Line type="monotone" dataKey="moodScore" stroke="#14b8a6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
             </LineChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* New Entry */}
      <div className="bg-paper border border-yellow-100 p-5 rounded-xl shadow-sm mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-200"></div>
        <textarea 
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="What's on your mind today?"
          className="w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 resize-none h-20 mb-3 text-sm"
        />
        
        {/* Triggers */}
        <div className="flex flex-wrap gap-2 mb-4">
          {TRIGGERS.map(t => (
            <button 
              key={t}
              onClick={() => toggleTrigger(t)}
              className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${selectedTriggers.includes(t) ? 'bg-red-50 border-red-200 text-red-500 font-medium' : 'bg-white border-gray-100 text-gray-400'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {MOODS.map(m => (
              <button 
                key={m} 
                onClick={() => setSelectedMood(m)}
                className={`text-xl hover:scale-110 transition-transform ${selectedMood === m ? 'scale-125 drop-shadow-md' : 'opacity-60'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <button 
            onClick={handleSave}
            disabled={!newContent || !selectedMood}
            className="bg-yellow-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Bottle It 🍾
          </button>
        </div>
      </div>

      {/* History */}
      <h3 className="font-bold text-gray-800 mb-3">Your Bottles</h3>
      <div className="grid grid-cols-3 gap-3">
        {entries.map(entry => (
          <div key={entry.id} className="relative group">
             <div className="aspect-[1/2] bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors">
               <span className="text-2xl drop-shadow-sm opacity-80">🧴</span>
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] p-2 rounded w-24 text-center z-10">
               {entry.mood} <br/> {new Date(entry.createdAt).toLocaleDateString()}
             </div>
          </div>
        ))}
        {entries.length === 0 && <p className="text-xs text-gray-400 col-span-3">No bottles yet. Write your first note!</p>}
      </div>
    </div>
  );
};

const CrisisModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/50 backdrop-blur-sm p-6">
     <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-red-600 mb-4">
           <AlertTriangle size={32} />
           <h2 className="text-xl font-bold">Crisis Support (Malaysia)</h2>
        </div>
        <p className="text-gray-600 mb-6 text-sm">
           You are not alone. If you are in immediate danger, please contact emergency services.
        </p>
        <div className="space-y-3">
           <div className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-xl font-bold">
              <Phone size={18} /> Emergency (999)
           </div>
           <div className="flex items-center justify-center gap-2 w-full bg-blue-100 text-blue-800 py-3 rounded-xl font-bold">
              <Phone size={18} /> Befrienders KL (03-76272929)
           </div>
           <div className="flex items-center justify-center gap-2 w-full bg-orange-100 text-orange-700 py-3 rounded-xl font-bold">
              <Phone size={18} /> Talian Kasih (15999)
           </div>
           <button onClick={onClose} className="w-full text-gray-400 py-2 text-sm hover:text-gray-600">
              Close
           </button>
        </div>
     </div>
  </div>
);

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>(Page.LOGIN);
  const [showCrisis, setShowCrisis] = useState(false);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setActivePage(Page.HOME);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setActivePage(Page.HOME);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
    setActivePage(Page.LOGIN);
  };

  if (!user || activePage === Page.LOGIN) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activePage={activePage} 
      onNavigate={setActivePage} 
      onCrisis={() => setShowCrisis(true)}
    >
      {showCrisis && <CrisisModal onClose={() => setShowCrisis(false)} />}
      
      {activePage === Page.HOME && <HomePage user={user} onNavigate={setActivePage} />}
      {activePage === Page.PROFILE && <ProfilePage user={user} onUpdate={setUser} onLogout={handleLogout} />}
      {activePage === Page.COUNSELLOR && <CounsellorPage />}
      {activePage === Page.SELF_CARE && <SelfCarePage />}
      {activePage === Page.JOURNAL && <JournalPage />}
    </Layout>
  );
};

export default App;
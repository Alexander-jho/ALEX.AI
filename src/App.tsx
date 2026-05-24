import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  FileSearch, 
  Languages, 
  Layout, 
  Activity, 
  Coins, 
  AlertCircle,
  Sun,
  Moon,
  Github,
  Mail,
  User,
  GraduationCap
} from 'lucide-react';
import { TaskSolution, CitationReference } from './types';
import TaskSolver from './components/TaskSolver';
import AcademicChat from './components/AcademicChat';
import FileWorkspace from './components/FileWorkspace';
import LinguisticEngine from './components/LinguisticEngine';
import DocumentGenerator from './components/DocumentGenerator';
import AdminPanel from './components/AdminPanel';
import PremiumSystem from './components/PremiumSystem';

export default function App() {
  const [activeTab, setActiveTab] = useState<'solver' | 'chat' | 'ocr' | 'linguistic' | 'compiler' | 'admin' | 'premium'>('solver');
  
  // Account/Subscription states
  const [darkTheme, setDarkTheme] = useState<boolean>(true);
  const [creditsRemaining, setCreditsRemaining] = useState<number>(99999);
  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'premium'>('premium');

  // Shared state: when a solution is generated, it's shared with the document compiler
  const [activeSolution, setActiveSolution] = useState<TaskSolution | null>(null);

  const addCredits = (count: number) => {
    // Session actions count tracker can go here under the hood
    setCreditsRemaining(prev => prev);
  };

  // Switch tab and prefill a question (e.g., extracted from OCR scanner)
  const handleQuestionExtracted = (questionText: string) => {
    setActiveTab('solver');
    // Prefills standard question state or triggers action inside TaskSolver
    // We can show instructions to the user
    setTimeout(() => {
      const questArea = document.querySelector('textarea');
      if (questArea) {
        (questArea as HTMLTextAreaElement).value = questionText;
        // Trigger generic change event to update state in TaskSolver component
        const event = new Event('input', { bubbles: true });
        questArea.dispatchEvent(event);
      }
    }, 100);
  };

  const tabs: { id: typeof activeTab; label: string; icon: React.ComponentType<any>; color: string }[] = [
    { id: 'solver', label: 'Resolución de Tareas', icon: Sparkles, color: 'text-amber-500' },
    { id: 'chat', label: 'Tutor IA Chat', icon: MessageSquare, color: 'text-amber-500' },
    { id: 'ocr', label: 'Análisis OCR Escáner', icon: FileSearch, color: 'text-amber-500' },
    { id: 'linguistic', label: 'Motor Lingüístico', icon: Languages, color: 'text-amber-500' },
    { id: 'compiler', label: 'Generar Entregable', icon: Layout, color: 'text-amber-500' },
    { id: 'admin', label: 'Administrar Clúster', icon: Activity, color: 'text-amber-500' },
    { id: 'premium', label: 'Sistemas & Licencia', icon: Coins, color: 'text-amber-500' }
  ];

  return (
    <div className={`min-h-screen transition-all font-sans ${
      darkTheme 
        ? 'bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200' 
        : 'bg-stone-100 text-stone-900 selection:bg-amber-500/20 selection:text-amber-900'
    }`}>
      {/* Dynamic top safety bar indicating Cloud Run status */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-[10px] font-extrabold uppercase py-2 px-4 flex items-center justify-between tracking-widest leading-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-stone-950 rounded-full animate-ping shrink-0" />
          <span>ALEX.AI Cloud Container Instance (Cloud Run Auto-Scaled)</span>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <span>LATENCIA: 12ms</span>
          <span>● KUBERNETES BALANCED</span>
          <span>alex.b19h@gmail.com</span>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-6">
        
        {/* Navigation / Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-100 dark:border-slate-900 gap-4">
          <div className="flex items-center space-x-3.5 select-none">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-stone-950 flex items-center justify-center font-serif font-extrabold text-2xl shadow-lg shadow-amber-500/10">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif italic tracking-tight text-stone-900 dark:text-amber-50">ALEX.AI</h1>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/25 uppercase font-bold tracking-wider">Gratis e Ilimitado</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">La plataforma educativa e investigadora más avanzada para resolución de tareas, citas APA7/Vancouver y tutoría paso a paso.</p>
            </div>
          </div>

          {/* Top user metrics and theme configuration widgets */}
          <div className="flex flex-wrap items-center gap-3.5 justify-end">
            
            {/* User credit wallet status */}
            <div className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border ${
              darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200'
            }`}>
              <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-mono font-bold text-emerald-400">Uso Ilimitado y Gratis</span>
            </div>

            {/* Profile email */}
            <div className={`hidden lg:flex items-center space-x-2 px-3.5 py-2 rounded-xl border ${
              darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200'
            }`}>
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-xs text-gray-400 font-mono">alex.b19h@gmail.com</span>
            </div>

            {/* Light/Dark mode switcher */}
            <button
              onClick={() => setDarkTheme(!darkTheme)}
              className={`p-2.5 rounded-xl border transition-all ${
                darkTheme 
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:text-white' 
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
              title="Cambiar Contraste / Claridad"
            >
              {darkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Global Alert if Key is Missing inside .env (checked lazily but represented as warning advice) */}
        <div className={`p-4 rounded-xl border text-xs flex items-center space-x-3.5 ${
          darkTheme 
            ? 'bg-amber-500/10 border-amber-500/25 text-amber-300' 
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <GraduationCap className="w-5 h-5 shrink-0" />
          <div className="leading-relaxed">
            <span className="font-bold">Modelos Multimodales activos:</span> El clúster está enlazado a Google Gemini para realizar OCR en imágenes de cuadernos, estructurar bibliografías correctas e interpretar código. Puedes cambiar tus opciones y el nivel escolar o universitario en cada pestaña.
          </div>
        </div>

        {/* Dynamic Navigation Tabs menu */}
        <nav className="flex flex-wrap gap-2 border-b border-gray-100 dark:border-slate-900 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                  isSelected
                    ? darkTheme
                      ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md shadow-amber-500/10'
                      : 'bg-amber-500 text-stone-950 font-extrabold shadow-sm'
                    : darkTheme
                      ? 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                      : 'hover:bg-stone-200/50 text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* MAIN VIEWPORT SWITCHER */}
        <main className="min-h-[500px]">
          {activeTab === 'solver' && (
            <TaskSolver 
              onSolutionGenerated={(sol) => setActiveSolution(sol)} 
              darkTheme={darkTheme} 
              addCredits={addCredits} 
              creditsRemaining={creditsRemaining} 
            />
          )}

          {activeTab === 'chat' && (
            <AcademicChat 
              darkTheme={darkTheme} 
              addCredits={addCredits} 
              creditsRemaining={creditsRemaining} 
            />
          )}

          {activeTab === 'ocr' && (
            <FileWorkspace 
              darkTheme={darkTheme} 
              onQuestionExtracted={handleQuestionExtracted} 
              addCredits={addCredits} 
              creditsRemaining={creditsRemaining} 
            />
          )}

          {activeTab === 'linguistic' && (
            <LinguisticEngine 
              darkTheme={darkTheme} 
              addCredits={addCredits} 
              creditsRemaining={creditsRemaining} 
            />
          )}

          {activeTab === 'compiler' && (
            <DocumentGenerator 
              darkTheme={darkTheme} 
              activeReferences={activeSolution ? activeSolution.references : []} 
              originalQuestion={activeSolution ? activeSolution.originalQuestion : undefined} 
              resolvedText={activeSolution ? activeSolution.resolvedText : undefined} 
            />
          )}

          {activeTab === 'admin' && (
            <AdminPanel 
              darkTheme={darkTheme} 
            />
          )}

          {activeTab === 'premium' && (
            <PremiumSystem 
              darkTheme={darkTheme} 
              creditsRemaining={creditsRemaining} 
              addCredits={addCredits} 
              subscriptionPlan={subscriptionPlan} 
              setSubscriptionPlan={setSubscriptionPlan} 
            />
          )}
        </main>

        {/* Footer */}
        <footer className="pt-10 border-t border-gray-100 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 font-mono gap-4">
          <div>
            &copy; 2026 ALEX.AI Academic Platforms, Inc. Derechos reservados.
          </div>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 hover:text-gray-300 transition select-none">
              <Mail className="w-3.5 h-3.5" />
              <span>alex.b19h@gmail.com</span>
            </span>
            <span className="flex items-center gap-1.5 select-none text-emerald-500 font-bold">
              <span>● MULTIMODAL GEMINI SECURE</span>
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}

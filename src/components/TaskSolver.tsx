import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  Settings, 
  FileText, 
  CheckCircle, 
  RefreshCw, 
  Layers, 
  HelpCircle, 
  Bookmark, 
  Copy, 
  Download,
  Terminal,
  Clock
} from 'lucide-react';
import { AcademicLevel, AcademicSubject, CitationStyle, TutorPersona, TaskSolution, CitationReference } from '../types';
import { motion } from 'motion/react';

interface TaskSolverProps {
  onSolutionGenerated: (solution: TaskSolution) => void;
  darkTheme: boolean;
  addCredits: (count: number) => void;
  creditsRemaining: number;
}

export default function TaskSolver({ onSolutionGenerated, darkTheme, addCredits, creditsRemaining }: TaskSolverProps) {
  const [question, setQuestion] = useState('');
  const [level, setLevel] = useState<AcademicLevel>('university');
  const [subject, setSubject] = useState<AcademicSubject>('mathematics');
  const [citationStyle, setCitationStyle] = useState<CitationStyle>('APA7');
  const [tutorPersona, setTutorPersona] = useState<TutorPersona>('step_by_step');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<TaskSolution | null>(null);
  const [showConfig, setShowConfig] = useState(true);
  const [copied, setCopied] = useState(false);
  const [keyAlert, setKeyAlert] = useState(false);

  const levelOptions: { value: AcademicLevel; label: string; desc: string }[] = [
    { value: 'school', label: 'Educación Básica (School)', desc: 'Explicaciones sencillas y analogías básicas' },
    { value: 'highschool', label: 'Bachillerato (High School)', desc: 'Enfoque práctico con fórmulas estándar' },
    { value: 'university', label: 'Especialización Superior (College)', desc: 'Rigor técnico, metodología y análisis crítico' },
    { value: 'postgrad', label: 'Maestría / Postgrado', desc: 'Investigación pura, epistemología avanzada y tesis' }
  ];

  const subjectOptions: { value: AcademicSubject; label: string; icon: string }[] = [
    { value: 'mathematics', label: 'Matemáticas y Cálculo', icon: '∑' },
    { value: 'physics_chemistry', label: 'Física y Química', icon: '⚛' },
    { value: 'humanities_essay', label: 'Ensayos y Humanidades', icon: '✎' },
    { value: 'computer_science', label: 'Programación / CS', icon: '⟨⟩' },
    { value: 'law_political', label: 'Derecho y Jurisprudencia', icon: '⚖' },
    { value: 'medicine_biology', label: 'Medicina y Biología', icon: '🧬' },
    { value: 'economics_business', label: 'SaaS / Economía', icon: '📊' },
    { value: 'languages', label: 'Traducción y Lenguas', icon: '文' }
  ];

  const citationStyles: CitationStyle[] = [
    'APA7', 'APA6', 'IEEE', 'MLA', 'Vancouver', 'Chicago', 'Harvard', 'ICONTEC'
  ];

  const personaOptions: { value: TutorPersona; label: string; desc: string }[] = [
    { value: 'step_by_step', label: 'Explicación Paso a Paso', desc: 'Inducción numerada detallando el porqué de cada regla.' },
    { value: 'socratic', label: 'Método Socrático', desc: 'Te cuestiona para encender tu curiosidad racional antes del resultado.' },
    { value: 'rigorous', label: 'Científico Puro', desc: 'Vocabulario denso, riguroso, y sustentación epistemológica.' },
    { value: 'humanized', label: 'Humanizado para Entrega', desc: 'Redacción orgánica indetectable por softwares de IA.' }
  ];

  const handleSolve = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setKeyAlert(false);
    try {
      const response = await fetch('/api/academic/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          level,
          subject,
          citationStyle,
          tutorPersona
        }),
      });

      const data = await response.json();
      
      const newSolution: TaskSolution = {
        originalQuestion: question,
        resolvedText: data.resolvedText || '',
        stepExplanation: data.stepExplanation || [],
        formulas: data.formulas || [],
        visualMapHtml: data.visualMapHtml || '',
        references: data.references || [],
        academicLevel: level,
        subject,
        citationStyle,
        wordCount: data.resolvedText?.split(/\s+/).length || 0
      };

      setSolution(newSolution);
      onSolutionGenerated(newSolution);
      if (data.keyNeeded) {
        setKeyAlert(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header section with instructions */}
      <div className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm`}>
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Resolución Académica de Tareas</h2>
            <p className="text-xs text-gray-400">Descompón talleres, genera investigaciones y resuelve problemas STEM con citación automática.</p>
          </div>
        </div>

        {/* Input box */}
        <div className="mt-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Ingresa las instrucciones o problema de tu tarea</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ejemplo de Matemáticas: Encuentra la derivada parcial de f(x,y) = x²y + sin(y) con respecto a y.
O de Humanidades: Escribe un ensayo crítico de 400 palabras sobre la separación de poderes postulada por Montesquieu."
            rows={5}
            className={`w-full p-4 rounded-xl font-sans text-sm outline-none transition-all ${
              darkTheme 
                ? 'bg-slate-950 border border-slate-800 text-slate-100 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20' 
                : 'bg-stone-50 border border-stone-200 text-stone-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20'
            }`}
          />
        </div>

        {/* Configurations Toggle */}
        <div className="mt-4 flex flex-wrap gap-4 items-center justify-between border-t border-dashed border-gray-100 dark:border-slate-800 pt-4">
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className={`flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
              darkTheme 
                ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800' 
                : 'bg-stone-100 border-stone-200 hover:bg-stone-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configuración Académica: {showConfig ? 'Ocultar' : 'Mostrar'}</span>
          </button>

          <button
            onClick={handleSolve}
            disabled={loading || !question.trim()}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              !question.trim() 
                ? 'bg-gray-300 dark:bg-slate-800 text-gray-500 dark:text-slate-600 cursor-not-allowed' 
                : 'bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold active:scale-95 shadow-md shadow-amber-500/10'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Estatizando Criterios con IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Resolver Tarea con ALEX.AI (Ilimitado)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {keyAlert && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start space-x-3">
          <Terminal className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-400">
            <span className="font-bold">Modo Demostración Local:</span> La plataforma está utilizando un resolvedor alternativo estructurado porque no se detectó una clave de API comercial en Google Cloud secrets. Para habilitar soluciones fluidas 100% reales en vivo con el modelo avanzado Gemini, ingresa tu <span className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">GEMINI_API_KEY</span> en el configurador.
          </div>
        </div>
      )}

      {/* Configuration drawers */}
      {showConfig && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl ${darkTheme ? 'bg-slate-900/60 border border-slate-800/70' : 'bg-stone-50 border border-stone-200'}`}
        >
          {/* Level choice */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
              <span>Nivel Académico</span>
            </div>
            <div className="space-y-1">
              {levelOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLevel(opt.value)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all ${
                    level === opt.value
                      ? 'bg-amber-500/10 border border-amber-500/40 text-amber-500 font-medium'
                      : darkTheme 
                        ? 'bg-slate-950/70 border border-slate-900 text-slate-400 hover:text-slate-200' 
                        : 'bg-white border border-stone-100 hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[10px] opacity-70 leading-normal">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Subject choice */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Materia / Disciplina</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {subjectOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSubject(opt.value)}
                  className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                    subject === opt.value
                      ? 'bg-amber-500/10 border border-amber-500/40 text-amber-500 font-medium'
                      : darkTheme
                        ? 'bg-slate-950/70 border border-slate-900 text-slate-400 hover:text-slate-200'
                        : 'bg-white border border-stone-100 hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  <span className="font-mono text-xs opacity-60 ml-1">{opt.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tutor Persona */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Enfoque del Tutor</span>
            </div>
            <div className="space-y-1">
              {personaOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTutorPersona(opt.value)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all ${
                    tutorPersona === opt.value
                      ? 'bg-amber-500/10 border border-amber-500/40 text-amber-500 font-medium'
                      : darkTheme
                        ? 'bg-slate-950/70 border border-slate-900 text-slate-400 hover:text-slate-200'
                        : 'bg-white border border-stone-100 hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[10px] opacity-70 leading-normal">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Citation Style */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Norma de Citación</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {citationStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setCitationStyle(style)}
                  className={`p-2.5 rounded-lg text-center font-mono text-xs font-semibold uppercase transition-all ${
                    citationStyle === style
                      ? 'bg-amber-500 text-stone-950 border border-amber-500 shadow-sm'
                      : darkTheme
                        ? 'bg-slate-950/70 border border-slate-900 text-slate-400 hover:bg-slate-800'
                        : 'bg-white border border-stone-100 hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-gray-400 italic pt-1 leading-normal">
              La IA citará autor, páginas y referencias reales dentro del texto y compilará la bibliografía correspondiente de manera automática.
            </div>
          </div>
        </motion.div>
      )}

      {/* RESULTS DISPLAY */}
      {solution && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Resolution Paper Container */}
          <div className={`p-8 rounded-3xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm relative overflow-hidden`}>
            {/* Watermark badge */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <span className="font-mono text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                Citas: {solution.citationStyle}
              </span>
              <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                Nivel: {solution.academicLevel}
              </span>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
              <div className="text-xs text-gray-400 mb-1 flex items-center space-x-1.5">
                <FileText className="w-3 h-3 text-amber-500" />
                <span>MEMORIA DE RESOLUCIÓN</span>
              </div>
              <h3 className="text-xl font-bold italic tracking-tight text-gray-800 dark:text-slate-100">
                "{solution.originalQuestion.substring(0, 100)}{solution.originalQuestion.length > 100 ? '...' : ''}"
              </h3>
            </div>

            {/* Rendered Text */}
            <div className="prose prose-stone dark:prose-invert max-w-none text-sm leading-relaxed space-y-4 font-sans text-gray-700 dark:text-slate-200">
              {solution.resolvedText.split('\n\n').map((para, idx) => {
                if (para.startsWith('###')) {
                  return <h4 key={idx} className="text-md font-bold text-stone-900 dark:text-slate-100 mt-5 mb-2">{para.replace('###', '').trim()}</h4>;
                }
                if (para.startsWith('##')) {
                  return <h3 key={idx} className="text-lg font-bold text-stone-900 dark:text-slate-100 mt-6 mb-3">{para.replace('##', '').trim()}</h3>;
                }
                if (para.startsWith('-') || para.startsWith('*')) {
                  return (
                    <ul key={idx} className="list-disc list-inside pl-4 space-y-1">
                      {para.split('\n').map((line, lidx) => (
                        <li key={lidx}>{line.replace(/^-\s*/, '').replace(/^\*\s*/, '').trim()}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx} className="leading-relaxed whitespace-pre-wrap">{para}</p>;
              })}
            </div>

            {/* LaTeX formulas / critical points if any */}
            {solution.formulas && solution.formulas.length > 0 && (
              <div className="my-6 p-4 rounded-xl bg-slate-950 text-slate-100 border border-slate-800 font-mono text-xs space-y-2 relative">
                <span className="absolute top-2 right-2 text-[10px] text-slate-500 uppercase font-sans tracking-wide">Fórmulas / Conceptos Clave</span>
                <div className="text-gray-400 border-b border-slate-900 pb-1 mb-2 text-[10px] tracking-widest font-sans font-bold">EXPRESIONES DEDUCIDAS</div>
                {solution.formulas.map((form, fIdx) => (
                  <div key={fIdx} className="flex items-center space-x-2 py-1 text-amber-400 font-semibold text-sm">
                    <span>⚡</span>
                    <span>{form}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Copy button bar */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-4">
              <span className="text-xs text-gray-400 font-mono">
                Palabras generadas: <strong>{solution.wordCount}</strong> | Tiempo de inferencia: ~1.2s
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(solution.resolvedText)}
                  className={`flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded-lg border transition-all ${
                    copied 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                      : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-750'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? '¡Copiado!' : 'Copiar Resolución'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stepped Reasoning Block */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`col-span-2 p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm`}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Explicación Paso a Paso del Profesor</span>
              </h4>
              <div className="space-y-4">
                {solution.stepExplanation.map((step, idx) => (
                  <div key={idx} className="flex space-x-3 items-start p-3.5 rounded-xl bg-stone-50/50 dark:bg-slate-950/40 border border-gray-100 dark:border-slate-800/80">
                    <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="text-xs leading-relaxed text-gray-600 dark:text-slate-300">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Citations bibliography block */}
            <div className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm`}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center space-x-1.5">
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>Bibliografía Formateada ({solution.citationStyle})</span>
              </h4>
              <div className="space-y-4">
                {solution.references && solution.references.length > 0 ? (
                  solution.references.map((ref) => (
                    <div key={ref.id} className="p-3 rounded-lg bg-stone-50 dark:bg-slate-950 border border-gray-150 dark:border-slate-850 text-[11px] leading-relaxed text-gray-600 dark:text-slate-300 relative">
                      <div className="font-semibold text-gray-800 dark:text-slate-200 mb-1">{ref.author} ({ref.year})</div>
                      <div className="italic text-gray-700 dark:text-slate-300 mb-1">"{ref.title}"</div>
                      <div className="text-gray-400 font-mono text-[9px] truncate">{ref.url || 'scholar.google.com'}</div>
                      <div className="mt-2 pt-2 border-t border-dashed border-gray-250 dark:border-slate-800 text-[10px] text-amber-500 font-semibold bg-amber-500/5 p-1 rounded">
                        {ref.citationText}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">No se generaron referencias automáticas para esta pregunta.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

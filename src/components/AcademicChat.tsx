import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  FileUp, 
  Brain, 
  Compass, 
  Languages, 
  ChevronRight, 
  RefreshCw, 
  Terminal, 
  BookOpen, 
  Camera,
  Layers
} from 'lucide-react';
import { ChatMessage, CitationReference } from '../types';
import { motion } from 'motion/react';

interface AcademicChatProps {
  darkTheme: boolean;
  addCredits: (count: number) => void;
  creditsRemaining: number;
}

export default function AcademicChat({ darkTheme, addCredits, creditsRemaining }: AcademicChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "¡Hola! Soy **ALEX.AI**, tu tutor académico inteligente. Puedo ayudarte a desarrollar problemas matemáticos step-by-step, planificar la estructura de tus ensayos universitarios, analizar códigos informáticos o resolver dudas científicas complejas. \n\n¿Qué materia o tema te gustaría estudiar o resolver hoy?",
      timestamp: new Date().toLocaleTimeString(),
      stepByStepDetails: [
        "Iniciando Módulos del Tutor ALEX.AI",
        "Enlazando Base de Datos epistémica ilimitada",
        "Esperando variables o imágenes del usuario"
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; textCont: string; size: string }[]>([]);
  const [simulatedOcrActive, setSimulatedOcrActive] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const studyGuides = [
    { title: "Preparación Examen de Cálculo e Integrales" },
    { title: "Seminario de Argumentación Constitucional" },
    { title: "Principios de Bioquímica y CRISPR/Cas9" },
    { title: "Ingeniería de Software & Microservicios" },
    { title: "Análisis Estadístico e Inferencia Lineal" }
  ];

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    const updatedMessages = [...messages, userMsg];

    try {
      const response = await fetch('/api/academic/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: updatedMessages,
          activeTutorGuide: selectedGuide,
          attachedFiles: uploadedFiles.map(f => ({ name: f.name, extractedText: f.textCont }))
        })
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: data.text || "Disculpa, falló la síntesis de ALEX.AI.",
        timestamp: new Date().toLocaleTimeString(),
        stepByStepDetails: [
          "Captura del contexto conversacional de ALEX.AI",
          `Navegando en directrices de: ${selectedGuide || 'Tutoría Libre'}`,
          "Extrayendo citas académicas y verallidad de fondo"
        ]
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      const errAssistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: "Hubo un error de conexión con mi motor. Intenta de nuevo.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errAssistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  const triggerMockOcr = () => {
    setSimulatedOcrActive(true);
    setTimeout(() => {
      const newFile = {
        name: "imagen_ejercicio_quimica.png",
        textCont: "ENUNCIADO DE EJERCICIO: 'Calcular el pH de una disolución de Ácido Clorhídrico (HCl) de concentración 0.045 M a una temperatura de 25°C.'",
        size: "1.2 MB"
      };
      setUploadedFiles(prev => [...prev, newFile]);
      setSimulatedOcrActive(false);
      setInputText("IA, resuelve el ejercicio de química que recién cargué en la imagen");
    }, 1500);
  };

  const handleFileChangeLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const newFile = {
        name: file.name,
        textCont: `Contenido simulado del archivo ${file.name}. Contiene tesis sobre marcos legales y resoluciones de jurisprudencia.`,
        size: `${(file.size / 1024).toFixed(1)} KB`
      };
      setUploadedFiles(prev => [...prev, newFile]);
    }
  };

  const toggleReasoning = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, reasoningOpened: !m.reasoningOpened } : m));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[720px]">
      {/* Sidebar sidebar configurations */}
      <div className="space-y-4 col-span-1 flex flex-col justify-between h-full">
        <div className="space-y-4">
          {/* Study guide banner */}
          <div className={`p-4 rounded-xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'}`}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Guías de Plan Curricular</span>
            </h4>
            <div className="space-y-1">
              {studyGuides.map((guide) => (
                <button
                  key={guide.title}
                  onClick={() => setSelectedGuide(selectedGuide === guide.title ? "" : guide.title)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                    selectedGuide === guide.title
                      ? 'bg-amber-500/10 border border-amber-500/40 text-amber-500 font-medium'
                      : darkTheme 
                        ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' 
                        : 'hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  <span className="truncate">{guide.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </button>
              ))}
            </div>
            {selectedGuide && (
              <div className="mt-3 text-[10px] text-amber-400 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                Guía activa: La IA moldeará las explicaciones y las citas según los objetivos específicos curriculares de esta guía.
              </div>
            )}
          </div>

          {/* Upload contexts */}
          <div className={`p-4 rounded-xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'}`}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center space-x-1.5">
              <Camera className="w-4 h-4 text-amber-500" />
              <span>Fotos y Documentos (OCR)</span>
            </h4>
            
            {/* Action buttons */}
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={triggerMockOcr}
                disabled={simulatedOcrActive}
                className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all dark:text-slate-300"
              >
                {simulatedOcrActive ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Leyendo Escritura Manual...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5 text-amber-500" />
                    <span>Cargar Foto de Cuaderno/Math</span>
                  </>
                )}
              </button>

              <label className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer dark:text-slate-300">
                <FileUp className="w-3.5 h-3.5 text-amber-500" />
                <span>Subir PDF / Word Académico</span>
                <input
                  type="file"
                  onChange={handleFileChangeLocal}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />
              </label>
            </div>

            {/* List of active temporary files inside the chat context */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 space-y-1">
                <div className="text-[10px] uppercase font-bold text-gray-400">Contexto de archivos para la IA:</div>
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-900 text-[10px]">
                    <span className="truncate font-mono font-medium max-w-[130px]">{file.name}</span>
                    <span className="text-gray-400 font-mono text-[9px] shrink-0">{file.size}</span>
                  </div>
                ))}
                <button 
                  onClick={() => setUploadedFiles([])}
                  className="text-[9px] text-red-400 hover:underline pt-1"
                >
                  Limpiar archivos
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info panel */}
        <div className={`p-4 rounded-xl text-center text-xs text-gray-400 ${darkTheme ? 'bg-slate-900/40' : 'bg-stone-50'}`}>
          💬 Cada pregunta consume 1 crédito del balance premium de Socrates AI.
        </div>
      </div>

      {/* Main chat window */}
      <div className={`col-span-3 h-full rounded-2xl flex flex-col justify-between overflow-hidden relative ${
        darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'
      }`}>
        {/* Chat top info */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white/20 dark:bg-slate-950/20 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-stone-950 font-serif">S</div>
            <div>
              <div className="text-xs font-semibold">Tutor Especializado Socrates AI</div>
              <div className="text-[9px] text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Base de Conocimiento Activa (Gemini v3.5)</span>
              </div>
            </div>
          </div>
          {selectedGuide && (
            <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md font-medium border border-amber-500/10 max-w-[150px] truncate">
              {selectedGuide}
            </span>
          )}
        </div>

        {/* Messages viewport */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {/* Profile icon */}
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold font-serif shrink-0 text-sm mt-0.5">
                  S
                </div>
              )}

              <div className="max-w-[80%] space-y-1">
                <div className={`p-4 rounded-2xl text-xs leading-relaxed font-sans ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                    : darkTheme 
                      ? 'bg-slate-950 text-slate-100 border border-slate-850 rounded-tl-none' 
                      : 'bg-stone-50 border border-stone-100 text-stone-900 rounded-tl-none'
                }`}>
                  {/* Simplistic formatting renderer for chat messages */}
                  <div className="whitespace-pre-wrap">
                    {msg.text.split('\n\n').map((para, pIdx) => {
                      if (para.startsWith('**') && para.endsWith('**')) {
                        return <strong key={pIdx} className="block font-bold text-stone-900 dark:text-slate-100">{para.replaceAll('**', '')}</strong>;
                      }
                      return para;
                    })}
                  </div>
                </div>

                {/* Simulated Reasoning logs tool */}
                {msg.sender === 'assistant' && msg.stepByStepDetails && (
                  <div className="mt-1">
                    <button
                      onClick={() => toggleReasoning(msg.id)}
                      className="text-[10px] text-gray-400 flex items-center space-x-1.5 focus:outline-none hover:text-gray-300"
                    >
                      <Brain className="w-3.5 h-3.5 text-amber-500" />
                      <span>{msg.reasoningOpened ? 'Ocultar lógica interna del modelo' : 'Inspeccionar razonamiento interno paso a paso'}</span>
                    </button>

                    {msg.reasoningOpened && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1 leading-normal"
                      >
                        <div className="text-[9px] text-gray-500 border-b border-slate-900 pb-1 font-bold">KUBERNETES / WORKERS TRACE LOGS</div>
                        {msg.stepByStepDetails.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-center space-x-1.5">
                            <span className="text-amber-500">▶</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}
                
                {/* Message Timestamp */}
                <span className="block text-[9px] text-gray-400 font-mono pl-1">{msg.timestamp}</span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-stone-150 dark:bg-slate-850 flex items-center justify-center font-bold text-gray-400 shrink-0 text-sm mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold font-serif shrink-0 text-sm mt-0.5">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-stone-50 dark:bg-slate-950 p-4 rounded-xl border border-stone-100 dark:border-slate-855 max-w-[80%]">
                <span className="text-xs text-gray-400 animate-pulse">ALEX.AI está analizando currículos y formulando respuestas...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Text Box BAR */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white/20 dark:bg-slate-950/20 backdrop-blur-sm flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder={
              selectedGuide 
                ? `Pregunta sobre "${selectedGuide}"...` 
                : "Formula tu consulta (ej. 'explícame el Teorema de Bayes')..."
            }
            disabled={loading}
            className={`flex-1 p-3.5 rounded-xl text-xs outline-none transition-all ${
              darkTheme 
                ? 'bg-slate-950 border border-slate-800 text-slate-100 focus:border-amber-500/50' 
                : 'bg-stone-50 border border-stone-200 text-stone-900 focus:border-amber-500'
            }`}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || loading}
            className={`p-3.5 rounded-xl transition-all ${
              !inputText.trim() || loading
                ? 'bg-stone-100 text-stone-300 dark:bg-slate-850 dark:text-slate-700 cursor-not-allowed'
                : 'bg-amber-500 text-stone-950 hover:bg-amber-600 active:scale-95'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

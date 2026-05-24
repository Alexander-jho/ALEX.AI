import React, { useState } from 'react';
import { 
  FileUp, 
  Sparkles, 
  BookOpen, 
  Clock, 
  HelpCircle, 
  Plus, 
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';

interface FileWorkspaceProps {
  darkTheme: boolean;
  onQuestionExtracted: (qText: string) => void;
  addCredits: (count: number) => void;
  creditsRemaining: number;
}

export default function FileWorkspace({ darkTheme, onQuestionExtracted, addCredits, creditsRemaining }: FileWorkspaceProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFile, setActiveFile] = useState<{
    name: string;
    text: string;
    questions: string[];
    words: number;
  } | null>(null);

  // Simulated preset documents for quick user interaction
  const presetDocs = [
    { name: "CRISPR_Bioteconologia_Cap3.pdf", size: "4.2 MB", type: "PDF Document" },
    { name: "Muestra_Estadistica_Rendimiento.xlsx", size: "240 KB", type: "Excel Spreadsheet" },
    { name: "Jurisprudencia_Soberania_Nacional.docx", size: "1.1 MB", type: "Word Document" }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (name: string, type: string, size: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/academic/parse-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName: name,
          fileType: type,
          fileSize: size
        })
      });

      const data = await response.json();
      setActiveFile({
        name: data.fileName,
        text: data.extractedText,
        questions: data.detectedQuestions || [],
        words: data.wordCount
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processFile(file.name, file.type, `${(file.size / 1024).toFixed(1)} KB`);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await processFile(file.name, file.type, `${(file.size / 1024).toFixed(1)} KB`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        {/* Upload zone */}
        <div className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm`}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center space-x-1.5">
            <FileUp className="w-4 h-4 text-amber-500" />
            <span>Módulo de Procesamiento OCR</span>
          </h3>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            ALEX.AI lee y procesa automáticamente material estructurado, imágenes hechas a mano, grabaciones orales y hojas matemáticas de regresión lineal.
          </p>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`w-full p-8 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center relative cursor-pointer ${
              dragActive
                ? 'border-amber-500 bg-amber-500/5'
                : darkTheme 
                  ? 'border-slate-800 bg-slate-950/50 hover:border-amber-500/35 hover:bg-slate-950' 
                  : 'border-stone-250 bg-stone-50 hover:border-amber-500 hover:bg-stone-50/20'
            }`}
          >
            <input
              type="file"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full mb-3">
              <FileUp className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-xs font-semibold block mb-1">Arrastra tus archivos aquí</span>
            <span className="text-[10px] text-gray-400 block">PDF, DOCX, XLSX, PNG, MP4 o ZIP</span>
          </div>
        </div>

        {/* Premade guides presets info */}
        <div className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm`}>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Materiales de Demostración Rápida</h4>
          <div className="space-y-2">
            {presetDocs.map((doc, idx) => (
              <button
                key={idx}
                onClick={() => processFile(doc.name, doc.name, doc.size)}
                disabled={loading}
                className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                  loading 
                    ? 'opacity-55 cursor-not-allowed'
                    : darkTheme 
                      ? 'bg-slate-950 border-slate-800 hover:bg-slate-850' 
                      : 'bg-stone-50 border-stone-150 hover:bg-stone-100'
                }`}
              >
                <div>
                  <div className="font-bold truncate max-w-[150px]">{doc.name}</div>
                  <div className="text-[10px] text-gray-400">{doc.type} | {doc.size}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Viewport */}
      <div className="lg:col-span-2 space-y-6">
        {loading && (
          <div className={`p-12 text-center rounded-2xl ${darkTheme ? 'bg-slate-900' : 'bg-white'} border border-dashed flex flex-col items-center justify-center space-y-3`}>
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
            <h4 className="text-sm font-bold">OCR Inteligente Escaneando Documento...</h4>
            <p className="text-[11px] text-gray-400 max-w-[300px]">Extrayendo vectores textuales, analizando variables matemáticas e identificando directivas académicas con el proxy de ALEX.AI.</p>
          </div>
        )}

        {!loading && !activeFile && (
          <div className={`p-16 text-center rounded-2xl ${darkTheme ? 'bg-slate-900' : 'bg-white'} border border-dashed flex flex-col items-center justify-center space-y-3`}>
            <div className="p-4 bg-amber-500/5 text-amber-500 rounded-full">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold">Consola Examinadora de Documentos</h4>
            <p className="text-[11px] text-gray-400 max-w-[350px]">
              Sube un informe formal o utiliza uno de los materiales de simulación ràpida para interactuar con gráficos de hojas estadísticas u obtener preguntas sugeridas del docente.
            </p>
          </div>
        )}

        {!loading && activeFile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Header statistics of active file */}
            <div className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm`}>
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3 mb-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-500">Documento Examinado con Éxito</div>
                  <h3 className="text-lg font-bold font-mono tracking-tight">{activeFile.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase font-mono font-bold text-[9px]">
                    OCR Concluido
                  </span>
                </div>
              </div>

              {/* Read text scroll area */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cuerpo de Texto / Transcripción Encontrada</span>
                </span>
                <div className={`p-4 rounded-xl font-mono text-[11px] max-h-[160px] overflow-y-auto leading-relaxed border ${
                  darkTheme ? 'bg-slate-950 border-slate-850 text-slate-300' : 'bg-stone-50 border-stone-150 text-stone-700'
                }`}>
                  {activeFile.text}
                </div>
                <div className="text-[10px] text-gray-400 font-mono text-right">
                  Palabras analizadas: {activeFile.words}
                </div>
              </div>
            </div>

            {/* Interactive Questions block */}
            <div className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Tareas y Preguntas Identificadas Automáticamente</span>
              </h4>

              {activeFile.questions && activeFile.questions.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-xs text-gray-400 mb-3">
                    Hemos detectado las siguientes directivas o preguntas en tu material. Pulsa cualquiera para resolverla de inmediato:
                  </div>
                  {activeFile.questions.map((q, qidx) => (
                    <button
                      key={qidx}
                      onClick={() => onQuestionExtracted(q)}
                      className={`w-full text-left p-3.5 rounded-xl text-xs transition-all flex items-center justify-between border ${
                        darkTheme
                          ? 'bg-slate-950 border-slate-850 hover:border-amber-500/55 hover:bg-slate-900/40 text-slate-100'
                          : 'bg-stone-50 border-stone-150 hover:border-amber-500/50 hover:bg-white text-stone-900 font-medium'
                      }`}
                    >
                      <div className="flex items-start space-x-2.5">
                        <span className="text-amber-500 shrink-0 mt-0.5">✔</span>
                        <span>{q}</span>
                      </div>
                      <Plus className="w-4 h-4 text-amber-500 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start space-x-3 text-xs text-blue-400">
                  <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Análisis Teórico General:</span> Este archivo es expositivo y no tiene preguntas explícitas dictadas por el docente. Sin embargo, puedes consultar a ALEX.AI en el Chat de Estudio para redactar un resumen o resolver dudas específicas de este material.
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

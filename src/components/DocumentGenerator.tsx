import React, { useState } from 'react';
import { 
  FileText, 
  Settings, 
  HelpCircle, 
  Bookmark, 
  Download, 
  Layout, 
  Compass, 
  RefreshCw, 
  Sparkles,
  Award
} from 'lucide-react';
import { AcademicDocument, CitationReference } from '../types';
import { motion } from 'motion/react';

interface DocumentGeneratorProps {
  darkTheme: boolean;
  activeReferences: CitationReference[];
  originalQuestion?: string;
  resolvedText?: string;
}

export default function DocumentGenerator({ darkTheme, activeReferences, originalQuestion, resolvedText }: DocumentGeneratorProps) {
  const [docConfig, setDocConfig] = useState<AcademicDocument>({
    title: originalQuestion 
      ? `Investigación sobre: ${originalQuestion.substring(0, 50)}...` 
      : "Investigación Crítica y Modelado de Sistemas Académicos",
    institution: "Universidad ALEX.AI de Ciencias Aplicadas",
    faculty: "Facultad de Postgrado e Investigaciones Tecnológicas",
    subjectName: "Investigación Pedagógica con Inferencia de IA",
    authorName: "Alex B. (Estudiante Distinguido)",
    tutorName: "Dr. ALEX.AI (Catedrático Senior)",
    locationAndYear: "Santiago, 2026",
    includeTableOfContents: true,
    sections: [
      {
        title: "1. Introducción y Estado del Arte",
        paragraphs: [
          "El presente trabajo representa un compendio de las directivas académicas resueltas con el apoyo de la plataforma ALEX.AI Academic AI, garantizando el rigor formal de investigación.",
          "La integración de las herramientas de asistencia de última generación permite que la deducción de fórmulas estadísticas complejas y los análisis históricos de derecho mantengan una fluidez humana."
        ]
      },
      {
        title: "2. Planteamiento Metodológico",
        paragraphs: [
          resolvedText || "Se implementó un diseño de investigación descriptiva y analítica apoyada en agentes cognitivos distribuidos para inferencias de lenguaje de alta confiabilidad y latencia reducida con ALEX.AI.",
          "Las fuentes citadas han sido contrastadas con repositorios científicos mediante firmas criptográficas y esquemas bibliográficos validados formalmente."
        ]
      }
    ],
    references: activeReferences && activeReferences.length > 0 ? activeReferences : [
      {
        id: "r-901",
        author: "ALEX.AI Team",
        title: "Optimización de la IA en Pedagogías Modernas con ALEX.AI",
        year: "2026",
        publisher: "ALEX.AI Premium Press",
        url: "https://ai.studio/build",
        citationText: "ALEX.AI Team (2026). *Optimización de la IA en Pedagogías Modernas con ALEX.AI*. ALEX.AI Premium Press."
      }
    ]
  });

  const [compiling, setCompiling] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleCompile = async () => {
    setCompiling(true);
    setDownloadUrl(null);
    try {
      const response = await fetch('/api/academic/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docConfig })
      });

      const data = await response.json();
      if (data.success) {
        setDownloadUrl(data.downloadUrl);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCompiling(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Parameter customizer */}
      <div className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm space-y-4`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
            <Layout className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Generador de Archivos de Entrega</h3>
            <p className="text-xs text-gray-400">Genera portadas oficiales en Word/Markdown con Tabla de Contenido automática.</p>
          </div>
        </div>

        {/* Form elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="md:col-span-2 space-y-1">
            <label className="font-semibold text-gray-400">Título del Trabajo / Proyecto</label>
            <input
              type="text"
              value={docConfig.title}
              onChange={(e) => setDocConfig({ ...docConfig, title: e.target.value })}
              className={`w-full p-2.5 rounded-lg outline-none border ${
                darkTheme ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-amber-500/40' : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-500'
              }`}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-400">Institución Educativa</label>
            <input
              type="text"
              value={docConfig.institution}
              onChange={(e) => setDocConfig({ ...docConfig, institution: e.target.value })}
              className={`w-full p-2.5 rounded-lg outline-none border ${
                darkTheme ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-400">Facultad / Departamento</label>
            <input
              type="text"
              value={docConfig.faculty}
              onChange={(e) => setDocConfig({ ...docConfig, faculty: e.target.value })}
              className={`w-full p-2.5 rounded-lg outline-none border ${
                darkTheme ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-400">Materia / Asignatura</label>
            <input
              type="text"
              value={docConfig.subjectName}
              onChange={(e) => setDocConfig({ ...docConfig, subjectName: e.target.value })}
              className={`w-full p-2.5 rounded-lg outline-none border ${
                darkTheme ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-400">Nombre del Estudiante (Autor)</label>
            <input
              type="text"
              value={docConfig.authorName}
              onChange={(e) => setDocConfig({ ...docConfig, authorName: e.target.value })}
              className={`w-full p-2.5 rounded-lg outline-none border ${
                darkTheme ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-400">Catedrático / Tutor Revisor</label>
            <input
              type="text"
              value={docConfig.tutorName}
              onChange={(e) => setDocConfig({ ...docConfig, tutorName: e.target.value })}
              className={`w-full p-2.5 rounded-lg outline-none border ${
                darkTheme ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-400">Ubicación y Año</label>
            <input
              type="text"
              value={docConfig.locationAndYear}
              onChange={(e) => setDocConfig({ ...docConfig, locationAndYear: e.target.value })}
              className={`w-full p-2.5 rounded-lg outline-none border ${
                darkTheme ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center space-x-2 pt-2 border-t border-dashed border-gray-100 dark:border-slate-850">
          <input
            type="checkbox"
            id="includeTOC"
            checked={docConfig.includeTableOfContents}
            onChange={(e) => setDocConfig({ ...docConfig, includeTableOfContents: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
          <label htmlFor="includeTOC" className="text-xs text-gray-400 cursor-pointer select-none">
            Generar Tabla de Contenido de manera interactiva e indexada.
          </label>
        </div>

        {/* Action and Download Button */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={handleCompile}
            disabled={compiling}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 active:scale-95"
          >
            {compiling ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Compilando Estilo Académico...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generar Compendio Académico Listo para Entregar</span>
              </>
            )}
          </button>

          {downloadUrl && (
            <motion.a
              href={downloadUrl}
              download={`${docConfig.title}.md`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 border border-emerald-600 text-center shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Documento Generado (.md / Word)</span>
            </motion.a>
          )}
        </div>
      </div>

      {/* Visual representation of the compiled work (PREVIEW PAGE) */}
      <div className={`p-8 rounded-2xl border ${
        darkTheme ? 'bg-slate-950 border-slate-900 text-slate-100' : 'bg-stone-50 border-stone-200 text-stone-800'
      } shadow-lg relative max-h-[640px] overflow-y-auto space-y-8 font-sans`}>
        {/* Page title watermarked */}
        <div className="absolute top-4 right-4 text-[9px] uppercase font-mono px-2 py-0.5 border rounded-full bg-amber-500/5 text-amber-500 border-amber-500/20">
          VISTA PREVIA DE FOLIO 1
        </div>

        {/* Tapa Académica (Cover Page) */}
        <div className="text-center py-8 space-y-8">
          <div className="space-y-1.5 uppercase tracking-wide font-medium text-xs text-gray-500">
            <div className="flex justify-center mb-1"><Award className="w-5 h-5 text-amber-500" /></div>
            <div>{docConfig.institution || 'Universidad'}</div>
            <div className="text-[10px] opacity-80">{docConfig.faculty || 'Facultas'}</div>
          </div>

          <div className="py-4 border-y border-dashed border-gray-200 dark:border-slate-800 max-w-[80%] mx-auto">
            <h2 className="text-lg font-bold uppercase tracking-tight text-stone-900 dark:text-slate-100">
              {docConfig.title}
            </h2>
          </div>

          <div className="text-[11px] text-gray-400 space-y-1">
            <div>Asignatura: <strong className="text-gray-300 dark:text-slate-200">{docConfig.subjectName}</strong></div>
            <div>Estudiante: <strong className="text-gray-200 dark:text-slate-200">{docConfig.authorName}</strong></div>
            <div>Profesor Revisor: <strong className="text-gray-300 dark:text-slate-200">{docConfig.tutorName}</strong></div>
          </div>

          <div className="pt-6 font-mono text-[10px] uppercase text-gray-500">
            {docConfig.locationAndYear}
          </div>
        </div>

        {/* Table of Content (Indice) If toggled */}
        {docConfig.includeTableOfContents && (
          <div className="border-t border-gray-150 dark:border-slate-900 pt-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wide text-amber-500">TABLA DE CONTENIDO (GENERADA AUTOMÁTICAMENTE)</h4>
            <div className="space-y-1.5 font-mono text-[10px] text-gray-400 text-left">
              <div className="flex justify-between border-b border-dotted border-gray-205 dark:border-slate-850">
                <span>1. INTRODUCCIÓN Y ESTADO DEL ARTE</span>
                <span>Pág 2</span>
              </div>
              <div className="flex justify-between border-b border-dotted border-gray-205 dark:border-slate-850">
                <span>2. PLANTEAMIENTO METODOLÓGICO</span>
                <span>Pág 3</span>
              </div>
              <div className="flex justify-between border-b border-dotted border-gray-205 dark:border-slate-850">
                <span>3. ANÁLISIS DE REFERENCIAS Y NORMA DE CITACIÓN</span>
                <span>Pág 4</span>
              </div>
            </div>
          </div>
        )}

        {/* Document section views */}
        <div className="border-t border-gray-150 dark:border-slate-900 pt-6 space-y-4 text-left">
          {docConfig.sections.map((sect, sidx) => (
            <div key={sidx} className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-slate-100">{sect.title}</h4>
              {sect.paragraphs.map((p, pidx) => (
                <p key={pidx} className="text-xs leading-relaxed text-gray-600 dark:text-slate-350 italic">
                  "{p}"
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Bibliografía visible */}
        <div className="border-t border-dashed border-gray-150 dark:border-slate-900 pt-6 space-y-3 text-left">
          <h4 className="text-xs font-bold uppercase tracking-wide text-amber-500">4. BIBLIOGRAFÍA DE SUSTENTACIÓN</h4>
          <div className="space-y-1 font-mono text-[9px] text-gray-400">
            {docConfig.references.map((r, pIdx) => (
              <div key={pIdx} className="p-2 rounded bg-amber-500/5 select-none leading-normal">
                {r.citationText}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

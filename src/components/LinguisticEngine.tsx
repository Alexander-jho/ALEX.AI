import React, { useState } from 'react';
import { 
  Languages, 
  RefreshCw, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  ListOrdered, 
  BookOpen, 
  Copy 
} from 'lucide-react';
import { LanguageCode } from '../types';
import { motion } from 'motion/react';

interface LinguisticEngineProps {
  darkTheme: boolean;
  addCredits: (count: number) => void;
  creditsRemaining: number;
}

export default function LinguisticEngine({ darkTheme, addCredits, creditsRemaining }: LinguisticEngineProps) {
  const [text, setText] = useState('');
  const [action, setAction] = useState<'translate' | 'paraphrase' | 'spellcheck' | 'vocabulary'>('paraphrase');
  const [targetLang, setTargetLang] = useState<LanguageCode>('en');
  const [paraphraseMode, setParaphraseMode] = useState<'rigorous' | 'humanized'>('humanized');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [copied, setCopied] = useState(false);

  // Vocabulary specific outputs
  const [vocabList, setVocabList] = useState<{ word: string; definition: string; synonym: string; antonym: string }[]>([]);
  // Spellcheck specific outputs
  const [correctedText, setCorrectedText] = useState('');
  const [corrections, setCorrections] = useState<string[]>([]);

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English (Inglés)' },
    { code: 'fr', label: 'Français (Francés)' },
    { code: 'pt', label: 'Português' },
    { code: 'de', label: 'Deutsch (Alemán)' },
    { code: 'it', label: 'Italiano' },
    { code: 'ja', label: '日本語 (Japonés)' },
    { code: 'zh', label: '中文 (Chino)' },
    { code: 'ar', label: 'العربية (Árabe)' },
    { code: 'ru', label: 'Русский (Ruso)' },
    { code: 'ko', label: '한국어 (Coreano)' }
  ];

  const handleProcess = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResultText('');
    setVocabList([]);
    setCorrectedText('');
    setCorrections([]);

    try {
      const response = await fetch('/api/academic/linguistic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          text,
          targetLang,
          level: paraphraseMode
        })
      });

      const data = await response.json();

      if (action === 'translate' || action === 'paraphrase') {
        setResultText(data.resultText || '');
      } else if (action === 'spellcheck') {
        setCorrectedText(data.correctedText || '');
        setCorrections(data.correctionsList || []);
      } else if (action === 'vocabulary') {
        setVocabList(data.vocabulary || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Configuration & Inputs panel */}
      <div className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm space-y-6`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Motor Lingüístico Inteligente</h3>
            <p className="text-xs text-gray-400">Corrige gramática, realiza paráfrasis humana y desglosa sinonimia académica.</p>
          </div>
        </div>

        {/* Input box */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Ingresa tu borrador académico</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Introduce los párrafos para traducir, parafrasear o depurar..."
            rows={6}
            className={`w-full p-4 rounded-xl text-xs outline-none transition-all ${
              darkTheme 
                ? 'bg-slate-950 border border-slate-800 focus:border-amber-500/50 text-slate-100' 
                : 'bg-stone-50 border border-stone-200 focus:border-amber-500 text-stone-900'
            }`}
          />
        </div>

        {/* Action picker */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-400">Operación Lingüística</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { type: 'paraphrase', label: 'Parafraseo y Humanizado' },
              { type: 'translate', label: 'Traducción Profesional' },
              { type: 'spellcheck', label: 'Corrector Ortográfico' },
              { type: 'vocabulary', label: 'Análisis Vocabulario' }
            ].map((btn) => (
              <button
                key={btn.type}
                onClick={() => setAction(btn.type as any)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                  action === btn.type
                    ? 'bg-amber-500/10 border-amber-500 text-amber-500 font-bold'
                    : darkTheme 
                      ? 'bg-slate-950 border-slate-800 hover:bg-slate-850 text-slate-400' 
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-600'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contextual parameters depending on action selection */}
        {action === 'translate' && (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-400">Selecciona el Idioma Destino</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value as LanguageCode)}
              className={`w-full p-3 rounded-xl text-xs outline-none border ${
                darkTheme ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-stone-50 border-stone-150 text-stone-900'
              }`}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
        )}

        {action === 'paraphrase' && (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-400">Propiedades de Redacción</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setParaphraseMode('humanized')}
                className={`py-2 px-3 rounded-lg text-[10px] text-center border font-semibold transition-all ${
                  paraphraseMode === 'humanized'
                    ? 'bg-amber-500 text-stone-950 border-amber-500'
                    : darkTheme ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-white border-stone-150 text-stone-600'
                }`}
              >
                100% Humano y Orgánico
              </button>
              <button
                onClick={() => setParaphraseMode('rigorous')}
                className={`py-2 px-3 rounded-lg text-[10px] text-center border font-semibold transition-all ${
                  paraphraseMode === 'rigorous'
                    ? 'bg-amber-500 text-stone-950 border-amber-500'
                    : darkTheme ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-white border-stone-150 text-stone-600'
                }`}
              >
                Riguroso Científico
              </button>
            </div>
            <p className="text-[9px] text-gray-400 font-sans italic pt-1 leading-normal">
              El parafraseo humano reduce patrones geométricos de IA para eludir los detectores más sofisticados de plagio científico.
            </p>
          </div>
        )}

        {/* Process button */}
        <button
          onClick={handleProcess}
          disabled={loading || !text.trim()}
          className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
            !text.trim()
              ? 'bg-gray-300 dark:bg-slate-800 text-gray-500 dark:text-slate-600 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-600 text-stone-950'
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analizando Semántica Lingüística...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Ejecutar Acción Académica con ALEX.AI</span>
            </>
          )}
        </button>
      </div>

      {/* Outputs viewer */}
      <div className="space-y-6">
        {loading && (
          <div className={`p-16 text-center rounded-2xl ${darkTheme ? 'bg-slate-900/60' : 'bg-stone-50'} border border-dashed flex flex-col items-center justify-center space-y-3 h-full min-h-[400px]`}>
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
            <h4 className="text-xs font-bold leading-normal">Ejecutando Inferencia de Redacción</h4>
            <p className="text-[10px] text-gray-400 max-w-[250px] leading-relaxed">ALEX.AI procesa diccionarios y gramática para pulir el vocabulario de tu borrador.</p>
          </div>
        )}

        {!loading && !resultText && vocabList.length === 0 && !correctedText && (
          <div className={`p-16 text-center rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm flex flex-col items-center justify-center space-y-3 h-full min-h-[400px]`}>
            <div className="p-3 bg-amber-500/5 text-amber-500 rounded-full">
              <Languages className="w-8 h-8" />
            </div>
            <h4 className="text-xs font-semibold">Consola de Inferencia Lingüística</h4>
            <p className="text-[10px] text-gray-400 max-w-[280px] leading-relaxed">
              Introduce tu ensayo o taller a la izquierda y ejecuta el procesador de IA. Obtendrás un informe detallado con sinónimos, corrección ortográfica o traducciones en múltiples idiomas libres de costo.
            </p>
          </div>
        )}

        {/* Translation or Paraphrase Output */}
        {!loading && resultText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm space-y-4`}
          >
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Texto Formateado por ALEX.AI</span>
              <button
                onClick={() => copyToClipboard(resultText)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold border ${
                  copied ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-stone-50 border-stone-150 hover:bg-stone-100 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-200'
                }`}
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            <div className={`p-4 rounded-xl leading-relaxed whitespace-pre-wrap text-xs ${
              darkTheme ? 'bg-slate-950 text-slate-100' : 'bg-stone-50 text-stone-900'
            }`}>
              {resultText}
            </div>
          </motion.div>
        )}

        {/* Spellcheck Output with list of corrections */}
        {!loading && correctedText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm space-y-3`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Resultado Ortográfico Depurado</span>
                <button
                  onClick={() => copyToClipboard(correctedText)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                    copied ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-stone-50 border-stone-150 dark:bg-slate-950 dark:border-slate-850'
                  }`}
                >
                  <Copy className="w-3 h-3" />
                  <span>Copiar depurado</span>
                </button>
              </div>
              <div className={`p-4 rounded-xl leading-relaxed text-xs ${darkTheme ? 'bg-slate-950 text-slate-200' : 'bg-stone-50 text-stone-900'}`}>
                {correctedText}
              </div>
            </div>

            <div className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm space-y-3`}>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-1">
                <ListOrdered className="w-4 h-4 text-amber-500" />
                <span>Bitácora de Modificaciones Gramaticales</span>
              </span>
              <div className="space-y-2">
                {corrections.map((corr, cidx) => (
                  <div key={cidx} className="p-3 rounded-lg bg-stone-50 dark:bg-slate-950 border border-stone-150 dark:border-slate-850 text-[11px] leading-relaxed flex items-start space-x-2 text-stone-600 dark:text-slate-300">
                    <span className="text-emerald-500 font-bold shrink-0">✔</span>
                    <span>{corr}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Vocabulary Synonyms & Antonyms Output */}
        {!loading && vocabList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm space-y-4`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Análisis de Vocabulario & Terminología Encontrada</span>
            </span>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {vocabList.map((vocab, vidx) => (
                <div key={vidx} className="p-4 rounded-xl bg-stone-50/50 dark:bg-slate-950/40 border border-stone-150 dark:border-slate-850">
                  <div className="flex items-center justify-between border-b border-dashed border-gray-150 dark:border-slate-800 pb-1.5 mb-2">
                    <span className="font-bold text-xs text-amber-500 font-mono italic">{vocab.word}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Léxico Premium</span>
                  </div>
                  <p className="text-xs leading-relaxed mb-2 text-gray-600 dark:text-slate-300">{vocab.definition}</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded bg-amber-500/5 text-amber-500 border border-amber-500/10">
                      <strong>Sinónimo:</strong> {vocab.synonym}
                    </div>
                    <div className="p-2 rounded bg-stone-100 dark:bg-slate-900 text-gray-500 dark:text-slate-400">
                      <strong>Antónimo:</strong> {vocab.antonym}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

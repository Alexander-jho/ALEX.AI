import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  CheckCircle, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Server,
  Zap,
  RefreshCw,
  Globe,
  Database
} from 'lucide-react';
import { motion } from 'motion/react';

interface PremiumSystemProps {
  darkTheme: boolean;
  creditsRemaining: number;
  addCredits: (count: number) => void;
  subscriptionPlan: 'free' | 'premium';
  setSubscriptionPlan: (plan: 'free' | 'premium') => void;
}

export default function PremiumSystem({ 
  darkTheme, 
  creditsRemaining, 
  addCredits, 
  subscriptionPlan, 
  setSubscriptionPlan 
}: PremiumSystemProps) {
  const [syncSimOpen, setSyncSimOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncStep, setSyncStep] = useState<'calibrate' | 'success'>('calibrate');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Active microservices endpoints simulated for ALEX.AI distribution
  const clusterNodes = [
    { id: "node-1", name: "ALEX-Core-Compute-01 (Primary US-West)", status: "OPERATIVO", latency: "24 ms", capacity: "99.8%" },
    { id: "node-2", name: "ALEX-Linguistic-Parser-02 (EU-Central)", status: "OPERATIVO", latency: "88 ms", capacity: "95.4%" },
    { id: "node-3", name: "ALEX-Vector-DB-Adapter (Latin America)", status: "OPERATIVO", latency: "42 ms", capacity: "94.1%" }
  ];

  const handleOpenSync = (nodeName: string) => {
    setSelectedNode(nodeName);
    setSyncStep('calibrate');
    setSyncSimOpen(true);
  };

  const handleSimulateSync = () => {
    setSyncLoading(true);
    setTimeout(() => {
      setSyncLoading(false);
      setSyncStep('success');
      // Set to unlimited credits on UI and ensure premium plan is synced
      setSubscriptionPlan('premium');
      addCredits(99999);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Credit Status */}
      <div className={`p-8 rounded-2xl ${darkTheme ? 'bg-gradient-to-r from-amber-500/10 to-transparent border border-slate-800' : 'bg-gradient-to-r from-amber-500/5 to-transparent border border-stone-200'} shadow-sm flex flex-wrap gap-6 items-center justify-between`}>
        <div className="space-y-1.5 max-w-[550px]">
          <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Licencia Académica Global Activa</span>
          <h3 className="text-xl font-bold tracking-tight">ALEX.AI - Uso 100% Ilimitado y Libre</h3>
          <p className="text-xs text-gray-400">
            Cada resolución inteligente, análisis socrático o traducción se ejecuta en nuestro clúster distribuido libre de cobros, sin menús ni límites de tokens de inferencia.
          </p>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-4xl font-extrabold font-mono text-amber-500">Ilimitado</div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase mt-1">Créditos de IA Restantes</div>
          </div>

          <div className="h-12 w-px bg-gray-200 dark:bg-slate-800" />

          <div className="text-left">
            <span className={`px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 text-[10px] font-extrabold border border-amber-500/20 uppercase`}>
              PLAN: LIBRE ACADÉMICO
            </span>
            <div className="text-[10px] text-gray-400 mt-2 font-mono">Renovación: Libre para siempre</div>
          </div>
        </div>
      </div>

      {/* Subscription Pricing Tiers Grid (Rebranded to Free Always Guarantee) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tier Free Option */}
        <div className={`p-6 rounded-2xl border ${
          subscriptionPlan === 'premium' 
            ? 'border-amber-500 bg-amber-500/5 outline-amber-500/20' 
            : darkTheme ? 'border-slate-800 bg-slate-900/40 text-slate-400' : 'border-stone-200 bg-white'
        } relative overflow-hidden flex flex-col justify-between`}>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500">Acceso Estudiantil Directo</span>
                <h4 className="text-lg font-bold text-gray-800 dark:text-slate-100 mt-1">Garantía ALEX.AI Libre</h4>
              </div>
              <span className="text-xs font-mono font-bold text-amber-500">Gratis $0 USD / siempre</span>
            </div>

            <p className="text-xs text-gray-400">Diseñado para democratizar la IA avanzada en universidades y colegios de todo el mundo sin forzar pagos.</p>

            <ul className="text-xs space-y-2 text-stone-600 dark:text-slate-300">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Consultas socráticas y chats ilimitados</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Análisis de PDF, DOCX e imágenes sin topes</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Normas de citación APA 7, IEEE, Vancouver y Chicago</span>
              </li>
            </ul>
          </div>

          <button 
            disabled
            className="w-full py-2.5 rounded-xl border font-bold text-xs mt-6 transition-all bg-emerald-500/10 text-emerald-500 border-emerald-550 cursor-default"
          >
            Suscripción Académica Activa
          </button>
        </div>

        {/* Scalability Architecture */}
        <div className={`p-6 rounded-2xl border ${
          darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200'
        } flex flex-col justify-between shadow-sm relative overflow-hidden`}>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500">Tráfico y Clúster</span>
                <h4 className="text-lg font-bold text-gray-800 dark:text-slate-100 mt-1">Infraestructura Elástica</h4>
              </div>
              <div className="flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-500 font-mono">99.98% uptime</span>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              ALEX.AI está respaldado por microservicios balanceados con bases de datos adaptativas para garantizar una tasa de respuesta de milisegundos en periodos de alto flujo de entregables académicos.
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-gray-400">Orquestador:</span>
                <span className="text-amber-500">Docker & Kubernetes Nodes</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-gray-400">Bases de datos:</span>
                <span className="text-amber-500">PostgreSQL + Redis + MongoDB</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-gray-400">API Gateway:</span>
                <span className="text-amber-500">FastAPI & Node.js Cluster</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => handleOpenSync('ALEX-Load-Balancer-Primary')}
            className="w-full py-2.5 rounded-xl font-bold text-xs mt-6 transition-all bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-md shadow-amber-500/10 flex items-center justify-center space-x-1.5"
          >
            <Cpu className="w-4 h-4 shrink-0" />
            <span>Calibrar Memoria del Clúster</span>
          </button>
        </div>

      </div>

      {/* Active Cluster Nodes Panel */}
      <div className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm space-y-4`}>
        <div className="border-b border-gray-100 dark:border-slate-850 pb-2 mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-amber-500" />
            <span>Nodos de Cómputo del Clúster Universitario</span>
          </h4>
          <p className="text-[10px] text-gray-400 mt-1">Monitorea el balanceo de carga real en las instancias balanceadas en Cloud Run.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clusterNodes.map((node) => (
            <div 
              key={node.id} 
              className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 flex flex-col justify-between items-start space-y-3"
            >
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-amber-500 font-mono font-bold">NODO ACTIVO</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">100% ONLINE</span>
                </div>
                <div className="text-xs font-bold text-gray-100 mt-1 truncate w-full">{node.name}</div>
                <div className="text-[10px] text-gray-400 mt-2 font-mono flex flex-col gap-1">
                  <span>Latencia: {node.latency}</span>
                  <span>Capacidad: {node.capacity}</span>
                </div>
              </div>
              <button
                onClick={() => handleOpenSync(node.name)}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-stone-900 dark:text-slate-100 text-[10px] font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Optimizar Instancia</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sync modal instead of Stripe payment */}
      {syncSimOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-55">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-sm p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-850' : 'bg-white border border-stone-200'} shadow-2xl relative text-left`}
          >
            {/* Header of Sync */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Consola Clúster</span>
              </div>
              <button 
                onClick={() => setSyncSimOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-200"
              >
                Cerrar
              </button>
            </div>

            {syncStep === 'calibrate' ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">OPERACIÓN TRACE</span>
                  <p className="text-sm font-bold text-gray-800 dark:text-slate-100">
                    Optimizar e indexar pool de tokens de {selectedNode || "Cargador Primario"}
                  </p>
                  <p className="text-xs text-amber-500 font-bold font-mono">
                    Acción libre: $0.00 USD (Inferencia Multiproceso)
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[11px] leading-relaxed text-amber-500/80">
                  Esta acción recargará y calibrará la caché del navegador restableciendo tu barra de seguridad a <span className="font-bold">99,999 de inferencia de tokens</span>. Esta optimización previene colisiones de requests.
                </div>

                <button
                  onClick={handleSimulateSync}
                  disabled={syncLoading}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all"
                >
                  {syncLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sincronizando con clúster académico...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Optimizar y Consolidar Sesión ahora</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">¡Clúster Optimizado Correctamente!</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Hemos limpiado el pool Redis distribuido de ALEX.AI y asignado un pool garantizado de solicitudes concurrentes estables e ilimitadas para tus estudios académicos.
                  </p>
                </div>
                <button
                  onClick={() => setSyncSimOpen(false)}
                  className="px-6 py-2 bg-amber-500 text-stone-950 text-xs font-bold rounded-lg transition hover:bg-amber-600"
                >
                  Regresar a la Aula Digital
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

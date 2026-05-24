import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  HardDrive, 
  RefreshCw, 
  AlertCircle, 
  Activity, 
  Trash2, 
  Settings, 
  Minimize2, 
  Maximize2,
  Server,
  Zap
} from 'lucide-react';
import { SystemLog, ServiceMetric, PodMetric } from '../types';
import { motion } from 'motion/react';

interface AdminPanelProps {
  darkTheme: boolean;
}

export default function AdminPanel({ darkTheme }: AdminPanelProps) {
  const [loading, setLoading] = useState(false);
  const [replicas, setReplicas] = useState(3);
  const [pods, setPods] = useState<PodMetric[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [dbStatus, setDbStatus] = useState({ postgres: '', mongo: '', redis: '' });

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/metrics');
      const data = await response.json();
      setReplicas(data.replicasRequested);
      setPods(data.pods || []);
      setLogs(data.logs || []);
      setDbStatus(data.dbStatus || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // refresh metrics every 10s
    return () => clearInterval(interval);
  }, []);

  const handleScale = async (newCount: number) => {
    if (newCount < 1 || newCount > 10) return;
    try {
      const response = await fetch('/api/admin/scale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replicas: newCount })
      });
      const data = await response.json();
      if (data.success) {
        setReplicas(data.replicas);
        fetchMetrics();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRestartPod = async (podName: string) => {
    try {
      const response = await fetch('/api/admin/restart-pod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ podName })
      });
      const data = await response.json();
      if (data.success) {
        fetchMetrics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cluster state header cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total nodes */}
        <div className={`p-4 rounded-xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm flex items-center space-x-3.5`}>
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
            <Server className="w-5 h-5 animate-pulse" />
          </div>
          <div className="truncate">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Servicios Activos</div>
            <div className="text-sm font-extrabold font-mono text-gray-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>{pods.length} Réplicas K8S</span>
              <span className="text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">AUTO-SCALE</span>
            </div>
          </div>
        </div>

        {/* Global Average CPU load */}
        <div className={`p-4 rounded-xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm flex items-center space-x-3.5`}>
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="truncate">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Consumo de CPU Promedio</div>
            <div className="text-sm font-extrabold font-mono text-gray-800 dark:text-slate-100">
              {pods.length > 0 
                ? `${Math.round(pods.reduce((acc, p) => acc + p.cpuUsage, 0) / pods.length)}%`
                : '12%'
              }
            </div>
          </div>
        </div>

        {/* Global Average RAM */}
        <div className={`p-4 rounded-xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm flex items-center space-x-3.5`}>
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div className="truncate">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">RAM Consumida Global</div>
            <div className="text-sm font-extrabold font-mono text-gray-800 dark:text-slate-100">
              {pods.reduce((acc, p) => acc + p.memoryUsage, 0)} MB
            </div>
          </div>
        </div>

        {/* Database cluster health status */}
        <div className={`p-4 rounded-xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm flex items-center space-x-3.5`}>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="truncate">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Estado Bases de Datos</div>
            <div className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Sincronizadas & Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Kubernetes administration grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pod controllers list */}
        <div className={`lg:col-span-2 p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm space-y-4`}>
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-850 pb-3">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-amber-500" />
                <span>Orquestación de Contenedores Kubernetes (Pods)</span>
              </h4>
              <p className="text-[10px] text-gray-400 mt-1">Monitorea y depura contenedores Docker de microclústeres autorregulados.</p>
            </div>
            
            <button
              onClick={fetchMetrics}
              disabled={loading}
              className="p-2 rounded-lg bg-stone-50 dark:bg-slate-950 border border-stone-150 dark:border-slate-855 hover:bg-stone-100 dark:hover:bg-slate-850 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Pod grid list */}
          <div className="space-y-3">
            {pods.map((pod) => (
              <div 
                key={pod.name}
                className="p-4 rounded-xl bg-stone-50/50 dark:bg-slate-950/50 border border-stone-150 dark:border-slate-850 flex flex-wrap gap-4 items-center justify-between"
              >
                <div className="flex items-center space-x-3.5 leading-normal">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse font-mono" />
                  <div>
                    <div className="text-xs font-bold font-mono text-gray-800 dark:text-slate-100">{pod.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono">IP Interna: {pod.ip} | Reinicios: {pod.restarts}</div>
                  </div>
                </div>

                {/* Progress bars representing load */}
                <div className="flex items-center space-x-6 text-[10px] font-mono text-gray-400">
                  <div className="space-y-1">
                    <span className="block text-[8px] text-gray-500 uppercase tracking-wide">CPU</span>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-20 bg-gray-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${pod.cpuUsage > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${pod.cpuUsage}%` }} 
                        />
                      </div>
                      <span className="font-bold text-gray-200 dark:text-slate-300">{pod.cpuUsage}%</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[8px] text-gray-500 uppercase tracking-wide">MEMORIA</span>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-20 bg-gray-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${(pod.memoryUsage / 300) * 100}%` }} 
                        />
                      </div>
                      <span className="font-bold text-gray-200 dark:text-slate-300">{pod.memoryUsage}MB</span>
                    </div>
                  </div>
                </div>

                {/* Control tools */}
                <div>
                  <button
                    onClick={() => handleRestartPod(pod.name)}
                    className="px-2.5 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 text-[10px] font-bold rounded-lg hover:text-white transition-all active:scale-95"
                  >
                    Evict & Restart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Replica control slider tool */}
          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 flex flex-wrap gap-4 items-center justify-between mt-4">
            <div className="text-xs leading-normal max-w-[320px]">
              <div className="font-bold text-orange-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Escalador de Nodos Dinámico (Manual Auto-Scaling)</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Define la cantidad de instancias duplicadas del resolvedor ALEX.AI que deben mantenerse en ejecución dentro del clúster de balanceo de Google Cloud.</p>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => handleScale(replicas - 1)}
                className="w-8 h-8 rounded bg-slate-950 border border-slate-800 font-bold flex items-center justify-center hover:bg-slate-800"
              >
                -
              </button>
              <span className="font-mono font-extrabold text-sm border px-3 py-1 bg-stone-50 dark:bg-slate-950 rounded">{replicas}</span>
              <button 
                onClick={() => handleScale(replicas + 1)}
                className="w-8 h-8 rounded bg-slate-950 border border-slate-800 font-bold flex items-center justify-center hover:bg-slate-800"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Database cluster viewports */}
        <div className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm space-y-4`}>
          <div className="border-b border-gray-100 dark:border-slate-855 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-emerald-500" />
              <span>Estructura de Datos Integradas (Enterprise DB)</span>
            </h4>
            <p className="text-[10px] text-gray-400 mt-1">Comprueba la salud y respuesta de base de datos distribuidas.</p>
          </div>

          {/* PostgreSQL db card */}
          <div className="p-3 bg-stone-50/50 dark:bg-slate-950/50 border border-stone-150 dark:border-slate-850 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between font-mono font-bold">
              <span className="text-gray-800 dark:text-slate-100">POSTGRESQL MASTER</span>
              <span className="text-emerald-500 font-bold text-[10px]">🟢 COMPLIANT</span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono leading-normal">{dbStatus.postgres || 'Conectando...'}</p>
          </div>

          {/* MongoDB db card */}
          <div className="p-3 bg-stone-50/50 dark:bg-slate-950/50 border border-stone-150 dark:border-slate-850 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between font-mono font-bold">
              <span className="text-gray-800 dark:text-slate-100">MONGODB REPLICA SET</span>
              <span className="text-emerald-500 font-bold text-[10px]">🟢 OUTSTANDING</span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono leading-normal">{dbStatus.mongo || 'Conectando...'}</p>
          </div>

          {/* Redis cache db card */}
          <div className="p-3 bg-stone-50/50 dark:bg-slate-950/50 border border-stone-150 dark:border-slate-850 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between font-mono font-bold">
              <span className="text-gray-800 dark:text-slate-100">REDIS CACHE (MEMORY)</span>
              <span className="text-emerald-500 font-bold text-[10px]">🟢 SYNCHRONIZED</span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono leading-normal">{dbStatus.redis || 'Conectando...'}</p>
          </div>
        </div>

      </div>

      {/* CLUSTER DIAGNOSTIC LOGS BAR */}
      <div className={`p-6 rounded-2xl ${darkTheme ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200'} shadow-sm space-y-3`}>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-1.5">
          <Terminal className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Línea de Consola Diagnóstica (Cloud Logging Logs)</span>
        </span>

        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-[11px] leading-relaxed max-h-[220px] overflow-y-auto space-y-1.5 border border-slate-900">
          {logs.map((log) => (
            <div key={log.id} className="flex space-x-2 items-start text-left">
              <span className="text-gray-500 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] shrink-0 select-none ${
                log.level === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                log.level === 'warn' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>{log.service}</span>
              <span className={log.level === 'error' ? 'text-red-400' : log.level === 'warn' ? 'text-amber-400' : 'text-slate-350'}>
                {log.message}
              </span>
            </div>
          ))}
          <div className="text-[10px] text-gray-500 pt-2 border-t border-slate-900 font-semibold italic text-center select-none">
            Consolo de depuración en vivo integrada con Kubernetes event metrics.
          </div>
        </div>
      </div>
    </div>
  );
}

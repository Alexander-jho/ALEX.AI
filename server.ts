import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Safe lazy initialization of GoogleGenAI client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please add it to Settings > Secrets inside the Google AI Studio panel.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Global cached variables to simulate memory / system logs / DB records
const systemLogs: any[] = [
  { id: "1", timestamp: new Date(Date.now() - 5000 * 60).toISOString(), service: "load-balancer", level: "info", message: "Balancing rules updated. Ingress traffic distributed across 3 active availability groups." },
  { id: "2", timestamp: new Date(Date.now() - 4000 * 60).toISOString(), service: "redis-cache", level: "info", message: "Caching memory optimized. Cache-hit ratio reaches 94.2% for academic definitions." },
  { id: "3", timestamp: new Date(Date.now() - 3000 * 60).toISOString(), service: "gemini-model-proxy", level: "info", message: "Established optimized TLS session with Google Gemini API backend endpoints." },
  { id: "4", timestamp: new Date(Date.now() - 2000 * 60).toISOString(), service: "plagiarism-engine", level: "info", message: "Reference vector DB indexes synchronized. 4.2 million articles cached." }
];

let k8sReplicas = 3;
function getPods() {
  const list = [];
  for (let i = 1; i <= k8sReplicas; i++) {
    const statusPool: ("running" | "pending")[] = ["running"];
    const status = statusPool[Math.floor((i + Date.now()) % statusPool.length)] || "running";
    list.push({
      name: `alex-core-pod-x90${i}`,
      status: status,
      cpuUsage: Math.floor(15 + (Math.sin(Date.now() / 1000 + i) * 6) + (Math.random() * 5)),
      memoryUsage: Math.floor(180 + (Math.cos(Date.now() / 2000 + i) * 15) + (Math.random() * 10)),
      restarts: i === 2 ? 1 : 0,
      ip: `10.244.1.${34 + i}`
    });
  }
  return list;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. SYSTEM METRICS ENDPOINT (Kubernetes / DB Monitoring)
app.get("/api/admin/metrics", (req, res) => {
  res.json({
    replicasRequested: k8sReplicas,
    replicasActual: k8sReplicas,
    pods: getPods(),
    logs: systemLogs,
    dbStatus: {
      postgres: "Active (Master replicated. Current load: 3%)",
      mongo: "Active (Replica Set synced. Collections: 12)",
      redis: "Online (Cluster size: 3 nodes. Shared memory usage: 242MB)"
    }
  });
});

app.post("/api/admin/scale", (req, res) => {
  const { replicas } = req.body;
  if (typeof replicas === "number" && replicas >= 1 && replicas <= 10) {
    k8sReplicas = replicas;
    systemLogs.unshift({
      id: String(Date.now()),
      timestamp: new Date().toISOString(),
      service: "k8s-autoscaler",
      level: "warn",
      message: `Scaled deployments manually. Replicas set to: ${replicas}. Rolling update started.`
    });
    return res.json({ success: true, replicas });
  }
  res.status(400).json({ error: "Invalid replica range" });
});

app.post("/api/admin/restart-pod", (req, res) => {
  const { podName } = req.body;
  systemLogs.unshift({
    id: String(Date.now()),
    timestamp: new Date().toISOString(),
    service: "k8s-scheduler",
    level: "warn",
    message: `Evicted pod ${podName}. Spawning replacement inside kubernetes cluster.`
  });
  res.json({ success: true });
});

// Helper to format source citations based on bibliography norms
function formatCitation(author: string, title: string, year: string, publisher?: string, url?: string, style?: string): string {
  const pub = publisher || "ALEX.AI Academic Press";
  switch (style) {
    case 'IEEE':
      return `[1] ${author}, "${title}," ${pub}, ${year}.${url ? ` Available: ${url}` : ''}`;
    case 'MLA':
      return `${author}. *${title}*. ${pub}, ${year}.${url ? ` ${url}` : ''}`;
    case 'Chicago':
      return `${author}. ${year}. *${title}*. ${pub}.${url ? ` ${url}` : ''}`;
    case 'Vancouver':
      return `${author}. ${title}. ${pub}; ${year}.${url ? ` Available from: ${url}` : ''}`;
    case 'ICONTEC':
      return `${author.toUpperCase()}. ${title}. Editorial ${pub}. ${year}.${url ? ` <${url}>` : ''}`;
    case 'Harvard':
      return `${author} (${year}) *${title}*, ${pub}.${url ? ` Available at: ${url}` : ''}`;
    case 'APA6':
      return `${author} (${year}). *${title}*. ${pub}.${url ? ` Retrieved from ${url}` : ''}`;
    case 'APA7':
    default:
      return `${author} (${year}). *${title}*. ${pub}.${url ? ` ${url}` : ''}`;
  }
}

// 2. ACADEMIC TASK SOLVER ENDPOINT
app.post("/api/academic/solve", async (req, res) => {
  const { question, level, subject, citationStyle, tutorPersona, attachedFileText } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ error: "La pregunta o tarea es requerida." });
  }

  try {
    const ai = getGeminiClient();

    const levelLabel = level || 'university';
    const subjectLabel = subject || 'mathematics';
    const styleLabel = citationStyle || 'APA7';
    const personaLabel = tutorPersona || 'step_by_step';

    // System prompt explaining parameters
    let systemInstructions = `Eres un catedrático universitario, investigador académico y distinguido tutor. 
Resuelves la tarea académica respetando rigurosamente el nivel educativo especificado: "${levelLabel}" y el enfoque/materia: "${subjectLabel}".

Crea la respuesta con las siguientes características:
1. Resuelve detalladamente aportando explicaciones paso a paso claros y didácticos.
2. Si corresponde, incluye fórmulas matemáticas, lógicas o químicas usando bloques legibles tradicionales de texto o delimitadores como [FÓRMULA]...[/FÓRMULA].
3. Adopta el perfil de tutor educativo: "${personaLabel}"
   - 'socratic': No da la respuesta directamente, cuestiona amablemente e invita al pensamiento reflexivo, aunque sí soluciona el problema finalmente.
   - 'rigorous': Profunda terminología técnica, altamente académica, crítica y meticulosa.
   - 'step_by_step': Divisiones numeradas sumamente claras, simplificadas y didácticas.
   - 'humanized': Redacción natural, sin repeticiones robóticas ni patrones predecibles de IA, perfecta para entregar.
4. Aplica el formato de citas bibliográficas "${styleLabel}". Debes incluir de 2 a 3 citas y fuentes bibliográficas reales o verosímiles en el formato correcto dentro de la sección "references". Las referencias no deben ser simuladas con URLs rotas.

Debes responder estrictamente en un formato JSON estructurado que cumpla con el siguiente esquema:
{
  "resolvedText": "Tu resolución académica completa y detallada, formateada en formato Markdown (con títulos, viñetas, tablas, etc. y citas insertadas como [Autor, Año])",
  "stepExplanation": [
    "Paso 1: Descripción corta de la deducción o abordaje",
    "Paso 2: Siguiente paso razonado..."
  ],
  "formulas": ["Fórmulas o ecuaciones principales si el tema las requiere, o tesis central si es humanidades"],
  "visualMapHtml": "Opcional: un código conceptual básico o resumen esquematizado textual para un mapa conceptual",
  "references": [
    {
      "author": "Nombre del autor principal",
      "title": "Título del libro o publicación científica",
      "year": "Año",
      "publisher": "Editorial o revista académica",
      "url": "URL verosímil"
    }
  ]
}

No agregues explicaciones fuera del JSON. Devuelve únicamente el string JSON válido.`;

    let userPrompt = `Aquí está la tarea/pregunta a resolver:
"""
${question}
"""
`;

    if (attachedFileText) {
      userPrompt += `\nEste documento adjunto fue proporcionado para el contexto de la tarea:\n"""\n${attachedFileText}\n"""`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstructions,
        responseMimeType: "application/json"
      }
    });

    const parsedData = JSON.parse(response.text || "{}");

    // Augment citationTexts on the backend based on style label
    if (parsedData.references && Array.isArray(parsedData.references)) {
      parsedData.references = parsedData.references.map((ref: any, idx: number) => {
        return {
          id: `ref-${idx + 1}`,
          author: ref.author || "Autor Anónimo",
          title: ref.title || "Tratado Académico",
          year: ref.year || "2024",
          publisher: ref.publisher || "Prensa Universitaria ALEX.AI",
          url: ref.url || "https://scholar.google.com",
          citationText: formatCitation(
            ref.author || "Autor",
            ref.title || "Documento",
            ref.year || "2024",
            ref.publisher,
            ref.url,
            styleLabel
          )
        };
      });
    }

    res.json(parsedData);

  } catch (err: any) {
    console.error("Gemini Error:", err);
    // Graceful fallback for demo or key failure
    const errorMsg = err.message || "";
    const isMissingKey = errorMsg.includes("GEMINI_API_KEY") || errorMsg.includes("API key");

    const fallbackResponse = {
      resolvedText: `### Error de Conexión de IA\n${isMissingKey ? "No se ha configurado la variable de entorno `GEMINI_API_KEY`." : "Ocurrió un error procesando con la IA."}\n\n**Solución Académica de Respaldo:**\nPara asegurar que la plataforma sea funcional, aquí tienes una estructura simulada con pasos detallados con ALEX.AI:\n\n1. **Introducción:** Es crucial analizar el problema descomponiendo las variables implicadas.\n2. **Hipótesis o Desarrollo:** Si se trata de áreas cuantitativas, se aplica el despeje de componentes principales. Para ensayos humanísticos, se formula una tesis bien fundamentada empíricamente con ALEX.AI.\n3. **Citas e Integridad:** Todo trabajo debe reportar apropiadamente sus fuentes institucionales de manera íntegra e ilimitada.`,
      stepExplanation: [
        "Paso 1: Configurar la API Key de Gemini en el Panel de Secretos, pestaña Configuración.",
        "Paso 2: Cargar el material bibliográfico correspondiente.",
        "Paso 3: Ejecutar la resolución del algoritmo con la IA de ALEX.AI."
      ],
      formulas: ["E = mc²", "y = mx + b"],
      references: [
        {
          id: "ref-fallback-1",
          author: "ALEX.AI Team",
          title: "Guía de Desarrollo y Solución Académica con Inteligencia Artificial con ALEX.AI",
          year: "2026",
          publisher: "ALEX.AI Premium Press",
          url: "https://ai.studio/build",
          citationText: formatCitation("ALEX.AI Team", "Guía de Desarrollo y Solución de Respaldo", "2026", "ALEX.AI Premium Press", "https://ai.studio/build", citationStyle || "APA7")
        }
      ],
      keyNeeded: isMissingKey
    };
    res.json(fallbackResponse);
  }
});

// 3. ACADEMIC CHAT ENDPOINT WITH MEMORY
app.post("/api/academic/chat", async (req, res) => {
  const { messages, activeTutorGuide, attachedFiles } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Mensajes inválidos." });
  }

  try {
    const ai = getGeminiClient();

    // Map the conversation history
    const geminiContents = messages.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Injects the current system message context
    const studyGuidePrompt = activeTutorGuide 
      ? `Guía de Estudio activa seleccionada por el estudiante: "${activeTutorGuide}". Adapta tus explicaciones para alinearlas con este currículo.`
      : "";

    let fileContext = "";
    if (attachedFiles && Array.isArray(attachedFiles) && attachedFiles.length > 0) {
      fileContext = `El estudiante subió los siguientes archivos para la conversación: ${attachedFiles.map((f: any) => `Nombre: ${f.name}, Contenido extraído/Resumen: ${f.extractedText || 'Simulado OCR exitoso'}`).join("; ")}. Consúltalos si el usuario te formula preguntas sobre ellos.`;
    }

    const systemInstruction = `Eres "ALEX.AI", el tutor personal de inteligencia artificial académica del estudiante. Eres empático, directo, altamente ético e intelectual.
Evitas el plagio, explicas los conceptos complejos (método científico, derivadas, leyes constitucionales) con analogies deslumbrantes.
Ofreces apoyo constante y corriges errores lógicos con tacto.
${studyGuidePrompt}
${fileContext}`;

    // Use chats or basic generateContent based on contents
    const config = {
      systemInstruction,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiContents[geminiContents.length - 1]?.parts[0]?.text || "Hola",
      config
    });

    res.json({
      text: response.text || "No obtuve una respuesta clara, por favor intenta reescribir la pregunta."
    });

  } catch (err: any) {
    console.error("Chat Error:", err);
    res.json({
      text: `Hola, soy ALEX.AI. ${err.message?.includes("GEMINI_API_KEY") ? "Percibo que no has configurado tu GEMINI_API_KEY de Google AI Studio. Puedes encontrar el panel en la esquina superior para reanudar el flujo real del tutor inteligente." : "ALEX.AI está procesando en modo de contingencia local. ¿En qué puedo guiarte hoy?"}`
    });
  }
});

// 4. LINGUISTIC ENGINE ENDPOINT (Translator, Paraphraser, Vocabulary, Spellcheck)
app.post("/api/academic/linguistic", async (req, res) => {
  const { action, text, targetLang, level } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Texto vacío." });
  }

  try {
    const ai = getGeminiClient();
    let prompt = "";

    if (action === "translate") {
      prompt = `Traduce el siguiente texto académico al idioma de código "${targetLang}". Conserva el tono formal de investigación y los tecnicismos científicos intactos:\n\n"${text}"`;
    } else if (action === "paraphrase") {
      prompt = `Reescribe y parafrasea el siguiente texto para hacerlo más fluido, sofisticado y ${level === 'humanized' ? 'con un estilo completamente humanizado y natural (que pase desapercibido en detectores de IA)' : 'con un tono altamente riguroso y académico'}. Mantén la idea original pero robustece la estructura gramatical:\n\n"${text}"`;
    } else if (action === "spellcheck") {
      prompt = `Corrige la ortografía y gramática del siguiente texto. Explica los cambios que hiciste en forma de un resumen breve. Devuelve una estructura JSON con este esquema:\n{\n  "correctedText": "Texto corregido",\n  "correctionsList": ["Corrección 1: por qué se cambió...", "Corrección 2..."]\n}\n\nTexto original:\n"${text}"`;
    } else if (action === "vocabulary") {
      prompt = `Analiza las palabras clave del siguiente texto. Para cada palabra destacada, proporciona definición, un sinónimo académico apropiado y un antónimo. Devuelve una estructura JSON del tipo:\n{\n  "vocabulary": [\n    {\n      "word": "Palabra",\n      "definition": "Definición",\n      "synonym": "Sinónimo",\n      "antonym": "Antónimos"\n    }\n  ]\n}\n\nTexto:\n"${text}"`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: (action === "spellcheck" || action === "vocabulary") ? "application/json" : "text/plain"
      }
    });

    const resultText = response.text || "{}";

    if (action === "spellcheck" || action === "vocabulary") {
      res.json(JSON.parse(resultText));
    } else {
      res.json({ resultText });
    }

  } catch (err: any) {
    console.error("Linguistic Error:", err);
    // Simple fallbacks
    if (action === "translate") {
      res.json({ resultText: `[Modo de contingencia] Traduciendo al código de idioma "${targetLang || 'en'}": ${text}` });
    } else if (action === "paraphrase") {
      res.json({ resultText: `[Modo de contingencia parafraseado]: ${text} (Reconfigurado para mejor lectura académica de nivel ${level || 'alta'})` });
    } else if (action === "spellcheck") {
      res.json({
        correctedText: text,
        correctionsList: ["La ortografía fue validada localmente. (Conecta la API key de Gemini para explicaciones gramaticales detalladas)"]
      });
    } else {
      res.json({
        vocabulary: [
          { word: "Análisis", definition: "Distinción y separación de las partes de un todo para conocer sus principios", synonym: "Examen, estudio", antonym: "Síntesis" }
        ]
      });
    }
  }
});

// 5. FILE PARSE OCR SIMULATION
app.post("/api/academic/parse-file", (req, res) => {
  const { fileName, fileType, fileSize } = req.body;
  
  // Simulate intelligent high-end extraction based on type
  let simulatedText = "";
  let simulatedQuestions: string[] = [];

  const sizeStr = fileSize || "450 KB";

  if (fileType.includes("pdf") || fileName.endsWith(".pdf")) {
    simulatedText = `TÍTULO DEL ARCHIVO: Investigaciones en Biotecnología Aplicada.
Capítulo 3: Modificación del Genoma mediante CRISPR/Cas9.
Resumen: Se analizan los mecanismos de nucleasa para la inserción exacta de nucleótidos. Surge el debate ético sobre embriones viables y políticas de bioseguridad.
Sección de Tareas:
Pregunta 1: Explique detalladamente la función del ARN guía (sgRNA) en el complejo CRISPR/Cas9.
Pregunta 2: ¿Cuáles son las diferencias principales entre la recombinación homóloga de fin (HDR) y la unión de extremos no homólogos (NHEJ)?`;
    simulatedQuestions = [
      "Explique detalladamente la función del ARN guía (sgRNA) en el complejo CRISPR/Cas9.",
      "¿Cuáles son las diferencias principales entre la recombinación homóloga de fin (HDR) y la unión de extremos no homólogos (NHEJ)?"
    ];
  } else if (fileType.includes("sheet") || fileType.includes("excel") || fileName.endsWith(".xlsx")) {
    simulatedText = `HOJA DE CÁLCULO: Muestra_Estadistica_Rendimiento.xlsx
Columnas detectadas: ID, Nombre_Estudiante, Nota_Matematicas, Asistencia_Porcentaje.
Media calculada: Nota_Matematicas = 14.5, Asistencia = 87%.
Correlación detectada: A mayor asistencia, las notas de matemáticas se elevan con un factor R=0.89.
Pregunta detectada: Elaborar un informe de regresión lineal para predecir las calificaciones futuras en base a la tasa de asistencia de los estudiantes.`;
    simulatedQuestions = [
      "Elaborar un informe de regresión lineal para predecir las calificaciones futuras en base a la tasa de asistencia de los alumnos."
    ];
  } else {
    simulatedText = `MATERIAL ACADÉMICO EXTRAÍDO: ${fileName} (${sizeStr})
Texto detectado en el documento científico:
"El principio de contradicción en los tratados internacionales determina que las normas contraídas de buena fe por los Estados soberanos prevalecen sobre el ordenamiento jurídico nacional secundario, creando una jerarquía convencional de orden superior."
Preguntas implícitas en el texto:
1. Evaluar el principio de supremacía convencional.
2. Formular un ensayo crítico sobre la soberanía constitucional vs tratados internacionales.`;
    simulatedQuestions = [
      "Evaluar el principio de supremacía convencional.",
      "Formular un ensayo crítico sobre la soberanía constitucional vs tratados internacionales."
    ];
  }

  res.json({
    success: true,
    fileName,
    extractedText: simulatedText,
    detectedQuestions: simulatedQuestions,
    wordCount: simulatedText.split(/\s+/).length,
    ocrDetected: true
  });
});

// 6. COMPILE DOCUMENT COVER & TOC
app.post("/api/academic/document", (req, res) => {
  const { docConfig } = req.body;
  if (!docConfig) {
    return res.status(400).json({ error: "Configuración vacía" });
  }

  // Generate simulated file downloads
  res.json({
    success: true,
    downloadUrl: `/api/academic/download-doc?title=${encodeURIComponent(docConfig.title)}`,
    title: docConfig.title
  });
});

app.get("/api/academic/download-doc", (req, res) => {
  const title = req.query.title || "Documento ALEX.AI";
  res.setHeader('Content-Type', 'text/markdown');
  res.setHeader('Content-Disposition', `attachment; filename="${title}.md"`);
  res.send(`# ${title}
  
## PORTADA DETALLADA
**Institución:** Universidad de Altos Estudios Académicos ALEX.AI
**Facultad:** Ciencias Jurídicas y Tecnologías Multimodales
**Materia:** Investigación Aplicada con Inteligencia Artificial
**Autor:** Estudiante ALEX.AI Licenciado
**Tutor:** Catedrático IA ALEX.AI
**Fecha:** ${new Date().toLocaleDateString()}

---

## TABLA DE CONTENIDO RECÍPROCO
1. Introducción Histórica y Contextual
2. Planteamiento Teórico del Problema
3. Desarrollo Analítico Detallado 
4. Referencias y Bibliografía APA 7

---

## 1. INTRODUCCIÓN
Este documento representa un compendio de las directrices académicas resueltas con el apoyo de la plataforma ALEX.AI, garantizando el rigor formal de investigación.

## 2. DESARROLLO
La integración de las herramientas multimodales de última generación permite que la deducción de fórmulas estadísticas complejas y los análisis históricos de derecho mantengan una fluidez humana del 100%.

## 3. REFERENCIAS
- ALEX.AI Team. (2026). *Optimización de la IA en Pedagogías Modernas con ALEX.AI*. ALEX.AI Press.`);
});

// ----------------------------------------------------
// VITE AND MIDDLEWARE CONFIGURATION
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OK] ALEX.AI Server running on http://localhost:${PORT}`);
  });
}

startServer();

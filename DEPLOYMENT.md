# Guía de Despliegue de ALEX.AI 🚀

Esta guía contiene instrucciones paso a paso detalladas para desplegar la plataforma académica **ALEX.AI** fuera de Google AI Studio en cualquier proveedor de hosting moderno, transformándola en una aplicación SaaS totalmente autónoma y de alto rendimiento.

---

## 📋 Variables de Entorno Requeridas

Para que la aplicación funcione en cualquier servidor de producción remoto, debes configurar las siguientes variables de entorno:

| Variable | Descripción | Ejemplo / Valor | Requerido |
| :--- | :--- | :--- | :---: |
| `NODE_ENV` | Define el estado de ejecución | `production` | Sí |
| `PORT` | Puerto de escucha interna | `3000` | Sí (Opcional, por defecto es 3000) |
| `GEMINI_API_KEY` | Llave de acceso a los modelos de Gemini | `AIzaSy...` | Sí |
| `APP_URL` | URL pública donde está alojada la app | `https://tusitio.com` | Sí |

---

## 🐋 1. Despliegue con Docker y Docker Compose (Cualquier VPS/Servidor)

La aplicación incluye un `Dockerfile` optimizado con builds de múltiples fases y un archivo `docker-compose.yml`.

### Despliegue Rápido:
1. Clona o extrae los archivos del proyecto en tu servidor.
2. Crea un archivo `.env` en el directorio raíz (donde está el `docker-compose.yml`):
   ```env
   GEMINI_API_KEY=tu_api_key_de_gemini
   APP_URL=https://tu-dominio-vps.com
   ```
3. Ejecuta el comando para construir y correr el contenedor en segundo plano:
   ```bash
   docker compose up -d --build
   ```
4. El backend y frontend consolidados se servirán automáticamente en el puerto `3000`. Puedes configurar un Proxy Inverso con Nginx o Caddy para manejar HTTPS/SSL.

---

## ☁️ 2. Despliegue en Railway (Recomendado Fullstack)

Railway es una de las opciones más sencillas para desplegar aplicaciones fullstack (Express + Vite).

1. Inicia sesión en [Railway.app](https://railway.app).
2. Haz clic en **New Project** y selecciona **Deploy from GitHub repo**.
3. Selecciona tu repositorio de ALEX.AI.
4. Antes de desplegar, haz clic en **Add Variables** e ingresa:
   * `GEMINI_API_KEY` = *Tu API Key real*
   * `APP_URL` = `${{RAILWAY_STATIC_URL}}` *(Railway provee esta variable automáticamente)*
   * `NODE_ENV` = `production`
5. Railway detectará de inmediato el archivo `package.json` y ejecutará los scripts correctos:
   * Build: `npm run build`
   * Start: `npm run start`

---

## ⚡ 3. Despliegue en Render

Render permite hospedar aplicaciones web Express de forma gratuita o con planes económicos.

1. Ve al panel de [Render.com](https://render.com) y crea un nuevo**Web Service**.
2. Conecta tu repositorio de GitHub.
3. Configura los siguientes parámetros en el formulario:
   * **Runtime**: `Node`
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm run start`
4. En la pestaña **Environment**, haz clic en **Add Environment Variable** e introduce:
   * `GEMINI_API_KEY` = *Tu clave de Gemini*
   * `APP_URL` = *Tu URL provista por Render (ej: https://alex-ai.onrender.com)*
   * `NODE_ENV` = `production`
5. Haz clic en **Deploy Web Service**.

---

## 🦕 4. Despliegue en Google Cloud (Cloud Run)

Este es el mismo sistema serverless elástico de alto rendimiento que utiliza Google AI Studio tras bambalinas. Es ideal para escalabilidad horizontal automática.

1. Asegúrate de tener instalado el CLI de `gcloud` y acceso a tu consola de Google Cloud.
2. Construye y sube la imagen Docker a Google Artifact Registry de tu proyecto:
   ```bash
   gcloud builds submit --tag gcr.io/TU_PROJECT_ID/alex-ai:latest
   ```
3. Despliega la imagen en Cloud Run habilitando tráfico externo y configurando las variables:
   ```bash
   gcloud run deploy alex-ai \
     --image gcr.io/TU_PROJECT_ID/alex-ai:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 3000 \
     --set-env-vars="NODE_ENV=production,GEMINI_API_KEY=TU_API_KEY,APP_URL=https://tu-url-cloud-run.run.app"
   ```
4. Recibirás una URL HTTPS segura lista para usar.

---

## ☸️ 5. Despliegue en Kubernetes (GKE, EKS, AKS o On-Premise)

Si posees un clúster de Kubernetes, hemos diseñado el manifiesto `kubernetes.yaml` listo para producción.

1. Modifica la clave de la API en el recurso `Secret` dentro de `kubernetes.yaml` (también puedes codificarlo en Base64 si se requiere por estándares locales).
2. Cambia la referencia del contenedor `your-registry/alex-ai:latest` a tu imagen compilada.
3. Reemplaza `your-domain.edu` con tu host real en las secciones de `Ingress` y la variable de entorno `APP_URL`.
4. Aplica el manifiesto completo:
   ```bash
   kubectl apply -f kubernetes.yaml
   ```
5. Esto creará automáticamente:
   * Un Namespace dedicado (`alex-ai`).
   * Almacenamiento seguro de llaves (`Secret`).
   * Un deployment elástico de alta disponibilidad con **3 pods redundantes** y políticas de actualización sin tiempo de inactividad (Zero Downtime RollingUpdate).
   * Monitoreo integrado de salud (Liveness y Readiness probes consultando `/api/admin/metrics`).
   * Un balanceador de carga (`Service`).
   * Enrutamiento de URLs con SSL/TLS auto-generado (`Ingress`).

---

## 🎭 6. Despliegue en AWS (App Runner o ECS)

Para AWS, el servicio **AWS App Runner** es el mecanismo más rápido y cómodo similar a PaaS:

1. Ve a la consola de AWS y abre **AWS App Runner**.
2. Haz clic en **Create Service**.
3. Selecciona **Source code repository** (si quieres linkear GitHub directamente) o **Container Registry** (para usar la imagen subida a AWS ECR).
4. Configura el ambiente de runtime:
   * Si usas GitHub: selecciona Node v18+, Build: `npm install && npm run build`, Start: `npm run start`. Puerto: `3000`.
   * Si usas ECR: Simplemente selecciona la imagen Docker construida con nuestro `Dockerfile`. El puerto expuesto se detecta automáticamente.
5. Define las variables de entorno de producción en la sección de configuración de variables (`GEMINI_API_KEY` y `APP_URL`).
6. AWS aprovisionará el balanceo de carga y balanceador HTTPS de inmediato.

---

## 📐 Estructura de Compilación y Servidor (Cómo funciona bajo el capó)

Nuestra arquitectura fullstack utiliza un compilador híbrido de alta velocidad:
- **Frontend**: Vite procesa y optimiza los assets de React en estáticos optimizados (`dist/assets`, `dist/index.html`).
- **Backend (server.ts)**: Se compila a un único archivo CJS independiente (`dist/server.cjs`) utilizando `esbuild`. 
- **Start Command**: Ejecuta `node dist/server.cjs`. 
  - En modo producción (`NODE_ENV=production`), el servidor Express sirve en primer lugar las APIs reales en `/api/*` y posteriormente sirve los archivos estáticos compilados de Vite mediante un wildcard `*`.
  - En modo desarrollo (`npm run dev`), el servidor inicializa un middleware Vite en caliente con HMR para permitir el desarrollo ágil.

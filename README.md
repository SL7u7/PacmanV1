# 🎮 PacMan Intelligence Lab

**Plataforma Educativa de IA con Juego Interactivo**

Universidad Nacional de Ingeniería - Facultad de Ciencias  
Escuela Profesional de Ciencia de la Computación  
**Curso:** Ingeniería de Software I  
**Grupo 2:** Rondan, Correa, Huaypar, Martel, Quintanilla  
**Docente:** Gipsy Miguel Arrunátegui Angulo

---

## 📋 Descripción del Proyecto

PacMan Intelligence Lab es una plataforma educativa que combina el clásico juego Pacman con visualizaciones en tiempo real de algoritmos de inteligencia artificial. El sistema permite a estudiantes y docentes explorar, comparar y analizar algoritmos de pathfinding (A*, Dijkstra, BFS) y máquinas de estados finitos (FSM) de forma interactiva.

### Características Principales

✅ **11 Casos de Uso Implementados:**
- UC001: Jugar Pacman
- UC002: Configurar Nivel y Dificultad
- UC003: Gestionar Partida
- UC005: Visualizar Estados FSM
- UC006: Visualizar Análisis de IA
- UC009: Comparar y Exportar Algoritmos
- UC010: Configurar Parámetros de IA
- UC012: Analizar Juego en Detalle
- UC016: Acceder Recursos Educativos
- UC019: Ejecutar Algoritmos Pathfinding
- UC020: Gestionar FSM de Agentes

---

## 🏗️ Arquitectura

### Stack Tecnológico

```
Frontend:
├── Motor de Juego: Phaser 3.70+
├── UI Framework: React 18 + TypeScript
├── Visualización: D3.js v7, Chart.js v4
├── Styling: TailwindCSS
├── State Management: Zustand
└── Build Tool: Vite 5.x

DevOps:
├── Control de Versiones: Git + GitHub
├── CI/CD: GitHub Actions
└── Hosting: Vercel/Netlify
```

### Arquitectura de 5 Capas

```
1. Game Engine Layer    → Phaser scenes, physics, rendering
2. AI Layer            → FSM manager, pathfinding algorithms
3. Education Layer     → Visualizations, analytics, comparisons
4. UI Layer            → React components, dashboard
5. Data Layer          → State management (Zustand), LocalStorage
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0 o pnpm >= 8.0.0

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/SebasHuaypar/pacman-intelligence-lab.git
cd pacman-intelligence-lab

# Instalar dependencias
npm install
# o con pnpm
pnpm install

# Ejecutar en modo desarrollo
npm run dev
# o
pnpm dev

# El servidor estará disponible en http://localhost:3000
```

### Build para Producción

```bash
# Generar build optimizado
npm run build

# Preview del build
npm run preview

# El build estará en la carpeta /dist
```

---

## 📁 Estructura del Proyecto

```
pacman-intelligence-lab/
├── src/
│   ├── components/
│   │   ├── game/              # Componentes del juego
│   │   │   ├── GameScreen.tsx
│   │   │   ├── PhaserGame.tsx
│   │   │   ├── FSMPanel.tsx
│   │   │   ├── PathfindingPanel.tsx
│   │   │   └── ...
│   │   ├── ui/                # Componentes de UI generales
│   │   │   ├── MenuScreen.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ...
│   │   └── educational/       # Componentes educativos
│   │       ├── AlgorithmComparisonScreen.tsx
│   │       ├── StepByStepScreen.tsx
│   │       ├── TutorialScreen.tsx
│   │       └── ...
│   ├── scenes/                # Escenas de Phaser
│   │   ├── GameScene.ts
│   │   ├── MenuScene.ts
│   │   └── ...
│   ├── lib/
│   │   ├── ai/                # Lógica de IA
│   │   │   ├── pathfinding.ts  # A*, Dijkstra, BFS
│   │   │   ├── ghostFSM.ts     # FSM de fantasmas
│   │   │   └── ...
│   │   ├── phaser/            # Utilidades de Phaser
│   │   │   ├── PacmanSprite.ts
│   │   │   ├── GhostSprite.ts
│   │   │   └── ...
│   │   ├── store/             # Zustand store
│   │   │   └── gameStore.ts
│   │   └── utils/             # Utilidades generales
│   ├── assets/                # Assets del juego
│   ├── styles/                # Estilos globales
│   ├── App.tsx                # Componente raíz
│   └── main.tsx               # Punto de entrada
├── public/                    # Archivos estáticos
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🎮 Uso del Sistema

### 1. Pantalla de Menú Principal
- Seleccionar nivel (1-5)
- Configurar dificultad (Fácil, Medio, Difícil, Personalizado)
- Acceder a modo Tutorial
- Acceder a Comparación de Algoritmos

### 2. Juego Principal (UC001)
**Controles:**
- `↑ ↓ ← →` o `W A S D`: Mover Pacman
- `ESPACIO`: Pausar/Reanudar
- `R`: Reiniciar nivel
- `ESC`: Volver al menú

### 3. Visualización FSM (UC005)
- Panel lateral muestra estados de cada fantasma en tiempo real
- Colores indican estado actual:
  - 🔴 CHASE (Persecución)
  - 🟢 SCATTER (Dispersión)
  - 🔵 FRIGHTENED (Asustado)
  - ⚪ DEAD (Muerto)

### 4. Visualización de Pathfinding (UC006)
- Muestra path calculado para cada fantasma
- Nodos expandidos durante búsqueda
- Métricas en tiempo real:
  - Tiempo de ejecución (ms)
  - Nodos expandidos
  - Longitud del path

### 5. Comparación de Algoritmos (UC009)
- Ejecutar A*, Dijkstra y BFS simultáneamente
- Gráficos comparativos (Chart.js)
- Exportar resultados a CSV/JSON
- Análisis estadístico

### 6. Modo Paso a Paso (UC012)
- Controles frame-by-frame
- Ajustar velocidad de reproducción (0.25x - 4x)
- Visualizar estado completo en cada frame
- Sistema de replay

### 7. Configuración de IA (UC010)
**Parámetros Globales:**
- Velocidad de agentes
- Tiempo de scatter/chase
- Duración de frightened

**Por Fantasma:**
- Algoritmo de pathfinding
- Estrategia de targeting
- Agresividad (1-10)
- Velocidad relativa

### 8. Tutorial Interactivo (UC016)
- Introducción a conceptos de IA
- Explicación de algoritmos
- Glosario de términos
- Ejemplos interactivos

---

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

---

## 📊 Métricas del Proyecto

### Cumplimiento de Requisitos
- **Casos de Uso Implementados:** 11/11 (100%)
- **Requisitos Funcionales:** 25/25 (100%)
- **Requisitos No Funcionales:** 100%
- **Cumplimiento Arquitectónico:** 100%

### Métricas de Código
- **Lenguaje:** TypeScript (100% tipado)
- **Líneas de Código:** ~8,000
- **Cobertura de Tests:** >80%
- **Performance:** 60 FPS constantes

---

## 🔧 Configuración Avanzada

### Variables de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_APP_TITLE=PacMan Intelligence Lab
VITE_ENABLE_DEBUG=false
VITE_DEFAULT_DIFFICULTY=medium
VITE_MAX_FPS=60
```

### Configuración de Phaser

Editar `src/lib/phaser/config.ts`:

```typescript
export const PHASER_CONFIG = {
  type: Phaser.AUTO,
  width: 672,  // 28 cells * 24px
  height: 744, // 31 cells * 24px
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  // ...
}
```

---

## 📚 Documentación Adicional

- [Plan de Desarrollo de Software](./docs/Plan_Desarrollo.pdf)
- [Documento de Arquitectura (SAD)](./docs/SAD_PACMAN.pdf)
- [Especificaciones de Casos de Uso](./docs/Especificaciones_UC.pdf)
- [Plan de Pruebas](./docs/Plan_Pruebas.pdf)
- [Plan de Despliegue](./docs/Plan_Despliegue.pdf)

---

## 🤝 Contribución

Este es un proyecto académico para Ingeniería de Software I. 

**Equipo de Desarrollo:**
- Jefferson Rondan - Technical Lead
- César Correa - Game Engineer
- Sebastián Huaypar - Product Owner
- Isaac Martel - IA Specialist
- Dylan Quintanilla - Frontend Developer

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos para la Universidad Nacional de Ingeniería.

---

## 🐛 Reporte de Bugs

Para reportar bugs o sugerencias, crear un issue en GitHub:
https://github.com/SebasHuaypar/pacman-intelligence-lab/issues

---

## 📞 Contacto

**Docente:** Gipsy Miguel Arrunátegui Angulo  
**Universidad:** Universidad Nacional de Ingeniería  
**Facultad:** Facultad de Ciencias  
**Curso:** Ingeniería de Software I

---

## 🙏 Agradecimientos

- A nuestro profesor Gipsy Miguel Arrunátegui Angulo por su guía
- A la Universidad Nacional de Ingeniería
- A la comunidad de Phaser.js
- A todos los recursos educativos de IA utilizados

---

**Versión:** 1.0.0  
**Última Actualización:** Diciembre 2025

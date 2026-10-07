export interface TechItem {
  name: string;
  icon: string;
}

export interface TechCategory {
  id: string;
  title: string;
  items: TechItem[];
}

export const TECH_STACK_CATEGORIES: TechCategory[] = [
  {
    id: 'frontend',
    title: 'FRONT-END',
    items: [
      { name: 'React', icon: '/logos/react.svg' },
      { name: 'Next.js', icon: '/logos/nextjs.svg' },
      { name: 'TypeScript', icon: '/logos/typescript.svg' },
      { name: 'JavaScript', icon: '/logos/javascript.svg' },
      { name: 'Tailwind CSS', icon: '/logos/tailwindcss.svg' },
      { name: 'Shadcn/UI', icon: '/logos/shadcnui.svg' },
      { name: 'Framer Motion', icon: '/logos/framermotion.svg' },
      { name: 'Three.js', icon: '/logos/threejs.svg' },
    ],
  },
  {
    id: 'backend',
    title: 'BACK-END',
    items: [
      { name: 'Python', icon: '/logos/python.svg' },
      { name: 'Java', icon: '/logos/java.svg' },
      { name: 'Firebase', icon: '/logos/firebase.svg' },
      { name: 'REST APIs', icon: '/logos/restapis.svg' },
      { name: 'JDBC', icon: '/logos/jdbc.svg' },
    ],
  },
  {
    id: 'database',
    title: 'DATABASE',
    items: [
      { name: 'Firestore', icon: '/logos/firestore.svg' },
      { name: 'SQL', icon: '/logos/sql.svg' },
    ],
  },
  {
    id: 'ai-cv',
    title: 'AI & CV',
    items: [
      { name: 'Gemini', icon: '/logos/gemini.svg' },
      { name: 'OpenAI', icon: '/logos/openai.svg' },
      { name: 'OpenCV', icon: '/logos/opencv.svg' },
      { name: 'MediaPipe', icon: '/logos/mediapipe.svg' },
      { name: 'TensorFlow Lite', icon: '/logos/tensorflowlite.svg' },
      { name: 'Whisper', icon: '/logos/whisper.svg' },
    ],
  },
  {
    id: 'tools',
    title: 'TOOLS',
    items: [
      { name: 'Git', icon: '/logos/git.svg' },
      { name: 'GitHub', icon: '/logos/github.svg' },
      { name: 'Docker', icon: '/logos/docker.svg' },
      { name: 'n8n', icon: '/logos/n8n.svg' },
      { name: 'VS Code', icon: '/logos/vscode.svg' },
      { name: 'NetBeans', icon: '/logos/netbeans.svg' },
      { name: 'Gradle', icon: '/logos/gradle.svg' },
      { name: 'Render', icon: '/logos/render.svg' },
    ],
  },
];

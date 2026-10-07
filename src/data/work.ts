import { WorkItem } from '../types/cms';

export const workItems: WorkItem[] = [
  {
    id: 'arch',
    slug: 'arch',
    title: 'Arch',
    shortDescription: 'Personal Life OS',
    description:
      'Arch is a personal life operating system built to bring productivity, habits, academics, fitness, finances, entertainment, and coding into one focused workspace. Designed for students and power users who want clarity without juggling countless disconnected apps.',
    category: 'Personal Life OS',
    year: '2026',
    liveLink: 'https://arch-kx4x.onrender.com/',
    githubUrl: 'https://github.com/aryankumar-04/Arch',
    images: {
      hero: '/projects/arch 1.png',
      detail1: '/projects/arch 2.png',
      detail2: '/projects/arch 3.png',
      detail3: '/projects/arch 4.png',
    },
    introHtml: `
      <h2>About Arch</h2>
      <p>Arch is a unified personal command center designed for people who want to manage everyday life from one place. It brings tasks, journaling, academics, workouts, coding, movies, wardrobe, expenses, goals, and analytics together in a structured workspace built around daily routines.</p>
      <p>At its core, Arch is about control and clarity. It combines practical tools with a bold Neo-Brutalist interface, creating a focused system that feels personal, fast, and built for everyday use.</p>
      <h2>Designed for Daily Control, Built for Real Life</h2>
      <p>The goal behind Arch was to create a system that doesn't just organize information, but makes daily decisions easier. Each module is structured to surface priorities, track progress, and turn scattered routines into one clear workflow.</p>
    `,
    bodyHtml: `
      <h2>Visual Language</h2>
      <p>Arch uses a bold Neo-Brutalist visual language. Strong typography, crisp 2px borders, hard 4px offset shadows, vivid accents, and structured layouts create a distinctive interface. Seven themes give the system flexibility while keeping its visual identity consistent across the experience.</p>
      <p>Every interface detail follows a deliberate system of contrast, spacing, color, and interaction, giving Arch a visual identity that feels direct, functional, focused, and unmistakably its own.</p>
      <h2>Structured Personal Management</h2>
      <p>The experience is designed to move naturally from overview to action. The dashboard surfaces priorities and metrics, while dedicated modules let users manage tasks, reflect, study, train, code, track spending, and organize media.</p>
      <p>The structure keeps everyday information accessible without turning the experience into a crowded collection of disconnected tools.</p>
      <h2>Built for Real Use</h2>
      <p>Beyond aesthetics, Arch is built for real daily use. It combines React, Zustand, Firebase, Firestore, local caching, external APIs, and responsive components to support reliable workflows with cloud sync and offline-first data.</p>
    `,
    outroHtml: `
      <h2>A Foundation for Growth</h2>
      <p>Arch is more than a productivity dashboard—it is a personal system designed to evolve with its user. New goals, routines, projects, and data can grow alongside the platform while its modular architecture keeps the experience organized.</p>
      <h2>Clarity That Scales</h2>
      <p>Every module in Arch has a purpose—bringing productivity, reflection, planning, tracking, and personal data together into one focused system that makes everyday life easier to understand, organize, and manage.</p>
    `,
    sections: [
      {
        type: 'text',
        heading: 'About Arch',
        paragraphs: [
          'Arch is a unified personal command center designed for people who want to manage everyday life from one place. It brings tasks, journaling, academics, workouts, coding, movies, wardrobe, expenses, goals, and analytics together in a structured workspace built around daily routines.',
          'At its core, Arch is about control and clarity. It combines practical tools with a bold Neo-Brutalist interface, creating a focused system that feels personal, fast, and built for everyday use.',
        ],
      },
      {
        type: 'text',
        heading: 'Designed for Daily Control, Built for Real Life',
        paragraphs: [
          "The goal behind Arch was to create a system that doesn't just organize information, but makes daily decisions easier. Each module is structured to surface priorities, track progress, and turn scattered routines into one clear workflow.",
        ],
      },
      {
        type: 'gallery',
        images: [
          '/projects/arch 2.png',
          '/projects/arch 3.png',
        ],
      },
      {
        type: 'text',
        heading: 'Visual Language',
        paragraphs: [
          'Arch uses a bold Neo-Brutalist visual language. Strong typography, crisp 2px borders, hard 4px offset shadows, vivid accents, and structured layouts create a distinctive interface. Seven themes give the system flexibility while keeping its visual identity consistent across the experience.',
          'Every interface detail follows a deliberate system of contrast, spacing, color, and interaction, giving Arch a visual identity that feels direct, functional, focused, and unmistakably its own.',
        ],
      },
      {
        type: 'text',
        heading: 'Structured Personal Management',
        paragraphs: [
          'The experience is designed to move naturally from overview to action. The dashboard surfaces priorities and metrics, while dedicated modules let users manage tasks, reflect, study, train, code, track spending, and organize media.',
          'The structure keeps everyday information accessible without turning the experience into a crowded collection of disconnected tools.',
        ],
      },
      {
        type: 'text',
        heading: 'Built for Real Use',
        paragraphs: [
          'Beyond aesthetics, Arch is built for real daily use. It combines React, Zustand, Firebase, Firestore, local caching, external APIs, and responsive components to support reliable workflows with cloud sync and offline-first data.',
        ],
      },
      {
        type: 'collage',
        image: '/projects/arch 4.png',
      },
      {
        type: 'text',
        heading: 'A Foundation for Growth',
        paragraphs: [
          'Arch is more than a productivity dashboard—it is a personal system designed to evolve with its user. New goals, routines, projects, and data can grow alongside the platform while its modular architecture keeps the experience organized.',
        ],
      },
      {
        type: 'text',
        heading: 'Clarity That Scales',
        paragraphs: [
          'Every module in Arch has a purpose—bringing productivity, reflection, planning, tracking, and personal data together into one focused system that makes everyday life easier to understand, organize, and manage.',
        ],
      },
    ],
  },
  {
    id: 'daily-email-digest',
    slug: 'daily-email-digest',
    title: 'Daily Email Digest',
    shortDescription: 'n8n AI Automation',
    description:
      'A fully automated n8n workflow that reads your Gmail inbox every morning and delivers one clean, AI-written digest straight to your email.',
    category: 'n8n AI Automation',
    year: '2026',
    liveLink: 'https://github.com/aryankumar-04/n8n-daily-email-summarizer',
    githubUrl: 'https://github.com/aryankumar-04/n8n-daily-email-summarizer',
    images: {
      hero: '/projects/n8n2 1.png',
      detail1: '/projects/n8n2 2.png',
      detail2: '/projects/n8n2 3.png',
      detail3: '/projects/n8n2 4.png',
    },
    introHtml: `
      <h2>About the Project</h2>
      <p>Daily Email Digest is a smart n8n automation built for people who are tired of scanning a crowded inbox. Every day at 11 AM, it collects new Gmail threads, sorts them with NVIDIA Nemotron, and sends one clear summary, so the few emails that matter never get lost.</p>
      <h2>A Quieter Inbox, Built to Save Your Time</h2>
      <p>The idea was simple: read the inbox so you don't have to. Every email thread gets one short summary, and nothing is silently dropped, so you stay informed without opening a single message.</p>
    `,
    bodyHtml: `
      <h2>Smart Triage</h2>
      <p>Every thread is labeled Important, Normal, or Ignore. Promotions and social mail are filtered out first, then Nemotron summarizes the rest in batches of ten, keeping names, amounts, and deadlines exactly as written.</p>
      <h2>Reliable by Design</h2>
      <p>The workflow remembers its last successful run, so a failed day never skips an email. If anything breaks, an error alert lands in your inbox with the failed step.</p>
      <h2>Built for Busy People</h2>
      <p>The workflow is modular and easy to customize in n8n. Swap the AI model, change the schedule, or adjust the prompt to fit your own rules, and scale to hundreds of emails effortlessly.</p>
    `,
    outroHtml: `
      <h2>A System That Grows</h2>
      <p>This project is not just a quick summary—it's about a habit that lasts. As email volume grows, the workflow keeps batching, retrying, and delivering a clean digest at low cost, without losing accuracy.</p>
    `,
    sections: [
      {
        type: 'text',
        heading: 'About the Project',
        paragraphs: [
          'Daily Email Digest is a smart n8n automation built for people who are tired of scanning a crowded inbox. Every day at 11 AM, it collects new Gmail threads, sorts them with NVIDIA Nemotron, and sends one clear summary, so the few emails that matter never get lost.',
        ],
      },
      {
        type: 'text',
        heading: 'A Quieter Inbox, Built to Save Your Time',
        paragraphs: [
          "The idea was simple: read the inbox so you don't have to. Every email thread gets one short summary, and nothing is silently dropped, so you stay informed without opening a single message.",
        ],
      },
      {
        type: 'gallery',
        images: [
          '/projects/n8n2 2.png',
          '/projects/n8n2 3.png',
        ],
      },
      {
        type: 'text',
        heading: 'Smart Triage',
        paragraphs: [
          'Every thread is labeled Important, Normal, or Ignore. Promotions and social mail are filtered out first, then Nemotron summarizes the rest in batches of ten, keeping names, amounts, and deadlines exactly as written.',
        ],
      },
      {
        type: 'text',
        heading: 'Reliable by Design',
        paragraphs: [
          'The workflow remembers its last successful run, so a failed day never skips an email. If anything breaks, an error alert lands in your inbox with the failed step.',
        ],
      },
      {
        type: 'text',
        heading: 'Built for Busy People',
        paragraphs: [
          'The workflow is modular and easy to customize in n8n. Swap the AI model, change the schedule, or adjust the prompt to fit your own rules, and scale to hundreds of emails effortlessly.',
        ],
      },
      {
        type: 'collage',
        image: '/projects/n8n2 4.png',
      },
      {
        type: 'text',
        heading: 'A System That Grows',
        paragraphs: [
          "This project is not just a quick summary—it's about a habit that lasts. As email volume grows, the workflow keeps batching, retrying, and delivering a clean digest at low cost, without losing accuracy.",
        ],
      },
    ],
  },
  {
    id: 'airmouse',
    slug: 'airmouse',
    title: 'AirMouse',
    shortDescription: 'Windows Desktop App',
    description:
      'AirMouse AI is a modern, privacy-first Windows desktop app that turns any webcam into a touchless mouse. Control your cursor with natural hand gestures, running fully offline with no cloud, no subscriptions, and no special hardware.',
    category: 'Windows Desktop App',
    year: '2026',
    liveLink: 'https://github.com/aryankumar-04/AirMouse-AI',
    githubUrl: 'https://github.com/aryankumar-04/AirMouse-AI',
    images: {
      hero: '/projects/airmouse 1.png',
      detail1: '/projects/airmouse 2.png',
      detail2: '/projects/airmouse 3.png',
      detail3: '/projects/airmouse 4.png',
    },
    introHtml: `
      <h2>About the Project</h2>
      <p>AirMouse AI is a refined desktop app crafted for people who value touch-free control, privacy, and speed. Built with accessibility in mind, it works with any standard webcam—whether for browsing, presentations, or hands-free work on Windows 10 and 11, with no special hardware or cloud needed.</p>
      <p>At its core, AirMouse is about natural control. It blends computer vision with gesture recognition, creating an interaction that feels intuitive and effortless.</p>
      <h2>Engineered for Precision, Built for Privacy</h2>
      <p>The goal behind AirMouse was to create a tool that doesn't just track hands, but performs. Every gesture is intentionally mapped to move the cursor, trigger clicks, and support scrolling without causing accidental actions.</p>
    `,
    bodyHtml: `
      <h2>Gesture Language</h2>
      <p>AirMouse uses a simple yet powerful gesture approach. An index finger moves the cursor, a pinch tap clicks, and a pinch hold drags. A thumb and middle pinch right-clicks, and two fingers scroll. An open palm pauses tracking, while a fist triggers an instant emergency stop for safety.</p>
      <p>Below every gesture lies a deliberate system of detection, classification, and mapping that turns hand motion into precise mouse input.</p>
      <h2>Structured Tech Pipeline</h2>
      <p>The system is designed to flow naturally—from webcam capture to on-screen action. Each stage builds on the previous one, with MediaPipe detecting landmarks, a gesture engine classifying poses, and a controller acting on them.</p>
      <p>The pipeline guides every frame through smoothing and dead-zone filters that balance speed with stable, jitter-free motion.</p>
      <h2>Made for Daily Use</h2>
      <p>Beyond the tech, AirMouse is highly practical. It's packaged as an EXE installer or portable ZIP, with a dashboard, settings, and gesture guide. Every control is tunable.</p>
    `,
    outroHtml: `
      <h2>Open Source and Growing</h2>
      <p>AirMouse is more than a utility—it's a project designed to evolve with the people using it. Whether adding gesture presets, profile-based settings, or accessibility modes, the structure supports growth without losing stability.</p>
      <h2>Privacy that Stays with You</h2>
      <p>Every part of AirMouse is crafted to protect your data—bringing offline processing and zero telemetry into one effortless way.</p>
    `,
    sections: [
      {
        type: 'text',
        heading: 'About the Project',
        paragraphs: [
          'AirMouse AI is a refined desktop app crafted for people who value touch-free control, privacy, and speed. Built with accessibility in mind, it works with any standard webcam—whether for browsing, presentations, or hands-free work on Windows 10 and 11, with no special hardware or cloud needed.',
          'At its core, AirMouse is about natural control. It blends computer vision with gesture recognition, creating an interaction that feels intuitive and effortless.',
        ],
      },
      {
        type: 'text',
        heading: 'Engineered for Precision, Built for Privacy',
        paragraphs: [
          "The goal behind AirMouse was to create a tool that doesn't just track hands, but performs. Every gesture is intentionally mapped to move the cursor, trigger clicks, and support scrolling without causing accidental actions.",
        ],
      },
      {
        type: 'gallery',
        images: [
          '/projects/airmouse 2.png',
          '/projects/airmouse 3.png',
        ],
      },
      {
        type: 'text',
        heading: 'Gesture Language',
        paragraphs: [
          'AirMouse uses a simple yet powerful gesture approach. An index finger moves the cursor, a pinch tap clicks, and a pinch hold drags. A thumb and middle pinch right-clicks, and two fingers scroll. An open palm pauses tracking, while a fist triggers an instant emergency stop for safety.',
          'Below every gesture lies a deliberate system of detection, classification, and mapping that turns hand motion into precise mouse input.',
        ],
      },
      {
        type: 'text',
        heading: 'Structured Tech Pipeline',
        paragraphs: [
          'The system is designed to flow naturally—from webcam capture to on-screen action. Each stage builds on the previous one, with MediaPipe detecting landmarks, a gesture engine classifying poses, and a controller acting on them.',
          'The pipeline guides every frame through smoothing and dead-zone filters that balance speed with stable, jitter-free motion.',
        ],
      },
      {
        type: 'text',
        heading: 'Made for Daily Use',
        paragraphs: [
          "Beyond the tech, AirMouse is highly practical. It's packaged as an EXE installer or portable ZIP, with a dashboard, settings, and gesture guide. Every control is tunable.",
        ],
      },
      {
        type: 'collage',
        image: '/projects/airmouse 4.png',
      },
      {
        type: 'text',
        heading: 'Open Source and Growing',
        paragraphs: [
          "AirMouse is more than a utility—it's a project designed to evolve with the people using it. Whether adding gesture presets, profile-based settings, or accessibility modes, the structure supports growth without losing stability.",
        ],
      },
      {
        type: 'text',
        heading: 'Privacy that Stays with You',
        paragraphs: [
          'Every part of AirMouse is crafted to protect your data—bringing offline processing and zero telemetry into one effortless way.',
        ],
      },
    ],
  },
  {
    id: 'cenivo',
    slug: 'cenivo',
    title: 'Cenivo',
    shortDescription: 'Full-Stack Web App',
    description:
      'Cenivo is a modern movie and TV discovery platform built for sleek visuals, seamless exploration, and rich entertainment tracking. Perfect for cinephiles and casual viewers who want a responsive, high-impact streaming guide across trending cinema.',
    category: 'Full-Stack Web App',
    year: '2026',
    liveLink: 'https://cenivo.onrender.com/',
    githubUrl: 'https://github.com/aryankumar-04/Cenivo',
    images: {
      hero: '/projects/cenivo 1.png',
      detail1: '/projects/cenivo 2.png',
      detail2: '/projects/cenivo 3.png',
      detail3: '/projects/cenivo 4.png',
    },
    introHtml: `
      <h2>About the Project</h2>
      <p>Cenivo is a refined entertainment hub crafted for modern viewers who value clarity, speed, and immersive visual discovery. Built with real-time data integration, it brings together extensive cinema catalogues—whether for trending movies, acclaimed TV series, or custom watchlists looking to elevate daily viewing.</p>
      <p>At its core, Cenivo is about fluid exploration. It blends clean architecture with responsive state management, creating a browsing experience that feels both dynamic and effortless.</p>
      <h2>Designing for Discovery, Built for Performance</h2>
      <p>The goal behind Cenivo was to create a streaming platform that doesn't just look sleek, but performs instantly. Every section is intentionally structured to guide discovery, highlight essential metadata, and support seamless navigation without overwhelming the user.</p>
    `,
    bodyHtml: `
      <h2>Visual Language</h2>
      <p>Cenivo uses a dark, cinematic visual approach inspired by premium streaming services. Strong typography anchors title showcases, while generous spacing and structured grids create rhythm and clarity. The dark palette is intentionally immersive, allowing vibrant poster artwork to shine while maintaining a polished and cohesive look.</p>
      <p>Below every surface-level detail lies a deliberate system of color, contrast, and composition that defines the visual identity of the platform.</p>
      <h2>Structured Navigation</h2>
      <p>The layout is designed to flow naturally—from trending discovery to deeper engagement. Each section builds on user interaction, making it easy to browse genres, manage personal ratings, or curate custom watchlists in a clear and compelling way.</p>
      <p>The structure guides visitors through a curated catalogue that balances rich media details with visual breathing room.</p>
      <h2>Built for Real Use</h2>
      <p>Beyond aesthetics, Cenivo is highly practical. It's optimized for performance, responsiveness, and rapid state handling with React, TypeScript, and Vite. Every component is reusable and scalable.</p>
    `,
    outroHtml: `
      <h2>A Foundation for Growth</h2>
      <p>Cenivo is more than a frontend interface—it's a system designed to evolve with user activity. Whether syncing Firestore databases, scaling user authentication, or integrating recommendation models, the structure supports growth without losing visual integrity.</p>
      <h2>Clarity that Scales with You</h2>
      <p>Every element within Cenivo is crafted to serve a purpose—bringing together modern web design and entertainment discovery in a way that feels effortless.</p>
    `,
    sections: [
      {
        type: 'text',
        heading: 'About the Project',
        paragraphs: [
          'Cenivo is a refined entertainment hub crafted for modern viewers who value clarity, speed, and immersive visual discovery. Built with real-time data integration, it brings together extensive cinema catalogues—whether for trending movies, acclaimed TV series, or custom watchlists looking to elevate daily viewing.',
          'At its core, Cenivo is about fluid exploration. It blends clean architecture with responsive state management, creating a browsing experience that feels both dynamic and effortless.',
        ],
      },
      {
        type: 'text',
        heading: 'Designing for Discovery, Built for Performance',
        paragraphs: [
          "The goal behind Cenivo was to create a streaming platform that doesn't just look sleek, but performs instantly. Every section is intentionally structured to guide discovery, highlight essential metadata, and support seamless navigation without overwhelming the user.",
        ],
      },
      {
        type: 'gallery',
        images: [
          '/projects/cenivo 2.png',
          '/projects/cenivo 3.png',
        ],
      },
      {
        type: 'text',
        heading: 'Visual Language',
        paragraphs: [
          'Cenivo uses a dark, cinematic visual approach inspired by premium streaming services. Strong typography anchors title showcases, while generous spacing and structured grids create rhythm and clarity. The dark palette is intentionally immersive, allowing vibrant poster artwork to shine while maintaining a polished and cohesive look.',
          'Below every surface-level detail lies a deliberate system of color, contrast, and composition that defines the visual identity of the platform.',
        ],
      },
      {
        type: 'text',
        heading: 'Structured Navigation',
        paragraphs: [
          'The layout is designed to flow naturally—from trending discovery to deeper engagement. Each section builds on user interaction, making it easy to browse genres, manage personal ratings, or curate custom watchlists in a clear and compelling way.',
          'The structure guides visitors through a curated catalogue that balances rich media details with visual breathing room.',
        ],
      },
      {
        type: 'text',
        heading: 'Built for Real Use',
        paragraphs: [
          "Beyond aesthetics, Cenivo is highly practical. It's optimized for performance, responsiveness, and rapid state handling with React, TypeScript, and Vite. Every component is reusable and scalable.",
        ],
      },
      {
        type: 'collage',
        image: '/projects/cenivo 4.png',
      },
      {
        type: 'text',
        heading: 'A Foundation for Growth',
        paragraphs: [
          "Cenivo is more than a frontend interface—it's a system designed to evolve with user activity. Whether syncing Firestore databases, scaling user authentication, or integrating recommendation models, the structure supports growth without losing visual integrity.",
        ],
      },
      {
        type: 'text',
        heading: 'Clarity that Scales with You',
        paragraphs: [
          'Every element within Cenivo is crafted to serve a purpose—bringing together modern web design and entertainment discovery in a way that feels effortless.',
        ],
      },
    ],
  },
  {
    id: 'hill-climbing-race',
    slug: 'hill-climbing-race',
    title: 'Hill Climbing Race',
    shortDescription: '2D Game Development',
    description:
      'Hill Climbing Race is a modern 2D physics-based driving game built for responsive controls, dynamic terrain, and engaging progression. Crafted for players who enjoy challenging mechanics, vehicle upgrades, and endless distance trials.',
    category: '2D Game Development',
    year: '2026',
    liveLink: 'https://hill-climbing-race.onrender.com/',
    githubUrl: 'https://github.com/aryankumar-04/Hill-Climbing-Race',
    images: {
      hero: '/projects/hcr 1.png',
      detail1: '/projects/hcr 2.png',
      detail2: '/projects/hcr 3.png',
      detail3: '/projects/hcr 4.png',
    },
    introHtml: `
      <h2>About the Project</h2>
      <p>Hill Climbing Race is an interactive web-based driving game engineered for players who appreciate momentum-driven mechanics, tactical upgrades, and dynamic terrain traversal. Built with modern web technologies, it simulates real-time suspension, velocity, and gravity across endless landscapes.</p>
      <p>At its core, the game is about balance. It blends precise mechanical feedback with intuitive arcade controls, creating a gameplay loop that feels both challenging and rewarding.</p>
      <h2>Engineered for Physics, Built for Performance</h2>
      <p>The goal behind the project was to create a game loop that doesn't just look smooth, but executes flawlessly. Every subsystem is intentionally structured to handle physics timesteps, render fluid transformations, and calculate collision bounds without stuttering the browser.</p>
    `,
    bodyHtml: `
      <h2>Visual Language</h2>
      <p>The game pairs an energetic arcade aesthetic with an uncluttered interface. High-contrast gauges anchor the heads-up display, while smooth procedural slopes and distinct environments create depth and momentum. The styling keeps telemetry and stage markers immediately readable during high-speed runs.</p>
      <p>Below every visual surface lies a deliberate system of vector coordinates, spring math, and sprite state that defines the visual identity of each run.</p>
      <h2>Structured Progression</h2>
      <p>The game flow is designed to build momentum naturally—from basic introductory runs to high-tier mastery. Each stage builds on the previous one, making it easy to earn coins, unlock specialized terrain vehicles, and upgrade engine components to conquer increasingly steep hills.</p>
      <p>The progression rewards patience and tactical resource gathering, balancing fuel conservation against calculated throttle control.</p>
      <h2>Built for Real Use</h2>
      <p>Beyond visual flair, the architecture is strictly modular. It's optimized for lightweight bundling with Vite, smooth 60 FPS canvas execution, and persistent local storage. Every component is reusable and scalable.</p>
    `,
    outroHtml: `
      <h2>A Foundation for Growth</h2>
      <p>Hill Climbing Race is more than a standalone minigame—it's a system designed to evolve with future features. Whether adding custom sound design, expanding stage biomes, or introducing new vehicle categories, the structure supports growth without losing performance integrity.</p>
      <h2>Clarity that Scales with You</h2>
      <p>Every mechanic within the game is tuned to serve a clear purpose—bringing together game physics and reactive state in a way that feels effortless.</p>
    `,
    sections: [
      {
        type: 'text',
        heading: 'About the Project',
        paragraphs: [
          'Hill Climbing Race is an interactive web-based driving game engineered for players who appreciate momentum-driven mechanics, tactical upgrades, and dynamic terrain traversal. Built with modern web technologies, it simulates real-time suspension, velocity, and gravity across endless landscapes.',
          'At its core, the game is about balance. It blends precise mechanical feedback with intuitive arcade controls, creating a gameplay loop that feels both challenging and rewarding.',
        ],
      },
      {
        type: 'text',
        heading: 'Engineered for Physics, Built for Performance',
        paragraphs: [
          "The goal behind the project was to create a game loop that doesn't just look smooth, but executes flawlessly. Every subsystem is intentionally structured to handle physics timesteps, render fluid transformations, and calculate collision bounds without stuttering the browser.",
        ],
      },
      {
        type: 'gallery',
        images: [
          '/projects/hcr 2.png',
          '/projects/hcr 3.png',
        ],
      },
      {
        type: 'text',
        heading: 'Visual Language',
        paragraphs: [
          'The game pairs an energetic arcade aesthetic with an uncluttered interface. High-contrast gauges anchor the heads-up display, while smooth procedural slopes and distinct environments create depth and momentum. The styling keeps telemetry and stage markers immediately readable during high-speed runs.',
          'Below every visual surface lies a deliberate system of vector coordinates, spring math, and sprite state that defines the visual identity of each run.',
        ],
      },
      {
        type: 'text',
        heading: 'Structured Progression',
        paragraphs: [
          'The game flow is designed to build momentum naturally—from basic introductory runs to high-tier mastery. Each stage builds on the previous one, making it easy to earn coins, unlock specialized terrain vehicles, and upgrade engine components to conquer increasingly steep hills.',
          'The progression rewards patience and tactical resource gathering, balancing fuel conservation against calculated throttle control.',
        ],
      },
      {
        type: 'text',
        heading: 'Built for Real Use',
        paragraphs: [
          "Beyond visual flair, the architecture is strictly modular. It's optimized for lightweight bundling with Vite, smooth 60 FPS canvas execution, and persistent local storage. Every component is reusable and scalable.",
        ],
      },
      {
        type: 'collage',
        image: '/projects/hcr 4.png',
      },
      {
        type: 'text',
        heading: 'A Foundation for Growth',
        paragraphs: [
          "Hill Climbing Race is more than a standalone minigame—it's a system designed to evolve with future features. Whether adding custom sound design, expanding stage biomes, or introducing new vehicle categories, the structure supports growth without losing performance integrity.",
        ],
      },
      {
        type: 'text',
        heading: 'Clarity that Scales with You',
        paragraphs: [
          'Every mechanic within the game is tuned to serve a clear purpose—bringing together game physics and reactive state in a way that feels effortless.',
        ],
      },
    ],
  },
  {
    id: 'games-gadgets-haven',
    slug: 'games-gadgets-haven',
    title: 'Games & Gadgets Haven',
    shortDescription: 'Frontend Web Application',
    description:
      'Games & Gadgets Haven is a modern gaming storefront built for bold visuals, smooth interactions, and standout tech showcase. Perfect for gamers, setup enthusiasts, and collectors who want a polished, high impact digital shopping experience without unnecessary friction.',
    category: 'Frontend Web Application',
    year: '2026',
    liveLink: 'https://games-gadgets-haven.onrender.com/',
    githubUrl: 'https://github.com/aryankumar-04/Games-Gadgets-Haven',
    images: {
      hero: '/projects/ggh 1.png',
      detail1: '/projects/ggh 2.png',
      detail2: '/projects/ggh 3.png',
      detail3: '/projects/ggh 4.png',
    },
    introHtml: `
      <h2>About the Project</h2>
      <p>Games & Gadgets Haven is a refined e-commerce storefront crafted for the gaming community that values speed, immersion, and strong visual presence. Built with modularity in mind, it adapts seamlessly across screens—delivering an engaging catalog for consoles, custom PC rigs, and premium peripherals looking to elevate the player setup.</p>
      <p>At its core, the platform is about balance. It blends neon-accented dark aesthetics with intuitive usability, creating a foundation that feels both futuristic and effortless.</p>
      <h2>Designing for Immersion, Built for Performance</h2>
      <p>The goal behind Games & Gadgets Haven was to create a storefront that doesn't just look cool, but performs. Every section is intentionally structured to guide browsing, highlight featured hardware, and streamline shopping cart interactions without overwhelming the user.</p>
    `,
    bodyHtml: `
      <h2>Visual Language</h2>
      <p>The storefront uses a striking dark-mode aesthetic inspired by competitive gaming culture. Bold typography anchors the layout, while high-contrast cards and structured grids create rhythm and clarity. The color system balances deep charcoal surfaces with electric cyan and neon highlights, allowing hardware specs to pop with clarity.</p>
      <p>Below every surface-level detail lies a deliberate system of contrast, glowing accents, and reactive feedback that defines the visual identity of the storefront.</p>
      <h2>Structured Showcase</h2>
      <p>The layout is designed to flow naturally—from hero spotlight to detailed product discovery. Each section builds on the previous one, making it easy to explore categories, inspect specs via preview modals, or check customer reviews in a clear and compelling way.</p>
      <p>The structure guides visitors through a curated catalog that balances rich media previews with fluid navigation breathing room.</p>
      <h2>Built for Real Use</h2>
      <p>Beyond aesthetics, Games & Gadgets Haven is highly practical. It's engineered with React 19, TypeScript, and Tailwind CSS for rapid rendering and persistent local storage cart management. Every component is reusable and scalable.</p>
    `,
    outroHtml: `
      <h2>A Foundation for Scale</h2>
      <p>This storefront is more than a visual demo—it's an architecture designed to evolve into a full production platform. Whether integrating payment gateways, adding user authentication, or connecting cloud backends, the structure supports expansion without losing visual integrity.</p>
      <h2>Precision that Moves with You</h2>
      <p>Every element within Games & Gadgets Haven is crafted to serve a purpose—bringing together gaming culture and clean frontend engineering in a way that feels effortless.</p>
    `,
    sections: [
      {
        type: 'text',
        heading: 'About the Project',
        paragraphs: [
          'Games & Gadgets Haven is a refined e-commerce storefront crafted for the gaming community that values speed, immersion, and strong visual presence. Built with modularity in mind, it adapts seamlessly across screens—delivering an engaging catalog for consoles, custom PC rigs, and premium peripherals looking to elevate the player setup.',
          'At its core, the platform is about balance. It blends neon-accented dark aesthetics with intuitive usability, creating a foundation that feels both futuristic and effortless.',
        ],
      },
      {
        type: 'text',
        heading: 'Designing for Immersion, Built for Performance',
        paragraphs: [
          "The goal behind Games & Gadgets Haven was to create a storefront that doesn't just look cool, but performs. Every section is intentionally structured to guide browsing, highlight featured hardware, and streamline shopping cart interactions without overwhelming the user.",
        ],
      },
      {
        type: 'gallery',
        images: [
          '/projects/ggh 2.png',
          '/projects/ggh 3.png',
        ],
      },
      {
        type: 'text',
        heading: 'Visual Language',
        paragraphs: [
          'The storefront uses a striking dark-mode aesthetic inspired by competitive gaming culture. Bold typography anchors the layout, while high-contrast cards and structured grids create rhythm and clarity. The color system balances deep charcoal surfaces with electric cyan and neon highlights, allowing hardware specs to pop with clarity.',
          'Below every surface-level detail lies a deliberate system of contrast, glowing accents, and reactive feedback that defines the visual identity of the storefront.',
        ],
      },
      {
        type: 'text',
        heading: 'Structured Showcase',
        paragraphs: [
          'The layout is designed to flow naturally—from hero spotlight to detailed product discovery. Each section builds on the previous one, making it easy to explore categories, inspect specs via preview modals, or check customer reviews in a clear and compelling way.',
          'The structure guides visitors through a curated catalog that balances rich media previews with fluid navigation breathing room.',
        ],
      },
      {
        type: 'text',
        heading: 'Built for Real Use',
        paragraphs: [
          "Beyond aesthetics, Games & Gadgets Haven is highly practical. It's engineered with React 19, TypeScript, and Tailwind CSS for rapid rendering and persistent local storage cart management. Every component is reusable and scalable.",
        ],
      },
      {
        type: 'collage',
        image: '/projects/ggh 4.png',
      },
      {
        type: 'text',
        heading: 'A Foundation for Scale',
        paragraphs: [
          "This storefront is more than a visual demo—it's an architecture designed to evolve into a full production platform. Whether integrating payment gateways, adding user authentication, or connecting cloud backends, the structure supports expansion without losing visual integrity.",
        ],
      },
      {
        type: 'text',
        heading: 'Precision that Moves with You',
        paragraphs: [
          'Every element within Games & Gadgets Haven is crafted to serve a purpose—bringing together gaming culture and clean frontend engineering in a way that feels effortless.',
        ],
      },
    ],
  },
];

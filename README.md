<div align="center">

  <img src="./public/black.svg" alt="Aryan Gupta Monogram Logo" width="96" height="96" />

  # Aryan Gupta | SWE

  <p align="center">
    <strong>A high-performance, responsive software engineering portfolio and interactive design experience built with React, TypeScript, and modern web tools.</strong>
  </p>

  <p align="center">
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="License MIT" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_18-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React 18" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite_5-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 5" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://render.com/"><img src="https://img.shields.io/badge/Render-Static_Site-46E3B7.svg?style=for-the-badge&logo=render&logoColor=white" alt="Render" /></a>
  </p>

  <p align="center">
    <em>Crafted with precision, thoughtful typography, and smooth micro-interactions.</em>
  </p>

</div>

---

## 📖 Table of Contents

- [✨ About The Project](#-about-the-project)
  - [🎯 For Visitors & Recruiters](#-for-visitors--recruiters)
  - [💻 For Developers](#-for-developers)
- [🚀 Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🏁 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [📬 Contact Form Setup (Web3Forms)](#-contact-form-setup-web3forms)
- [🌐 Deployment (Render)](#-deployment-render)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📫 Contact & Connect](#-contact--connect)

---

## ✨ About The Project

Welcome to my personal developer portfolio! This website is designed to be more than just a static resume—it is a fast, interactive digital home that showcases real-world software engineering work, hands-on artificial intelligence projects, and technical writing.

### 🎯 For Visitors & Recruiters

If you are a recruiter, hiring manager, or visitor browsing my work:
- **Hero & Story**: Learn about my background, technical focus, and passion for building reliable software.
- **Featured Projects**: Explore case studies with live demos, GitHub repositories, and breakdown of problem-solving decisions.
- **Education & Certifications**: View verified credentials with inline modal previews and verification links.
- **Thoughts & Articles**: Read technical blogs covering AI engineering, developer career paths, and software fundamentals—complete with reading tracking and click-to-expand image lightboxes.
- **Get in Touch**: Send a direct message through the built-in contact form without leaving the page.

### 💻 For Developers

Under the hood, this application demonstrates clean frontend architecture and performance engineering:
- **Sticky Pinned Scroll Orchestration**: A continuous 200vh pinned track in the Hero section featuring dynamic crossfade transitions between portrait states.
- **Kinetic Text Scrubbing**: Word-by-word opacity transitions driven directly by viewport scroll progress.
- **Normalized Momentum Scrolling**: Powered by **Lenis** with intelligent locks during modal presentation.
- **Accessible Interactions**: ARIA-compliant modals, trapped keyboard navigation (`Tab` / `Escape`), and reduced-motion detection.

---

## 🚀 Key Features

- 📱 **Fully Responsive Layout**: Hand-tailored experiences across Mobile (`390px`), Tablet (`810px`), and Desktop (`1280px`).
- 🎬 **200vh Pinned Hero Track**: Sticky narrative introduction with layered content animation.
- 🖼️ **Click-to-Expand Image Lightbox**: Accessible, full-screen lightbox modal for article visuals with backdrop dismissal and scroll-locking.
- ⏱️ **Read History Tracker**: LocalStorage-backed reading state that informs visitors when they previously read an article.
- 📬 **Live Contact Form**: Client-side validation, rate-limiting (30s cooldown, max 2 messages per visitor), and bot-deterring honeypot fields powered by **Web3Forms**.
- 📜 **Inline Certificate Previews**: Modal PDF previewer for credentials with direct verification links.
- 🎨 **Editorial Aesthetics**: Subtle organic film-grain overlay, curated typography (`Archivo` & `Clash Grotesk`), and bespoke warm cream (`#FAF7F3`) theme palette.
- 🌓 **Adaptive Favicons**: Dynamic SVG favicon switcher responding to user operating system dark/light preferences.

---

## 🛠️ Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,ts,js,html,css,tailwind,vite,nodejs,git,github" alt="Tech Stack Icons" />
</p>

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) | Component-based UI architecture & state management |
| **Type Safety** | [TypeScript](https://www.typescriptlang.org/) | Strict typing across components, models, and data collections |
| **Build Tooling** | [Vite 5](https://vitejs.dev/) | Lightning-fast HMR and optimized Rollup production bundling |
| **Styling & Design System** | [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first responsive styling and typography tokens |
| **Motion & Animation** | [Framer Motion](https://www.framer.com/motion/) | Spring-based physics, layout animations, and gesture interactions |
| **Smooth Scrolling** | [Lenis](https://lenis.darkroom.engineering/) | Momentum-based, buttery smooth scroll normalization |
| **Routing** | [React Router v6](https://reactrouter.com/) | Client-side routing with scroll restoration and dynamic route params |
| **Form Backend** | [Web3Forms](https://web3forms.com/) | Serverless form submission delivery directly to email |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG iconography |

---

## 📂 Project Structure

```text
portfolio-website/
├── public/                       # Static public assets served at root
│   ├── black.svg                 # Brand monogram logo & light-mode favicon
│   ├── white.svg                 # Brand monogram logo & dark-mode favicon
│   ├── avatar.png                # Circular profile portrait
│   ├── resume.pdf                # Downloadable curriculum vitae
│   ├── logos/                    # Tech stack brand vector SVGs
│   ├── education/                # Institution logos
│   ├── pdf/                      # Certificate PDF files
│   └── _redirects                # Static host rewrite rules (SPA routing)
├── src/
│   ├── assets/                   # Bundled graphics, textures, and illustrations
│   │   ├── blog/                 # Blog post hero and internal SVG figures
│   │   └── grain.png             # Film-grain noise texture
│   ├── components/               # Reusable atomic UI components
│   │   ├── Navbar.jsx            # Floating header with mobile navigation drawer
│   │   ├── Footer.jsx            # Page footer with oversized typographic wordmark
│   │   ├── ImageLightboxModal.tsx # Fullscreen accessible image lightbox modal
│   │   ├── ResumeModal.jsx       # Embedded resume viewer modal
│   │   └── AnimatedArrowBox.jsx  # Micro-interactive directional action arrows
│   ├── config/                   # Site configuration and route metadata
│   ├── data/                     # Content datasets (Projects, Articles, Services)
│   │   ├── articles.js           # 7 in-depth technical blog posts
│   │   ├── work.ts               # Case studies & featured project data
│   │   └── techStackData.ts      # Categorized skills and toolsets
│   ├── hooks/                    # Custom React hooks (Favicon, Scroll, Page Title)
│   ├── pages/                    # Route page components
│   │   ├── BlogArchive.jsx       # Articles catalog
│   │   ├── BlogArticle.jsx       # Dynamic reading page with lightbox & history
│   │   ├── WorkArchive.tsx       # Complete projects gallery
│   │   ├── WorkDetail.tsx        # In-depth case study breakdown
│   │   └── NotFound.tsx          # 404 error page
│   ├── sections/                 # Modular home page sections
│   │   ├── Hero.jsx              # 200vh pinned scroll track & bio
│   │   ├── CertificationsSection.tsx # Verified credentials showcase
│   │   ├── ContactSection.tsx    # Interactive message submission form
│   │   └── ...                   # Services, Projects, Testimonials
│   ├── App.tsx                   # App root, routing hierarchy & Lenis listener
│   ├── index.css                 # Global styles, font definitions & CSS variables
│   └── main.tsx                  # Application entry point
├── .env.example                  # Environment variable reference template
├── .gitignore                    # Git exclusion rules for clean repository state
├── LICENSE                       # MIT License
├── package.json                  # Dependencies and execution scripts
├── tailwind.config.js            # Design tokens, custom breakpoints & colors
├── tsconfig.json                 # TypeScript compiler options
└── vite.config.ts                # Vite dev server and build configuration
```

---

## 🏁 Getting Started

Follow these steps to run the portfolio locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js) or `pnpm` / `yarn`

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/aryankumar-04/portfolio-website.git
cd portfolio-website
npm install
```

### Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

*(Optional)* Add your Web3Forms access key if you wish to override the default key:

```env
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key_here
```

### Development Server

Launch the Vite local development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

### Production Build

Compile TypeScript and build the optimized production assets:

```bash
npm run build
```

The compiled static files will be generated in the `dist/` directory. You can preview the production bundle locally with:

```bash
npm run preview
```

---

## 📬 Contact Form Setup (Web3Forms)

The contact form is pre-configured to use [Web3Forms](https://web3forms.com/) for serverless email forwarding:

1. Visit [Web3Forms](https://web3forms.com/) and enter your email address to generate a free Access Key.
2. The key can be plugged directly into `src/Contact.jsx` (at `formDataObj.append('access_key', 'YOUR_KEY')`) or loaded via `.env` (`VITE_WEB3FORMS_ACCESS_KEY`).
3. **Security Recommendation**: Log in to your Web3Forms dashboard and add your production domain to the **Domain Whitelist** to prevent spam submissions from third-party websites.

---

## 🌐 Deployment (Render)

This repository is optimized for one-click deployment on [Render](https://render.com/) as a **Static Site**:

1. Fork or push this repository to your GitHub account.
2. Sign in to the [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** > **Static Site**.
4. Connect your `portfolio-website` repository.
5. Configure the build parameters:
   - **Name**: `portfolio-website`
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
6. Under **Redirects/Rewrites**, create an SPA catch-all rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
7. Click **Create Static Site**. Render will build and deploy your site automatically on every push!

*(Note: The repository also includes a `public/_redirects` file that static hosts like Render and Cloudflare Pages automatically respect for client-side routing).*

---

## 🤝 Contributing

Contributions, issues, and feature suggestions are welcome!
Feel free to open an issue or submit a pull request if you notice anything that could be improved.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full details.

```text
Copyright (c) 2026 Aryan Kumar Gupta
```

---

## 📫 Contact & Connect

<div align="center">

  <h3>Aryan Kumar Gupta</h3>
  <p>Software Engineer & AI Enthusiast</p>

  <p>
    <a href="mailto:contact.aryankgupta@gmail.com"><img src="https://img.shields.io/badge/Email-contact.aryankgupta%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
    <a href="https://linkedin.com/in/aryankumargupta04"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
    <a href="https://github.com/aryankumar-04"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
    <a href="https://x.com/aryankumar_04"><img src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" alt="X / Twitter" /></a>
  </p>

  <p><em>Thank you for visiting my portfolio! Have a project in mind or want to collaborate? Feel free to reach out.</em></p>

</div>

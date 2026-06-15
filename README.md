# Muhsin PA — Portfolio Website

A premium, macOS-inspired portfolio website for a Flutter & Full Stack Developer.

## Features

- Apple/macOS design language with glassmorphism
- Smooth scroll animations powered by [Motion](https://motion.dev) (from Framer Motion creators)
- Fully responsive (mobile, tablet, desktop)
- Sticky glass navbar
- Loading animation
- SEO optimized meta tags
- Dark mode by default

## Sections

1. **Hero** — Introduction, photo, resume download, social links
2. **About** — Professional summary, career goals, education
3. **Skills** — Glassmorphism skill cards with hover effects
4. **Experience** — Timeline layout
5. **Projects** — macOS-style project cards
6. **Contact** — Contact info + form

## Quick Start

### Option 1: Live Server (Recommended)

```bash
# Using VS Code Live Server extension, or:
npx serve .
```

Open `http://localhost:3000` (or the port shown).

### Option 2: Python

```bash
python -m http.server 8080
```

Open `http://localhost:8080`

> **Note:** Use a local server (not `file://`) so ES module imports for Motion work correctly.

## Customization

Replace placeholder values in `index.html`:

| Placeholder | Location |
|-------------|----------|
| Email | Contact section, `mailto:` links |
| Phone | Contact section, `tel:` links |
| LinkedIn URL | Hero & Contact sections |
| GitHub URL | Hero, Projects & Contact sections |
| Profile photo | Add `assets/profile.jpg` |
| Resume | Replace `assets/resume.pdf` |
| Project links | GitHub & Live Demo buttons in Projects section |

## File Structure

```
My_Portfolio/
├── index.html          # Main page
├── css/
│   └── styles.css      # Custom styles & glassmorphism
├── js/
│   └── main.js         # Animations & interactions
├── assets/
│   ├── profile.jpg     # Your photo (add this)
│   └── resume.pdf      # Your resume
└── README.md
```

## Tech Stack

- HTML5
- CSS3 (custom + Tailwind CSS via CDN)
- Vanilla JavaScript (ES Modules)
- [Motion](https://motion.dev) — animation library
- [Inter](https://fonts.google.com/specimen/Inter) font

## Deployment

Deploy to any static host:

- **GitHub Pages** — Push to repo, enable Pages
- **Vercel** — `vercel deploy`
- **Netlify** — Drag & drop the folder

## License

Personal portfolio — free to customize for your own use.

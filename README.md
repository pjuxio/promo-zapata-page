# Zapata - Musical Project Landing Page

A promotional landing page built with 11ty (Eleventy) for the Zapata musical project.

## Features

- ✨ Full-screen hero image on load
- 🎨 Modern, responsive design
- 🚀 Fast static site generation with 11ty
- 📱 Mobile-optimized
- 🌐 Ready for Netlify deployment

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm start
```

The site will be available at `http://localhost:8080`

### Build

Build for production:
```bash
npm run build
```

The output will be in the `_site` directory.

## Deployment to Netlify

### Option 1: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

### Option 2: Deploy via Netlify Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to [Netlify](https://www.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your Git repository
5. Netlify will auto-detect the build settings from `netlify.toml`
6. Click "Deploy site"

## Project Structure

```
promo-zapata-site-2026/
├── src/
│   └── index.html          # Main landing page
├── css/
│   └── style.css           # Styles with full-screen hero
├── img/
│   └── title-screen.webp   # Hero image
├── .eleventy.js            # 11ty configuration
├── netlify.toml            # Netlify build settings
├── package.json            # Dependencies
└── .gitignore             # Git ignore rules
```

## Customization

- Edit `src/index.html` to update content
- Modify `css/style.css` to change styling
- Replace `img/title-screen.webp` with your own image
- Update social links and streaming platform URLs

## License

MIT

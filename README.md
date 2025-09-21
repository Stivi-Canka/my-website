# Stivi Canka - Personal Website

A modern, responsive personal website showcasing skills, projects, and experience with tactile sound effects.

## 🏗️ Project Structure

```
my-website/
├── index.html              # Main homepage
├── index-mobile.html       # Mobile-optimized homepage
├── package.json            # Node.js dependencies
├── README.md              # This file
│
├── assets/                # Static assets
│   └── Canka_Stivi_Resume.pdf
│
├── css/                   # Stylesheets
│   └── styles.css         # Main stylesheet
│
├── js/                    # JavaScript files
│   ├── script.js         # Main website functionality
│   └── notion-sync.js    # Notion integration
│
├── pages/                 # Individual pages
│   ├── blog.html         # Blog page
│   ├── projects.html     # Projects showcase
│   ├── resume.html       # Resume/CV page
│   ├── updates.html      # Updates/news page
│   └── pics.html         # Photo gallery
│
│
└── docs/                  # Documentation
    └── SETUP_NOTION_INTEGRATION.md
```


## 🚀 Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with glassmorphism effects
- **Interactive Elements**: Hover effects and animations
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Fast Loading**: Optimized assets and minimal dependencies
- **Accessibility**: Keyboard navigation and screen reader friendly

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox/grid
- **JavaScript**: Vanilla JS (no frameworks)
- **Font Awesome**: Icons
- **Google Fonts**: Typography

## 📱 Pages

1. **Home** (`index.html`) - Landing page with navigation
2. **Resume** (`pages/resume.html`) - Professional experience and skills
3. **Projects** (`pages/projects.html`) - Portfolio showcase
4. **Blog** (`pages/blog.html`) - Articles and thoughts
5. **Updates** (`pages/updates.html`) - Latest news and updates
6. **Photos** (`pages/pics.html`) - Personal photo gallery

## 🔧 Development

### Local Development
```bash
# Start local server
python -m http.server 8000

# Or with Node.js
npx http-server

# Or with PHP
php -S localhost:8000
```

### File Organization
- **Root**: Main HTML files and configuration
- **css/**: All stylesheets and fonts
- **js/**: All JavaScript functionality
- **pages/**: Individual page HTML files
- **assets/**: Static files (PDFs, images)
- **docs/**: Documentation and setup guides

## 🎨 Customization

### Adding New Pages
1. Create HTML file in `pages/` directory
2. Use existing page structure as template
3. Update navigation links in `index.html`
4. Ensure proper CSS and JS paths

### Modifying Styles
- Main stylesheet: `css/styles.css`
- Mobile-specific styles: Inline in `index-mobile.html`


## 📚 Documentation

- **Notion Integration**: `docs/SETUP_NOTION_INTEGRATION.md`

## 🌐 Deployment

The website is ready for deployment to any static hosting service:
- Netlify
- Vercel
- AWS S3
- Any web server

## 📄 License

Personal website - All rights reserved.

---

**Contact**: stivi.canka@gmail.com  
**LinkedIn**: [linkedin.com/in/stivi-canka](https://linkedin.com/in/stivi-canka)  
**Location**: Toronto, Ontario, Canada
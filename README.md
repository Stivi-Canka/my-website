# Stivi Canka - Personal Website

A modern, responsive personal website built with vanilla HTML, CSS, and JavaScript. Features a clean design, smooth animations, and automated content management through Notion integration.

## Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, minimalist design with smooth animations
- **Notion Integration**: Automated content sync from Notion databases
- **Performance Optimized**: Fast loading times and smooth interactions
- **Accessibility**: WCAG compliant with proper semantic HTML
- **SEO Ready**: Optimized meta tags and structured data

## Project Structure

```text
my-website/
├── assets/                 # Images, PDFs, and other static assets
├── css/                   # Stylesheets
├── js/                    # JavaScript files
├── pages/                 # Individual page HTML files
│   ├── blog-posts/       # Individual blog post pages
│   ├── blog.html         # Blog listing page
│   ├── projects.html     # Projects showcase
│   ├── resume.html       # Resume/CV page
│   └── updates.html      # Updates timeline
├── docs/                 # Documentation
├── index.html            # Homepage
└── index-mobile.html     # Mobile-optimized homepage
```

## Technologies Used

- **HTML5**: Semantic markup and modern web standards
- **CSS3**: Flexbox, Grid, animations, and responsive design
- **JavaScript (ES6+)**: Modern JavaScript with async/await
- **Notion API**: Content management and automation
- **Font Awesome**: Icons and visual elements
- **Google Fonts**: Typography (JetBrains Mono, IBM Plex)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- A Notion account (for content management)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/my-website.git
cd my-website
```

2. Install dependencies:

```bash
npm install
```

3. Set up Notion integration (optional):

   - Follow the guide in `docs/SETUP_NOTION_INTEGRATION.md`
   - Create a `.env` file with your Notion credentials

4. Run the development server:

```bash
# For local development, you can use any static server
# For example, with Python:
python -m http.server 8000

# Or with Node.js:
npx serve .
```

## Content Management

The website supports automated content management through Notion:

- **Projects**: Automatically sync from your Notion projects database
- **Blog Posts**: Manage blog content through Notion
- **Updates**: Timeline of your professional updates

See `docs/SETUP_NOTION_INTEGRATION.md` for detailed setup instructions.

## Customization

### Styling

- Modify `css/styles.css` for design changes
- The CSS is organized with clear sections and comments
- Uses CSS custom properties for easy theming

### Content

- Update HTML files in the `pages/` directory
- Modify the homepage in `index.html`
- Add new blog posts in `pages/blog-posts/`

### Functionality

- JavaScript functionality is in `js/script.js`
- Notion integration is in `js/notion-sync.js`


## License

This project is open source and available under the [MIT License](LICENSE).
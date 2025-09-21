// Notion API Integration Script
// This script fetches data from your Notion databases and generates HTML content

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Database IDs (you'll need to get these from your Notion databases)
const PROJECTS_DATABASE_ID = process.env.NOTION_PROJECTS_DB_ID;
const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DB_ID;

// Function to fetch projects from Notion
async function fetchProjects() {
  try {
    const response = await notion.databases.query({
      database_id: PROJECTS_DATABASE_ID,
      sorts: [
        {
          property: 'Created',
          direction: 'descending',
        },
      ],
    });

    return response.results.map(page => {
      const properties = page.properties;
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.text?.content || 'Untitled Project',
        description: properties.Description?.rich_text?.[0]?.text?.content || '',
        technologies: properties.Technologies?.multi_select?.map(tech => tech.name) || [],
        liveUrl: properties['Live URL']?.url || '#',
        sourceUrl: properties['Source URL']?.url || '#',
        imageUrl: properties.Image?.files?.[0]?.file?.url || null,
        icon: properties.Icon?.select?.name || 'fas fa-code',
        featured: properties.Featured?.checkbox || false,
        status: properties.Status?.select?.name || 'Completed'
      };
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Function to fetch blog posts from Notion
async function fetchBlogPosts() {
  try {
    const response = await notion.databases.query({
      database_id: BLOG_DATABASE_ID,
      sorts: [
        {
          property: 'Published Date',
          direction: 'descending',
        },
      ],
    });

    return response.results.map(page => {
      const properties = page.properties;
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.text?.content || 'Untitled Post',
        excerpt: properties.Excerpt?.rich_text?.[0]?.text?.content || '',
        content: properties.Content?.rich_text?.[0]?.text?.content || '',
        publishedDate: properties['Published Date']?.date?.start || new Date().toISOString(),
        tags: properties.Tags?.multi_select?.map(tag => tag.name) || [],
        slug: properties.Slug?.rich_text?.[0]?.text?.content || '',
        featured: properties.Featured?.checkbox || false,
        status: properties.Status?.select?.name || 'Published'
      };
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Function to generate projects HTML
function generateProjectsHTML(projects) {
  const projectsHTML = projects.map(project => `
    <div class="project-cell">
      <div class="project-image">
        ${project.imageUrl ? 
          `<img src="${project.imageUrl}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">` :
          `<div class="image-placeholder">
            <i class="${project.icon}"></i>
          </div>`
        }
      </div>
      <div class="project-info">
        <h3>${project.title}</h3>
        <p class="project-tech">${project.technologies.join(' • ')}</p>
        <p>${project.description}</p>
        <div class="project-links">
          ${project.liveUrl !== '#' ? `<a href="${project.liveUrl}" class="project-link" target="_blank">Live Demo</a>` : ''}
          ${project.sourceUrl !== '#' ? `<a href="${project.sourceUrl}" class="project-link" target="_blank">Source</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  return `
    <div class="projects-grid">
      ${projectsHTML}
    </div>
  `;
}

// Function to generate blog HTML
function generateBlogHTML(blogPosts) {
  const blogHTML = blogPosts.map(post => `
    <div class="blog-post">
      <h2>${post.title}</h2>
      <p class="blog-meta">${new Date(post.publishedDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })} • ${post.tags.join(', ')}</p>
      <p>${post.excerpt}</p>
      <a href="blog/${post.slug}.html" class="read-more">Read More →</a>
    </div>
  `).join('');

  return blogHTML;
}

// Main function to update website content
async function updateWebsite() {
  console.log('🔄 Starting website update...');
  
  try {
    // Fetch data from Notion
    const [projects, blogPosts] = await Promise.all([
      fetchProjects(),
      fetchBlogPosts()
    ]);

    console.log(`📊 Fetched ${projects.length} projects and ${blogPosts.length} blog posts`);

    // Read current HTML files
    const projectsHTMLPath = path.join(__dirname, 'projects.html');
    const blogHTMLPath = path.join(__dirname, 'blog.html');
    
    let projectsHTML = fs.readFileSync(projectsHTMLPath, 'utf8');
    let blogHTML = fs.readFileSync(blogHTMLPath, 'utf8');

    // Replace the projects grid content
    const projectsGridRegex = /<div class="projects-grid">[\s\S]*?<\/div>/;
    const newProjectsGrid = generateProjectsHTML(projects);
    projectsHTML = projectsHTML.replace(projectsGridRegex, newProjectsGrid);

    // Replace the blog content
    const blogContentRegex = /<div class="blog-content">[\s\S]*?<\/div>/;
    const newBlogContent = `
      <div class="blog-content">
        <div class="page-header">
          <a href="index.html" class="back-link">← Back to Home</a>
          <div class="section-label">03. Blog</div>
        </div>
        ${generateBlogHTML(blogPosts)}
      </div>
    `;
    blogHTML = blogHTML.replace(blogContentRegex, newBlogContent);

    // Write updated files
    fs.writeFileSync(projectsHTMLPath, projectsHTML);
    fs.writeFileSync(blogHTMLPath, blogHTML);

    console.log('✅ Website updated successfully!');
    
    // Log summary
    console.log(`📈 Updated ${projects.length} projects and ${blogPosts.length} blog posts`);
    
  } catch (error) {
    console.error('❌ Error updating website:', error);
    process.exit(1);
  }
}

// Run the update
if (require.main === module) {
  updateWebsite();
}

module.exports = { updateWebsite, fetchProjects, fetchBlogPosts };

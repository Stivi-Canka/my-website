# Notion Database Integration Setup Guide

This guide will help you set up automatic synchronization between your Notion databases and your website.

## 🚀 Quick Setup

### Step 1: Create Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "My Website Sync")
4. Select your workspace
5. Click "Submit"
6. Copy the "Internal Integration Token" (starts with `secret_`)

### Step 2: Set Up Your Notion Databases

#### Projects Database Structure
Create a database with these properties:

| Property Name | Type | Description |
|---------------|------|-------------|
| Title | Title | Project name |
| Description | Rich Text | Project description |
| Technologies | Multi-select | Tech stack (React, Node.js, etc.) |
| Live URL | URL | Live demo link |
| Source URL | URL | Source code repository link |
| Image | Files & media | Project screenshot/image |
| Icon | Select | FontAwesome icon class (fas fa-code) |
| Featured | Checkbox | Whether to feature this project |
| Status | Select | Project status (Completed, In Progress, etc.) |
| Created | Created time | Auto-generated |

#### Blog Database Structure
Create a database with these properties:

| Property Name | Type | Description |
|---------------|------|-------------|
| Title | Title | Blog post title |
| Excerpt | Rich Text | Short description |
| Content | Rich Text | Full blog content |
| Published Date | Date | When the post was published |
| Tags | Multi-select | Blog post tags |
| Slug | Rich Text | URL-friendly slug |
| Featured | Checkbox | Whether to feature this post |
| Status | Select | Post status (Published, Draft, etc.) |

### Step 3: Share Databases with Integration

1. Open each database in Notion
2. Click the "Share" button (top right)
3. Click "Add people, emails, groups, or integrations"
4. Search for your integration name
5. Click "Invite"

### Step 4: Get Database IDs

1. Open your database in Notion
2. Look at the URL: `https://www.notion.so/your-workspace/DATABASE_ID?v=...`
3. Copy the DATABASE_ID (32-character string)

### Step 5: Set Up Environment Variables

1. Create a `.env` file in your project root
2. Add these environment variables:

```
NOTION_TOKEN=secret_your_integration_token_here
NOTION_PROJECTS_DB_ID=your_projects_database_id
NOTION_BLOG_DB_ID=your_blog_database_id
```

### Step 6: Install Dependencies

Run this command in your project directory:

```bash
npm install
```

### Step 7: Test the Integration

Run the sync script locally:

```bash
npm run sync
```

## 🔧 Configuration Options

### Customizing the Sync

Edit `notion-sync.js` to customize:

- **Property mappings**: Change how Notion properties map to HTML
- **Sorting**: Modify how projects/posts are ordered
- **Filtering**: Add conditions to show only certain items
- **Styling**: Customize the generated HTML structure

### Scheduling

You can set up automated syncing using:
- **Cron jobs** on your server
- **CI/CD pipelines** (GitLab CI, Jenkins, etc.)
- **Netlify Functions** with scheduled triggers
- **Vercel Cron Jobs**
- **AWS Lambda** with EventBridge

## 🎯 Advanced Features

### Webhook Integration (Real-time Updates)

For instant updates when you add content to Notion:

1. Set up a webhook endpoint (using Netlify Functions, Vercel API routes, etc.)
2. Configure Notion webhooks to call your endpoint
3. Trigger the sync script when changes occur

### Image Optimization

The script can automatically:
- Download images from Notion
- Optimize them for web
- Upload to a CDN
- Update image URLs in the generated HTML

### Content Caching

Add caching to avoid unnecessary API calls:
- Store last sync timestamp
- Only fetch changed items
- Use Notion's `last_edited_time` property

## 🐛 Troubleshooting

### Common Issues

1. **"Database not found" error**
   - Check your database ID
   - Ensure the integration has access to the database

2. **"Invalid token" error**
   - Verify your NOTION_TOKEN secret
   - Make sure the token starts with `secret_`

3. **Empty results**
   - Check property names match exactly
   - Ensure properties have the correct types
   - Verify data exists in your databases

### Debug Mode

Add this to your script for debugging:

```javascript
console.log('Projects:', projects);
console.log('Blog posts:', blogPosts);
```

## 📈 Monitoring

### Monitoring Sync

You can monitor your sync process by:
1. **Local testing**: Run `npm run sync` to test changes
2. **Log files**: Check console output for any errors
3. **Automated monitoring**: Set up alerts for failed syncs
4. **Manual triggers**: Run the sync script whenever needed

## 🚀 Next Steps

Once set up, your website will automatically update whenever you:
- Add new projects to your Notion database
- Update existing project information
- Publish new blog posts
- Modify blog content

The sync runs every hour, so changes will appear on your website within an hour of updating Notion.

## 💡 Pro Tips

1. **Use templates**: Create Notion templates for consistent project/blog post structure
2. **Batch updates**: Make multiple changes in Notion before the next sync
3. **Preview changes**: Test locally with `npm run sync` before pushing
4. **Backup**: Keep a backup of your HTML files before major changes
5. **Version control**: Consider using `[skip ci]` in commit messages to avoid triggering other workflows

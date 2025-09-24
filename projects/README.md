# Projects Directory

This directory contains all project entries for the website. Each project is represented by a JSON file that contains all the necessary information to display the project on the website.

## How to Add a New Project

1. **Create a project folder**: Create a new folder with the project name (e.g., `ecommerce-platform`)
2. **Add images**: Place all project images in this folder
3. **Create JSON file**: Create a new JSON file following the naming convention: `YYYY-MM-DD-project-name.json`
4. **Fill in the template**: Copy the content from `TEMPLATE.json` and fill in your project details
5. **Update the loader**: Add the new JSON filename to the `projectFiles` array in `js/project-loader.js`

## File Structure

```
projects/
├── README.md                    # This file
├── TEMPLATE.json               # Template for new projects
├── YYYY-MM-DD-project-name.json # Individual project files
└── project-name/               # Project image folders
    ├── image1.jpg
    ├── image2.jpg
    └── image3.jpg
```

## JSON Template Fields

- **id**: Unique identifier (use the same as filename without .json)
- **date**: Project completion/launch date (YYYY-MM-DD format)
- **title**: Project title (displayed as heading)
- **role**: Your role/position in the project (e.g., "Team Lead", "Founder & President")
- **projectDate**: Project timeline (e.g., "September 2022 - November 2023", "May 2023 - Present")
- **description**: Detailed project description
- **images**: Array of image paths relative to projects directory

## How to Remove a Project

1. Delete the JSON file for the project
2. Delete the project image folder
3. Remove the filename from the `projectFiles` array in `js/project-loader.js`

## Image Guidelines

- Use descriptive filenames (e.g., `homepage.jpg`, `dashboard.png`)
- Recommended formats: JPG, PNG, WebP
- Recommended size: 800x600px or similar aspect ratio
- Keep file sizes reasonable for web performance

## Example Project Entry

```json
{
    "id": "2024-12-01-ecommerce-platform",
    "date": "2024-12-01",
    "title": "E-commerce Platform",
    "role": "Full-Stack Developer",
    "projectDate": "August 2024 - December 2024",
    "description": "A comprehensive full-stack e-commerce solution built with React and Node.js, featuring advanced user authentication, secure payment processing, and real-time inventory management.",
    "images": [
        "ecommerce-platform/homepage.jpg",
        "ecommerce-platform/dashboard.png",
        "ecommerce-platform/checkout.jpg"
    ]
}
```

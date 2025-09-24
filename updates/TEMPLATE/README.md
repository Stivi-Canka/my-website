# Update Template

This folder contains the template structure for creating new updates.

## How to Create a New Update

1. **Create a new folder** with the naming pattern: `YYYY-MM-DD-update-name`
2. **Copy this template folder** and rename it to your update name
3. **Edit `metadata.json`** with your update information
4. **Add images** to the folder (hero image, additional photos, etc.)
5. **Add documents** if needed (PDFs, certificates, etc.)
6. **Update the main updates loader** to include your new update

## File Structure

- `metadata.json` - Contains all the update information
- `hero-image.jpg` - Main image for the update (optional)
- `additional-photo.jpg` - Additional images (optional)
- `document.pdf` - Any related documents (optional)

## Image Guidelines

- **Hero Image**: Should be the main visual for the update
- **Additional Photos**: Can be multiple images showing different aspects
- **Formats**: JPG, PNG, GIF supported
- **Size**: Recommended max 2MB per image for web performance

## Metadata Fields

- `id`: Unique identifier (YYYY-MM-DD-update-name)
- `date`: Publication date
- `title`: Update title
- `preview`: Short preview text (max 150 characters)
- `fullText`: Complete update text
- `featured`: Boolean for featured updates
- `images`: Array of image filenames
- `documents`: Array of document filenames
- `tags`: Array of tags for categorization

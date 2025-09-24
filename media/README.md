# Media Directory

This directory contains JSON files for media entries that are dynamically loaded on the media page.

## How to Add New Media Entries

1. **Create a new JSON file** in this directory with the naming convention: `YYYY-MM-DD-description.json`
   - Example: `2024-12-25-holiday-feature.json`

2. **Use the template** (`TEMPLATE.json`) as a starting point:
   ```json
   {
       "id": "YYYY-MM-DD-short-description",
       "date": "YYYY-MM-DD",
       "title": "Your Media Title Here",
       "link": "https://example.com/your-link-here",
       "featured": false
   }
   ```

3. **Update the media-loader.js file** to include your new file in the `mediaFiles` array:
   ```javascript
   const mediaFiles = [
       '2025-01-29-data-scientist.json',
       '2024-06-01-canada-university.json',
       '2024-05-29-university-medal.json',
       '2024-04-09-poster-prize.json',
       '2018-11-01-gold-medal-asia.json',
       '2024-12-25-holiday-feature.json', // Add your new file here
   ];
   ```

## JSON File Structure

- **id**: Unique identifier (usually matches filename without .json)
- **date**: Publication date in YYYY-MM-DD format
- **title**: Display title for the media entry
- **link**: URL to the media article/video
- **featured**: Boolean flag for highlighting important entries (optional)

## How to Remove Media Entries

1. **Delete the JSON file** from this directory
2. **Remove the filename** from the `mediaFiles` array in `js/media-loader.js`

## File Naming Convention

- Use format: `YYYY-MM-DD-description.json`
- Use hyphens to separate words in the description
- Keep descriptions short and descriptive
- Dates should match the actual publication date

## Examples

- `2024-12-25-holiday-feature.json` - Holiday feature article
- `2024-11-15-podcast-interview.json` - Podcast interview
- `2024-10-30-award-announcement.json` - Award announcement

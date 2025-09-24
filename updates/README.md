# Updates System - Simple Manual Method

This is a simple system for managing updates on your website.

## How to Add a New Update

### Step 1: Create the Update File
1. Copy `TEMPLATE.json` to a new file with the naming convention: `YYYY-MM-DD-descriptive-title.json`
2. Fill in all the required fields
3. Save the file

### Step 2: Update the JavaScript
1. Open `js/updates-loader.js`
2. Find the `updateFiles` array (around line 86)
3. Add your new filename to the list
4. Save the file

### Example:
If you create `2024-12-21-my-new-update.json`, add it to the list like this:

```javascript
const updateFiles = [
    '2021-12-15-new-project-launch.json',
    '2021-12-15-new-project-launch copy.json',
    '2024-09-20-open-source-contribution.json',
    '2024-12-21-my-new-update.json'  // Add your new file here
];
```

## How to Remove an Update

1. Delete the JSON file from the `updates/` folder
2. Remove the filename from the `updateFiles` array in `js/updates-loader.js`

## JSON Structure

Each update file should follow this structure:

```json
{
  "id": "2024-12-21-example-update",
  "date": "2024-12-21",
  "title": "Your Update Title",
  "preview": "Brief preview text (under 150 characters)...",
  "fullText": "Complete text for your update. This will be shown when users click 'Read more'.",
  "tags": ["tag1", "tag2", "tag3"],
  "featured": false
}
```

## File Naming Convention

- Format: `YYYY-MM-DD-descriptive-title.json`
- Example: `2024-12-21-new-project-launch.json`
- The date in the filename should match the date field in the JSON

## That's It!

This simple system gives you full control over your updates without any automation complexity.
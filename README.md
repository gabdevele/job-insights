# LinkedIn Job Insights Extension

> This extension shows insights and data that are not usually visible on LinkedIn job applications.

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)

## Features

### **Application insights**
- **Competition level analysis**: View the number of applications with color competition indicators
  - 🟢 **Low** (< 50 applications)
  - 🟡 **Medium** (50-200 applications) 
  - 🔴 **High** (> 200 applications)

### **Company information**
- **Company size categories**: Micro, Small, Medium, Large with exact employee counts
- **Remote work availability**: Clear indication of remote work options

### **Timing data**
- **Posted date**: When the job was originally listed
- **Application deadline**: When applications close

### **Job details**
- **Experience level required**: Entry, Mid, Senior level positions
- **Employment type**: Full-time, Part-time, Contract, Internship

## Screenshots



## Installation

### For users
1. Download the extension from Chrome Web Store *(coming soon)*
2. Click "Add to Chrome"
3. Navigate to any LinkedIn job posting
4. The insights card will automatically appear below the job description

### For devs
1. **Clone the repository**
   ```bash
   git clone https://github.com/gabdevele/job-insights.git
   cd job-insights
   ```

2. **Install dependencies**
   ```bash
   pnpm i
   ```

3. **Build the extension**
   ```bash
   pnpm run build
   ```

4. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

## Details

### Architecture
- **Manifest V3** Chrome Extension
- **React** for UI components
- **Webpack** for bundling
- **API Interception** using XMLHttpRequest hooking

### How it works
1. **Injector Script**: Intercepts LinkedIn's internal API calls at `document_start`
2. **Data Caching**: Stores job data to handle LinkedIn's request caching
3. **URL Monitoring**: Tracks navigation to display cached data instantly
4. **React UI**: Renders insights in a card

### Security and privacy
- **No external API calls**
- **No data collection**
- **Open source** 



## Bug Reports & Feature Requests

Found a bug or have a feature request? Please [open an issue](https://github.com/gabdevele/job-insights/issues) on GitHub.

---

<div align="center">
  <p>⭐ If this extension helped, please star this repository! ⭐</p>
</div>
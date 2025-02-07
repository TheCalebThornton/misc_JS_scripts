# JavaScript Scripts Collection

## Overview
This repository contains a collection of independent JavaScript projects and scripts. Each subfolder represents a standalone project that can be executed independently with its own server configuration.

## Repository Structure
Each subfolder follows this general structure:
- `package.json` - Project dependencies and scripts
- `server.js` - Individual server configuration 
- Project-specific source files
- Project-specific README with detailed instructions

## Current Projects

### HubSpot
- API integration assessment
- Runs on port 8080
- See subfolder README for detailed setup

## Getting Started

### Prerequisites
- Node.js installed on your system
- npm or yarn package manager

### Running a Project
1. Navigate to the desired project subfolder:
   ```bash
   cd <project-folder>
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Start the project server:
   ```bash
   npm start
   ```
4. Follow the project-specific README for additional setup and usage instructions

## Adding New Projects
1. Create a new subfolder for your project
2. Include a package.json with required dependencies
3. Set up an independent server.js if needed
4. Add a README with project-specific instructions

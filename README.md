# StashSpark

CodePath WEB103 Final Project

Designed and developed by: Annie

🔗 Link to deployed app: 

## About

### Description and Purpose

StashSpark is a personal bookmarking and knowledge organization web app that helps users turn random online saves into meaningful insights.  
Instead of letting thousands of saved links pile up, users can organize them, generate quick AI summaries, take personal notes, and review them periodically through a lightweight spaced-review system.  

The goal is to transform passive collecting into active learning — helping users actually remember and use what they save.

### Inspiration

I realized I often save hundreds of posts, threads, and articles across platforms but rarely revisit them. I wanted a simple app that not only keeps everything in one place but also helps me digest the content.  
StashSpark is inspired by tools like Notion, Readwise, and bookmarking extensions — but reimagined as a focused, minimalist system that fits a student or developer’s daily workflow.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS  
**Backend:** Node.js, Express, PostgreSQL (Render-hosted)

## Features

### User Authentication (Baseline)
Secure login/logout system to let each user manage their own bookmarks.

### Add and Manage Bookmarks (Baseline)
Users can add a new bookmark by pasting a URL. The app automatically extracts the title and domain for easy organization.

### Personal Notes (Baseline)
Each bookmark has a built-in notes section for users to jot down reflections or summaries in plain text or Markdown.

### AI Summary Generator (Custom)
Optional AI-powered summary generation for saved articles. Users can quickly get a short synopsis before reading the full text.

### Review Today (Custom)
A spaced-review feature that reminds users to revisit saved content at custom intervals (1 day, 3 days, 7 days, etc.).

### Search and Filter (Baseline)
Simple search bar for finding bookmarks by title or note content. Optional tag-based filtering can be enabled later.

### Optional Tag System (Stretch)
Modular tagging system that can be turned on/off through a feature flag without breaking the app’s structure.

## Installation Instructions


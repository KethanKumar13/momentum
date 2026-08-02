# 🚀 TaskFlow

> A modern, responsive Task Management Dashboard built with React, Vite, and a reusable component architecture.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![CSS](https://img.shields.io/badge/CSS3-Modern-blue?logo=css3)
---

## 📖 Overview

TaskFlow is a modern Task Management Dashboard designed with a clean, scalable architecture and a reusable component-based approach.

The project focuses on building production-ready frontend architecture while implementing modern UI/UX principles 

Rather than being just another CRUD application, TaskFlow is being developed as a quality SaaS product that will eventually include authentication, backend integration, analytics, collaboration, and AI-powered productivity features.

---

# ✨ Features

## 📋 Task Management

- Create new tasks
- Delete tasks
- Mark tasks as completed
- Undo completed tasks
- Real-time task statistics
- Priority management
- Due date management
- Assigned user support

---

## 🔍 Search & Filtering

- Search tasks instantly
- Filter by status
- Filter by priority
- Sort tasks by newest/oldest

---

## 📊 Dashboard Analytics

Dashboard automatically displays

- Total Tasks
- Pending Tasks
- Completed Tasks
- High Priority Tasks

with live updates.

---

## 🎨 Modern UI

- Dark Theme
- Responsive Layout
- Glassmorphism-inspired cards
- Modern dashboard hero
- Smooth hover animations
- Professional navigation
- Modern typography
- Reusable buttons
- Responsive dashboard layout

---

## ♻️ Reusable Components

Current reusable UI library includes:

- Button
- Input
- Search Input
- Empty State
- Task Card
- Dashboard Cards

More reusable components are planned.

---

## 💾 Local Storage

Tasks are persisted using browser Local Storage through reusable custom hooks.

---

## 🏗️ Project Structure

```
src
│
├── assets
│
├── components
│   │
│   ├── Dashboard
│   ├── Navbar
│   ├── Task
│   └── ui
│       ├── Button
│       ├── Input
│       ├── SearchInput
│       ├── EmptyState
│       ├── Card
│       ├── Loader
│       └── Modal
│
├── context
│
├── hooks
│
├── layouts
│
├── pages
│
├── routes
│
├── services
│
├── styles
│
└── utils
```

---

# ⚙️ Tech Stack

## Frontend

- React 19
- Vite
- JavaScript (ES6+)
- CSS3
- Lucide React Icons

---

## Tooling

- ESLint
- Prettier
- Husky
- lint-staged
- Git
- GitHub

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/<your-github-username>/taskflow.git
```

Navigate into the project

```bash
cd taskflow
```

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

Build production version

```bash
npm run build
```

Run ESLint

```bash
npm run lint
```

---

# 🧩 Current Architecture

TaskFlow follows a scalable architecture based on reusable components.

```
Dashboard
      │
      ▼
Task Components
      │
      ▼
Reusable UI Components
      │
      ▼
Custom Hooks
      │
      ▼
Services
      │
      ▼
Local Storage
```

This architecture makes it easy to replace Local Storage with a REST API in future versions.

---

# 📁 Current Features

| Feature | Status |
|----------|--------|
| Dashboard | ✅ |
| Task Management | ✅ |
| Add Task | ✅ |
| Delete Task | ✅ |
| Complete Task | ✅ |
| Undo Completion | ✅ |
| Search | ✅ |
| Status Filter | ✅ |
| Priority Filter | ✅ |
| Sorting | ✅ |
| Dashboard Statistics | ✅ |
| Responsive Layout | ✅ |
| Dark Theme | ✅ |
| Local Storage | ✅ |
| Reusable Components | ✅ |

---
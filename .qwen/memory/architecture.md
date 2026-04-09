# Orion Soft Systems - System Architecture

## Deployment
- Hosting: cPanel (production)
- Domain: https://www.orionsoftsystems.com.ng
- Backend runs on same domain (Node.js)

## Frontend
- Static HTML, CSS, JavaScript
- Pages:
  - index.html
  - login.html
  - register.html
  - dashboard.html
  - pricing.html
  - projects.html
  - contact.html
  - about.html

## Backend
- Node.js (Express)
- API routes under /api
- Database: PostgreSQL

## AI Integration
- OpenAI API
- DeepSeek API

## Goals
- Fully functional SaaS platform
- AI assistant embedded on all pages
- Blog automation system
- Multilingual support (English, Igbo, Arabic)
- Ideas page with AI demos
- Social media integration
- Production-grade UI/UX

## Rules
- Never use localhost in production
- Always use https://www.orionsoftsystems.com.ng/api
- Maintain scalable and clean architecture

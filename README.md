# QAForge — AI-Powered QA Test Management Platform

![CI](https://github.com/YOUR_USERNAME/qaforge/actions/workflows/ci.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![License](https://img.shields.io/badge/license-MIT-green)

> Generate structured test cases from PRDs using AI, manage your entire QA lifecycle, and export directly to Jira or TestRail.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🤖 **AI Generation** | Upload a PRD or user story → Claude AI generates structured test cases instantly |
| 📋 **Test Case Management** | Full CRUD, filtering by status/tag, versioning, run history |
| 🔗 **Traceability Matrix** | Requirement ↔ Test Case coverage mapping |
| ⚙️ **Automation Tracking** | CI pipeline result dashboard (GitHub Actions integration) |
| 📤 **Export** | One-click export to Jira, TestRail, CSV, or JSON |
| 👥 **Role-Based Access** | QA, Developer, and Manager roles with distinct permissions |

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/qaforge.git
cd qaforge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Open `.env` and add your Anthropic API key:

```
REACT_APP_ANTHROPIC_API_KEY=sk-ant-...
```

Get your key at [console.anthropic.com](https://console.anthropic.com/).

### 4. Run the development server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Role-Based Access Control

| Permission | QA Engineer | Developer | Manager |
|------------|:-----------:|:---------:|:-------:|
| View test cases | ✅ | ✅ | ✅ |
| Create / Edit tests | ✅ | ❌ | ✅ |
| Delete tests | ✅ | ❌ | ✅ |
| Export data | ✅ | ❌ | ✅ |
| AI generation | ✅ | ❌ | ✅ |
| Manage team | ❌ | ❌ | ✅ |

---

## 🤖 AI Test Case Generation

1. Navigate to **AI Generate** in the sidebar
2. Paste your PRD, user story, or acceptance criteria
3. Click **Generate with AI**
4. Review the generated test cases (title, steps, priority, tags, automation type)
5. Click **Import** to add them to your test suite

**Tip:** The more detailed your PRD, the higher quality test cases you'll get.

---

## 📤 Export Integrations

| Format | Use Case |
|--------|----------|
| **Jira** | Creates issues with test steps as checklists |
| **TestRail** | Full test case structure with sections |
| **CSV** | Download for Excel / Google Sheets |
| **JSON** | Custom integrations and APIs |

---

## 🏗️ Tech Stack

- **Frontend:** React 18, plain CSS-in-JS (no external UI library)
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`)
- **CI/CD:** GitHub Actions
- **Fonts:** DM Sans + DM Mono (Google Fonts)

---

## 📁 Project Structure

```
qaforge/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── QAForgePlatform.jsx   # Main application (all views)
│   ├── App.jsx
│   └── index.js
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions CI pipeline
├── .env.example                  # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ GitHub Actions CI

The included workflow (`.github/workflows/ci.yml`) automatically:
- Runs on every push to `main` / `develop` and all pull requests
- Installs dependencies with `npm ci`
- Builds the production bundle
- Uploads the build artifact

To enable AI features in CI, add your Anthropic API key as a GitHub secret:

> **Settings → Secrets and variables → Actions → New repository secret**
> Name: `ANTHROPIC_API_KEY`

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server at localhost:3000 |
| `npm run build` | Build optimized production bundle |
| `npm test` | Run test suite |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT © 2025 — Built with ❤️ using React + Claude AI

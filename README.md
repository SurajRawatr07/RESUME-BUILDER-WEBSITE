<div align="center">

# 🚀 Resume Craft

### Professional • ATS-Friendly • Modern Resume Builder

Create **clean, professional, and ATS-friendly resumes** with modern templates, live preview, ATS analysis, and high-quality PDF export.

<p>
  <a href="https://resume-craft-07.vercel.app/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_Website-111111?style=for-the-badge" />
  </a>
  <a href="https://github.com/SurajRawatr07/RESUME-BUILDER-WEBSITE">
    <img src="https://img.shields.io/badge/GitHub-Repository-111111?style=for-the-badge&logo=github" />
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=flat-square&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-EF008F?style=flat-square&logo=framer&logoColor=white" />
</p>

</div>

---

## ✨ Overview

**Resume Craft** is a modern web-based resume builder designed for students, developers, freshers, and professionals who want to create polished and ATS-friendly resumes without dealing with complicated document formatting.

The platform provides a structured resume editor, professional templates, real-time preview, ATS analysis, theme support, and PDF export in a single workflow.

---

## 🎯 Why Resume Craft?

- 📝 Build resumes section by section
- 🎨 Choose from professional resume templates
- 👀 Preview changes in real time
- 🤖 Analyze resumes for ATS compatibility
- 📄 Export resumes as PDF
- 🔗 Add clickable professional links
- 🌙 Switch between Light and Dark themes
- 📱 Use the application across desktop, tablet, and mobile
- ⚡ Fast and responsive editing experience

---

## 🚀 Features

| Feature | Description |
|---|---|
| 📄 Resume Builder | Create and edit structured resumes |
| 🎨 Professional Templates | Multiple modern and ATS-friendly layouts |
| 👀 Live Preview | Instantly preview resume changes |
| 🤖 ATS Checker | Analyze resume structure, keywords, and ATS score |
| 📥 PDF Export | Generate and download a professional PDF |
| 🔗 Social Links | Add GitHub, LinkedIn, Portfolio, Email, Phone, and LeetCode |
| 🎓 Education Section | Add multiple education records |
| 💼 Experience Section | Manage internships and professional experience |
| 🚀 Projects Section | Showcase projects with technology and links |
| 🛠️ Skills Section | Organize technical and professional skills |
| 🏆 Certifications | Add certificates and credential links |
| 📊 Dashboard | Manage created resumes from one place |
| 🌙 Theme System | Smooth Light / Dark mode |
| 📱 Responsive Design | Optimized for mobile, tablet, and desktop |
| ✨ Modern UI | Clean interface with subtle animations |

---

## 🧩 How Resume Craft Works

```mermaid
flowchart LR
    A[👤 User] --> B[📝 Create Resume]
    B --> C[🎨 Select Template]
    C --> D[✏️ Enter Resume Data]
    D --> E[👀 Live Preview]
    E --> F[🤖 ATS Analysis]
    F --> G[📄 Generate Resume]
    G --> H[⬇️ Download PDF]

    F -->|Improve Score| D
    E -->|Change Template| C
```

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    USER[👤 User]

    DASHBOARD[📊 Dashboard]
    BUILDER[📝 Resume Builder]
    TEMPLATES[🎨 Template Gallery]
    PREVIEW[👀 Live Preview]
    ATS[🤖 ATS Checker]
    EXPORT[📄 PDF Exporter]
    THEME[🌙 Theme Manager]

    USER --> DASHBOARD
    DASHBOARD --> BUILDER
    DASHBOARD --> TEMPLATES

    BUILDER --> PREVIEW
    BUILDER --> ATS

    TEMPLATES --> PREVIEW
    PREVIEW --> EXPORT

    ATS --> BUILDER
    THEME --> DASHBOARD
    THEME --> BUILDER
    THEME --> PREVIEW
```

---

## 📐 Resume Craft Class Diagram

```mermaid
classDiagram
    direction TB

    class User {
        +register()
        +login()
        +logout()
        +viewDashboard()
        +manageResumes()
    }

    class Dashboard {
        +viewResumes()
        +createResume()
        +editResume()
        +deleteResume()
        +duplicateResume()
        +openTemplates()
    }

    class Resume {
        +createResume()
        +editResume()
        +saveResume()
        +setPersonalInfo()
        +setEducation()
        +setExperience()
        +setProjects()
        +setSkills()
        +setCertifications()
    }

    class PersonalInfo {
        +setFullName()
        +setEmail()
        +setPhone()
        +setLocation()
        +setWebsite()
        +setGithub()
        +setLinkedIn()
        +setLeetCode()
    }

    class Education {
        +addEducation()
        +editEducation()
        +removeEducation()
    }

    class Experience {
        +addExperience()
        +editExperience()
        +removeExperience()
    }

    class Projects {
        +addProject()
        +editProject()
        +removeProject()
        +addProjectLink()
    }

    class Skills {
        +addTechnicalSkill()
        +addSoftSkill()
        +editSkill()
        +removeSkill()
    }

    class Certifications {
        +addCertificate()
        +editCertificate()
        +removeCertificate()
    }

    class TemplateGallery {
        +viewTemplates()
        +searchTemplates()
        +filterTemplates()
        +previewTemplate()
        +selectTemplate()
    }

    class Template {
        +templateId
        +templateName
        +category
        +layout
        +applyTemplate()
        +renderTemplate()
    }

    class DemoResume {
        +loadDemoData()
        +viewDemoResume()
        +previewDemoTemplate()
    }

    class ATSChecker {
        +analyzeResume()
        +calculateScore()
        +checkKeywords()
        +findMissingSections()
        +generateSuggestions()
    }

    class ResumePreview {
        +renderResume()
        +updatePreview()
        +zoomIn()
        +zoomOut()
        +printResume()
    }

    class PDFExporter {
        +generatePDF()
        +downloadPDF()
        +setPageSize()
        +setFileName()
    }

    class ThemeManager {
        +currentTheme
        +toggleTheme()
        +setLightMode()
        +setDarkMode()
        +saveTheme()
    }

    User --> Dashboard : accesses
    User --> Resume : creates

    Dashboard --> Resume : manages
    Dashboard --> TemplateGallery : opens

    Resume *-- PersonalInfo : contains
    Resume *-- Education : contains
    Resume *-- Experience : contains
    Resume *-- Projects : contains
    Resume *-- Skills : contains
    Resume *-- Certifications : contains

    Resume --> Template : uses
    TemplateGallery --> Template : displays
    TemplateGallery --> DemoResume : previews

    DemoResume --> Template : demonstrates
    DemoResume --> ResumePreview : renders

    Resume --> ResumePreview : generates
    ResumePreview --> Template : applies

    Resume --> ATSChecker : analyzes
    ATSChecker --> Resume : evaluates

    ResumePreview --> PDFExporter : exports
    PDFExporter --> Resume : converts

    ThemeManager --> Dashboard : controls
    ThemeManager --> ResumePreview : controls
```

---

## 🛠️ Tech Stack

### Frontend

- **React 18+**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**

### Core Functionality

- Resume data management
- Dynamic template rendering
- Real-time resume preview
- ATS score analysis
- PDF generation
- Responsive design
- Theme management

---

## 📂 Project Structure

```text
Resume-Craft/
│
├── public/
│   ├── assets/
│   └── ...
│
├── src/
│   ├── components/
│   │   ├── resume/
│   │   ├── templates/
│   │   ├── dashboard/
│   │   ├── ats/
│   │   └── ui/
│   │
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── data/
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SurajRawatr07/RESUME-BUILDER-WEBSITE.git
```

### 2. Navigate to the project

```bash
cd RESUME-BUILDER-WEBSITE
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start development server

```bash
npm run dev
```

### 5. Open in browser

```text
http://localhost:5173
```

---

## 🎨 Design Philosophy

Resume Craft follows a clean and professional visual language focused on readability and usability.

### Design Principles

- Minimal and professional interface
- Strong typography hierarchy
- ATS-friendly resume layouts
- Consistent spacing
- Responsive components
- Subtle motion and micro-interactions
- Light and Dark theme support
- No unnecessary visual clutter

---

## 📱 Responsive Experience

Resume Craft is designed to work across:

```text
📱 Mobile
   ↓
📲 Tablet
   ↓
💻 Laptop
   ↓
🖥️ Desktop
```

The interface adapts navigation, forms, template previews, cards, and resume layouts according to screen size.

---

## 🔄 Application Flow

```mermaid
flowchart TD
    START([🚀 Start]) --> AUTH{👤 User}

    AUTH -->|New User| REGISTER[📝 Register]
    AUTH -->|Existing User| LOGIN[🔐 Login]

    REGISTER --> DASHBOARD[📊 Dashboard]
    LOGIN --> DASHBOARD

    DASHBOARD --> NEW[➕ New Resume]
    DASHBOARD --> EXISTING[📄 Existing Resume]

    NEW --> TEMPLATE[🎨 Choose Template]
    EXISTING --> EDIT[✏️ Edit Resume]

    TEMPLATE --> EDIT

    EDIT --> INFO[👤 Personal Information]
    INFO --> EDUCATION[🎓 Education]
    EDUCATION --> EXPERIENCE[💼 Experience]
    EXPERIENCE --> PROJECTS[🚀 Projects]
    PROJECTS --> SKILLS[🛠️ Skills]
    SKILLS --> CERTS[🏆 Certifications]

    CERTS --> PREVIEW[👀 Live Preview]

    PREVIEW --> ATS[🤖 ATS Analysis]

    ATS --> SCORE{📊 ATS Score}

    SCORE -->|Needs Improvement| EDIT
    SCORE -->|Ready| PDF[📄 Generate PDF]

    PDF --> DOWNLOAD[⬇️ Download Resume]
    DOWNLOAD --> END([✅ Complete])
```

---

## 📈 Development Roadmap

```mermaid
flowchart LR
    A[✅ Resume Builder] --> B[✅ Templates]
    B --> C[✅ Live Preview]
    C --> D[✅ ATS Checker]
    D --> E[✅ PDF Export]
    E --> F[✅ Responsive UI]
    F --> G[🔄 Advanced Resume Analytics]
    G --> H[🔄 AI Resume Suggestions]
    H --> I[🔄 Job Description Matching]
```

---

## 🔮 Future Improvements

- 🤖 AI-powered resume improvement
- 🎯 Job description keyword matching
- 📊 Advanced ATS analytics
- ✨ More professional templates
- 📄 Multiple export formats
- 🔗 Public resume sharing
- 📈 Resume performance insights
- ☁️ Cloud resume storage
- 👥 Resume collaboration
- 🌐 Custom resume URLs

---

## 🌐 Live Project

<p align="center">

<a href="https://resume-craft-07.vercel.app/">
  <img src="https://img.shields.io/badge/🚀_Open_Resume_Craft-111111?style=for-the-badge" />
</a>

</p>

---

## 👨‍💻 Author

<div align="center">

### Suraj Rawat

**BCA Computer Science Student · MERN Stack Developer · Open Source Contributor**

<p>
  <a href="https://github.com/SurajRawatr07">
    <img src="https://img.shields.io/badge/GitHub-SurajRawatr07-111111?style=for-the-badge&logo=github" />
  </a>
  <a href="https://www.linkedin.com/in/suraj-rawat-30513b340/">
    <img src="https://img.shields.io/badge/LinkedIn-Suraj_Rawat-0A66C2?style=for-the-badge&logo=linkedin" />
  </a>
</p>

</div>

---

## ⭐ Support

If you find **Resume Craft** useful, consider giving the repository a ⭐ on GitHub.

Your support helps improve the project and motivates further development.

---

<div align="center">

### 🚀 Resume Craft

**Build a better resume. Build a better career.**

Made with ❤️ by **Suraj Rawat**

</div>

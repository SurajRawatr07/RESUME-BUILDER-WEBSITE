import { ResumeData, TemplateType } from '@/types/resume';

export const BASE_DEMO_DATA: ResumeData = {
  fullName: 'Suraj Rawat',
  jobTitle: 'Software Engineer',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  github: 'github.com/alexmorgan',
  linkedin: 'linkedin.com/in/alexmorgan',
  portfolio: 'alexmorgan.dev',
  leetcode: 'leetcode.com/u/alexmorgan',
  aboutMe: 'Results-driven software engineer with 4+ years of experience engineering high-throughput microservices, scalable distributed architectures, and responsive web applications.',
  summary: 'Software Engineer with expertise in full-stack architecture, distributed systems, and API design. Proven track record of architecting cloud-native services processing 20M+ daily events with 99.99% availability. Strong foundation in Data Structures, Algorithms, System Design, and automated CI/CD pipelines.',
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      institution: 'Columbia University',
      location: 'New York, NY',
      graduationDate: '2020 – 2024',
      gpa: '3.88 / 4.0',
      coursework: 'Data Structures & Algorithms, Distributed Systems, Operating Systems, Database Management, Computer Networks',
      description: 'Coursework: Distributed Systems, Advanced Algorithms, Computer Networks, Database Architecture. Dean\'s Honors List.',
    },
  ],
  skills: [
    'Distributed Systems',
    'Data Structures & Algorithms',
    'Object-Oriented Design',
    'RESTful & GraphQL APIs',
    'Cloud-Native Microservices',
    'Database Optimization',
    'CI/CD & DevOps Automation',
    'System Performance Tuning',
  ],
  technologies: [
    'TypeScript', 'JavaScript', 'Python', 'Go', 'Java', 'SQL',
    'React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'GraphQL',
    'PostgreSQL', 'Redis', 'MongoDB', 'Kafka',
    'Docker', 'Kubernetes', 'AWS', 'Terraform', 'Git', 'GitHub Actions'
  ],
  experiences: [
    {
      id: 'exp-1',
      jobTitle: 'Senior Software Engineer',
      company: 'Apex Cloud Systems',
      location: 'New York, NY',
      startDate: '2024',
      endDate: 'Present',
      current: true,
      description: '• Architected resilient microservices in Go and Node.js handling 18M+ daily requests, improving 99th-percentile response latency by 32%.\n• Designed and implemented distributed caching tier using Redis clusters, cutting database read load by 45%.\n• Spearheaded migration from legacy monolithic backend to containerized Kubernetes workloads on AWS, cutting infrastructure cloud spend by $140,000 annually.\n• Mentored 5 junior and mid-level engineers on system design patterns, automated unit testing, and zero-downtime deployment strategies.',
    },
    {
      id: 'exp-2',
      jobTitle: 'Software Engineer',
      company: 'Veloce Data Labs',
      location: 'New York, NY',
      startDate: '2022',
      endDate: '2024',
      current: false,
      description: '• Built event-driven data ingestion pipeline in Python and Kafka processing 500GB+ daily telemetry data with sub-second ingestion latency.\n• Engineered secure OAuth2/JWT authentication middleware supporting multi-tenant access control for 120,000+ enterprise users.\n• Optimized complex PostgreSQL queries and index strategies, reducing transaction execution times from 450ms to under 35ms.\n• Implemented comprehensive automated test suites achieving 92% code coverage with GitHub Actions CI/CD.',
    },
    {
      id: 'exp-3',
      jobTitle: 'Software Engineering Intern',
      company: 'Horizon Technologies',
      location: 'Boston, MA',
      startDate: '2021',
      endDate: '2022',
      current: false,
      description: '• Developed responsive client-facing analytics dashboards using React, TypeScript, and Tailwind CSS adopted by 40,000+ active users.\n• Created RESTful API endpoints in Express.js with input validation, rate limiting, and structured logging.\n• Reduced frontend bundle payload by 28% through code-splitting, tree-shaking, and asset optimization.',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'DistriKV — Distributed In-Memory Key-Value Store',
      technologies: 'Go, Raft Consensus, gRPC, Docker',
      startDate: '2024',
      endDate: '2025',
      description: '• Engineered fault-tolerant distributed key-value storage engine implementing Raft consensus protocol for leader election and log replication.\n• Benchmarked throughput reaching 85,000 operations/sec under linearizable read/write workloads across 5 distributed nodes.',
      link: 'github.com/alexmorgan/distrikv',
    },
    {
      id: 'proj-2',
      title: 'OmniFlow — Real-Time Collaborative Canvas',
      technologies: 'TypeScript, React, WebSockets, Node.js, Redis',
      startDate: '2023',
      endDate: '2024',
      description: '• Developed real-time collaborative workspace supporting concurrent multi-user editing with Conflict-Free Replicated Data Types (CRDTs).\n• Synchronized document state over WebSockets with under 15ms broadcast latency for up to 100 simultaneous room collaborators.',
      link: 'github.com/alexmorgan/omniflow',
    },
    {
      id: 'proj-3',
      title: 'CloudMesh — Microservice Service Mesh Proxy',
      technologies: 'Rust, Docker, Kubernetes, Prometheus',
      startDate: '2023',
      endDate: '2023',
      description: '• Implemented lightweight reverse-proxy sidecar managing mTLS encryption, rate limiting, and distributed tracing telemetry across microservices.',
      link: 'github.com/alexmorgan/cloudmesh',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      date: '2024',
      link: 'aws.amazon.com/certification',
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      date: '2023',
    },
  ],
  achievements: [
    'Winner (1st Place out of 180 teams) — HackColumbia Global Hackathon 2023',
    'LeetCode Top 0.5% Globally (Rating 2350+, 800+ algorithmic problems solved)',
    'Published Technical Article on Distributed Consensus with 45,000+ views on High Scalability',
  ],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Native' },
    { id: 'lang-2', language: 'Spanish', proficiency: 'Professional' },
  ],
  interests: ['Distributed Systems', 'Open Source Tooling', 'High-Performance Computing', 'Marathon Running'],
};

// Role-specific demo profiles for each template
export const ROLE_DEMO_DATA: Record<string, ResumeData> = {
  // 1. FRONTEND DEVELOPER
  frontend: {
    ...BASE_DEMO_DATA,
    jobTitle: 'Frontend Engineer / React Specialist',
    aboutMe: 'Frontend Engineer specialized in React, Next.js, TypeScript, and modern web performance. Dedicated to building accessible, pixel-perfect user interfaces.',
    summary: 'Frontend Engineer with 4+ years of experience delivering high-performance web applications using React, Next.js, and TypeScript. Expert in design systems, state management, web vitals optimization (98+ Lighthouse scores), and WCAG 2.1 AA accessibility compliance.',
    skills: [
      'React & Next.js Architecture',
      'TypeScript & Modern JavaScript',
      'Tailwind CSS & CSS Architecture',
      'State Management (Redux, Zustand)',
      'Data Fetching (React Query, SWR)',
      'Web Vitals & Performance Tuning',
      'Component Design Systems',
      'Automated Testing (Jest, Playwright)',
    ],
    technologies: [
      'React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3',
      'Tailwind CSS', 'Redux Toolkit', 'Zustand', 'React Query',
      'Webpack', 'Vite', 'GraphQL', 'REST APIs', 'Jest', 'Playwright', 'Git'
    ],
    experiences: [
      {
        id: 'fe-exp-1',
        jobTitle: 'Senior Frontend Developer',
        company: 'Nova Interactive Labs',
        location: 'New York, NY',
        startDate: '2024',
        endDate: 'Present',
        current: true,
        description: '• Architected core design system comprising 45+ reusable accessible React components, accelerating feature shipment velocity by 35% across 4 engineering teams.\n• Optimized Core Web Vitals across company flagship web application, reducing Largest Contentful Paint (LCP) by 1.2s and elevating mobile Lighthouse score to 99.\n• Migrated complex client-side state machine to Zustand and TanStack Query, eliminating 60% of unnecessary DOM re-renders.\n• Enforced strict WCAG 2.1 AA accessibility standards, audited with Axe and screen readers.',
      },
      {
        id: 'fe-exp-2',
        jobTitle: 'Frontend Engineer',
        company: 'Pulse Digital Media',
        location: 'New York, NY',
        startDate: '2022',
        endDate: '2024',
        current: false,
        description: '• Engineered dynamic dashboard interfaces in Next.js & TypeScript utilized by 150,000+ monthly active analytics users.\n• Implemented streaming server-side rendering (SSR) and route-level code splitting, cutting initial bundle payload from 480KB to 160KB.\n• Collaborated closely with Product and UX teams in Figma to translate complex specifications into responsive, resilient web interfaces.',
      },
    ],
    projects: [
      {
        id: 'fe-proj-1',
        title: 'PrismUI — Headless Design System & Component Library',
        technologies: 'React, TypeScript, Tailwind CSS, Radix UI, Storybook',
        startDate: '2024',
        endDate: '2025',
        description: '• Built accessible, headless design system with full keyboard navigation, automated dark/light theming, and ARIA 1.2 pattern support.\n• Documented with interactive Storybook sandbox and published to NPM with 15,000+ monthly downloads.',
        link: 'github.com/alexmorgan/prism-ui',
      },
      {
        id: 'fe-proj-2',
        title: 'SaaS MetricFlow — Real-Time Analytics Dashboard',
        technologies: 'Next.js 14, TypeScript, Recharts, Tailwind CSS',
        startDate: '2023',
        endDate: '2024',
        description: '• Created high-frequency financial metrics dashboard rendering 10,000+ data points smoothly at 60 FPS utilizing HTML5 Canvas and SVG virtualization.',
        link: 'github.com/alexmorgan/metric-flow',
      },
    ],
  },

  // 2. BACKEND DEVELOPER
  backend: {
    ...BASE_DEMO_DATA,
    jobTitle: 'Backend Engineer / API Architect',
    aboutMe: 'Backend Engineer specializing in resilient distributed services, microservices, high-throughput REST/GraphQL APIs, and database engineering.',
    summary: 'Backend Engineer with 5 years of engineering high-concurrency server applications and database architectures. Specialized in Node.js, Express, Go, PostgreSQL, Redis, and message broker architectures handling millions of daily transactions with sub-50ms latency.',
    skills: [
      'REST & GraphQL API Architecture',
      'Microservices & Event-Driven Systems',
      'Relational & NoSQL Database Design',
      'Authentication & Authorization (JWT, OAuth2)',
      'Message Queues (Kafka, RabbitMQ)',
      'Caching Strategies & Redis Clustering',
      'Docker & Container Orchestration',
      'Server Performance & Load Profiling',
    ],
    technologies: [
      'Node.js', 'Express', 'Go', 'Python', 'TypeScript', 'SQL',
      'PostgreSQL', 'MongoDB', 'Redis', 'Kafka', 'RabbitMQ',
      'Docker', 'AWS (ECS, S3, RDS)', 'REST APIs', 'gRPC', 'JWT', 'Git'
    ],
    experiences: [
      {
        id: 'be-exp-1',
        jobTitle: 'Lead Backend Engineer',
        company: 'Stratos Financial Systems',
        location: 'New York, NY',
        startDate: '2023',
        endDate: 'Present',
        current: true,
        description: '• Architected transactional payment processing service in Node.js and Go managing $12M+ monthly payments with strict idempotent guarantees.\n• Engineered asynchronous ledger reconciliation pipeline utilizing Kafka and PostgreSQL, reducing settlement processing windows by 70%.\n• Implemented token-bucket rate limiting and zero-trust JWT authentication protecting 28 internal and public API endpoints from DDoS vulnerabilities.',
      },
      {
        id: 'be-exp-2',
        jobTitle: 'Backend Developer',
        company: 'CloudGate Technologies',
        location: 'New York, NY',
        startDate: '2021',
        endDate: '2023',
        current: false,
        description: '• Built modular RESTful microservices in Express.js supporting 80,000+ concurrent enterprise connections.\n• Re-architected relational database schema in PostgreSQL with automated read-replicas, slashing average API response latency from 180ms to 24ms.\n• Implemented automated database migration and schema rollback system with zero downtime deployment.',
      },
    ],
    projects: [
      {
        id: 'be-proj-1',
        title: 'VaultAPI — High-Throughput Fintech Ledger Gateway',
        technologies: 'Node.js, Express, PostgreSQL, Redis, Docker',
        startDate: '2024',
        endDate: '2025',
        description: '• Developed double-entry ledger backend supporting ACID transactions, concurrency locking, and cryptographically verified audit trails.',
        link: 'github.com/alexmorgan/vault-api',
      },
      {
        id: 'be-proj-2',
        title: 'StreamBroker — Lightweight Distributed Pub/Sub Broker',
        technologies: 'Go, WebSockets, Redis, Docker',
        startDate: '2023',
        endDate: '2024',
        description: '• Engineered pub/sub message broker delivering 120,000 msgs/sec with persistent disk write-ahead logs and dynamic topic partitioning.',
        link: 'github.com/alexmorgan/stream-broker',
      },
    ],
  },

  // 3. FULL STACK DEVELOPER
  fullstack: {
    ...BASE_DEMO_DATA,
    jobTitle: 'Full Stack Engineer / MERN Specialist',
    aboutMe: 'Full Stack Engineer bridging modern React client architectures with resilient Node.js backend services, cloud databases, and DevOps automation.',
    summary: 'Full Stack Developer with comprehensive experience delivering end-to-end web platforms. Proficient across modern TypeScript, React, Next.js, Node.js, Express, MongoDB, and PostgreSQL with a strong focus on clean architecture, security, and developer productivity.',
    skills: [
      'Frontend: React, Next.js, Tailwind CSS',
      'Backend: Node.js, Express, REST & GraphQL',
      'Databases: MongoDB, PostgreSQL, Redis',
      'State Management: Redux Toolkit, Zustand',
      'DevOps: Docker, AWS, CI/CD, Git',
      'Security: JWT, OAuth, CORS, Input Sanitization',
    ],
    technologies: [
      'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Express',
      'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Redux', 'Redis',
      'Docker', 'AWS', 'REST APIs', 'GraphQL', 'Git', 'GitHub Actions'
    ],
    projects: [
      {
        id: 'fs-proj-1',
        title: 'CollabSync — End-to-End Team Workspace Suite',
        technologies: 'React, Node.js, Express, MongoDB, WebSockets, Tailwind',
        startDate: '2024',
        endDate: '2025',
        description: '• Built full-stack project tracking platform with real-time kanban boards, live comment threads, and role-based permissions.\n• Integrated OAuth2 login, Stripe subscription billing webhooks, and automated email notifications.',
        link: 'github.com/alexmorgan/collab-sync',
      },
      {
        id: 'fs-proj-2',
        title: 'MarketNest — Full-Stack E-Commerce Cloud Platform',
        technologies: 'Next.js 14, TypeScript, PostgreSQL, Prisma, Stripe',
        startDate: '2023',
        endDate: '2024',
        description: '• Engineered high-performance storefront with server actions, real-time inventory management, cart synchronization, and checkout pipeline.',
        link: 'github.com/alexmorgan/market-nest',
      },
    ],
  },

  // 4. SOFTWARE ENGINEER / SDE
  sde: {
    ...BASE_DEMO_DATA,
    jobTitle: 'Software Development Engineer (SDE)',
    aboutMe: 'Software Development Engineer with solid foundation in algorithms, systems design, object-oriented design, and enterprise software engineering.',
    summary: 'Software Development Engineer (SDE) with deep expertise in scalable system design, core computer science principles, and cloud engineering. Experienced in architecting fault-tolerant backend services and solving complex algorithmic challenges at scale.',
    skills: [
      'Object-Oriented Design & Design Patterns',
      'Data Structures & Algorithm Optimization',
      'Distributed Systems & Concurrency',
      'System Architecture & Microservices',
      'Relational Database Modeling & SQL Tuning',
      'Automated Testing & Continuous Delivery',
    ],
    technologies: [
      'Java', 'C++', 'Python', 'Go', 'TypeScript', 'SQL',
      'Spring Boot', 'Node.js', 'PostgreSQL', 'Redis', 'Kafka',
      'Docker', 'Kubernetes', 'AWS', 'Linux', 'Git', 'JUnit'
    ],
  },

  // 5. FAANG / BIG TECH
  faang: {
    ...BASE_DEMO_DATA,
    jobTitle: 'Software Engineer — Distributed Systems',
    summary: 'Software Engineer focused on large-scale distributed systems and high-throughput data processing. Proven record optimizing compute efficiency, cutting tail latencies, and delivering mission-critical infrastructure serving tens of millions of global queries daily.',
    achievements: [
      'LeetCode Top 0.2% Globally — Contest Rating 2410 (Knight Badge, 950+ Problems Solved)',
      '1st Place Winner — ACM International Collegiate Programming Contest (ICPC) Regional 2022',
      'Published Research: "Low-Latency Consensus in Heterogeneous Distributed Clusters" (IEEE Cloud 2023)',
    ],
  },

  // 6. CS / IT DEVELOPER
  'cs-it': {
    ...BASE_DEMO_DATA,
    jobTitle: 'Computer Science & IT Engineer',
    summary: 'Computer Science graduate with rigorous grounding in computing theory, systems software, and modern web engineering. Demonstrated technical excellence across academic capstone engineering, open source contributions, and competitive programming.',
    education: [
      {
        id: 'cs-edu-1',
        degree: 'B.S. in Computer Science & Information Technology',
        institution: 'Columbia University, School of Engineering',
        location: 'New York, NY',
        graduationDate: '2020 – 2024',
        gpa: '3.91 / 4.0 (Magna Cum Laude)',
        coursework: 'Data Structures & Algorithms, Computer Networks, Operating Systems, Database Management Systems, Object-Oriented Analysis & Design, Compiler Construction',
        description: 'Honors: Dean\'s Academic Excellence Award (4 Consecutive Years). Lead Teaching Assistant for CS3134 Data Structures & Algorithms.',
      },
    ],
  },

  // 7. DEVOPS / CLOUD ENGINEER
  devops: {
    ...BASE_DEMO_DATA,
    jobTitle: 'DevOps & Cloud Infrastructure Engineer',
    aboutMe: 'DevOps & Cloud Engineer specializing in Kubernetes orchestration, Infrastructure-as-Code (Terraform), GitOps, and robust zero-downtime CI/CD pipelines.',
    summary: 'DevOps & Cloud Infrastructure Engineer with 4+ years designing, automating, and maintaining multi-region cloud infrastructures on AWS. Expert in Kubernetes, Docker, Terraform, Prometheus/Grafana observability, and automated CI/CD pipelines sustaining 99.99% service uptime.',
    skills: [
      'Cloud Architecture (AWS, GCP)',
      'Container Orchestration (Kubernetes, Docker)',
      'Infrastructure as Code (Terraform, Ansible)',
      'CI/CD Pipelines (GitHub Actions, GitLab CI)',
      'Observability (Prometheus, Grafana, ELK)',
      'Linux Administration & Bash Scripting',
      'Security & Compliance (IAM, SOC2, Vault)',
      'Site Reliability Engineering (SLO/SLI, On-Call)',
    ],
    technologies: [
      'AWS', 'Kubernetes', 'Docker', 'Terraform', 'Helm', 'Linux',
      'GitHub Actions', 'Prometheus', 'Grafana', 'Ansible', 'Bash',
      'Python', 'Go', 'Nginx', 'Argocd', 'Vault', 'Git'
    ],
    experiences: [
      {
        id: 'devops-exp-1',
        jobTitle: 'Senior Cloud Platform Engineer',
        company: 'CloudSphere Infrastructure',
        location: 'New York, NY',
        startDate: '2023',
        endDate: 'Present',
        current: true,
        description: '• Managed production multi-cluster Amazon EKS infrastructure supporting 80+ microservices and 150M+ weekly requests.\n• Automated entire cloud provisioning lifecycle across 3 environments via modular Terraform, reducing developer staging environment setup time from 4 days to 12 minutes.\n• Implemented Prometheus and Grafana alerts alongside OpenTelemetry distributed tracing, slashing Mean Time to Detection (MTTD) by 60%.\n• Designed zero-downtime blue/green deployment strategy, eliminating customer-facing deployment outages entirely.',
      },
      {
        id: 'devops-exp-2',
        jobTitle: 'DevOps Engineer',
        company: 'Apex Systems',
        location: 'Boston, MA',
        startDate: '2021',
        endDate: '2023',
        current: false,
        description: '• Standardized Docker image build pipeline with multi-stage caching, decreasing CI build and deployment duration by 52%.\n• Hardened AWS IAM roles and network security groups, ensuring full compliance with SOC2 Type II requirements.\n• Automated routine database snapshot, restore, and failover drills using Python and AWS Lambda.',
      },
    ],
    projects: [
      {
        id: 'devops-proj-1',
        title: 'GitOps-K8s — Production Infrastructure-as-Code Framework',
        technologies: 'Terraform, ArgoCD, Kubernetes, Helm, AWS',
        startDate: '2024',
        endDate: '2025',
        description: '• Created declarative GitOps delivery pipeline orchestrating multi-region EKS clusters with automated branch preview environments.',
        link: 'github.com/alexmorgan/gitops-k8s',
      },
      {
        id: 'devops-proj-2',
        title: 'AutoSentry — Cloud Cost & Anomaly Detection Bot',
        technologies: 'Python, AWS Lambda, CloudWatch, Slack API',
        startDate: '2023',
        endDate: '2024',
        description: '• Automated AWS cost monitoring utility analyzing underutilized EC2/RDS resources, saving 22% monthly on idle computing resources.',
        link: 'github.com/alexmorgan/autosentry',
      },
    ],
  },

  // 8. DATA / PYTHON DEVELOPER
  'data-python': {
    ...BASE_DEMO_DATA,
    jobTitle: 'Data Engineer / Python Developer',
    aboutMe: 'Data Engineer & Python Developer specialized in distributed data pipelines, ETL architectures, SQL query optimization, and data modeling.',
    summary: 'Data & Python Developer with 4 years of experience building high-volume data pipelines and analytical processing engines. Expert in Python, SQL, Apache Spark, Airflow, and PostgreSQL with a focus on data reliability, warehouse modeling, and machine learning feature stores.',
    skills: [
      'Python & Numerical Computing (Pandas, NumPy)',
      'Advanced SQL & Query Optimization',
      'ETL/ELT Pipeline Engineering (Airflow, dbt)',
      'Big Data Processing (Apache Spark, Kafka)',
      'Data Warehousing (Snowflake, BigQuery, Postgres)',
      'Data Modeling & Schema Architecture',
      'REST APIs & Microservices (FastAPI, Flask)',
    ],
    technologies: [
      'Python', 'SQL', 'FastAPI', 'Apache Spark', 'Apache Airflow',
      'PostgreSQL', 'Snowflake', 'Redis', 'Docker', 'AWS (S3, Redshift)',
      'Pandas', 'NumPy', 'dbt', 'Kafka', 'Git'
    ],
    experiences: [
      {
        id: 'data-exp-1',
        jobTitle: 'Data Engineer',
        company: 'Vanguard Analytics',
        location: 'New York, NY',
        startDate: '2023',
        endDate: 'Present',
        current: true,
        description: '• Built distributed ETL ingestion pipeline in Python and Apache Spark processing 4TB+ daily transactional records into Snowflake data warehouse.\n• Orchestrated 35+ automated DAG pipelines in Apache Airflow with automated backfilling, SLA monitoring, and data quality checks via Great Expectations.\n• Optimized complex analytical SQL aggregation queries, cutting reporting dashboard execution time from 12 minutes to 18 seconds.',
      },
      {
        id: 'data-exp-2',
        jobTitle: 'Python Software Developer',
        company: 'DataStream Labs',
        location: 'New York, NY',
        startDate: '2021',
        endDate: '2023',
        current: false,
        description: '• Developed high-performance REST APIs using FastAPI and Pydantic serving machine learning inference predictions to 50,000+ daily client apps.\n• Designed relational data models in PostgreSQL supporting high-velocity write throughput and indexed read queries.',
      },
    ],
    projects: [
      {
        id: 'data-proj-1',
        title: 'PipelineFlow — Real-Time Streaming Data Engine',
        technologies: 'Python, Apache Kafka, Spark Streaming, PostgreSQL',
        startDate: '2024',
        endDate: '2025',
        description: '• Built event-driven data streaming engine aggregating telemetry and financial metrics with exactly-once delivery guarantees.',
        link: 'github.com/alexmorgan/pipeline-flow',
      },
    ],
  },

  // 9. MOBILE APP DEVELOPER
  mobile: {
    ...BASE_DEMO_DATA,
    jobTitle: 'Mobile App Developer / React Native Engineer',
    aboutMe: 'Mobile App Developer specialized in React Native, cross-platform iOS and Android engineering, state architecture, and smooth native device integrations.',
    summary: 'Mobile Application Developer with 4+ years delivering polished iOS and Android apps using React Native and TypeScript. Experienced in offline-first data sync, native module bridging, push notification pipelines, and App Store / Play Store deployment workflows.',
    skills: [
      'React Native & Cross-Platform Architecture',
      'iOS & Android Native Integrations',
      'TypeScript & Mobile JavaScript',
      'State Management (Redux Toolkit, Zustand)',
      'Offline-First Sync & SQLite / WatermelonDB',
      'Mobile UI/UX Animations (Reanimated, Gesture Handler)',
      'App Store & Play Store Deployment Automation',
    ],
    technologies: [
      'React Native', 'TypeScript', 'JavaScript', 'Swift', 'Kotlin',
      'Redux Toolkit', 'React Navigation', 'Tailwind / NativeWind',
      'GraphQL', 'REST APIs', 'Fastlane', 'Xcode', 'Android Studio', 'Git'
    ],
    experiences: [
      {
        id: 'mob-exp-1',
        jobTitle: 'Senior Mobile Engineer',
        company: 'Stride Health & Fitness',
        location: 'New York, NY',
        startDate: '2023',
        endDate: 'Present',
        current: true,
        description: '• Led architecture of cross-platform fitness tracker app in React Native downloaded by 350,000+ active iOS and Android users.\n• Implemented 60 FPS gesture-driven animations and data visualizations using React Native Reanimated and Skia.\n• Engineered robust offline synchronization engine with local SQLite storage, enabling seamless offline workout logging with zero data loss on reconnect.\n• Automated CI/CD build and app signing workflows using Fastlane and GitHub Actions, cutting release cycles from 3 days to 30 minutes.',
      },
    ],
    projects: [
      {
        id: 'mob-proj-1',
        title: 'ZenithWallet — Crypto & Fiat Mobile Wallet',
        technologies: 'React Native, TypeScript, Web3, Biometrics, Redux',
        startDate: '2024',
        endDate: '2025',
        description: '• Developed secure financial mobile application with biometric authentication (Face ID / Fingerprint), encrypted key storage, and real-time portfolio charts.',
        link: 'github.com/alexmorgan/zenith-wallet',
      },
    ],
  },

  // 10. STUDENT / FRESHER
  fresher: {
    ...BASE_DEMO_DATA,
    jobTitle: 'Computer Science Graduate / Software Engineer',
    aboutMe: 'Motivated Computer Science graduate with strong technical foundations in algorithms, full-stack development, and collaborative hackathons. Eager to contribute to high-impact engineering teams.',
    summary: 'Recent Computer Science graduate from Columbia University with top academic standing (3.92 GPA). Solid hands-on experience building full-stack web applications, contributing to open-source software, and solving 700+ algorithmic problems. Recipient of 1st place in university-wide hackathons.',
    education: [
      {
        id: 'fresh-edu-1',
        degree: 'B.S. in Computer Science',
        institution: 'Columbia University',
        location: 'New York, NY',
        graduationDate: 'May 2024',
        gpa: '3.92 / 4.0 (Dean\'s Honor List)',
        coursework: 'Data Structures & Algorithms, Object-Oriented Programming, Database Systems, Computer Systems, Software Engineering Lab, Web Development',
        description: 'Graduated Magna Cum Laude. Teaching Assistant for CS3134 Data Structures & Algorithms. President of ACM Student Chapter.',
      },
    ],
    skills: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (OOP)',
      'Full-Stack Web Development',
      'Database Management (SQL & NoSQL)',
      'Version Control & Git Collaboration',
      'Agile Team Problem Solving',
    ],
    technologies: [
      'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'SQL',
      'React', 'Node.js', 'Express', 'HTML5', 'CSS3', 'Tailwind CSS',
      'PostgreSQL', 'MongoDB', 'Git', 'GitHub', 'Linux', 'Docker'
    ],
    experiences: [
      {
        id: 'fresh-exp-1',
        jobTitle: 'Software Engineering Intern',
        company: 'Cognitive Web Labs',
        location: 'New York, NY',
        startDate: 'Jun 2023',
        endDate: 'Aug 2023',
        current: false,
        description: '• Developed responsive full-stack features using React, TypeScript, and Node.js for internal developer tooling platform used by 200+ engineers.\n• Optimized database queries in PostgreSQL, reducing average report generation time by 28%.\n• Authored unit and integration test suites reaching 88% test coverage with Jest and Supertest.',
      },
    ],
    projects: [
      {
        id: 'fresh-proj-1',
        title: 'StudySphere — Collaborative Academic Note & Quiz Platform',
        technologies: 'React, Node.js, Express, MongoDB, Tailwind CSS',
        startDate: '2023',
        endDate: '2024',
        description: '• Built collaborative student learning hub with flashcard generation, quiz competitions, and PDF annotations used by 1,200+ students.\n• Integrated JWT authentication, real-time study rooms over WebSockets, and cloud image uploads via Amazon S3.',
        link: 'github.com/alexmorgan/study-sphere',
      },
      {
        id: 'fresh-proj-2',
        title: 'AlgoVisualizer — Interactive Algorithm Visualizer',
        technologies: 'React, TypeScript, Canvas API, CSS3',
        startDate: '2023',
        endDate: '2023',
        description: '• Created interactive educational tool animating Dijkstra, A*, QuickSort, and MergeSort algorithms with step-by-step speed control.',
        link: 'github.com/alexmorgan/algo-visualizer',
      },
    ],
    achievements: [
      '1st Place Winner — HackColumbia Hackathon 2023 (out of 120+ collegiate teams)',
      'Dean\'s Academic Honor List (All 8 Academic Semesters)',
      'LeetCode 700+ Problems Solved (Top 1% Global Contest Rating 2150)',
      'President — University Association for Computing Machinery (ACM) Chapter',
    ],
  },

  // 11. OPEN SOURCE DEVELOPER
  opensource: {
    ...BASE_DEMO_DATA,
    jobTitle: 'Open Source Software Engineer & Maintainer',
    aboutMe: 'Open Source Engineer and community maintainer passionate about developer ergonomics, high-performance tooling, modular libraries, and open standards.',
    summary: 'Open Source Software Engineer and maintainer of popular TypeScript and Node.js utilities with 100,000+ weekly downloads. Deep expertise in Git workflows, RFC design processes, semantic versioning, CI/CD automation, and international developer community leadership.',
    skills: [
      'Open Source Tooling & Library Design',
      'Modern TypeScript & JavaScript Standards',
      'Git Workflows, Branching & Release Automation',
      'API Design & Backward Compatibility',
      'Benchmarking & Performance Profiling',
      'Community Triage & Code Review',
    ],
    technologies: [
      'TypeScript', 'JavaScript', 'Rust', 'Node.js', 'Go',
      'Vite', 'Turborepo', 'Rollup', 'Jest', 'Vitest',
      'GitHub Actions', 'Docker', 'NPM Packaging', 'Git', 'Linux'
    ],
    experiences: [
      {
        id: 'oss-exp-1',
        jobTitle: 'Core Maintainer & Developer Advocate',
        company: 'Open Source Collective',
        location: 'Remote',
        startDate: '2023',
        endDate: 'Present',
        current: true,
        description: '• Lead maintainer of 3 popular TypeScript libraries with over 150,000 weekly downloads and 4,000+ GitHub stars.\n• Triaged 300+ community bug reports, reviewed 140+ pull requests, and maintained zero unaddressed security vulnerabilities across releases.\n• Re-architected bundling and build pipelines using Rollup and esbuild, decreasing package bundle size by 42% and doubling install speed.',
      },
    ],
    projects: [
      {
        id: 'oss-proj-1',
        title: 'FastSchema — Zero-Dependency TypeScript Schema Validator',
        technologies: 'TypeScript, Vitest, NPM, GitHub Actions',
        startDate: '2024',
        endDate: '2025',
        description: '• Built high-speed runtime data validation library benchmarked at 3.5x faster than alternatives with complete static type inference.\n• Adopted by 250+ production web applications with 60k+ monthly downloads.',
        link: 'github.com/alexmorgan/fast-schema',
      },
    ],
  },

  // 12. UI / FRONTEND ENGINEER
  'ui-frontend': {
    ...BASE_DEMO_DATA,
    jobTitle: 'UI Engineer / Design Systems Specialist',
    aboutMe: 'UI Engineer passionate about crafting refined user experiences, scalable design systems, smooth interactive animations, and accessible web standards.',
    summary: 'UI Developer & Frontend Engineer specializing in design systems, component architecture, and micro-interactions. Combines technical engineering depth in React and TypeScript with acute eye for typography, spatial harmony, and WCAG accessibility standards.',
    skills: [
      'UI Engineering & Design Systems',
      'Component Architecture (React, Radix, Tailwind)',
      'Responsive Layouts & Typography Systems',
      'Web Accessibility (WCAG 2.1 AA, WAI-ARIA)',
      'Micro-Interactions & Framer Motion',
      'Cross-Browser & Device Performance',
    ],
    technologies: [
      'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Radix UI',
      'Next.js', 'Storybook', 'Figma', 'HTML5', 'CSS3', 'Vite', 'Git'
    ],
    projects: [
      {
        id: 'ui-proj-1',
        title: 'Atelier — Modern Editorial UI Component Kit',
        technologies: 'React, TypeScript, Tailwind CSS, Framer Motion',
        startDate: '2024',
        endDate: '2025',
        description: '• Engineered comprehensive design kit with 50+ accessible components, seamless dark mode support, and fluid responsive typography.',
        link: 'github.com/alexmorgan/atelier-ui',
      },
    ],
  },
};

export function getDemoDataForTemplate(templateId: TemplateType | string): ResumeData {
  return ROLE_DEMO_DATA[templateId] || BASE_DEMO_DATA;
}

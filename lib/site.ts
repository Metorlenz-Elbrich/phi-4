export const site = {
  name: "PhiBrain",
  tagline: "Where intelligent ideas become beautiful digital products.",
  description:
    "PhiBrain is a creative technology studio crafting websites, web & mobile apps, brand systems, and secure digital experiences for ambitious teams.",
  url: "https://phibrain.dev",
  email: "hello@phibrain.dev",
  social: {
    github: "https://github.com/phibraininc",
    linkedin: "https://linkedin.com/company/phibrain",
    twitter: "https://twitter.com/phibrain",
  },
  nav: [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Work", href: "#work" },
    { label: "Security", href: "#security" },
    { label: "Contact", href: "#contact" },
  ],
};

export type Service = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  accent: "cyan" | "violet" | "coral" | "amber" | "mint";
  icon:
    | "globe"
    | "layers"
    | "smartphone"
    | "sparkles"
    | "pen-tool"
    | "shield"
    | "compass";
};

export const services: Service[] = [
  {
    id: "websites",
    title: "Websites",
    tagline: "Premium marketing sites that convert.",
    description:
      "Editorial-quality websites engineered for speed, story, and SEO. From landing pages to multi-region marketing platforms.",
    bullets: ["Next.js / Astro", "Headless CMS", "SEO + analytics ready", "A/B test harness"],
    accent: "cyan",
    icon: "globe",
  },
  {
    id: "web-apps",
    title: "Web Applications",
    tagline: "Web products that feel alive.",
    description:
      "Custom SaaS, dashboards, and internal tools. Architected with TypeScript, real-time data, and accessibility from day one.",
    bullets: ["TS + React / Next", "Realtime + auth", "Design systems", "Edge & serverless"],
    accent: "violet",
    icon: "layers",
  },
  {
    id: "mobile",
    title: "Mobile Apps",
    tagline: "Native-feel apps, shipped fast.",
    description:
      "iOS & Android products with React Native and Expo. Pixel-true UI, native modules, and store delivery.",
    bullets: ["React Native + Expo", "Native modules", "Push + offline", "App Store delivery"],
    accent: "mint",
    icon: "smartphone",
  },
  {
    id: "branding",
    title: "Branding",
    tagline: "Identities with personality.",
    description:
      "Logo systems, typography, color, and brand guidelines that make your product unmistakable across every surface.",
    bullets: ["Naming & narrative", "Logo systems", "Type & color", "Brand books"],
    accent: "coral",
    icon: "sparkles",
  },
  {
    id: "ui-ux",
    title: "UI / UX Design",
    tagline: "Interfaces people remember.",
    description:
      "Research-led product design — flows, wireframes, prototypes, and pixel-perfect UI handed off to engineering.",
    bullets: ["Discovery + research", "Wireframes & flows", "High-fidelity UI", "Design tokens"],
    accent: "amber",
    icon: "pen-tool",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    tagline: "Sleep-well-at-night security.",
    description:
      "Hardening, audits, and incident response for product teams. Modern threat models, OWASP coverage, and clear remediation plans.",
    bullets: ["Audits & pentests", "OWASP coverage", "Hardening playbooks", "Incident response"],
    accent: "cyan",
    icon: "shield",
  },
  {
    id: "digital-transformation",
    title: "Digital Transformation",
    tagline: "From legacy to launchable.",
    description:
      "We modernise legacy stacks, ship migrations, and stand up the workflows that move your team from slow to shipping.",
    bullets: ["Tech strategy", "Stack migrations", "DevX & CI/CD", "Team enablement"],
    accent: "violet",
    icon: "compass",
  },
];

export type ProcessStep = {
  index: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Discover",
    description:
      "We listen, audit, and shape the problem. Workshops, interviews, and a sharp scope written in plain language.",
  },
  {
    index: "02",
    title: "Design",
    description:
      "Flows, wireframes, and high-fidelity UI in fast cycles. Design tokens get committed to the same repo as engineering.",
  },
  {
    index: "03",
    title: "Build",
    description:
      "Weekly demos, typed code, real environments. You see the product grow in your inbox, not in a slide.",
  },
  {
    index: "04",
    title: "Launch & evolve",
    description:
      "We ship, measure, and iterate. Security reviews, performance budgets, and a roadmap that breathes.",
  },
];

export type Project = {
  id: string;
  client: string;
  title: string;
  summary: string;
  tags: string[];
  year: string;
  accent: "cyan" | "violet" | "coral" | "amber" | "mint";
};

export const projects: Project[] = [
  {
    id: "lumen",
    client: "Lumen Health",
    title: "A patient portal that feels like an app, not a form.",
    summary:
      "Next.js + React Native shared design system. Booking, secure messaging, and clinician dashboards in one product.",
    tags: ["Web app", "Mobile", "Design system"],
    year: "2025",
    accent: "cyan",
  },
  {
    id: "northwind",
    client: "Northwind Coffee",
    title: "Brand and storefront for a third-wave coffee chain.",
    summary:
      "From identity to e-commerce. A vibrant brand system, a fast headless storefront, and in-store ordering on tablets.",
    tags: ["Branding", "Website", "E-commerce"],
    year: "2025",
    accent: "coral",
  },
  {
    id: "atlas",
    client: "Atlas Logistics",
    title: "Replatformed a 14-year-old logistics suite.",
    summary:
      "Stack migration to typed services and a new operator dashboard. Onboarding time cut by 60%, errors by 40%.",
    tags: ["Transformation", "Web app", "Security"],
    year: "2024",
    accent: "violet",
  },
  {
    id: "halo",
    client: "Halo Studios",
    title: "An immersive marketing site for a game studio.",
    summary:
      "WebGL hero, cinematic scroll, and a CMS that ships campaign pages in hours, not weeks.",
    tags: ["Website", "3D", "Motion"],
    year: "2024",
    accent: "mint",
  },
];

export const trustBadges = [
  "OWASP-aligned",
  "SOC 2 ready playbooks",
  "GDPR-friendly",
  "WCAG AA",
  "ISO mindset",
];

export const securityPillars = [
  {
    title: "Audit & assess",
    description:
      "Threat models, attack-surface maps, and pen-tests delivered with clear remediation, not a 200-page PDF.",
  },
  {
    title: "Harden the build",
    description:
      "Secure defaults across auth, sessions, secrets, dependencies, and CI. Security lives in the same repo as the product.",
  },
  {
    title: "Watch the perimeter",
    description:
      "Monitoring, alerting, and on-call playbooks. We respond fast — and we tell you what happened in plain English.",
  },
];

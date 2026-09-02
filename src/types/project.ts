import type React from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  video?: string;
  link: string;
  categories: string[];
  badges: string[];
  keyFeatures: string[];
  techStack: {
    frontend?: string[];
    backend?: string[];
    technologies?: string[];
  };
  technologies?: { icon: React.ReactNode; name: string }[];
  github?: string;
  live: string;
  details: boolean;
  projectDetailsPageSlug: string;
  isWorking: boolean;
}

export interface ProjectCaseStudyFrontmatter {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  techStack?: Project['techStack'];
  github: string;
  live: string;
  timeline: string;
  role: string;
  team?: string;
  status: 'completed' | 'in-progress' | 'archived';
  featured: boolean;
  challenges?: string[];
  learnings?: string[];
  isPublished: boolean;
}

export interface ProjectCaseStudy {
  slug: string;
  frontmatter: ProjectCaseStudyFrontmatter;
  content: string;
}

export interface ProjectCaseStudyPreview {
  slug: string;
  frontmatter: ProjectCaseStudyFrontmatter;
}

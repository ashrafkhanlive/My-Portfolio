import Docker from '@/components/technologies/Docker';
import Hibernate from '@/components/technologies/Hibernate';
import Java from '@/components/technologies/Java';
import MySQL from '@/components/technologies/MySQL';
import Postman from '@/components/technologies/Postman';
import SpringBoot from '@/components/technologies/SpringBoot';

export interface Technology {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  image: string;
  description: string[];
  startDate: string;
  endDate: string;
  website: string;
  x?: string;
  linkedin?: string;
  github?: string;
  technologies: Technology[];
  isCurrent: boolean;
  isBlur?: boolean;
}

const javaBackendTechnologies: Technology[] = [
  {
    name: 'Java',
    href: 'https://www.java.com/',
    icon: <Java />,
  },
  {
    name: 'Spring Boot',
    href: 'https://spring.io/projects/spring-boot',
    icon: <SpringBoot />,
  },
  {
    name: 'Hibernate',
    href: 'https://hibernate.org/',
    icon: <Hibernate />,
  },
  {
    name: 'MySQL',
    href: 'https://www.mysql.com/',
    icon: <MySQL />,
  },
  {
    name: 'Docker',
    href: 'https://www.docker.com/',
    icon: <Docker />,
  },
  {
    name: 'Postman',
    href: 'https://www.postman.com/',
    icon: <Postman />,
  },
];

export const experiences: Experience[] = [
  {
    isCurrent: false,
    isBlur: false,
    company: 'Coding Shuttle',
    position: 'Java Backend Developer',
    location: 'Remote',
    image: '/company/promote.png',
    description: [
      'Learned full-stack application development by building an *Airbnb* clone with user authentication, property listings, bookings, and search functionality.',
'Gained hands-on experience developing a *LinkedIn* clone featuring user profiles, posts, networking, and feed management.',
'Applied *Spring Boot*, *Hibernate*, *MySQL*, REST APIs, and layered architecture while implementing real-world backend features.',
'Strengthened backend development skills through project-based learning, API testing with *Postman*, and database integration.',
    ],
    startDate: 'january 2026',
    endDate: 'June 2026',
    technologies: javaBackendTechnologies,
    website: '#',
    github: '#',
    x: '#',
  },
  {
    isCurrent: false,
    company: 'TAP Academy',
    position: 'Spring Boot Developer Intern',
    location: 'Bangalore, India',
    image: '/company/upsurge.png',
    description: [
      'Learned Core Java concepts including OOP, Collections Framework, Exception Handling, Multithreading, File Handling, and Java 8 features.',
'Studied Data Structures and Algorithms (DSA) including arrays, linked lists, stacks, queues, trees, graphs, sorting, and searching.',
'Practiced problem-solving using Java to strengthen algorithmic thinking and coding skills.',
'Built a strong foundation in object-oriented programming and software development principles.',
    ],
    startDate: 'June 2025',
    endDate: 'November 2025',
    technologies: javaBackendTechnologies,
    website: '#',
    github: '#',
    x: '#',
    linkedin: '#',
  },
  {
    isCurrent: false,
    company: 'Code For Fuccess',
    position: 'Java Full Stack Developer',
    location: 'Noida (U.P.), India',
    image: '/company/prepeasy.png',
    description: [
      'Developed scalable *Java* backend services with *JWT Authentication*, role-based access control (RBAC), and secure REST APIs.',
  'Built asynchronous workflows using *Apache Kafka* and integrated *Redis* for caching, session management, and performance optimization.',
  'Designed and optimized relational databases using *PostgreSQL/MySQL*, implementing efficient schemas, indexing, joins, pagination, and transaction management.',
  'Created production-ready backend workflows with clean architecture, authentication, API documentation, and *Docker*-based containerized deployment for consistent development environments.'
    ],
    startDate: 'April 2025',
    endDate: 'June 2025',
    technologies: javaBackendTechnologies,
    website: '#',
    github: '#',
  },
  
 
];

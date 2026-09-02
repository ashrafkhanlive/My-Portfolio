/*
 * CUSTOMIZATION EXAMPLE
 *
 * Want to customize this portfolio for yourself? Here's how easy it is:
 *
 * 1. Update your personal info:
 *    name: "Your Name"
 *    title: "Your Professional Title"
 *    avatar: "/path/to/your/image.jpg"
 *
 * 2. Add your skills:
 *    skills: [
 *      { name: "Python", href: "https://python.org", component: "Python" }, // Note: You'd need to create Python component
 *      { name: "React", href: "https://react.dev", component: "ReactIcon" },
 *      { name: "Node.js", href: "https://nodejs.org", component: "NodeJs" },
 *    ]
 *
 * 3. Write your description using the template:
 *    template: "I'm a **passionate developer** who loves building apps with {skills:0} and {skills:1}. I specialize in **web development** and enjoy working with {skills:2}."
 *
 * 4. Update your social links:
 *    Just change the href values to your own social media profiles
 *
 * That's it! Your portfolio will automatically update with your information.
 */
import Github from '@/components/svgs/Github';
import Instagram from '@/components/svgs/Instagram';
import LinkedIn from '@/components/svgs/LinkedIn';
import Mail from '@/components/svgs/Mail';
import X from '@/components/svgs/X';
import Docker from '@/components/technologies/Docker';
import Java from '@/components/technologies/Java';
import MongoDB from '@/components/technologies/MongoDB';
import MySQL from '@/components/technologies/MySQL';
import NextJs from '@/components/technologies/NextJs';
import NodeJs from '@/components/technologies/NodeJs';
import Prisma from '@/components/technologies/Prisma';
import ReactIcon from '@/components/technologies/ReactIcon';
import SpringBoot from '@/components/technologies/SpringBoot';

// Component mapping for skills
export const skillComponents = {
  MySQL: MySQL,
  ReactIcon: ReactIcon,
  Docker: Docker,
  NextJs: NextJs,
  SpringBoot: SpringBoot,
  NodeJs: NodeJs,
  MongoDB: MongoDB,
  Prisma: Prisma,
  Java: Java,
};

export const heroConfig = {
  // Personal Information
  name: 'Ashraf Khan',
  title: 'Full-Stack Developer.',
  avatar: '/assets/logo.png',

  // Skills Configuration
  skills: [
    {
      name: 'Java',
      href: 'https://www.java.com/',
      component: 'Java',
    },
    {
      name: 'MySQL',
      href: 'https://www.mysql.com/',
      component: 'MySQL',
    },
    {
      name: 'Next.js',
      href: 'https://nextjs.org/',
      component: 'NextJs',
    },
    {
      name: 'Docker',
      href: 'https://www.docker.com/',
      component: 'Docker',
    },
    {
      name: 'Spring Boot',
      href: 'https://spring.io/projects/spring-boot',
      component: 'SpringBoot',
    },
  ],

  // Description Configuration
  description: {
    template:
      "I'm a Full Stack Java Developer who loves building interactive web applications with {skills:0}, {skills:4}, {skills:2}, {skills:1}, and {skills:3}. Alongside backend development, I enjoy crafting clean and engaging <b>UI</b> designs in <b>Figma</b> with a strong attention to detail and user experience.",
  },

  // Buttons Configuration
  buttons: [
    {
      variant: 'outline',
      text: 'Resume / CV',
      href: '/resume',
      icon: 'CV',
    },
    {
      variant: 'default',
      text: 'Get in touch',
      href: '/contact',
      icon: 'Chat',
    },
  ],
};

// Social Links Configuration
export const socialLinks = [
  {
    name: 'X',
    href: 'https://x.com/ashrafkhanlive',
    icon: <X />,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ashraf-khan-code/',
    icon: <LinkedIn />,
  },
  {
    name: 'Github',
    href: 'https://github.com/ashrafkhanlive',
    icon: <Github />,
  },
  {
    name: 'Email',
    href: 'mailto:ashrafkhan.connect@gmail.com',
    icon: <Mail />,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/coder_berojgar/',
    icon: <Instagram />,
  },
];

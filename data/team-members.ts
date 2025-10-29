export interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

export const teamMembers: TeamMember[] = [
    {
      name: 'Krishiv Thakuria',
      role: 'CEO',
      image: '/profile-pics/krishiv-thakuria.png',
      description: 'Led viral marketing with millions of views for an AI product, now working on AI tools for education + democracy.'
    },
    {
      name: 'Hemit Patel',
      role: 'CTO',
      image: '/profile-pics/hemit-patel.png',
      description: 'Building AI tools for education + democracy. Innovating the very design of democracy, one line of code at a time.'
    },
    {
      name: 'Danielle Dee',
      role: 'COO',
      image: '/profile-pics/danielle-dee.png',
      description: "I am passionate about the intersection of STEM, business, and law to ensure groundbreaking ideas reach those who need them most."
    },
    {
      name: 'Kofi Hair-Ralston',
      role: 'Advisor',
      image: '/profile-pics/kofi-hair-ralston.png',
      description: 'I am a tech leader with a passion for building innovative and user-friendly applications.'
    },
      {
      name: 'Agenya Tharun',
      role: 'Advisor',
      image: '/profile-pics/agenya-tharun.png',
      description: 'College freshman at Carnegie Mellon University. A leader experienced in AI startups and pure ML research.'
    }
  ];
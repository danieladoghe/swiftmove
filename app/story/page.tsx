import type { Metadata } from 'next';
import { StoryExperience } from '@/components/story/StoryExperience';

export const metadata: Metadata = {
  title: 'Star Drift — A Space Odyssey',
  description:
    'A scroll-driven, cinematic space odyssey. Five chapters of painted nebulae, fluid color transitions, and buttery-smooth motion.',
};

export default function StoryPage() {
  return <StoryExperience />;
}

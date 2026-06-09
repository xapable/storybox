import SectionHeader from '../../components/section-header';
import Card from '../../components/card';
import type { Story } from '../../types';
import { mockStories, homeLipsum } from '../mockData';
import './Home.css';

export default function Home() {
  const handleCardOpenChange = (_item: Story, isOpen: boolean) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  return (
    <div className="home">
      <SectionHeader
        title="StoryBox 知識盒子"
        label={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      />

      <div className="home__list">
        {mockStories.map((story) => (
          <Card
            key={story.id}
            {...story}
            light={(story.contents?.length ?? 0) > 0}
            onOpenChange={handleCardOpenChange}
          >
            {homeLipsum.map((text, i) => (
              <p key={i} className="home__card-text">{text}</p>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

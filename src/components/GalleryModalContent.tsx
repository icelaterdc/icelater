import React from 'react';
import ActionCard from './ActionCard';

const GalleryModalContent: React.FC = () => {
  return (
    <div>
      <ActionCard
        imageSrc="/images/gallery.jpg"
        author="Gallery"
        description="Browse through our stunning image collection."
        link="/gallery"
      />
    </div>
  );
};

export default GalleryModalContent;

import React from 'react';
import ModalCard from './ModalCard';

interface GalleryModalContentProps {
  onClose: () => void;
}

const GalleryModalContent: React.FC<GalleryModalContentProps> = ({ onClose }) => {
  const handleGalleryGo = () => {
    window.location.href = '/gallery';
  };

  return (
    <div className="flex justify-center">
      <ModalCard
        imageSrc="/images/gallery.png"
        author="Gallery"
        description="Göz alıcı görsellerle dolu galeriye göz atın."
        onGo={handleGalleryGo}
      />
    </div>
  );
};

export default GalleryModalContent;

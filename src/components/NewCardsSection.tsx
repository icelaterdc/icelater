import React, { useState } from 'react';
import FancyCard from './FancyCard';
import Modal from './Modal';
import AIModalContent from './AIModalContent';
import GameModalContent from './GameModalContent';
import GalleryModalContent from './GalleryModalContent';

export type ModalType = 'ai' | 'game' | 'gallery' | null;

const NewCardsSection: React.FC = () => {
  const [openModal, setOpenModal] = useState<ModalType>(null);

  const closeModal = () => setOpenModal(null);

  return (
    <div className="flex flex-col gap-6">
      {/* AI Kartı */}
      <FancyCard
        imageSrc="/images/ai-icon.png"
        title="Artificial Intelligence"
        description="Chat & Imagine AI services."
        onClick={() => setOpenModal('ai')}
      />
      {/* Oyun Kartı */}
      <FancyCard
        imageSrc="/images/game-icon.png"
        title="Games"
        description="Chess, Snake & Football."
        onClick={() => setOpenModal('game')}
      />
      {/* Galeri Kartı */}
      <FancyCard
        imageSrc="/images/gallery-icon.png"
        title="Gallery"
        description="Beautiful visuals await."
        onClick={() => setOpenModal('gallery')}
      />

      {openModal === 'ai' && (
        <Modal onClose={closeModal}>
          <AIModalContent onClose={closeModal} />
        </Modal>
      )}
      {openModal === 'game' && (
        <Modal onClose={closeModal}>
          <GameModalContent onClose={closeModal} />
        </Modal>
      )}
      {openModal === 'gallery' && (
        <Modal onClose={closeModal}>
          <GalleryModalContent onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default NewCardsSection;

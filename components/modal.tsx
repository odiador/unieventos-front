"use client";

import { motion } from 'framer-motion';
import { createContext, useState, ReactNode, useContext } from 'react';

interface ModalContextType {
  isOpen: boolean;
  content: string;
  openModal: (content: string) => void;
  openCustomModal: (content: ReactNode) => void;
  openRightBar: (content: ReactNode) => void;
  closeModal: () => void;
  closeRightBar: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRight, setIsOpenRight] = useState(false);
  const [content, setContent] = useState('');
  const [customContent, setCustomContent] = useState<ReactNode | undefined>(undefined);
  const [customContentRight, setCustomContentRight] = useState<ReactNode | undefined>(undefined);

  const openModal = (content: string) => {
    setContent(content);
    setCustomContent(undefined)
    setIsOpen(true);
  };
  const openCustomModal = (content: ReactNode) => {
    setCustomContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setCustomContent(undefined)
    setIsOpen(false);
    setContent('');
  };
  const openRightBar = (content: ReactNode) => {
    setCustomContentRight(content)
    setIsOpenRight(true);
  }
  const closeRightBar = () => {
    setIsOpenRight(false);
  }

  return (
    <ModalContext.Provider value={{ isOpen, content, openModal, closeModal, openCustomModal, openRightBar, closeRightBar }}>
      {children}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: .1 }}
          className="fixed top-0 left-0 bg-black/50 z-50 w-full h-full flex justify-center items-center px-2 sm:px-8 py-12">
          {customContent}
          {content && <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: .1 }}
            className="flex flex-col w-4/5 overflow-hidden h-full max-h-64 items-end gap-4 bg-white rounded-2xl shadow-sm shadow-black/45 outline-black/50">
            {<span className="mt-2 mr-4 cursor-pointer text-black rounded-full text-4xl font-medium size-4 text-center flex items-center justify-center" onClick={closeModal}>&times;</span>}
            {<p className='mx-4 mb-2 overflow-hidden text-black self-start h-full text-wrap'>{content}</p>}
          </motion.div>}
        </motion.div>
      )}
      {isOpenRight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: .1 }}
          className="fixed top-0 left-0 bg-black/50 z-50 w-full h-full flex justify-end items-center py-12">
          {customContentRight}
        </motion.div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

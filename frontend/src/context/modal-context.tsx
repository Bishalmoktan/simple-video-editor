import React, { createContext, useContext, useState } from "react";

type ModalType = "previewVideo";

type ModalDataType = {
  title: string;
  videoSrc: string;
};

export type ModalContextType = {
  data: ModalDataType | null;
  type: ModalType | null;
  isOpen: boolean;
  openModal: (type: ModalType, data: ModalDataType) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

export const ModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalDataType | null>(null);
  const [type, setType] = useState<ModalType | null>(null);

  const openModal = (type: ModalType, data: ModalDataType) => {
    if (data) {
      setData(data);
    }
    setType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        closeModal,
        openModal,
        isOpen,
        data,
        type,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext) as ModalContextType;
};

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type HandPreference,
  getStoredHandPreference,
  setStoredHandPreference,
} from "@/lib/handPreference";

interface HandPreferenceContextValue {
  handPreference: HandPreference;
  hasChosenPreference: boolean;
  setHandPreference: (pref: HandPreference) => void;
  isChoiceModalOpen: boolean;
  openChoiceModal: () => void;
  closeChoiceModal: () => void;
}

const HandPreferenceContext = createContext<HandPreferenceContextValue>({
  handPreference: "right",
  hasChosenPreference: false,
  setHandPreference: () => {},
  isChoiceModalOpen: false,
  openChoiceModal: () => {},
  closeChoiceModal: () => {},
});

export function HandPreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [handPreference, setHandPrefState] = useState<HandPreference>("right");
  const [hasChosenPreference, setHasChosenPreference] = useState(false);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredHandPreference();
    if (stored) {
      setHandPrefState(stored);
      setHasChosenPreference(true);
    } else {
      // First visit — prompt user to choose hand preference
      setIsChoiceModalOpen(true);
    }
  }, []);

  const setHandPreference = useCallback((pref: HandPreference) => {
    setHandPrefState(pref);
    setHasChosenPreference(true);
    setStoredHandPreference(pref);
    setIsChoiceModalOpen(false);
  }, []);

  const openChoiceModal = useCallback(() => {
    setIsChoiceModalOpen(true);
  }, []);

  const closeChoiceModal = useCallback(() => {
    setIsChoiceModalOpen(false);
  }, []);

  return (
    <HandPreferenceContext.Provider
      value={{
        handPreference,
        hasChosenPreference,
        setHandPreference,
        isChoiceModalOpen,
        openChoiceModal,
        closeChoiceModal,
      }}
    >
      {children}
    </HandPreferenceContext.Provider>
  );
}

export function useHandPreference(): HandPreferenceContextValue {
  return useContext(HandPreferenceContext);
}

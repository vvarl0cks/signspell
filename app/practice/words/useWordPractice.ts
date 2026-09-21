"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSignRecognition } from "@/hooks/useSignRecognition";
import wordListData from "@/data/word-list.json";

import { type HandPreference } from "@/lib/handPreference";

export type Difficulty = "easy" | "medium" | "hard";

const MOTION_LETTERS = new Set(["J", "Z"]);

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface WordPracticeStats {
  wordsCompleted: number;
  lettersCompleted: number;
  sessionStartMs: number;
  avgMsPerLetter: number;
}

export function useWordPractice(
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  difficulty: Difficulty,
  handPreference: HandPreference = "right"
) {
  const wordPool = wordListData[difficulty] as string[];
  const [words] = useState(() => shuffleArray(wordPool));

  const [wordIndex, setWordIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [isWordFlashing, setIsWordFlashing] = useState(false);
  const [stats, setStats] = useState<WordPracticeStats>({
    wordsCompleted: 0,
    lettersCompleted: 0,
    sessionStartMs: Date.now(),
    avgMsPerLetter: 0,
  });

  const isAdvancingRef = useRef(false);
  const letterStartMsRef = useRef(Date.now());
  const totalLetterMsRef = useRef(0);

  const currentWord = words[wordIndex] ?? "";
  const currentLetter = currentWord[letterIndex] ?? "";
  const isMotionGesture = MOTION_LETTERS.has(currentLetter);

  const handleLetterAccepted = useCallback((letter: string) => {
    if (isAdvancingRef.current) return;
    if (letter !== currentLetter) return;
    isAdvancingRef.current = true;

    // Track timing
    const elapsed = Date.now() - letterStartMsRef.current;
    totalLetterMsRef.current += elapsed;

    setStats((s) => {
      const newCount = s.lettersCompleted + 1;
      return {
        ...s,
        lettersCompleted: newCount,
        avgMsPerLetter: Math.round(totalLetterMsRef.current / newCount),
      };
    });

    const nextLetterIdx = letterIndex + 1;

    if (nextLetterIdx >= currentWord.length) {
      // Word complete
      setIsWordFlashing(true);
      setCompletedWords((prev) => [...prev, currentWord]);
      setStats((s) => ({ ...s, wordsCompleted: s.wordsCompleted + 1 }));

      setTimeout(() => {
        setIsWordFlashing(false);
        setWordIndex((idx) => Math.min(idx + 1, words.length - 1));
        setLetterIndex(0);
        letterStartMsRef.current = Date.now();
        isAdvancingRef.current = false;
      }, 1000);
    } else {
      // Next letter in same word
      setTimeout(() => {
        setLetterIndex(nextLetterIdx);
        letterStartMsRef.current = Date.now();
        isAdvancingRef.current = false;
      }, 300);
    }
  }, [currentLetter, letterIndex, currentWord, words]);

  // Reset letter start timer when letter changes
  useEffect(() => {
    letterStartMsRef.current = Date.now();
  }, [letterIndex, wordIndex]);

  const skipLetter = useCallback(() => {
    if (letterIndex < currentWord.length - 1) {
      setLetterIndex((i) => i + 1);
    } else {
      setWordIndex((i) => Math.min(i + 1, words.length - 1));
      setLetterIndex(0);
    }
  }, [letterIndex, currentWord.length, words.length]);

  const skipWord = useCallback(() => {
    setWordIndex((i) => Math.min(i + 1, words.length - 1));
    setLetterIndex(0);
  }, [words.length]);

  const recognition = useSignRecognition({
    videoRef,
    canvasRef,
    targetLetter: currentLetter,
    isMotionGesture,
    handPreference,
    onLetterAccepted: handleLetterAccepted,
  });

  return {
    currentWord,
    currentLetter,
    letterIndex,
    wordIndex,
    words,
    completedWords,
    isWordFlashing,
    isMotionGesture,
    stats,
    skipLetter,
    skipWord,
    ...recognition,
  };
}

import { useCallback, useEffect, useRef } from "react";

// A global flag to see if the audio context is unlocked.
let isAudioUnlocked = false;

// A silent one-pixel mp3 file encoded in base64.
const silentSound =
  "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAAgAAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

export const useSound = (src: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create the Audio object once.
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(src);
    }
  }, [src]);

  // This function should be called on the first user interaction (e.g., a button click).
  const unlockAudio = useCallback(() => {
    if (isAudioUnlocked || typeof window === "undefined") return;

    const audio = new Audio(silentSound);
    audio
      .play()
      .then(() => {
        isAudioUnlocked = true;
        console.log("Audio context unlocked.");
      })
      .catch((e) => console.error("Could not unlock audio:", e));
  }, []);

  const play = useCallback(async (): Promise<void> => {
    if (!isAudioUnlocked) {
      console.warn(
        "Audio not unlocked. Call unlockAudio() on a user interaction."
      );
      unlockAudio();
    }

    const audio = audioRef.current;
    if (audio) {
      return new Promise((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = (e) => reject(e);
        audio.currentTime = 0;
        audio.play().catch((e) => reject(e));
      });
    }
    return Promise.resolve();
  }, [unlockAudio]);

  return { play, unlockAudio };
};

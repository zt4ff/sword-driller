import { useCallback, useEffect, useState } from "react";

export const useSound = (src: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // We only want to create the Audio object on the client side.
    if (typeof window !== "undefined") {
      const audioInstance = new Audio(src);
      setAudio(audioInstance);
    }
  }, [src]);

  const play = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((e) => console.error("Error playing sound:", e));
    }
  }, [audio]);

  return play;
};

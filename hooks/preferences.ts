"use client";
import { useLocalStorage } from "usehooks-ts";

type Preference = {
  region: string;
} | null;

const usePreference = () => {
  const [preference, setPreference, removePreference] =
    useLocalStorage<Preference>("preference", null);

  const handleSetPreference = (region: string | null) => {
    setPreference(prev => ({
      region: region ?? prev?.region ?? "",
    }));
  };

  const handleGetPreference = () => {
    return preference;
  };

  return { preference, handleSetPreference, handleGetPreference, removePreference };
};

export default usePreference;
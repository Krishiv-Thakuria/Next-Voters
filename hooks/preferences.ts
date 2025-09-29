"use client";
import { useLocalStorage } from "usehooks-ts";

type Preference = {
  election: string;
  region: string;
} | null;

const usePreference = () => {
  const [preference, setPreference, removePreference] =
    useLocalStorage<Preference>("preference", null);

  const handleSetPreference = (election: string | null, region: string | null) => {
    setPreference(prev => ({
      election: election ?? prev?.election ?? "",
      region: region ?? prev?.region ?? "",
    }));
  };

  const handleGetPreference = () => {
    return preference;
  };

  return { preference, handleSetPreference, handleGetPreference, removePreference };
};

export default usePreference;
"use client";

import { useLocalStorage } from "usehooks-ts";

type Preference = {
  election: string;
  region: string;
  party: string;
} | null;

const usePreference = () => {
  const [preference, setPreference, removePreference] =
    useLocalStorage<Preference>("preference", null);

  const handleSetPreference = (election: string, region: string, party: string) => {
    setPreference({ election, region, party });
  };

  const handleGetPreference = () => {
    return preference;
  };

  return { preference, handleSetPreference, handleGetPreference, removePreference };
}

export default usePreference;
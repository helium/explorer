import { useState, useEffect, useCallback } from "react";
import { getLocalStorageItem, setLocalStorageItem } from "./utils";

interface UseStar {
  // Indicates the server is rendering this hook
  isServer: boolean;
  isStarred: boolean;
  setStarred: (starred: boolean) => void;
  toggleStarred: () => void;
}

/**
 * Subscribes to a single starred item in local storage. Also watches for
 * cross tab changes which might occur.
 *
 * @param key item storage key
 */
export function useStar(key: string): UseStar {
  const [state, setState] = useState<boolean>(false);
  const { stars } = useStars();

  useEffect(() => {
    const starred = getLocalStorageItem<string[]>("starred", []);
    setState(starred.findIndex((i) => i === key) > -1);
  }, [key]);

  useEffect(() => {
    const isInArray = new Set(stars).has(key);

    if (isInArray !== state) {
      setStarred(isInArray);
    }
  }, [key, stars.length]);

  const setStarred = useCallback(
    (starred: boolean) => {
      setLocalStorageItem<string[]>("starred", [], (items) => {
        const set = new Set(items);

        if (starred) {
          set.add(key);
        } else {
          set.delete(key);
        }

        return Array.from(set);
      });

      setState(starred);
    },
    [key]
  );

  const toggleStarred = useCallback(() => {
    setStarred(!state);
  }, [key, state]);

  return {
    isServer: typeof window === "undefined",
    isStarred: state,
    setStarred,
    toggleStarred,
  };
}

interface UseStars {
  stars: string[];
  isServer: boolean;
}

/**
 * Returns & subscribes to the current starred items in local storage.
 */
export function useStars(): UseStars {
  const [state, setState] = useState<string[]>([]);

  function onLocalStorageChange(event: StorageEvent) {
    if (event.key == "helium:starred" && event.oldValue != event.newValue) {
      setState(getLocalStorageItem("starred", []));
    }
  }

  useEffect(() => {
    setState(getLocalStorageItem("starred", []));
    window.addEventListener("storage", onLocalStorageChange);
    return () => window.removeEventListener("storage", onLocalStorageChange);
  }, []);

  return {
    stars: state,
    isServer: typeof window === "undefined",
  };
}

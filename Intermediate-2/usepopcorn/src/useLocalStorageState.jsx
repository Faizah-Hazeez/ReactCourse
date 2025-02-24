import { useState, useEffect } from "react";

export function useLocalStorageState(initailState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);

    return storedValue ? JSON.parse(storedValue) : initailState;
  });

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(value));
    },
    [value],
    key
  );

  return [value, setValue];
}

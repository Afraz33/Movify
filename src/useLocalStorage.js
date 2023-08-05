import { useState, useEffect } from "react";
export function useLocalStorage(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem("bookmarked");
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setValue];
}

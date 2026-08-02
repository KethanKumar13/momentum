import { useEffect, useState } from "react";
import { getStorageItem, setStorageItem } from "../utils/storage";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() =>
    getStorageItem(key, initialValue)
  );

  useEffect(() => {
    setStorageItem(key, value);
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
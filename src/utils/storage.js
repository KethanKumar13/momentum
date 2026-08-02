// ============================================
// Storage Keys
// ============================================

export const STORAGE_KEYS = {
  TASKS: "taskflow.tasks",
};

// ============================================
// Read
// ============================================

export function getStorageItem(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);

    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Failed to read localStorage:", error);

    return defaultValue;
  }
}

// ============================================
// Write
// ============================================

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to write localStorage:", error);
  }
}

// ============================================
// Remove
// ============================================

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove localStorage:", error);
  }
}
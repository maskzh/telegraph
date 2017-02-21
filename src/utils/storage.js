export function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return !!localStorage.getItem(key);
  } catch (e) {
    return false;
  }
}

export function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return false;
  }
}

export function storageDelete(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

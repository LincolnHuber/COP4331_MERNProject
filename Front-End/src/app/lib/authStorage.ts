import { useEffect, useState } from "react";

export interface StoredUser {
  id: string;
  username: string;
  email: string;
}

const USER_DATA_KEY = "user_data";
const USER_DATA_EVENT = "user-data-changed";

export function getStoredUser(): StoredUser | null {
  const storedUser = localStorage.getItem(USER_DATA_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as StoredUser;
  } catch {
    localStorage.removeItem(USER_DATA_KEY);
    return null;
  }
}

function notifyUserChanged() {
  window.dispatchEvent(new Event(USER_DATA_EVENT));
}

export function setStoredUser(user: StoredUser) {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  notifyUserChanged();
}

export function clearStoredUser() {
  localStorage.removeItem(USER_DATA_KEY);
  notifyUserChanged();
}

export function useStoredUser() {
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser());

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    window.addEventListener(USER_DATA_EVENT, syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener(USER_DATA_EVENT, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  return user;
}

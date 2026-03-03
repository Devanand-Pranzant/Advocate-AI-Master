let expiryTimeout = null;

export const scheduleSessionExpiry = (token, onExpire) => {
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000;
    const delay = expiryTime - Date.now();

    if (expiryTimeout) {
      clearTimeout(expiryTimeout);
    }

    if (delay <= 0) {
      onExpire?.();
      return;
    }

    expiryTimeout = setTimeout(() => {
      onExpire?.();
    }, delay);
  } catch (err) {
    console.error("Invalid token:", err);
    onExpire?.();
  }
};

export const clearSessionExpiry = () => {
  if (expiryTimeout) {
    clearTimeout(expiryTimeout);
    expiryTimeout = null;
  }
};

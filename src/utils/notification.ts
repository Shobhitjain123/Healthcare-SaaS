export const showNotification = async (title: string) => {
  // Check if Notification API is supported
  if (!("Notification" in window)) {
    return;
  }

  // Check current permission first
  let permission = Notification.permission;
  // Only request if not already granted
  if (permission !== "granted") {
    permission = await Notification.requestPermission();
  }

  if (permission === "granted") {
    // Use service worker to show notification (recommended approach)
    try {
      console.log("Getting service worker registration...");
      const registration = await navigator.serviceWorker.ready;
      console.log("Service worker ready, showing notification:", title);
      await registration.showNotification(title, {
        body: "Patient added successfully",
        icon: "/favicon.svg",
        badge: "/favicon.svg",
      });
      console.log("Notification shown successfully");
    } catch (error) {
      console.error("Service worker not ready:", error);
      // Fallback to direct notification if service worker fails
      new Notification(title, {
        body: "Patient added successfully",
        icon: "/favicon.svg",
      });
    }
  } else {
    console.warn("Notification permission not granted. Current state:", permission);
  }
};

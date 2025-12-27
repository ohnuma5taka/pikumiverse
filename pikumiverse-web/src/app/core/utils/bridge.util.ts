declare var AndroidBridge: { markAsRead: (_: number) => void };

const markAsRead = (supportId: number) => {
  if (typeof AndroidBridge !== 'undefined' && AndroidBridge.markAsRead)
    AndroidBridge.markAsRead(supportId);
};

export const bridgeUtil = {
  markAsRead,
};

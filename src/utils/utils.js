const throttle = (timer) => {
  let queuedCallback = null;
  return (callback) => {
    if (!queuedCallback) {
      timer(() => {
        const cb = queuedCallback;
        queuedCallback = null;
        if (cb) cb();
      });
    }
    queuedCallback = callback;
  };
};

export const throttleWrite = throttle(requestAnimationFrame);

export const controllerLogger = (controllerName = 'controller') => {
  const prefix = (fn) => `[${new Date().toISOString()}] [${controllerName}] ${fn}`;

  return {
    enter: (fn, meta) => console.log(prefix(fn) + ' - enter', meta ?? ''),
    success: (fn, result) => console.log(prefix(fn) + ' - success', result ?? ''),
    error: (fn, err) => console.error(prefix(fn) + ' - error', err && err.stack ? err.stack : err),
  };
};

export default controllerLogger;

function composeRef(...args) {
  return ref => {
    args.forEach(arg => {
      if (!arg) {
        return;
      }

      if (typeof arg === "function") {
        arg(ref);
        return;
      }

      arg.current = ref;
    });
  };
}

export default composeRef;

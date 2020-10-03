import * as React from "react";

let keyboardModeGlobal = true;

export type UseKeyboardFocusProps = {
  onFocus: () => void;
  onBlur: () => void;
};

export function useKeyboardFocus() {
  const [keyboardMode, setKeyboardMode] = React.useState(keyboardModeGlobal);

  const [hasFocus, setHasFocus] = React.useState(false);

  React.useEffect(() => {
    function handleMouseDown() {
      keyboardModeGlobal = false;
      setKeyboardMode(false);
      document.body.classList.add("disable-outline");
    }
    function handleKeyDown() {
      keyboardModeGlobal = true;
      setKeyboardMode(true);
      document.body.classList.remove("disable-outline");
    }

    document.body.addEventListener("mousedown", handleMouseDown);
    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("mousedown", handleMouseDown);
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return [
    hasFocus,
    {
      onFocus: () => {
        if (keyboardMode) {
          setHasFocus(true);
        }
      },
      onBlur: () => {
        setHasFocus(false);
      }
    } as UseKeyboardFocusProps
  ] as const;
}

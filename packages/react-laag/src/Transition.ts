import { useState, useRef, useEffect } from "react";
import warning from "tiny-warning";

export type TransitionProps = {
  isOpen: boolean;
  children: (
    isOpen: boolean,
    onTransitionEnd: any,
    isLeaving: boolean
  ) => React.ReactElement;
};

/**
 * @deprecated
 * Note: this component is marked as deprecated and will be removed and a possible
 * future release
 */
export function Transition({
  isOpen: isOpenExternal,
  children
}: TransitionProps) {
  const [state, setState] = useState({
    isOpenInternal: isOpenExternal,
    isLeaving: false
  });

  const didMount = useRef(false);

  useEffect(() => {
    if (isOpenExternal) {
      setState({
        isOpenInternal: true,
        isLeaving: false
      });
    } else if (didMount.current) {
      setState({
        isOpenInternal: false,
        isLeaving: true
      });
    }
  }, [isOpenExternal, setState]);

  useEffect(() => {
    warning(
      children,
      `react-laag: You are using 'Transition'. Note that this component is marked as deprecated and will be removed at future releases`
    );
  }, [children]);

  useEffect(() => {
    didMount.current = true;
  }, []);

  if (!isOpenExternal && !state.isOpenInternal && !state.isLeaving) {
    return null;
  }

  return children(
    state.isOpenInternal,
    () => {
      if (!state.isOpenInternal) {
        setState(s => ({ ...s, isLeaving: false }));
      }
    },
    state.isLeaving
  );
}

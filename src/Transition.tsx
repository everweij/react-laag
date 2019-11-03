import * as React from "react";

type TransitionProps = {
  isOpen: boolean;
  children: (isOpen: boolean, onTransitionEnd: any) => React.ReactElement;
};

export default function Transition({
  isOpen: isOpenExternal,
  children
}: TransitionProps) {
  const [state, setState] = React.useState({
    isOpenInternal: isOpenExternal,
    isLeaving: false
  });

  const didMount = React.useRef(false);

  React.useEffect(() => {
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

  React.useEffect(() => {
    didMount.current = true;
  }, []);

  if (!isOpenExternal && !state.isOpenInternal && !state.isLeaving) {
    return null;
  }

  return children(state.isOpenInternal, () => {
    if (!state.isOpenInternal) {
      setState(s => ({ ...s, isLeaving: false }));
    }
  });
}

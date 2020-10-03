import * as React from "react";
import warning from "tiny-warning";

type Registration = {
  shouldCloseWhenClickedOutside: (event: MouseEvent) => boolean;
  closeSlave: () => void;
};

type Registrations = Set<Registration>;

type RegisterFn = (registration: Registration) => () => void;

type GroupContextType = {} | RegisterFn;

const GroupContext = React.createContext({} as GroupContextType);

type GroupProviderProps = {
  children: React.ReactNode;
  registrations: React.MutableRefObject<Registrations>;
};

// Provider that wraps arround the layer in order to provide other useLayers
// down in the hiearchy (child layers) with means to communicate with the parent.
// This provider receives a `registrations` Set which can be used to add and
// delete registrations.
export function GroupProvider({ children, registrations }: GroupProviderProps) {
  // registration function that is used as 'context payload' for child layers
  // to call. It returns a function to unregister.
  const handleRegister = React.useCallback(
    function register(registration: Registration) {
      registrations.current.add(registration);

      return () => registrations.current.delete(registration);
    },
    [registrations]
  );

  return (
    <GroupContext.Provider value={handleRegister}>
      {children}
    </GroupContext.Provider>
  );
}

// asks child layers if they would close given the documents click event
// if there's one that signals not to close, return early (false)
function getShouldCloseAccordingToSlaves(
  registrations: Registrations,
  event: MouseEvent
) {
  for (const { shouldCloseWhenClickedOutside } of registrations) {
    if (!shouldCloseWhenClickedOutside(event)) {
      return false;
    }
  }

  return true;
}

type UseGroup = {
  isOpen: boolean;
  onOutsideClick?: () => void;
  onParentClose?: () => void;
};

/**
 * Responsible for close behavior
 * When the `onOutsideClick` callback is provided by the user, it will listen for clicks
 * in the document, and tell whether the user clicked outside -> not on layer / trigger.
 * It keeps track of nested useLayers a.k.a child layers (`registrations` Set), through which
 * we can ask whether they `shouldCloseWhenClickedOutside`, or tell them to close.
 *
 * Behavior:
 * - `onOutsideClick` only works on the most outer parent, and not on children. The parent will ask
 *   the child layers whether they would close, and will handle accordingly. The parent may
 *   command the children to close indirectly with the help of `onParentClose`
 * - When the parent just was closed, it will make sure that any children will also close
 *   with the help of `onParentClose`
 */
export function useGroup({ isOpen, onOutsideClick, onParentClose }: UseGroup) {
  // store references to the dom-elements
  // we need these to later determine wether the clicked outside or not
  const trigger = React.useRef<HTMLElement>(null!);
  const layer = React.useRef<HTMLElement>(null!);

  // a Set which keeps track of callbacks given by the child layers through context
  const registrations = React.useRef<Registrations>(new Set());

  // if this instance is a child itself, we should use this function to register
  // some callbacks to the parent
  const possibleRegisterFn = React.useContext(GroupContext);

  // recursively checks whether to close or not. This mechanism has some similarities
  // with event bubbling.
  const shouldCloseWhenClickedOutside = React.useCallback(
    function shouldCloseWhenClickedOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      const clickedOnTrigger =
        trigger.current && trigger.current.contains(target);
      const clickedOnLayer = layer.current && layer.current.contains(target);

      const shouldCloseAccordingToSlaves = getShouldCloseAccordingToSlaves(
        registrations.current,
        event
      );

      // when clicked on own layer, but the child would have closed ->
      // let child close
      if (clickedOnLayer && shouldCloseAccordingToSlaves) {
        registrations.current.forEach(({ closeSlave }) => closeSlave());
      }

      return (
        !clickedOnTrigger && !clickedOnLayer && shouldCloseAccordingToSlaves
      );
    },
    [trigger, layer, registrations]
  );

  // registration stuff
  React.useEffect(() => {
    if (typeof possibleRegisterFn !== "function") {
      return;
    }

    // 'possibleRegisterFn' will return a function that will unregister
    // on cleanup
    return possibleRegisterFn({
      shouldCloseWhenClickedOutside,
      closeSlave: () => {
        warning(
          onParentClose,
          `react-use-layer: You are using useLayer() in a nested setting but forgot to set the 'onParentClose()' callback in the options. This could lead to unexpected behavior.`
        );

        if (onParentClose) {
          onParentClose();
        }
      }
    });
  }, [
    possibleRegisterFn,
    shouldCloseWhenClickedOutside,
    onParentClose,
    registrations
  ]);

  // document click handling
  React.useEffect(() => {
    const isSlave = typeof possibleRegisterFn === "function";
    const shouldNotListen = !isOpen || !onOutsideClick || isSlave;
    if (shouldNotListen) {
      return;
    }

    function handleClick(event: MouseEvent) {
      if (shouldCloseWhenClickedOutside(event)) {
        onOutsideClick!();
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [
    isOpen,
    onOutsideClick,
    shouldCloseWhenClickedOutside,
    possibleRegisterFn
  ]);

  // When this 'useLayer' gets closed -> tell child layers to close as well
  React.useEffect(() => {
    if (!isOpen) {
      registrations.current.forEach(({ closeSlave }) => closeSlave());
    }
  }, [isOpen]);

  return {
    closeOnOutsideClickRefs: {
      trigger,
      layer
    },
    registrations
  };
}

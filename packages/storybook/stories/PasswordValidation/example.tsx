import * as React from "react";
import styled from "styled-components";
import { useLayer, mergeRefs, Arrow } from "react-laag";
import { Input } from "../../components/Input";
import { AnimatePresence, motion } from "framer-motion";

type RequirementType =
  | "numeric"
  | "lowercase"
  | "uppercase"
  | "special"
  | "length";

const validationMap: Record<RequirementType, (value: string) => boolean> = {
  lowercase: value => /[a-z]/.test(value),
  uppercase: value => /[A-Z]/.test(value),
  // eslint-disable-next-line no-useless-escape
  special: value => /[\!\@\#\$\%\^\&\*\+\_\-\~]/.test(value),
  numeric: value => /[0-9]/.test(value),
  length: value => value.length >= 8
};

type RequirementProps = {
  children: string;
  type: RequirementType;
  value: string;
};

const RequirementBase = styled.div`
  display: flex;
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
  line-height: 1.15;

  > *:first-child {
    width: 20px;
    color: #7db316;
  }
`;

function Requirement({ children, type, value }: RequirementProps) {
  const isValid = validationMap[type](value);

  return (
    <RequirementBase
      style={{
        display: "flex",
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
        lineHeight: 1.15
      }}
    >
      <div>{isValid ? "✔︎" : ""}</div>
      {children}
    </RequirementBase>
  );
}

const Menu = styled(motion.div)`
  /* transition: width 0.15s ease-in-out; */
  padding: 12px 16px;
  background-clip: padding-box;
  border-radius: 4px;
  box-shadow: 0 1px 15px rgba(27, 31, 35, 0.15);
  margin: 0;
  box-sizing: border-box;
  background-color: white;
  color: #333;
  border: 1px solid rgba(27, 31, 35, 0.15);

  > *:first-child {
    font-weight: 700;
    font-size: 12px;
    margin-bottom: 8px;
  }
`;

export const PasswordValidation = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(function PasswordValidation(props, ref) {
  const [value, setValue] = React.useState("");
  const [hasFocus, setFocus] = React.useState(false);

  const [didOpen, setDidOpen] = React.useState(false);

  React.useEffect(() => {
    if (!hasFocus) {
      return;
    }

    setDidOpen(true);

    return () => setDidOpen(false);
  }, [hasFocus]);

  const {
    renderLayer,
    triggerProps,
    layerProps,
    arrowProps,
    triggerBounds
  } = useLayer({
    isOpen: hasFocus,
    overflowContainer: false,
    auto: true,
    snap: true,
    placement: "top-start",
    possiblePlacements: [
      "top-start",
      "bottom-start",
      "right-center",
      "left-center"
    ],
    triggerOffset: 12,
    containerOffset: 16,
    arrowOffset: 8
  });

  return (
    <>
      {renderLayer(
        <AnimatePresence>
          {hasFocus && (
            <Menu
              {...layerProps}
              style={{
                ...layerProps.style,
                width: triggerBounds!.width
              }}
              initial={{ opacity: 0 }} // animate from
              animate={{ opacity: 1 }} // animate to
              exit={{ opacity: 0 }} // animate to
              transition={{
                duration: 0.15
              }}
              layout={didOpen}
            >
              <div>Choose a secure password</div>
              <Requirement value={value} type="length">
                8 characters
              </Requirement>
              <Requirement value={value} type="uppercase">
                1 uppercase letter
              </Requirement>
              <Requirement value={value} type="lowercase">
                1 lowercase letter
              </Requirement>
              <Requirement value={value} type="special">
                1 special character
              </Requirement>
              <Requirement value={value} type="numeric">
                1 number
              </Requirement>
              <Arrow
                {...arrowProps}
                borderColor="rgba(27, 31, 35, 0.15)"
                borderWidth={1}
                roundness={0.5}
              />
            </Menu>
          )}
        </AnimatePresence>
      )}
      <Input
        {...props}
        ref={mergeRefs(triggerProps.ref, ref)}
        style={{
          ...props.style,
          width: 200
        }}
        type="password"
        value={value}
        onChange={evt => setValue(evt.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder="Choose a password..."
      />
    </>
  );
});

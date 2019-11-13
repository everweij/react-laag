import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import { ChevronUp } from "styled-icons/feather/ChevronUp";
import { ChevronDown } from "styled-icons/feather/ChevronDown";

const Base = styled(motion.div)`
  overflow: hidden;
  border-bottom: 1px solid var(--greybg-border);
  background-color: white;
`;

const Top = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  justify-content: space-between;
  background-color: var(--greybg);
  user-select: none;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const Body = styled.div`
  padding: 12px;
  border-top: 1px solid var(--greybg-border);
  font-size: 16px;

  & > input {
    margin-bottom: 8px;
  }
  & > input[type="checkbox"] {
    position: relative;
    top: -6px;
  }
  & > input[type="radio"] {
    margin-right: 8px;
    margin-bottom: 16px;
  }
  & > input[type="radio"] + label {
    margin-right: 16px;
    font-size: 14px;
  }
  /* box-shadow: inset 0px 0px 3px 0px hsla(0, 0%, 0%, 0.09); */
`;

function Section({ id, children, title, isOpen, onClick, isFirst }) {
  const Icon = isOpen ? ChevronUp : ChevronDown;

  return (
    <Base
      initial={false}
      animate={{ height: isOpen ? "auto" : 40 }}
      transition={{ stiffness: 800, damping: 40 }}
      style={{ marginTop: isFirst ? 0 : 0 }}
    >
      <Top
        onClick={() => onClick(id)}
        style={{
          borderTop: isFirst ? "1px solid var(--greybg-border)" : "none"
        }}
      >
        <Title>{title}</Title>
        <Icon size={20} color="black" />
      </Top>
      <Body>{children}</Body>
    </Base>
  );
}

export default React.memo(Section, (prev, next) => {
  if (next.isOpen || (!next.isOpen && prev.isOpen)) {
    return false;
  }

  return true;
});

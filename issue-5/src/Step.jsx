import * as React from "react";

import Tooltip from "./Tooltip2";

export default function Step() {
  return (
    <Tooltip tooltip="This is the status" hover={false}>
      <div className="step">...</div>
    </Tooltip>
  );
}

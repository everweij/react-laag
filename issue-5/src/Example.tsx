import * as React from "react";
import { useState, useEffect } from "react";
import move from "array-move";

// @ts-ignore
import sillyname from "sillyname";

import Project from "./Project";
import Step from "./Step";
import Tooltip from "./Tooltip2";

const initialProjects = Array(15)
  .fill(null)
  .map(() => sillyname());

export const Example = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [steps, setSteps] = useState();

  useEffect(() => {
    let steps: any = {};
    projects.forEach(project => {
      steps[project] = Array(Math.floor(Math.random() * 5) + 1).fill(<Step />);
    });
    setSteps(steps);
  }, []);

  const moveTo = (i: number, target: number) =>
    setProjects(move(projects, i, target));

  return (
    <>
      <div className="projects">
        <div id="tooltips" />
        <Tooltip tooltip="It works!" hover={true}>
          <h1>Test tooltip (hover here)</h1>
        </Tooltip>
        {projects.map((project, i) => (
          <Project
            key={project}
            i={i}
            project={project}
            steps={steps && steps[project]}
            moveTo={moveTo}
          />
        ))}
      </div>
    </>
  );
};

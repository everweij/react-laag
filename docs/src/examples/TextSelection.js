import * as React from "react";
import ResizeObserver from "resize-observer-polyfill";
import { FormatBold } from "styled-icons/material/FormatBold";
import { FormatItalic } from "styled-icons/material/FormatItalic";
import { FormatUnderlined } from "styled-icons/material/FormatUnderlined";

import {
  Editor,
  EditorState,
  getVisibleSelectionRect,
  RichUtils,
  ContentState
} from "draft-js";

import { useToggleLayer } from "react-laag";

function Style({ Icon, selected, onClick, style }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        padding: 6,
        backgroundColor: selected ? "rgba(255,255,255, 0.15)" : "transparent",
        borderRadius: 3,
        ...style
      }}
    >
      <Icon size={24} />
    </div>
  );
}

function TextSelection({}) {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      ContentState.createFromText(`Way nor furnished sir procuring therefore but. Warmth far manner myself active are cannot called. Set her half end girl rich met. Me allowance departure an curiosity ye. In no talking address excited it conduct. Husbands debating replying overcame blessing he it me to domestic. 

    Insipidity the sufficient discretion imprudence resolution sir him decisively. Proceed how any engaged visitor. Explained propriety off out perpetual his you. Feel sold off felt nay rose met you. We so entreaties cultivated astonished is. Was sister for few longer mrs sudden talent become. Done may bore quit evil old mile. If likely am of beauty tastes. 
    `)
    )
  );

  const editor = React.useRef(null);

  const [element, toggleLayerProps] = useToggleLayer(
    ({ isOpen, layerProps }) =>
      isOpen && (
        <div
          ref={layerProps.ref}
          style={{
            ...layerProps.style,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            borderRadius: 4,
            color: "white",
            display: "flex",
            padding: 4
          }}
          onMouseDown={evt => evt.preventDefault()}
        >
          <Style
            Icon={FormatBold}
            onClick={() => {
              setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
            }}
            selected={editorState.getCurrentInlineStyle().has("BOLD")}
          />
          <Style
            Icon={FormatItalic}
            style={{ marginLeft: 2 }}
            onClick={() => {
              setEditorState(
                RichUtils.toggleInlineStyle(editorState, "ITALIC")
              );
            }}
            selected={editorState.getCurrentInlineStyle().has("ITALIC")}
          />
          <Style
            Icon={FormatUnderlined}
            style={{ marginLeft: 2 }}
            onClick={() => {
              setEditorState(
                RichUtils.toggleInlineStyle(editorState, "UNDERLINE")
              );
            }}
            selected={editorState.getCurrentInlineStyle().has("UNDERLINE")}
          />
        </div>
      ),
    { placement: { triggerOffset: 4 }, ResizeObserver }
  );

  function focusEditor() {
    editor.current.focus();
  }

  React.useEffect(() => {
    focusEditor();
  }, []);

  React.useEffect(() => {
    const isCollapsed = editorState.getSelection().isCollapsed();

    if (!editorState.getSelection().getHasFocus()) {
      toggleLayerProps.close();
      return;
    }

    if (isCollapsed) {
      toggleLayerProps.close();
    } else {
      toggleLayerProps.open({
        clientRect: () => getVisibleSelectionRect(window),
        target: document.body
      });
    }
  }, [
    editorState.getSelection().isCollapsed(),
    editorState.getSelection().getHasFocus()
  ]);

  return (
    <>
      <div
        onClick={focusEditor}
        style={{
          minHeight: 300,
          backgroundColor: "white",
          padding: 12
        }}
      >
        {element}
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={editorState => setEditorState(editorState)}
          handleKeyCommand={(command, editorState) => {
            const newState = RichUtils.handleKeyCommand(editorState, command);
            if (newState) {
              setEditorState(newState);
              return "handled";
            }
            return "not-handled";
          }}
        />
      </div>
    </>
  );
}

export default TextSelection;

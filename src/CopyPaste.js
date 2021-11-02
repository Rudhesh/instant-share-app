import "./App.css";
import React, { useRef, useState } from "react";

export default function CopyExample({ value = "", onChange }) {
  const [copySuccess, setCopySuccess] = useState("");
  const [text, setText] = useState(value);
  const textAreaRef = useRef(null);

  function update(event) {
    setText(event.target.value);
    if (typeof onChange === "function") {
      onChange(event.target.value);
    }
  }

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand("copy");
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus();
    setCopySuccess("Copied!");
  }

  return (
    <div>
      {
        /* Logical shortcut for only displaying the 
          button if the copy command exists */
        document.queryCommandSupported("copy") && (
          <div>
            <button onClick={copyToClipboard}>Copy</button>
            {copySuccess}
          </div>
        )
      }
      <form>
        <div className="icon">
          <input
            type="text"
            ref={textAreaRef}
            class="no-outline"
            id="fileURL"
            value={text}
            onChange={update}
            // readOnly
          />
          {/* <FontAwesomeIcon icon={faCopy} /> */}
        </div>
        {/* <textarea ref={textAreaRef} value="Some text to copy" /> */}
      </form>
    </div>
  );
}

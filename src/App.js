import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import outbox from "./outbox.png";
import React, { useState, useRef } from "react";
import { getDefaultNormalizer } from "@testing-library/react";

function App({ value = "", onChange }) {
  // const baseURL = "https://instant-share.herokuapp.com";

  const baseURL = "http://localhost:5000";

  const uploadURL = `${baseURL}/api/files`;
  const emailURL = `${baseURL}/api/files/send`;

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [isFile, setIsFile] = useState(false);

  const fileInput = useRef(null);

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

    e.target.focus();
    setCopySuccess("Copied!");
  }

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();

    formData.append("myfile", selectedFile);

    fetch(uploadURL, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
        showLink(result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fileURL = document.getElementById("fileURL");
  const emailForm = document.querySelector("#emailForm");
  let showLink = ({ file: url }) => {
    console.log(url.split("/").splice(-1, 1)[0]);
    fileURL.value = url;
    setIsFile(true);
  };
  const emailId = useRef(null);

  function submit(e) {
    e.preventDefault();

    console.log("INPUT VALUE: ", textAreaRef.current?.value);
    // const url = fileURL.value;
    const formData = {
      uuid: textAreaRef.current?.value.split("/").splice(-1, 1)[0],
      emailTo: emailId.current?.value,
      emailFrom: emailId.current?.value,
    };

    console.log(formData);
    fetch(emailURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // showToast("Email Sent");
          console.log(data);
        }
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <section>
          <div className="header">
            <h1>Instant Share</h1>
            <p>Easy and fast file sharing app.</p>
          </div>
          <div>
            <img src={outbox} alt="outbox" />
          </div>

          <div>
            <input
              id="fileInput"
              // hidden
              style={{ display: "none" }}
              type="file"
              name="file"
              ref={fileInput}
              onChange={changeHandler}
            />
            <div className="generate">
              <button
                className="upload-btn"
                onClick={() => fileInput.current.click()}
              >
                Choose File
              </button>
            </div>
            {isFilePicked ? (
              <div className="details">
                <p>Filename: {selectedFile.name}</p>
                <p>Filetype: {selectedFile.type}</p>
                <p>Size: {(selectedFile.size / 1000).toFixed()} KB</p>
                <p>
                  last Modified:{" "}
                  {selectedFile.lastModifiedDate.toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p>Select a file to show details</p>
            )}
          </div>

          <div>
            <div className="generate">
              <button onClick={handleSubmission}>Generate Link</button>
            </div>
          </div>

          <div>
            <div className="icon">
              <input
                type="text"
                className="no-outline"
                // value="Some text to copy"
                id="fileURL"
                ref={textAreaRef}
                readOnly
              />
              {
                /* Logical shortcut for only displaying the 
          button if the copy command exists */
                document.queryCommandSupported("copy") && (
                  <span className="button">
                    <button onClick={copyToClipboard}>
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                    {/* {copySuccess} */}
                  </span>
                )
              }
            </div>
          </div>

          <p>Or Send via Email</p>
          <div className="email-container">
            <form id="emailForm">
              {/* <div className="filed">
                <input
                  type="email"
                  autoComplete="email"
                  required
                  ref={emailId}
                  name="from-email"
                  id="fromEmail"
                  placeholder="Sender Email"
                />
              </div> */}

              <div className="filed">
                <input
                  type="email"
                  required
                  ref={emailId}
                  autoComplete="receiver"
                  name="to-email"
                  id="toEmail"
                  placeholder="Type Receiver Email"
                />
              </div>
              <div className=" generate">
                <button onClick={submit}>Send</button>
              </div>
            </form>
          </div>
        </section>
      </header>
    </div>
  );
}

export default App;

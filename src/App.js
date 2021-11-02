import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import outbox from "./outbox.png";
import React, { useState, useRef } from "react";

function App({ value = "", onChange }) {
  const baseURL = "https://instant-share.herokuapp.com";

  // const baseURL = "http://localhost:5000";

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

    const formData = {
      uuid: url.split("/").splice(-1, 1)[0],
      emailTo: emailForm.elements["to-email"].value,
      emailFrom: emailForm.elements["from-email"].value,
    };
    console.log(formData);
  };

  // const url = fileURL.value;
  // const formData = {
  //   uuid: url.split("/").splice(-1, 1)[0],
  //   emailTo: emailForm.elements["to-email"].value,
  //   emailFrom: emailForm.elements["from-email"].value,
  // };

  // console.log(formData);

  const toast = document.querySelector(".toast");

  let toastTimer;
  // the toast function
  const showToast = (msg) => {
    clearTimeout(toastTimer);
    toast.innerText = msg;
    toast.classList.add("show");
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  };

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
            <button
              className="upload-btn"
              onClick={() => fileInput.current.click()}
            >
              Choose File
            </button>
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
            <div>
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
                  <span>
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
              <div className="filed">
                {/* <label for="fromEmail">Sender's </label> */}
                <input
                  type="email"
                  autoComplete="email"
                  required
                  name="from-email"
                  id="fromEmail"
                  placeholder="Sender Email"
                />
              </div>

              <div className="filed">
                {/* <label for="toEmail">Receiver's</label> */}
                <input
                  type="email"
                  required
                  autoComplete="receiver"
                  name="to-email"
                  id="toEmail"
                  placeholder="Receiver Email"
                />
              </div>
              <div className="send-btn-container">
                <button type="submit">Send</button>
              </div>
            </form>
          </div>
        </section>

        <div className="toast">Sample message</div>
      </header>
    </div>
  );
}

export default App;

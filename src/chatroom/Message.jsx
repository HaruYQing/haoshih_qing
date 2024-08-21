// Message.js
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import moment from "moment";

const Message = ({ msg }) => {
  const [showModal, setShowModal] = useState(false);
  const { type, content, username, timestamp, color } = msg;
  const messageStyle = {
    color: color,
    fontWeight: "bold",
  };

  const handleImageClick = () => {
    if (type === "image" || type === "sticker") {
      setShowModal(true);
    }
  };
  const formatMessageTime = (timestamp) =>
    moment(timestamp).format("YYYY-MM-DD hh:mm:ss");

  return (
    <>
      <div
        className={`d-flex ${
          username === "YourUsername"
            ? "justify-content-end"
            : "justify-content-start"
        } mb-3`}
      >
        <div
          className="card"
          style={{ maxWidth: "70%", backgroundColor: `${color}` }}
        >
          <div
            className="card-header  border-0 pt-2 pb-0"
            style={{ backgroundColor: `${color}` }}
          >
            <small className="text-muted">{username}</small>
          </div>
          <div className="card-body pt-1 pb-2">
            {type === "sticker" && (
              <img
                src={content}
                alt="sticker"
                style={{
                  width: "100px",
                  cursor: "pointer",
                }}
                onClick={handleImageClick}
              />
            )}
            {type === "image" && (
              <img
                src={content}
                alt="uploaded"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  cursor: "pointer",
                }}
                onClick={handleImageClick}
              />
            )}
            {type === "text" && <p className="card-text">{content}</p>}
          </div>
          <div className="card-footer border-0 pt-0 pb-2">
            <small className="text-muted">{formatMessageTime(timestamp)}</small>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <img src={content} alt="Full size" style={{ width: "100%" }} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Message;

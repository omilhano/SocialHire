// RemoveFriendModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

const RemoveFriendModal = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Remove Friend</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to remove this person from your friends list?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Remove Friend
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveFriendModal;

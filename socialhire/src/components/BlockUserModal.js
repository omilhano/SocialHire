// BlockUserModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

const BlockUserModal = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Block User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to block this user? Blocking will prevent you from seeing or interacting with their profile.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Block
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BlockUserModal;

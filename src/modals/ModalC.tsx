import React from "react";
import { Modal, Button } from "react-bootstrap";

interface ModalCProps {
  show: boolean;
  onHide: () => void;
  contact: any;
}

const ModalC: React.FC<ModalCProps> = ({ show, onHide, contact }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Contact Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Name: {contact.first_name} {contact.last_name}
        </p>
        <p>Email: {contact.email || "N/A"}</p>
        <p>Phone Number: {contact.phone_number || "N/A"}</p>
        <p>Country Id: {contact.country_id || "N/A"}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalC;

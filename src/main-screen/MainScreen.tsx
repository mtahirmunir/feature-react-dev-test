import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import ModalA from "../modals/ModalA";
import ModalB from "../modals/ModalB";

function MainScreen() {
  const [showModalA, setShowModalA] = useState(false);
  const [showModalB, setShowModalB] = useState(false);
  const [onlyEven, setOnlyEven] = useState(false);

  const openModalA = () => {
    setShowModalA(true);
    setShowModalB(false);
  };

  const openModalB = () => {
    setShowModalA(false);
    setShowModalB(true);
  };

  const handleCloseModals = () => {
    setShowModalA(false);
    setShowModalB(false);
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center h-100"
      style={{ minHeight: "100vh" }}
    >
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={openModalA}>
            Button A
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="secondary" onClick={openModalB}>
            Button B
          </Button>
        </Col>
      </Row>

      <Form className="mt-3">
        <Form.Check
          type="checkbox"
          label="Only even"
          checked={onlyEven}
          onChange={() => setOnlyEven(!onlyEven)}
        />
      </Form>

      {/* Render ModalA */}
      <ModalA
        show={showModalA}
        onHide={handleCloseModals}
        onlyEven={onlyEven}
      />

      {/* Render ModalB */}
      <ModalB
        show={showModalB}
        onHide={handleCloseModals}
        onlyEven={onlyEven}
      />
    </Container>
  );
}

export default MainScreen;

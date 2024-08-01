// src/CalendarComponent.js
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Container, Row, Col, Card } from "react-bootstrap";

const Employee = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md="auto">
          <Card>
            <Card.Header>
              <h3>Calendar</h3>
            </Card.Header>
            <Card.Body>
              <Calendar onChange={onChange} value={date} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Employee;

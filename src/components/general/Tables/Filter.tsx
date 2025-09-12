import type { ITableFilterParams } from "@types";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { memo } from "react";

const FilterComponent = ({ filterText, onFilter, onClear, placeholder }: ITableFilterParams) => {
  return (
    <Row className="justify-content-between">
      <Col sm="auto">
        <InputGroup className="m-1">
          <Form.Control
            size="sm"
            placeholder={placeholder}
            type="text"
            value={filterText}
            onChange={onFilter}
          />
          <Button size="sm" variant="outline-secondary" onClick={onClear}>
            X
          </Button>
        </InputGroup>
      </Col>
    </Row>
  );
};

export const Filter = memo(FilterComponent);
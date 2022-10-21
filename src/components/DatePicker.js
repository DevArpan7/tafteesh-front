import React from 'react'
import { Form, InputGroup } from "react-bootstrap";

import moment from "moment" ;
const DatePicker =(props)=> {
  const{datePickerChange,data,name,required,message,flag } = props;
  //console.log(data,required,"dataaaa")
  return (
    <>
      <InputGroup className='date_box'>
        <span className='hidebox'></span>
        <Form.Control
          type="text"
          placeholder="DD-MMM-YYYY"
          value={data && moment(data).format("DD-MMM-YYYY")}
          required={required}
          disabled={true}
        />
        <Form.Control.Feedback type="invalid">
            {message && message}
        </Form.Control.Feedback>
        <InputGroup.Text>
          <Form.Control
          name={name}
          // value={data && moment(data).format("YYYY-MM-DD")}
            className='dateBtn'
            type="date"
            required={required}
            onChange={datePickerChange}
            placeholder=""
            max={moment().format("YYYY-MM-DD")}
          />
          <i class="far fa-calendar-alt"></i>
        </InputGroup.Text>
      </InputGroup>
    </>
  )
}

export default DatePicker
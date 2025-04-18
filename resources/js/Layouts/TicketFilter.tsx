import React, { useState } from "react";
import { Link } from '@inertiajs/react';
import ReactDatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";

const TicketFilter = () => {
    const startOfYear = new Date();
startOfYear.setMonth(0); // Ocak (0. indeks) ayı
startOfYear.setDate(1); // Ayın ilk günü

    const [selectedDate1, setSelectedDate1] = useState(startOfYear);
    const [selectedDate2, setSelectedDate2] = useState(new Date());
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleLabelClick = () => {
    setFocused(true);
  };

  const handleInputBlur = () => {
    if (inputValue === "") {
      setFocused(false);
    }
  };
  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setInputValue(value);
    if (value !== "" && !focused) {
      setFocused(true);
    }
  };

  const handleDateChange1 = (date: any) => {
    setSelectedDate1(date);
  };
  const handleDateChange2 = (date: any) => {
    setSelectedDate2(date);
  };
  const level = [
    { value: 1, label: "Select Level" },
    { value: 2, label: "High" },
    { value: 3, label: "Low" },
    { value: 4, label: "Medium" },
  ];
  const status = [
    { value: 1, label: "Select Level" },
    { value: 2, label: "Pending" },
    { value: 3, label: "Approved" },
    { value: 4, label: "Returned" },
  ];

  const customStyles = {
    option: (provided:any, state:any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff9b44",
      },
    }),
  };

  return (
    <>
      <div className="row filter-row">
        <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
          <div
            className={
              focused || inputValue !== ""
                ? "input-block form-focus focused"
                : "input-block form-focus"
            }
          >
            <input
              type="text"
              className="form-control floating"
              value={inputValue}
              onFocus={handleLabelClick}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
            />
            <label className="focus-label" onClick={handleLabelClick}>
              Employee Name
            </label>
          </div>
        </div>
        <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
          <div className="input-block form-focus select-focus">
            <Select
              options={status}
              placeholder="--Select--"
              styles={customStyles}
            />
            <label className="focus-label">Status</label>
          </div>
        </div>
        <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
          <div className="input-block form-focus select-focus">
            <Select
              options={level}
              placeholder="--Select--"
              styles={customStyles}
            />
            <label className="focus-label">Priority</label>
          </div>
        </div>
        <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
          <div className="input-block form-focus select-focus">
            <div className="cal-icon">
              <ReactDatePicker

                selected={selectedDate1}
                onChange={handleDateChange1}
                className="form-control floating datetimepicker"
                dateFormat="dd-MM-yyyy"
              />
            </div>
            <label className="focus-label">From</label>
          </div>
        </div>
        <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
          <div className="input-block form-focus select-focus">
            <div className="cal-icon">
              <ReactDatePicker
                selected={selectedDate2}
                onChange={handleDateChange2}
                className="form-control floating datetimepicker"
                dateFormat="dd-MM-yyyy" // Add the placeholderText prop here
              />
            </div>
            <label className="focus-label">To</label>
          </div>
        </div>
        <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
          <Link href="#" className="btn btn-success btn-block w-100">
            {" "}
            Search{" "}
          </Link>
        </div>
      </div>
    </>
  );
};

export default TicketFilter;

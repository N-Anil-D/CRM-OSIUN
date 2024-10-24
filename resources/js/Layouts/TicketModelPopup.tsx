import React, {PropsWithChildren, useState} from "react";
import { Link } from '@inertiajs/react';
import Select from "react-select";
import { PageProps } from "@/types";
import axios from "axios";
import { BuildingProps, CustomerProps} from "@/types/globalProps";
import {User} from '@/types';


function TicketModelPopup({ kullanici, builds, customers }: PropsWithChildren<{ kullanici: User | undefined; builds: BuildingProps[] | undefined; customers: CustomerProps[] | undefined;}>)  {
    //const [isDisabled, setisDisabled] =useState(true);
    //const [customers, setCustomers] = useState<CustomerProps[]>([]);
    //if (user) {
    //    if (user.connectedCustomer == 'ALL') {
    //        setisDisabled(false);
    //        //axios.get('/api/customerindex').then(res => {
    //        //    setCustomers(res.data);
    //        //})
    //    }else {
    //        setisDisabled(true);
    //        const currentCustomer: CustomerProps = {
    //            CustomerID : user.connectedCustomer,
    //            id:0,
    //            adress : "-",
    //            city: "-",
    //            country: "-",
    //            created_at: new Date(),
    //            updated_at: new Date(),
    //            passive: 0,
    //            phone_number: "-",
    //            postal_code: "-",
    //            Unvan: "-",
    //            username : "-",
    //            VergiDairesi: "-",
    //            VergiNumarasi: "-",
    //            Yetkili: "-"
    //        }
    //        setCustomers([currentCustomer]);
    //    }
//
    //}else {
    //    return (
    //        <h1>Kullanıcı Hatası...</h1>
    //    )
    //}
  console.dir("popup Customer",customers);
  console.dir("popup Build",builds);
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
      <div id="add_ticket" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Ticket</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Subject</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Customer</label>
                      <Select
                        options={customers}
                        placeholder={customers ? customers.length > 0 ? customers[0].CustomerID : kullanici?.connectedCustomer : '-'}
                        styles={customStyles}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Building</label>
                      <Select
                        options={builds}
                        placeholder={'--Select A Value--'}
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Room</label>
                      <Select
                        options={customers}
                        placeholder="-"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                </div>
                {/*<div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Priority</label>
                      <Select
                        options={status}
                        placeholder="High"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">CC</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Assign</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Assignee</label>
                      <div className="project-members">
                        <Link
                          title="John Smith"
                          data-placement="top"
                          data-bs-toggle="tooltip"
                          href="#"
                          className="avatar"
                        >
                          {/*<img src={Avatar_02} alt="" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Add Followers</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Followers</label>
                      <div className="project-members">
                        <Link
                          title="Richard Miles"
                          data-bs-toggle="tooltip"
                          href="#"
                          className="avatar"
                        >
                        {/*<img src={Avatar_09} alt="" />
                        </Link>
                        <Link
                          title="John Smith"
                          data-bs-toggle="tooltip"
                          href="#"
                          className="avatar"
                        >
                        {/*<img src={Avatar_10} alt="" />
                        </Link>
                        <Link
                          title="Mike Litorus"
                          data-bs-toggle="tooltip"
                          href="#"
                          className="avatar"
                        >
                        {/*<img src={Avatar_05} alt="" />
                        </Link>
                        <Link
                          title="Wilmer Deluna"
                          data-bs-toggle="tooltip"
                          href="#"
                          className="avatar"
                        >
                          {/*<img src={Avatar_11} alt="" />
                        </Link>
                        <span className="all-team">+2</span>
                      </div>
                    </div>
                  </div>
                </div>*/}
                <div className="row">
                  <div className="col-sm-12">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Description</label>
                      <textarea className="form-control" defaultValue={""} />
                    </div>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Upload Files</label>
                      <input className="form-control" type="file" />
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="reset"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div id="edit_ticket" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Ticket</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Subject</label>
                      <input
                        className="form-control"
                        type="text"
                        defaultValue="Laptop Issue"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Id</label>
                      <input
                        className="form-control"
                        type="text"
                        readOnly
                        defaultValue="TKT-0001"
                      />
                    </div>
                  </div>
                </div>
                {/*<div className="row">
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Assign Staff</label>
                      <Select
                        options={staff}
                        placeholder="John Smith"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Client</label>
                      <Select
                        options={customers}
                        placeholder="Delta InfoTech"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Priority</label>
                      <Select
                        options={status}
                        placeholder="Medium"
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">CC</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Assign</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Assignee</label>
                      <div className="project-members">
                        <Link
                          title="John Smith"
                          data-placement="top"
                          data-bs-toggle="tooltip"
                          href="#"
                          className="avatar"
                        >
                          {/*<img src={Avatar_02} alt="" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Add Followers</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Ticket Followers</label>
                      <div className="project-members">
                        <Link
                          title="Richard Miles"
                          data-bs-toggle="tooltip"
                          href="#"
                          className="avatar"
                        >
                        {/*<img src={Avatar_09} alt="" />
                        </Link>
                        <Link
                          title="John Smith"
                          data-bs-toggle="tooltip"
                          href="#"
                          className="avatar"
                        >
                        {/*<img src={Avatar_10} alt="" />
                        </Link>
                        <Link
                          title="Mike Litorus"
                          data-bs-toggle="tooltip"
                          href="#"
                          className="avatar"
                        >
                        {/*<img src={Avatar_05} alt="" />
                        </Link>
                        <Link
                          title="Wilmer Deluna"
                          data-bs-toggle="tooltip"
                          href="#"
                          className="avatar"
                        >
                        {/*<img src={Avatar_11} alt="" />
                        </Link>
                        <span className="all-team">+2</span>
                      </div>
                    </div>
                  </div>
                </div>*/}
                <div className="row">
                  <div className="col-md-12">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        defaultValue={""}
                      />
                    </div>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Upload Files</label>
                      <input className="form-control" type="file" />
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="reset"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TicketModelPopup;

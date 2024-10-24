import React, {useState, useEffect} from 'react';
import {MoreVertical, PlusCircle} from 'react-feather';
import {PageProps} from '@/types';
import {Head, Link} from '@inertiajs/react';
import axios from "axios";
import moment from "moment/moment";
import {CustomerProps, RouteAuths} from '@/types/globalProps';
import {User} from '@/types';
import {forEach} from "react-bootstrap/ElementChildren";
import Cookies from "js-cookie";
import Swal from 'sweetalert2';
import {AgGridReact} from 'ag-grid-react';
import {themeQuartz} from '@ag-grid-community/theming';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {ICellRendererParams, ColDef, ValueGetterParams} from 'ag-grid-community';
import withReactContent from "sweetalert2-react-content";

interface ClientProjectsProps {
    auth: User;
    customer: CustomerProps;
    pageAuth: RouteAuths | undefined;
}

async function getProjects(customer: CustomerProps): Promise<void> {
    const MySwal = withReactContent(Swal);
    const request = {
        customerID: customer.CustomerID
    }
    axios.post('/apí/getcustomersprojects', request).then(resp => {
        if (resp.status == 200) {

        }
    }).catch(err => {
        console.log(err);
        MySwal.fire({
            title: 'Fout!',
            text: 'Er is iets misgegaan.\n' + err,
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-danger',
            },
        });
    })
}

export function ClientProjects({auth, customer, pageAuth}: ClientProjectsProps) {
    const [projectsData, setProjectsData] = useState()
    const [writeAuth, setWriteAuth] = useState<boolean>(false);
    const [deleteAuth, setDeleteAuth] = useState<boolean>(false)
    useEffect(() => {
        getProjects(customer);
        if (pageAuth?.children) {
            let contentAuth = pageAuth.children.find(x => x.page_name == `Projects`)
            if (contentAuth) {
                setWriteAuth(contentAuth.write);
                setDeleteAuth(contentAuth.delete)
            }
        }
    }, [auth]);
    return (
        <div>
            <div className="view-header">
                <h4>Projects</h4>
                <ul>
                    <li>
                        <a onClick={(e) => {
                            e.preventDefault();
                        }}
                           className="com-add"><i
                            className="las la-plus-circle me-1"/>Add
                            New</a>
                    </li>
                </ul>
            </div>
            <div className="calls-activity">
                <AgGridReact

                />
            </div>
        </div>
    )
}

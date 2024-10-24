import React, {useState} from 'react'
import { Head, Link } from '@inertiajs/react';
import axios from "axios";

interface NoteProps {
    customerid: string;
    openername: string;
    notetitle: string;
    note: string;
    delete: boolean;
    created_at: Date;
    updated_at: Date;
}
interface CustomerProps {
    id: number;
    CustomerID: string;
    Unvan: string;
    username: string;
    VergiDairesi: string;
    VergiNumarasi: string;
    Yetkili: string;
    email: string;
    phone_number: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
    passive: number;
    created_at: Date;
    updated_at: Date;
    tag: string;
}
interface KullaniciProps {
    id: number;
    name: string;
    email: string;
}
interface Props{
    kullanici: KullaniciProps;
    customer: CustomerProps;
}
const AddNotes: React.FC<Props> = ({kullanici, customer}) => {
    const [formData, setFormData] = useState<NoteProps>({
        customerid: customer.CustomerID,
        openername: kullanici.name,
        notetitle:'',
        note:'',
        delete: false,
        created_at: new Date(),
        updated_at: new Date()
    });
    const NewNoteSendChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleNewNoteSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // formData'yı kullanarak yapmak istediğiniz işlemleri gerçekleştirin (örneğin, API'ye gönderme)
        try {
            console.log('formdata', formData);
            // Kullanıcı verilerini içeren bir nesne gönderiyoruz
            axios.post('/api/notes/store', formData).then(response => {
                console.log('Note added sucsessfully:', response.data);
                window.location.reload();
            }).catch(err => {

                console.error('There is an error accured while adding a note:', err);
            });
            //return response.data; // Eklendikten sonra dönen veriyi işlemek için isteğin yanıtını döndürebilirsiniz
        } catch (error) {
            console.error('There is an error accured while adding a ticket:', error);
            throw error; // Hata durumunda hatayı yakalayabilir veya yukarıya iletebilirsiniz
        }
    };
    return (
        <>
            {/* Add Note */}
            <div
                className="modal custom-modal fade modal-padding"
                id="add_notes"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header header-border align-items-center justify-content-between p-0">
                            <h5 className="modal-title">Add Note</h5>
                            <button
                                type="button"
                                className="btn-close position-static"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body p-0">
                            <form id='newNote' onSubmit={handleNewNoteSend} method='post'>
                                <div className="input-block mb-3">
                                    <label className="col-form-label">
                                        Title <span className="text-danger"> *</span>
                                    </label>
                                    <input className="form-control" type="text"
                                           value={formData.notetitle}
                                           name={"notetitle"}
                                           onChange={NewNoteSendChange} />
                                </div>
                                <div className="input-block mb-3">
                                    <label className="col-form-label">
                                        Note <span className="text-danger"> *</span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        placeholder="Add text"
                                        onChange={NewNoteSendChange}
                                        name={"note"}
                                        value={formData.note}
                                    />
                                </div>
                                <div className="col-lg-12 text-end form-wizard-button">
                                    <button className="button btn-lights reset-btn" type="reset" data-bs-dismiss="modal">
                                        Reset
                                    </button>
                                    <button className="btn btn-primary"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                            type="submit">
                                        Save Note
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Note */}
        </>

    )
}

export default AddNotes

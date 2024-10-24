import React, { useState } from 'react';
import {PageProps} from "@/types";

interface PassProps{
    formData:any;
    NewUserSendChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>void;
}
const PasswordComponent: React.FC<PassProps> = ({ formData, NewUserSendChange }) => {
    const [password, setPassword] = useState<any>(formData.password || '');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword(e.target.value);
        NewUserSendChange(e);
    };

    const handlePasswordAgainChange = (e:any) => {
        setPasswordAgain(e.target.value);
        if (password !== e.target.value) {
            setError('Passwords do not match');
        } else {
            setError('');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="row">
            <div className="col-sm-6">
                <div className="input-block mb-3">
                    <label className="col-form-label">Password <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <input type={passwordVisible ? "text" : "password"}
                               className="form-control"
                               onChange={handlePasswordChange}
                               name={'password'}
                               value={password}
                        />
                        <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                            {passwordVisible ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-sm-6">
                <div className="input-block mb-3">
                    <label className="col-form-label">Password Again <span className="text-danger">*</span></label>
                    <input type={passwordVisible ? "text" : "password"}
                           className="form-control"
                           onChange={handlePasswordAgainChange}
                           value={passwordAgain}
                    />
                    {error && <div className="text-danger">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default PasswordComponent;

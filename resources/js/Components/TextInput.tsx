import React, {forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes, useState} from 'react';
import {Eye, EyeOff, Phone} from 'react-feather'

export default forwardRef(function TextInput(
    {type = 'text', className = '', isFocused = false, ...props}: InputHTMLAttributes<HTMLInputElement> & {
        isFocused?: boolean
    },
    ref
) {
    const localRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, []);

    return (
        <div className="input-group mt-1 col-12">
            <input
                {...props}
                type={showPassword ? 'text' : type}
                className={
                    'border-gray-300 focus:border-indigo-500 ' +
                    'dark:focus:border-indigo-600 focus:ring-indigo-500' +
                    ' dark:focus:ring-indigo-600 rounded-md shadow-sm ' +
                    className + (type === 'password' ? (' col-10 ') : ' ')
                }
                ref={localRef}
            />
            {type == 'password' ? (
                <span className={'text-center input-group-text col-2 ' +
                    'border-gray-300 focus:border-indigo-500 ' +
                    'dark:focus:border-indigo-600 focus:ring-indigo-500' +
                    ' dark:focus:ring-indigo-600 rounded-md shadow-sm '} id="basic-addon1"
                      onClick={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                      }}>
                    {!showPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
                </span>) : null}
        </div>
    );
});

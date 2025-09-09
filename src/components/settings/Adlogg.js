import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../GlobalContext';

export default function Adloggs() {
    const { setIsLoading, setAppError, setAppErrorMessage, setAppErrorTitle, setAppErrorMode } = useGlobalContext();

    const [apiKey, setApiKey] = useState('');
    const [baseUrl, setBaseUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation logic
        if (!apiKey) {
            setAppError(true);
            setAppErrorMessage("Please enter the API Key.");
            setAppErrorTitle("Validation Error");
            setAppErrorMode("error");
            setIsLoading(false);
            return;
        }

        if (!baseUrl) {
            setAppError(true);
            setAppErrorMessage("Please enter the Base URL.");
            setAppErrorTitle("Validation Error");
            setAppErrorMode("error");
            setIsLoading(false);
            return;
        }

        if (!username) {
            setAppError(true);
            setAppErrorMessage("Please enter the Username.");
            setAppErrorTitle("Validation Error");
            setAppErrorMode("error");
            setIsLoading(false);
            return;
        }

        if (!password) {
            setAppError(true);
            setAppErrorMessage("Please enter the Password.");
            setAppErrorTitle("Validation Error");
            setAppErrorMode("error");
            setIsLoading(false);
            return;
        }

        // If all validations pass, proceed with the rest of your logic (e.g., API call)
        // ...
    };

    return (
        <>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        <h1>AdLoggs</h1>
                        <span>
                            <Link to="/"> Dashboard </Link> /  AdLoggs
                        </span>
                    </div>
                    <div className='page-content'>
                        <div className="portal">
                            <div className='portal-body'>
                                <div className='form'>
                                    <form autoComplete="off" onSubmit={handleSubmit}>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <div className='mb-3'>
                                                    <h4>AdLoggs Information</h4>
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">API Key</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        autoComplete='off'
                                                        placeholder="Enter API Key"
                                                        value={apiKey}
                                                        onChange={(e) => setApiKey(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Base URL</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        autoComplete='off'
                                                        placeholder="Enter Base URL"
                                                        value={baseUrl}
                                                        onChange={(e) => setBaseUrl(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Username</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        autoComplete='off'
                                                        placeholder="Enter Username"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        autoComplete='off'
                                                        placeholder="Enter Password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='clearfix'></div>
                                            <div className='col-12 text-end'>
                                                <div className="mb-3">
                                                    <button type='reset' className='btn btn-danger btn-md'> <i className="ri-reset-right-line"></i> Reset </button>
                                                    &nbsp;&nbsp;
                                                    <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Save Adloggs </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
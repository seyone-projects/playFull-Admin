import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../GlobalContext';

export default function Branding() {
    const { setIsLoading, setAppError, setAppErrorMessage, setAppErrorTitle, setAppErrorMode } = useGlobalContext();

    const [appName, setAppName] = useState('');
    const [appIcon, setAppIcon] = useState(null);
    const [splashScreen, setSplashScreen] = useState(null);
    const [mobileEntryScreen, setMobileEntryScreen] = useState(null);
    const [otpEntryScreen, setOtpEntryScreen] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation logic
        if (!appName) {
            setAppError(true);
            setAppErrorMessage("Please enter the app name.");
            setAppErrorTitle("Validation Error");
            setAppErrorMode("error");
            setIsLoading(false);
            return;
        }

        if (!appIcon) {
            setAppError(true);
            setAppErrorMessage("Please upload the app icon.");
            setAppErrorTitle("Validation Error");
            setAppErrorMode("error");
            setIsLoading(false);
            return;
        }

        if (!splashScreen) {
            setAppError(true);
            setAppErrorMessage("Please upload the splash screen.");
            setAppErrorTitle("Validation Error");
            setAppErrorMode("error");
            setIsLoading(false);
            return;
        }

        if (!mobileEntryScreen) {
            setAppError(true);
            setAppErrorMessage("Please upload the mobile entry screen.");
            setAppErrorTitle("Validation Error");
            setAppErrorMode("error");
            setIsLoading(false);
            return;
        }

        if (!otpEntryScreen) {
            setAppError(true);
            setAppErrorMessage("Please upload the OTP entry screen.");
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
                        <h1>Branding</h1>
                        <span>
                            <Link to="/"> Dashboard </Link> / Branding
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
                                                    <h4>Branding Information</h4>
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">App Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        autoComplete='off'
                                                        placeholder="Enter App Name"
                                                        value={appName}
                                                        onChange={(e) => setAppName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">App Icon</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={(e) => setAppIcon(e.target.files[0])}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Splash Screen</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={(e) => setSplashScreen(e.target.files[0])}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Mobile Entry Screen</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={(e) => setMobileEntryScreen(e.target.files[0])}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">OTP Entry Screen</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={(e) => setOtpEntryScreen(e.target.files[0])}
                                                    />
                                                </div>
                                            </div>
                                            <div className='clearfix'></div>
                                            <div className='col-12 text-end'>
                                                <div className="mb-3">
                                                    <button type='reset' className='btn btn-danger btn-md'> <i className="ri-reset-right-line"></i> Reset </button>
                                                    &nbsp;&nbsp;
                                                    <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Save Branding </button>
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
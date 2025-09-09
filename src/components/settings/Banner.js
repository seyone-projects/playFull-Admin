import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../GlobalContext';

export default function Banner() {
    const { setIsLoading, setAppError, setAppErrorMessage, setAppErrorTitle, setAppErrorMode } = useGlobalContext();

    const [homeBanner1, setHomeBanner1] = useState(null);
    const [homeBanner2, setHomeBanner2] = useState(null);
    const [defaultKitchenBanner, setDefaultKitchenBanner] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation logic
        if (!homeBanner1) {
            setAppError(true);
            setAppErrorMessage("Please upload Home Banner 1.");
            setAppErrorTitle("Validation Error");
            setAppErrorMode("error");
            setIsLoading(false);
            return;
        }

        if (!homeBanner2) {
            setAppError(true);
            setAppErrorMessage("Please upload Home Banner 2.");
            setAppErrorTitle("Validation Error");
            setAppErrorMode("error");
            setIsLoading(false);
            return;
        }

        if (!defaultKitchenBanner) {
            setAppError(true);
            setAppErrorMessage("Please upload Default Kitchen Banner.");
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
                        <h1>Banners</h1>
                        <span>
                            <Link to="/"> Dashboard </Link> /  Banners
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
                                                    <h4>Banner Information</h4>
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Home Banner 1</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={(e) => setHomeBanner1(e.target.files[0])}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Home Banner 2</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={(e) => setHomeBanner2(e.target.files[0])}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Default Kitchen Banner</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={(e) => setDefaultKitchenBanner(e.target.files[0])}
                                                    />
                                                </div>
                                            </div>
                                            <div className='clearfix'></div>
                                            <div className='col-12 text-end'>
                                                <div className="mb-3">
                                                    <button type='reset' className='btn btn-danger btn-md'> <i className="ri-reset-right-line"></i> Reset </button>
                                                    &nbsp;&nbsp;
                                                    <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Save Banners </button>
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
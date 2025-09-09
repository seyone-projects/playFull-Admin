import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';

export default function SupplierNew() {
    const { isLoading, setIsLoading, setAppError, setAppErrorMessage, setAppErrorTitle, setAppErrorMode } = useGlobalContext();

    const [supplier, setSupplier] = useState(null);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState('active');
    const { id } = useParams();

    const saveSupplier = (e) => {
        e.preventDefault();
        // Add your saving logic here
        console.log('Saving supplier...');
    };

    return (
        <>
            <Helmet>
                <title>Supplier Manage | {config.appName}</title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        <h1>{id ? 'Edit Supplier' : 'Add Supplier'}</h1>
                        <span>
                            <Link to="/">Dashboard</Link> / <Link to="#">Supplier List</Link> / Supplier Manage
                        </span>
                    </div>
                    <div className='page-content'>
                        <div className="portal">
                            <div className='portal-body'>
                                <div className='form'>
                                    <form onSubmit={saveSupplier} encType='multipart/form-data'>
                                        <div className='row'>
                                            <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Name</label>
                                                    <input type='text' className='form-control' />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-3 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">States</label>
                                                    <div className="input-group mb-3">
                                                        <select className="form-select" id="supplierId">
                                                            <option value="">Select State</option>
                                                            <option value="tamil nadu">Tamil Nadu</option>
                                                            <option value="kerala">Kerala</option>
                                                            <option value="karnataka">Karnataka</option>
                                                            <option value="andhra pradesh">Andhra Pradesh</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-2 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Mobile</label>
                                                    <input className='form-control' type='text' />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-2 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Whatsapp</label>
                                                    <input className='form-control' type='text' />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-2 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Email</label>
                                                    <input className='form-control' type='text' />
                                                </div>
                                            </div>
                                            <div className='col-lg-12 col-md-2 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Address</label>
                                                    <textarea className='form-control'></textarea>
                                                </div>
                                            </div>

                                            {id && (
                                                <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                                                    <div className="mb-3">
                                                        <label className="form-label">Status</label>
                                                        <br></br>
                                                        <input type='radio' name='status' value="active" onChange={(e) => setStatus(e.target.value)} checked={status === 'active'} /> Active &nbsp;&nbsp;
                                                        <input type='radio' name='status' value="inactive" onChange={(e) => setStatus(e.target.value)} checked={status === 'inactive'} /> Deactive
                                                    </div>
                                                </div>
                                            )}
                                            <div className='col-12 text-end'>
                                                <button type='reset' className='btn btn-danger btn-md'> <i className="ri-reset-right-line"></i> Reset </button>
                                                &nbsp;&nbsp;
                                                {supplier === null ?
                                                    <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Add Supplier  </button>
                                                    :
                                                    <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Update Supplier </button>
                                                }
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

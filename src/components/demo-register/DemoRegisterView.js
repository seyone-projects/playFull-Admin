import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { GetById } from '../../service/DemoRegisterService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function DemoRegistrationView() {

    const { id } = useParams(); // Get the registration ID from URL
    const { isLoading, setIsLoading, setAppError, setAppErrorMessage, setAppErrorTitle, setAppErrorMode } = useGlobalContext();
    const [registration, setRegistration] = React.useState(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [totalItems, setTotalItems] = React.useState(0);

    const fetchRegistration = async () => {
        try {
            setIsLoading(true);
            var response = await GetById(id);
            console.log("demoregister", response);
            setRegistration(response.demoRegistration);
            setCurrentPage(response.currentPage);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalItems);
        } catch (error) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Failed to load data");
            setAppErrorMode("error");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchRegistration();
    }, [id]);

    if (!registration) return null;

    return (
        <>
            <Helmet>
                <title>Demo Registration Details | {config.appName}</title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        <h1>Demo Registration Details</h1>
                        <span>
                            <Link to="/"> Dashboard </Link> / <Link to="/demo-registration/list">Demo Registration List</Link> / Details
                        </span>
                    </div>
                    <div className='page-content'>
                        <div className='card shadow-sm p-4'>
                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <strong>Name:</strong> {registration.name}
                                </div>
                                <div className='col-md-6'>
                                    <strong>Email:</strong> {registration.email}
                                </div>
                            </div>

                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <strong>Mobile:</strong> {registration.mobile}
                                </div>
                                <div className='col-md-6'>
                                    <strong>WhatsApp Number:</strong> {registration.whatAppNumber}
                                </div>
                            </div>

                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <strong>Standard:</strong> {registration.standard || 'N/A'}
                                </div>
                                <div className='col-md-6'>
                                    <strong>Board:</strong> {registration.board || 'N/A'}
                                </div>
                            </div>

                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <strong>Current Position:</strong> {registration.currentPosition || 'N/A'}
                                </div>
                                <div className='col-md-6'>
                                    <strong>Time Zone:</strong> {registration.timeZone}
                                </div>
                            </div>

                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <strong>Demo Date: </strong>
                                    {registration.demoDate
                                        ? (() => {
                                            const date = new Date(registration.demoDate);
                                            const day = String(date.getDate()).padStart(2, '0');
                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                            const year = date.getFullYear();
                                            return `${day}-${month}-${year}`;
                                        })()
                                        : ''}
                                </div>
                                <div className='col-md-6'>
                                    <strong>Demo Time:</strong> {registration.demoTime}
                                </div>
                            </div>
                            <hr></hr>
                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <strong>State:</strong> {registration.stateId?.name || 'N/A'}
                                </div>
                                <div className='col-md-6'>
                                    <strong>Section:</strong> {registration.sectionId?.name || 'N/A'}
                                </div>
                            </div>

                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <strong>Category:</strong> {registration.categoryId?.name || 'N/A'}
                                </div>
                                <div className='col-md-6'>
                                    <strong>SubCategory:</strong> {registration.subCategoryId?.name || 'N/A'}
                                </div>
                            </div>

                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <strong>Trainer:</strong> {registration.userId?.username || 'N/A'}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

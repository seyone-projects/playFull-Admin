import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetById } from '../../service/BatchService';
import { Update, GetById as GetByLPId } from '../../service/LessonPlannerService';
import { GetUsersByRole } from '../../service/UserService';
import axios from 'axios';

export default function LessonPlannerScreenshots() {
    const {
        isLoading,
        setIsLoading,
        isAppError,
        setAppError,
        appErrorMessage,
        setAppErrorMessage,
        appErrorTitle,
        setAppErrorTitle,
        appErrorMode,
        setAppErrorMode,
        appUser,
    } = useGlobalContext();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;
    const { batchId, id } = useParams();

    const [batchDetails, setBatchDetails] = useState({});

    // Form states
    const [lessonTopic, setLessonTopic] = useState('');
    const [lessonDate, setLessonDate] = useState('');
    const [lessonTime, setLessonTime] = useState('');
    const [lessonDuration, setLessonDuration] = useState('');
    const [lessonDescription, setLessonDescription] = useState('');
    const [link, setLink] = useState('');
    const [remarks, setRemarks] = useState('');
    const [status, setStatus] = useState('');
    const [image, setImage] = useState(null);
    const [screenshot1, setScreenshot1] = useState(null);
    const [screenshot2, setScreenshot2] = useState(null);
    const [screenshot3, setScreenshot3] = useState(null);
    const [screenshot4, setScreenshot4] = useState(null);

    const userId = appUser?._id;
    const [lessonPlanner, setLessonPlanner] = useState(null);

    const formatLessonTime = (time) => {
        if (!time) return '';

        // Case 1: Time is already in HH:mm format
        if (/^\d{2}:\d{2}$/.test(time)) {
            return time;
        }

        // Case 2: ISO string or full Date
        const date = new Date(time);
        if (!isNaN(date)) {
            return date.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
        }

        return '';
    };

    // Trainer
    const [trainerUserId, setUserId] = useState('');
    const [trainers, setUsers] = useState([]);

    const fetchBatchDetails = async () => {
        try {
            setIsLoading(true);
            const response = await GetById(batchId);
            if (response?.batch) {
                setBatchDetails(response.batch);
            } else {
                setBatchDetails({});
            }
        } catch (error) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Failed to fetch batch details");
            setAppErrorMode("error");
        } finally {
            setIsLoading(false);
        }
    };

    // fetch trainer 
    const FetchUser = async () => {
        setIsLoading(true);
        try {
            const response = await GetUsersByRole("trainer", 1, 9999);
            console.log("trainer", response);
            if (response && Array.isArray(response.users)) {
                // Filter only active categories
                const activeUsers = response.users.filter(cat => cat.status === "active");
                setUsers(activeUsers);
            } else {
                setAppError(true);
                setAppErrorMessage('No User Found.');
            }
        } catch (error) {
            setAppError(true);
            setAppErrorMessage('Error loading master data');
            setAppErrorMode('Error');
        } finally {
            setIsLoading(false);
        }
    };


    // Fetch lesson planner details by ID
    const fetchLessonPlannerDetails = async () => {
        try {
            setIsLoading(true);
            const response = await GetByLPId(id);
            // After fetching lesson planner details
            if (response?.lessonPlanner) {
                const lp = response.lessonPlanner;
                setLessonPlanner(lp); // <-- Add this line
                const oldTime = formatLessonTime(lp.lessonTime);
                setUserId(lp.trainerId?._id || '');
                setLessonTopic(lp.lessonTopic || '');
                setLessonDate(lp.lessonDate?.split('T')[0] || '');
                setLessonTime(oldTime);
                setLessonDuration(lp.lessonDuration || '');
                setLessonDescription(lp.lessonDescription || '');
                setLink(lp.link || '');
                setRemarks(lp.remarks || '');
                setStatus(lp.status || '');
                setScreenshot1(lp.screenshot1);
                setScreenshot2(lp.screenshot2);
                setScreenshot3(lp.screenshot3);
                setScreenshot4(lp.screenshot4);
            }

        } catch (error) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Failed to fetch lesson planner details");
            setAppErrorMode("error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLessonPlannerDetails();
    }, [id]);
    useEffect(() => {
        fetchBatchDetails();
    }, []);

    React.useEffect(() => {
        FetchUser(); // Call function to fetch categories when component mounts
    }, []);




    const handleFileChange = (event) => {
        setImage(event.target.files[0]); // Set the selected file
        console.log(image);
    };

    return (
        <>
            <Helmet>
                <title>  Lesson Planner Screenshots | {config.appName}</title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        <h1> Lesson Planner Screenshots </h1>
                        <span>
                            <Link to="/"> Dashboard </Link> / <Link to={`/batch-lesson-planner/manage/${batchId}`}> Batch Lesson Planner List </Link>
                            / Lesson Planner Screenshots
                        </span>
                    </div>

                    <div className='page-content'>
                        <div className="portal">
                            <div className='portal-body'>
                                <div className='batch-details'>
                                    <div className='row'>
                                        <div className='col-lg-3 col-md-3 col-sm-12'>
                                            Category : <strong>{batchDetails?.courseId?.categoryId?.name || '-'}</strong>
                                        </div>
                                        <div className='col-lg-3 col-md-3 col-sm-12'>
                                            Sub Category : <strong> {batchDetails?.courseId?.subCategoryIds
                                                ?.map(sub => sub.name)
                                                .join(", ")}</strong>
                                        </div>
                                        <div className='col-lg-6 col-md-6 col-sm-12'>
                                            Course : <strong>{batchDetails?.courseId?.name || '-'}</strong>
                                        </div>
                                    </div>
                                </div>
                                <br></br>
                                <div className='batch-details'>
                                    <div className='row'>
                                        <div className='col-lg-3 col-md-3 col-sm-12'>
                                            Batch Code : <strong>{batchDetails?.code || '-'}</strong>
                                        </div>
                                        <div className='col-lg-3 col-md-3 col-sm-12'>
                                            Start Date : <strong>
                                                {batchDetails?.startDate
                                                    ? (() => {
                                                        const date = new Date(batchDetails.startDate);
                                                        const day = String(date.getDate()).padStart(2, '0');
                                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                                        const year = date.getFullYear();
                                                        return `${day}-${month}-${year}`;
                                                    })()
                                                    : '-'}
                                            </strong>
                                        </div>
                                        <div className='col-lg-6 col-md-6 col-sm-12'>
                                            Batch Name : <strong>{batchDetails?.name || '-'}</strong>
                                        </div>
                                    </div>
                                </div>
                                <br></br>
                                <h5><b><FontAwesomeIcon icon="fa-solid fa-book" /> Lesson Planner Screenshots </b></h5>
                                <div className='row'>
                                    <div className='col-lg-6 col-md-6 col-sm-12 mb-3'>
                                        <label className="form-label">Screenshot 1</label>
                                        <br />
                                        {screenshot1 ? (
                                            screenshot1.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                <img
                                                    src={`${config.imageBasePath}/screenshot1/${lessonPlanner._id}.${screenshot1}`}
                                                    alt="screenshot1"
                                                    style={{ width: '100%', height: '300px', marginTop: '10px' }}
                                                />
                                            ) : (
                                                <a
                                                    href={`${config.imageBasePath}/screenshot1/${lessonPlanner._id}.${screenshot1}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View File ({screenshot1})
                                                </a>
                                            )
                                        ) : (
                                            <p>No screenshot uploaded</p>
                                        )}
                                    </div>

                                    <div className='col-lg-6 col-md-6 col-sm-12 mb-3'>
                                        <label className="form-label">Screenshot 2</label>
                                        <br />
                                        {screenshot2 ? (
                                            screenshot2.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                <img
                                                    src={`${config.imageBasePath}/screenshot2/${lessonPlanner._id}.${screenshot2}`}
                                                    alt="screenshot2"
                                                    style={{ width: '100%', height: '300px', marginTop: '10px' }}
                                                />
                                            ) : (
                                                <a
                                                    href={`${config.imageBasePath}/screenshot2/${lessonPlanner._id}.${screenshot2}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View File ({screenshot2})
                                                </a>
                                            )
                                        ) : (
                                            <p>No screenshot uploaded</p>
                                        )}
                                    </div>

                                    <div className='col-lg-6 col-md-6 col-sm-12 mb-3'>
                                        <label className="form-label">Screenshot 3</label>
                                        <br />
                                        {screenshot3 ? (
                                            screenshot3.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                <img
                                                    src={`${config.imageBasePath}/screenshot3/${lessonPlanner._id}.${screenshot3}`}
                                                    alt="screenshot3"
                                                    style={{ width: '100%', height: '300px', marginTop: '10px' }}
                                                />
                                            ) : (
                                                <a
                                                    href={`${config.imageBasePath}/screenshot3/${lessonPlanner._id}.${screenshot3}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View File ({screenshot3})
                                                </a>
                                            )
                                        ) : (
                                            <p>No screenshot uploaded</p>
                                        )}
                                    </div>

                                    <div className='col-lg-6 col-md-6 col-sm-12 mb-3'>
                                        <label className="form-label">Screenshot 4</label>
                                        <br />
                                        {screenshot4 ? (
                                            screenshot4.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                <img
                                                    src={`${config.imageBasePath}/screenshot4/${lessonPlanner._id}.${screenshot4}`}
                                                    alt="screenshot4"
                                                    style={{ width: '100%', height: '300px', marginTop: '10px' }}
                                                />
                                            ) : (
                                                <a
                                                    href={`${config.imageBasePath}/screenshot4/${lessonPlanner._id}.${screenshot4}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View File ({screenshot4})
                                                </a>
                                            )
                                        ) : (
                                            <p>No screenshot uploaded</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

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

export default function BatchLessonPlannerEdit() {
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
            if (response?.lessonPlanner) {
                const lessonPlanner = response.lessonPlanner;
                const oldTime = formatLessonTime(lessonPlanner.lessonTime);
                setUserId(lessonPlanner.trainerId._id || '');
                setLessonTopic(lessonPlanner.lessonTopic || '');
                setLessonDate(lessonPlanner.lessonDate?.split('T')[0] || '');
                setLessonTime(oldTime);
                setLessonDuration(lessonPlanner.lessonDuration || '');
                setLessonDescription(lessonPlanner.lessonDescription || '');
                setLink(lessonPlanner.link || '');
                setRemarks(lessonPlanner.remarks || '');
                setStatus(lessonPlanner.status || '');
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


    const saveLessonPlanner = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        try {
            let response = null;
            response = await Update(id, batchId, trainerUserId, lessonTopic, lessonDate, lessonTime, lessonDuration, lessonDescription, link, remarks, status);
            if (response.status === 200) {
                setAppError(true);
                setAppErrorTitle("Action Response");
                setAppErrorMessage(response.message || "Lesson planner Successfully Updated");
                setAppErrorMode("success");
                if (batchId) {
                    window.location.href = `/batch-lesson-planner/manage/edit/${id}/${batchId}`;
                } else {
                    console.error("Invalid batch id");
                }
            } else {
                setAppError(true);
                setAppErrorTitle("Error");
                setAppErrorMessage(response.message || "Action failed. Please try again.");
                setAppErrorMode("error");
            }
        } catch (error) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Something went wrong. Please try again.");
            setAppErrorMode("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title> Edit Lesson Planner | {config.appName}</title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        <h1>Edit Lesson Planner </h1>
                        <span>
                            <Link to="/"> Dashboard </Link> / <Link to={`/batch-lesson-planner/manage/${batchId}`}> Batch Lesson Planner List </Link>
                            / Edit Lesson Planner
                        </span>
                    </div>

                    <div className='page-content'>
                        <div className="portal">
                            <div className='portal-body'>
                                <div className='batch-details'>
                                    <div className='row mb-3'>
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
                                        <div className='col-lg-3 col-md-3 col-sm-12'>
                                            Fee : <strong>{batchDetails?.fee}</strong>
                                        </div>
                                        <div className='col-lg-3 col-md-3 col-sm-12'>
                                            Certificate : <strong>
                                                {batchDetails?.certificate === true
                                                    ? "Yes"
                                                    : batchDetails?.certificate === false
                                                        ? "No"
                                                        : "-"}
                                            </strong>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-6 col-sm-12'>
                                            Batch Name : <strong>{batchDetails?.name || '-'}</strong>
                                        </div>
                                        <div className='col-lg-6 col-md-6 col-sm-12'>
                                            Trainer Name : <strong>{batchDetails.trainerId?.username || '-'}</strong>
                                        </div>
                                    </div>
                                </div>

                                <br />
                                <div className='row'>
                                    <div className='col-lg-12 col-md-12 col-xs-12'>
                                        <div className='batch-details'>
                                            <form onSubmit={saveLessonPlanner} encType='multipart/form-data'>
                                                <div className='row'>
                                                    <div className='col-lg-4 col-md-4 col-sm-12 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Trainer</label>
                                                            <select
                                                                className="form-control"
                                                                value={trainerUserId} // Ensure this state is defined
                                                                onChange={(e) => setUserId(e.target.value)} // Update correctly
                                                            >
                                                                <option value="">Select Trainer</option>
                                                                {trainers.map(trainerOption => (
                                                                    <option key={trainerOption._id} value={trainerOption._id}>
                                                                        {trainerOption.username}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-8 col-md-8 col-sm-12 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Lesson Topic</label>
                                                            <input className='form-control' type='text' value={lessonTopic} onChange={(e) => setLessonTopic(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-4 col-sm-12 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Lesson Date</label>
                                                            <input className='form-control' type='date' value={lessonDate} onChange={(e) => setLessonDate(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-4 col-sm-12 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Lesson Time</label>
                                                            <input className='form-control' type='time' value={lessonTime} onChange={(e) => setLessonTime(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-4 col-sm-12 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Lesson Duration (mins)</label>
                                                            <input className='form-control' type='number' value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6 col-md-4 col-sm-12 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Link</label>
                                                            <input className='form-control' type='url' value={link} onChange={(e) => setLink(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6 col-md-4 col-sm-12 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Remarks</label>
                                                            <input className='form-control' type='text' value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Lesson Description</label>
                                                            <textarea className='form-control' value={lessonDescription} onChange={(e) => setLessonDescription(e.target.value)} rows={5} />
                                                        </div>
                                                    </div>
                                                    {id && (
                                                        <div className='col-lg-12 col-md-12 col-sm-6 col-12'>
                                                            <div className="mb-3">
                                                                <label className="form-label">Status</label>
                                                                <br></br>
                                                                <input type='radio' name='status' value="planned" onChange={(e) => setStatus(e.target.value)} checked={status === 'planned'} /> Planned &nbsp;&nbsp;
                                                                <input type='radio' name='status' value="inprogress" onChange={(e) => setStatus(e.target.value)} checked={status === 'inprogress'} /> In Progress &nbsp;&nbsp;
                                                                <input type='radio' name='status' value="pending" onChange={(e) => setStatus(e.target.value)} checked={status === 'pending'} /> Pending &nbsp;&nbsp;
                                                                <input type='radio' name='status' value="completed" onChange={(e) => setStatus(e.target.value)} checked={status === 'completed'} /> Completed &nbsp;&nbsp;
                                                                <input type='radio' name='status' value="cancelled" onChange={(e) => setStatus(e.target.value)} checked={status === 'cancelled'} /> Cancelled
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className='col-12 text-end'>
                                                        <div className="mb-3">
                                                            <button type='submit' className='btn btn-success-app btn-md'>
                                                                <i className="ri-check-fill"></i> Update Lesson Planner
                                                            </button>
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
                </div>
            </div>
        </>
    );
}

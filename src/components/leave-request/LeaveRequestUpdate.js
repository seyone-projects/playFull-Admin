import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetById as GetBatchById, GetUsersByBatchId } from '../../service/BatchService';
import { GetById as GetLessonPlannerById } from '../../service/LessonPlannerService';
import { Update } from '../../service/LeaveRequestService';

export default function LeaveRequestUpdate() {
    const {
        setIsLoading,
        setAppError,
        setAppErrorMessage,
        setAppErrorTitle,
        setAppErrorMode,
        appUser,
    } = useGlobalContext();

    const { id, batchId, lessonPlannerId } = useParams();
    const [batchDetails, setBatchDetails] = useState({});
    const [lessonTopic, setLessonTopic] = useState('');
    const [lessonDate, setLessonDate] = useState('');
    const [lessonTime, setLessonTime] = useState('');
    const [lessonDuration, setLessonDuration] = useState('');
    const [lessonDescription, setLessonDescription] = useState('');
    const [lessonTrainerName, setLessonTrainerName] = useState('');

    const [studentsAttendance, setStudentsAttendance] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    const [responseRemarks, setResponseRemarks] = useState();
    const [status, setStatus] = useState();

    function formatTimeWithAMPM(timeStr) {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata',
        });
    }

    const fetchBatchDetails = async () => {
        try {
            setIsLoading(true);
            const response = await GetBatchById(batchId);
            if (response?.batch) {
                setBatchDetails(response.batch);
            } else {
                setBatchDetails({});
            }
        } catch {
            setAppError(true);
            setAppErrorTitle('Error');
            setAppErrorMessage('Failed to fetch batch details');
            setAppErrorMode('error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLessonPlannerDetails = async () => {
        try {
            setIsLoading(true);
            const res = await GetLessonPlannerById(lessonPlannerId);
            if (res?.lessonPlanner) {
                const lp = res.lessonPlanner;
                setLessonTopic(lp.lessonTopic || '');
                setLessonDate(lp.lessonDate?.split('T')[0] || '');
                setLessonTime(lp.lessonTime || '');
                setLessonDuration(lp.lessonDuration || '');
                setLessonDescription(lp.lessonDescription || '');
                setLessonTrainerName(lp.trainerId?.username || '');
            }
        } catch {
            setAppError(true);
            setAppErrorTitle('Error');
            setAppErrorMessage('Failed to fetch lesson planner details');
            setAppErrorMode('error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBatchStudentList = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await GetUsersByBatchId(batchId, page, itemsPerPage);
            setUsers(response.users || []);
            setStudentsAttendance(
                (response.users || []).map(u => ({
                    id: u._id,
                    name: u.username,
                    status: 'present',
                    remarks: ''
                }))
            );
            setCurrentPage(response.currentPage || 1);
            setTotalPages(response.totalPages || 1);
            setTotalItems(response.totalItems || 0);
        } catch {
            setAppError(true);
            setAppErrorTitle('Error');
            setAppErrorMessage('Failed to load data');
            setAppErrorMode('error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (batchId && id) {
            fetchBatchDetails();
            fetchLessonPlannerDetails();
        }
    }, [batchId, id]);

    useEffect(() => {
        if (batchId) {
            fetchBatchStudentList(currentPage);
        }
    }, [batchId, currentPage]);



    const saveLeaveRequest = async (event) => {
        event.preventDefault();

        // Validate response remarks is required
        if (!responseRemarks || responseRemarks.trim() === '') {
            setAppError(true);
            setAppErrorTitle("Validation Error");
            setAppErrorMessage("Please enter response remarks");
            setAppErrorMode("error");
            return;
        }

        //status is required
        if (!status || status.trim() === '') {
            setAppError(true);
            setAppErrorTitle("Validation Error");
            setAppErrorMessage("Please select status");
            setAppErrorMode("error");
            return;
        }

        setIsLoading(true);

        try {
            let response = null;
            response = await Update(id, responseRemarks, status);
            if (response.status === 200) {
                setAppError(true);
                setAppErrorTitle("Action Response");
                setAppErrorMessage(response.message || "Leave request Successfully Updated");
                setAppErrorMode("success");
                if (batchId) {
                    window.location.href = `/leave-request/list`;
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
                <title>Leave Response | {config.appName}</title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        <h1>Leave Response</h1>
                        <span>
                            <Link to="/">Dashboard</Link> /
                            <Link to={`/leave-request/list`}> Leave Request List </Link>
                            / Leave Response
                        </span>
                    </div>

                    <div className='page-content'>
                        <div className='portal'>
                            <div className='portal-body'>

                                {/* Batch details */}
                                <div className='batch-details'>
                                    <div className='row mb-3'>
                                        <div className='col-lg-3'>Batch Code : <strong>{batchDetails?.code || '-'}</strong></div>
                                        <div className='col-lg-3'>Start Date : <strong>
                                            {batchDetails?.startDate ? (() => {
                                                const date = new Date(batchDetails.startDate);
                                                const day = String(date.getDate()).padStart(2, '0');
                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                const year = date.getFullYear();
                                                return `${day}-${month}-${year}`;
                                            })() : '-'}</strong></div>
                                        <div className='col-lg-3'>Fee : <strong>{batchDetails?.fee || '-'}</strong></div>
                                        <div className='col-lg-3'>Certificate : <strong>{batchDetails?.certificate ? 'Yes' : 'No'}</strong></div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-6'>Batch Name : <strong>{batchDetails?.name || '-'}</strong></div>
                                        <div className='col-lg-6'>Trainer Name : <strong>{batchDetails.trainerId?.username || '-'}</strong></div>
                                    </div>
                                </div>

                                {/* Lesson planner details */}
                                <div className='batch-details mt-3'>
                                    <div className='row'>
                                        <div className='col-lg-4 col-12'>Lesson Date : <strong>
                                            {lessonDate ? (() => {
                                                const date = new Date(lessonDate);
                                                const day = String(date.getDate()).padStart(2, '0');
                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                const year = date.getFullYear();
                                                return `${day}-${month}-${year}`;
                                            })() : '-'}</strong>
                                        </div>
                                        <div className='col-lg-4 col-12'>Lesson Time : <strong>
                                            {formatTimeWithAMPM(lessonTime)}</strong>
                                        </div>
                                        <div className='col-lg-4 col-12'>Lesson Duration (mins) : <strong>{lessonDuration || '-'}</strong>
                                        </div>
                                    </div>
                                    <div className='row mt-3'>
                                        <div className='col-lg-8 col-md-8 col-12'>Lesson Topic : <strong>{lessonTopic || '-'}</strong></div>
                                        <div className='col-lg-4 col-md-4 col-12'>Trainer Name : <strong>{lessonTrainerName || '-'}</strong></div>
                                    </div>
                                </div>
                                <br></br>
                                <div className='row'>
                                    <div className='col-lg-12 col-md-12 col-xs-12'>
                                        <div className='batch-details'>
                                            <form onSubmit={saveLeaveRequest} encType='multipart/form-data'>
                                                <div className='row'>
                                                    <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Response Remarks</label>
                                                            <textarea
                                                                className='form-control'
                                                                value={responseRemarks}
                                                                onChange={(e) => setResponseRemarks(e.target.value)}
                                                            ></textarea>
                                                        </div>
                                                    </div>

                                                    {/* Status Radio Buttons */}
                                                    <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label d-block">Status</label>
                                                            <div className="form-check form-check-inline">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    id="statusApproved"
                                                                    name="status"
                                                                    value="approved"
                                                                    checked={status === "approved"}
                                                                    onChange={(e) => setStatus(e.target.value)}
                                                                />
                                                                <label className="form-check-label" htmlFor="statusApproved">
                                                                    Approved
                                                                </label>
                                                            </div>
                                                            <div className="form-check form-check-inline">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    id="statusRejected"
                                                                    name="status"
                                                                    value="declined"
                                                                    checked={status === "declined"}
                                                                    onChange={(e) => setStatus(e.target.value)}
                                                                />
                                                                <label className="form-check-label" htmlFor="statusRejected">
                                                                   Declined
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12 text-end'>
                                                        <div className="mb-3">
                                                            <button type='submit' className='btn btn-success-app btn-md'>
                                                                <i className="ri-check-fill"></i> Send Response
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

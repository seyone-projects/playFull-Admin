import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetById as GetBatchById, GetUsersByBatchId } from '../../service/BatchService';
import { GetById as GetLessonPlannerById } from '../../service/LessonPlannerService';
import { Add, GetByLessonPlannerId, DeleteByBatchAndLessonPlanner } from '../../service/AttendanceService';

export default function AttendanceNew() {
    const {
        setIsLoading,
        setAppError,
        setAppErrorMessage,
        setAppErrorTitle,
        setAppErrorMode,
    } = useGlobalContext();

    const { batchId, id } = useParams();
    const [batchDetails, setBatchDetails] = useState({});
    const [lessonTopic, setLessonTopic] = useState('');
    const [lessonDate, setLessonDate] = useState('');
    const [lessonTime, setLessonTime] = useState('');
    const [lessonDuration, setLessonDuration] = useState('');
    const [lessonDescription, setLessonDescription] = useState('');
    const [lessonTrainerName, setLessonTrainerName] = useState('');
    const [lessonPlannerId, setLessonPlannerId] = useState('');
    const [trainerId, setTrainerId] = useState('');

    const [trainerStatus, setTrainerStatus] = useState('present');
    const [trainerRemarks, setTrainerRemarks] = useState('');

    const [studentsAttendance, setStudentsAttendance] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

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
            const res = await GetLessonPlannerById(id);
            if (res?.lessonPlanner) {
                const lp = res.lessonPlanner;
                setLessonTopic(lp.lessonTopic || '');
                setLessonDate(lp.lessonDate?.split('T')[0] || '');
                setLessonTime(lp.lessonTime || '');
                setLessonDuration(lp.lessonDuration || '');
                setLessonDescription(lp.lessonDescription || '');
                setLessonTrainerName(lp.trainerId?.username || '');
                setLessonPlannerId(lp._id || '');
                setTrainerId(lp.trainerId?._id || '');
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

    const updateStudentAttendance = (studentId, field, value) => {
        setStudentsAttendance(prev =>
            prev.map(s =>
                s.id === studentId ? { ...s, [field]: value } : s
            )
        );
    };

    const fetchAttendanceDetails = async (id) => {
        try {
            setIsLoading(true);
            const response = await GetByLessonPlannerId(id);
            if (response.attendances && Array.isArray(response.attendances)) {
                const attendanceList = response.attendances;
                // Trainer record
                const trainerRecord = attendanceList.find(a => {
                    const uid = typeof a.userId === 'object' ? a.userId._id : a.userId;
                    return uid === trainerId;
                });

                if (trainerRecord) {
                    setTrainerStatus(trainerRecord.attendanceStatus);
                    setTrainerRemarks(trainerRecord.remarks);
                }

                // Student records
                setStudentsAttendance(prev =>
                    prev.map(student => {
                        const studentRecord = attendanceList.find(a => {
                            const uid = typeof a.userId === 'object' ? a.userId._id : a.userId;
                            return uid === student.id;
                        });
                        return studentRecord
                            ? {
                                ...student,
                                status: studentRecord.attendanceStatus || 'present', // keep same field name used in form
                                remarks: studentRecord.remarks
                            }
                            : student;
                    })
                );

            }
        } catch {
            setAppError(true);
            setAppErrorTitle('Error');
            setAppErrorMessage('Failed to fetch attendance details');
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

    useEffect(() => {
        if (id && trainerId) {
            fetchAttendanceDetails(id);
        }
    }, [id, trainerId]);


    const saveAttendance = async (e) => {
        e.preventDefault();
        try {
            // 1. First delete old attendance records for this batch and lesson
            await DeleteByBatchAndLessonPlanner(batchId, lessonPlannerId);

            // 2. Then add trainer attendance
            await Add(batchId, trainerId, lessonPlannerId, lessonDate, trainerStatus, trainerRemarks);

            // 3. Then add each student's attendance
            for (const student of studentsAttendance) {
                await Add(batchId, student.id, lessonPlannerId, lessonDate, student.status, student.remarks);
            }
            setAppError(true);
            setAppErrorTitle('Success');
            setAppErrorMessage('Attendance saved for trainer and students');
            setAppErrorMode('success');
            window.location.href = `/attendance/manage/${lessonPlannerId}/${batchId}`;
        } catch {
            setAppError(true);
            setAppErrorTitle('Error');
            setAppErrorMessage('Something went wrong');
            setAppErrorMode('error');
        }
    };

    return (
        <>
            <Helmet>
                <title>Attendance | {config.appName}</title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        <h1>Attendance</h1>
                        <span>
                            <Link to="/">Dashboard</Link> /
                            <Link to={`/batch-lesson-planner/manage/${batchId}`}> Batch Lesson Planner List </Link>
                            / Attendance
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

                                {/* Attendance Form */}
                                <div className='mt-4'>
                                    <h5><b><FontAwesomeIcon icon="fa-solid fa-calendar-check" /> Trainer & Student Attendance </b></h5>

                                    <form onSubmit={saveAttendance}>
                                        <div className='col-lg-3 col-md-3 col-12 mb-3'>
                                            <label className='form-label'>Attendance Date</label> :
                                            <span style={{ color: 'rgba(231, 40, 40, 1)' }}> <b> {lessonDate ? (() => {
                                                const date = new Date(lessonDate);
                                                const day = String(date.getDate()).padStart(2, '0');
                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                const year = date.getFullYear();
                                                return `${day}-${month}-${year}`;
                                            })() : '-'} </b></span>
                                        </div>
                                        <div className='row g-4'>
                                            {/* Trainer Attendance */}
                                            <div className='col-lg-12 col-12'>
                                                <div className='border rounded p-3' style={{ backgroundColor: 'rgba(247, 255, 247, 1)' }}>
                                                    <h6 className='mb-3'> <b><FontAwesomeIcon icon="fa-solid fa-user-circle" /> Trainer Attendance </b></h6>
                                                    <div className='row'>
                                                        <div className='col-lg-3 col-md-9 col-12'>
                                                            <label className='form-label d-block'>Attendance</label>
                                                            <div className="btn-group" role="group">
                                                                <input type='radio' className='btn-check' id='tPresent' name='tStatus' value='present'
                                                                    checked={trainerStatus === 'present'} onChange={e => setTrainerStatus(e.target.value)} />
                                                                <label className='btn btn-outline-success' htmlFor='tPresent'>Present</label>

                                                                <input type='radio' className='btn-check' id='tAbsent' name='tStatus' value='absent'
                                                                    checked={trainerStatus === 'absent'} onChange={e => setTrainerStatus(e.target.value)} />
                                                                <label className='btn btn-outline-danger' htmlFor='tAbsent'>Absent</label>
                                                            </div>
                                                        </div>
                                                        <div className='col-lg-9 col-md-9 col-12'>
                                                            <label className='form-label'>Remarks</label>
                                                            <input type='text' className='form-control' value={trainerRemarks} onChange={e => setTrainerRemarks(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Student Attendance */}
                                            <div className='col-lg-12'>
                                                <div className='border rounded p-3' style={{ backgroundColor: 'rgba(255, 251, 236, 1)' }}>
                                                    <h6 className='mb-3'><b><FontAwesomeIcon icon="fa-solid fa-users" /> Student Attendance</b></h6>

                                                    <div className="table-responsive">
                                                        <table className="table table-bordered table-sm align-middle">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th>Student Name</th>
                                                                    <th className="text-center">Attendance</th>
                                                                    <th>Remarks</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {users.map((student, index) => {
                                                                    const sData = studentsAttendance.find(s => s.id === student._id) || {};
                                                                    return (
                                                                        <tr key={student._id}>
                                                                            <td>{student.username}</td>
                                                                            <td className="text-center">
                                                                                <div className="btn-group" role="group">
                                                                                    <input type="radio" className="btn-check" name={`status_${index}`} id={`present_${index}`} value="present"
                                                                                        checked={sData.status === 'present'}
                                                                                        onChange={() => updateStudentAttendance(student._id, 'status', 'present')}
                                                                                    />
                                                                                    <label className="btn btn-outline-success btn-sm" htmlFor={`present_${index}`}>Present</label>

                                                                                    <input type="radio" className="btn-check" name={`status_${index}`} id={`absent_${index}`} value="absent"
                                                                                        checked={sData.status === 'absent'}
                                                                                        onChange={() => updateStudentAttendance(student._id, 'status', 'absent')}
                                                                                    />
                                                                                    <label className="btn btn-outline-danger btn-sm" htmlFor={`absent_${index}`}>Absent</label>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <input type="text" className="form-control form-control-sm"
                                                                                    value={sData.remarks || ''}
                                                                                    onChange={e => updateStudentAttendance(student._id, 'remarks', e.target.value)}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='text-end mt-4'>
                                            <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Save Attendance</button>
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

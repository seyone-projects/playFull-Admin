import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetById } from '../../service/BatchService';
import { Add, GetByBatchId } from '../../service/LessonPlannerService';
import { GetUsersByRole } from '../../service/UserService';
import axios from 'axios';

export default function BatchLessonPlannerList() {
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
  const { id } = useParams();

  const [batchDetails, setBatchDetails] = useState({});
  const [lessonPlanners, setLessonPlanners] = useState([]);

  // Form states
  const [lessonTopic, setLessonTopic] = useState('');
  const [lessonDate, setLessonDate] = useState('');
  const [lessonTime, setLessonTime] = useState('');
  const [lessonDuration, setLessonDuration] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [link, setLink] = useState('');
  const [remarks, setRemarks] = useState('');

  function formatTimeWithAMPM(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0); // Set time

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  }

  // Trainer
  const [trainerUserId, setUserId] = useState('');
  const [trainers, setUsers] = useState([]);

  // view lesson planner details
  const [showModal, setShowModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);


  const fetchBatchDetails = async () => {
    try {
      setIsLoading(true);
      const response = await GetById(id);
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

  const fetchLessonPlanners = async (page = 1) => {
    try {
      setIsLoading(true);
      var response = await GetByBatchId(id, page, itemsPerPage);
      setLessonPlanners(response.lessonPlanners);
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

  useEffect(() => {
    fetchBatchDetails();
  }, []);

  React.useEffect(() => {
    FetchUser(); // Call function to fetch categories when component mounts
  }, []);


  React.useEffect(() => {
    fetchLessonPlanners(currentPage);
  }, []);

  const saveLessonPlanner = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      let response = null;
      response = await Add(id, trainerUserId, lessonTopic, lessonDate, lessonTime, lessonDuration, lessonDescription, link, remarks);
      if (response.status === 200) {
        setAppError(true);
        setAppErrorTitle("Action Response");
        setAppErrorMessage(response.message || "Lesson planner Successfully Added");
        setAppErrorMode("success");
        if (id) {
          window.location.href = `/batch-lesson-planner/manage/${id}`;
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
      {showModal && selectedLesson && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050, }}>
          <div className="modal-dialog modal-lg" style={{ marginTop: '1vh' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Lesson Planner Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Trainer:</strong> {selectedLesson.trainerId?.username || '-'}</p>
                <p><strong>Topic:</strong> {selectedLesson.lessonTopic}</p>
                <p><strong>Date:</strong> {selectedLesson.lessonDate ? (() => {
                  const date = new Date(selectedLesson.lessonDate);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  return `${day}-${month}-${year}`;
                })() : '-'}</p>
                <p><strong>Time:</strong> {formatTimeWithAMPM(selectedLesson.lessonTime)}</p>
                <p><strong>Duration:</strong> {selectedLesson.lessonDuration} mins</p>
                <p><strong>Description:</strong> {selectedLesson.lessonDescription}</p>
                <p><strong>Link:</strong> {selectedLesson.link ? (
                  <a href={selectedLesson.link} target="_blank" rel="noopener noreferrer">{selectedLesson.link}</a>
                ) : '-'}</p>
                <p><strong>Remarks:</strong> {selectedLesson.remarks || '-'}</p>
                <p><strong>Status:</strong> {selectedLesson.status.charAt(0).toUpperCase() + selectedLesson.status.slice(1)}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Helmet>
        <title>Lesson Planner Details | {config.appName}</title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Lesson Planner Details</h1>
            <span>
              <Link to="/"> Dashboard </Link> / <Link to={`/batch/list`}> Batch Lesson Planner List </Link>
              / Lesson Planner Details
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
                      Trainer Name : <strong>{batchDetails?.trainerId?.username || '-'}</strong>
                    </div>
                  </div>
                </div>
                <br></br>
                <div className='row'>
                  <div className='col-lg-12 col-md-12 col-xs-12'>
                    <h5><b><FontAwesomeIcon icon="fa-solid fa-plus-circle" /> Add Lesson Planner</b></h5>
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
                              <label className="form-label">Lesson Duration (in mins)</label>
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
                          <div className='col-12 text-end'>
                            <div className="mb-3">
                              <button type='submit' className='btn btn-success-app btn-md'>
                                <i className="ri-check-fill"></i> Add Lesson Planner
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <br />
                <h5><b><FontAwesomeIcon icon="fa-solid fa-book" /> Lesson Planner List </b></h5>
                <div className='table-content'>
                  <div className="mobile-scroll">
                  <table className='table table-bordered table-condensed'>
                    <thead>
                      <tr>
                        <th>Trainer</th>
                        <th>Topic</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Duration (in mins)</th>
                        <th>Link</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lessonPlanners.length === 0 ? (
                        <tr>
                          <td colSpan="8" className='text-center'>No records found</td>
                        </tr>
                      ) : (
                        lessonPlanners.map((lesson) => (
                          <tr key={lesson._id}>
                            <td>{lesson.trainerId?.username || '-'}</td>
                            <td>{lesson.lessonTopic}</td>
                            <td>
                              {lesson?.lessonDate
                                ? (() => {
                                  const date = new Date(lesson.lessonDate);
                                  const day = String(date.getDate()).padStart(2, '0');
                                  const month = String(date.getMonth() + 1).padStart(2, '0');
                                  const year = date.getFullYear();
                                  return `${day}-${month}-${year}`;
                                })()
                                : '-'}
                            </td>
                            <td>{formatTimeWithAMPM(lesson.lessonTime)}</td>
                            <td>{lesson.lessonDuration} mins</td>
                            <td>
                              {lesson.link ? (
                                <a href={lesson.link} target="_blank" rel="noopener noreferrer">
                                  Join
                                </a>
                              ) : (
                                <span>—</span>
                              )}
                            </td>
                            <td>{lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}</td>
                            <td>
                              <Link to={`/batch-lesson-planner/manage/edit/${lesson._id}/${id}`} className='btn btn-sm btn-primary me-2'>
                                <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                              </Link>
                              <button className="btn btn-sm btn-warning me-2" onClick={() => { setSelectedLesson(lesson); setShowModal(true); }}>
                                <FontAwesomeIcon icon="fa-solid fa-eye" />
                              </button>
                              <Link to={`/attendance/manage/${lesson._id}/${id}`} className='btn btn-sm btn-dark me-2'>
                                <FontAwesomeIcon icon="fa-solid fa-calendar-check" /> Attendance
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  </div>
                  {totalItems > itemsPerPage && (
                    <div className="pagination mt-3 d-flex justify-content-center">
                      <span className="align-self-center me-3">
                        {currentPage > 1 && (
                          <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => fetchLessonPlanners(currentPage - 1)}
                          >
                            Previous
                          </button>
                        )}
                        Page {currentPage} of {totalPages}
                        {currentPage < totalPages && (
                          <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => fetchLessonPlanners(currentPage + 1)}
                          >
                            Next
                          </button>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

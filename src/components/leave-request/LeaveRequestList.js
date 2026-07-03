import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetAll } from '../../service/LeaveRequestService';

export default function LeaveRequestList() {
  const {
    setIsLoading,
    setAppError,
    setAppErrorMessage,
    setAppErrorTitle,
    setAppErrorMode,
  } = useGlobalContext();

  const [leaveRequests, setLeaveRequests] = useState([]);

  const fetchLeaveRequestDetails = async () => {
    try {
      setIsLoading(true);
      const response = await GetAll(); // Fetch all leave requests (no role filter)
      setLeaveRequests(response.leaveRequests || []);
    } catch {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to fetch leave request details");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequestDetails();
  }, []);

  // Separate trainer and student leave requests
  const trainerRequests = leaveRequests.filter(
    (req) => req.userId?.role === "trainer"
  );
  const studentRequests = leaveRequests.filter(
    (req) => req.userId?.role === "student"
  );

  // Trainer pagination
  const [trainerPage, setTrainerPage] = useState(1);
  const trainerItemsPerPage = 10;
  const trainerTotalPages = Math.ceil(trainerRequests.length / trainerItemsPerPage);
  const trainerPaginated = trainerRequests.slice(
    (trainerPage - 1) * trainerItemsPerPage,
    trainerPage * trainerItemsPerPage
  );

  // Student pagination
  const [studentPage, setStudentPage] = useState(1);
  const studentItemsPerPage = 10;
  const studentTotalPages = Math.ceil(studentRequests.length / studentItemsPerPage);
  const studentPaginated = studentRequests.slice(
    (studentPage - 1) * studentItemsPerPage,
    studentPage * studentItemsPerPage
  );

  return (
    <>
      <Helmet>
        <title>Leave Request | {config.appName}</title>
      </Helmet>
      <div className="container">
        <div className="page">
          <div className="page-heading">
            <h1>Leave Request</h1>
            <span>
              <Link to="/">Dashboard</Link> / Leave Request
            </span>
          </div>
          <div className="page-content">
            <div className="portal">
              <div className="portal-body">

                {/* Trainer Leave Requests */}
                <h4 className="mb-3">Trainer Leave Requests</h4>
                <div className="table-content mb-5">
                  <div className="mobile-scroll">
                    <table className="table table-bordered table-condensed">
                      <thead>
                        <tr>
                          <th>Batch Name</th>
                          <th>Lesson Planner</th>
                          <th>Trainer Name</th>
                          <th>Apply Remarks</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trainerPaginated.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No trainer leave requests found
                            </td>
                          </tr>
                        ) : (
                          trainerPaginated.map((leaveRequest) => (
                            <tr key={leaveRequest._id}>
                              <td>{leaveRequest.lessonPlannerId?.batchId?.name}</td>
                              <td>{leaveRequest.lessonPlannerId?.lessonTopic}</td>
                              <td>{leaveRequest.userId?.username}</td>
                              <td>{leaveRequest.applyRemarks}</td>
                              <td>
                                {leaveRequest.status.charAt(0).toUpperCase() +
                                  leaveRequest.status.slice(1)}
                              </td>
                              <td>
                                <Link
                                  to={`/leave-request/manage/${leaveRequest._id}/${leaveRequest.lessonPlannerId?.batchId?._id}/${leaveRequest.lessonPlannerId?._id}`}
                                  className="btn btn-sm btn-dark me-2"
                                >
                                  <FontAwesomeIcon icon="fa-solid fa-coins" /> Make Response
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Trainer Pagination */}
                  {trainerTotalPages > 1 && (
                    <div className="pagination mt-3 d-flex justify-content-center">
                      <span className="align-self-center me-3">
                        {trainerPage > 1 && (
                          <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => setTrainerPage(trainerPage - 1)}
                          >
                            Previous
                          </button>
                        )}
                        Page {trainerPage} of {trainerTotalPages}
                        {trainerPage < trainerTotalPages && (
                          <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => setTrainerPage(trainerPage + 1)}
                          >
                            Next
                          </button>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Student Leave Requests */}
                <h4 className="mb-3">Student Leave Requests</h4>
                <div className="table-content">
                  <div className="mobile-scroll">
                    <table className="table table-bordered table-condensed">
                      <thead>
                        <tr>
                          <th>Batch Name</th>
                          <th>Lesson Planner</th>
                          <th>Student Name</th>
                          <th>Apply Remarks</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentPaginated.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No student leave requests found
                            </td>
                          </tr>
                        ) : (
                          studentPaginated.map((leaveRequest) => (
                            <tr key={leaveRequest._id}>
                              <td>{leaveRequest.lessonPlannerId?.batchId?.name}</td>
                              <td>{leaveRequest.lessonPlannerId?.lessonTopic}</td>
                              <td>{leaveRequest.userId?.username}</td>
                              <td>{leaveRequest.applyRemarks}</td>
                              <td>
                                {leaveRequest.status.charAt(0).toUpperCase() +
                                  leaveRequest.status.slice(1)}
                              </td>
                              <td>
                                <Link
                                  to={`/leave-request/manage/${leaveRequest._id}/${leaveRequest.lessonPlannerId?.batchId?._id}/${leaveRequest.lessonPlannerId?._id}`}
                                  className="btn btn-sm btn-dark me-2"
                                >
                                  <FontAwesomeIcon icon="fa-solid fa-coins" /> Make Response
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Student Pagination */}
                  {studentTotalPages > 1 && (
                    <div className="pagination mt-3 d-flex justify-content-center">
                      <span className="align-self-center me-3">
                        {studentPage > 1 && (
                          <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => setStudentPage(studentPage - 1)}
                          >
                            Previous
                          </button>
                        )}
                        Page {studentPage} of {studentTotalPages}
                        {studentPage < studentTotalPages && (
                          <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => setStudentPage(studentPage + 1)}
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

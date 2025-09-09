import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetById, GetUsersByBatchId } from '../../service/BatchService';
import { GetByBatchId as GetLessonPlannerByBatchId } from '../../service/LessonPlannerService';
import { GetByBatchId } from '../../service/FeeSchemeService';
import { GetByFeeSchemeId } from '../../service/FeeSchemePaymentService';

export default function BatchOverview() {
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

  const { id } = useParams();

  const [batchDetails, setBatchDetails] = useState({});

  // Students
  const [users, setUsers] = useState([]);
  const [currentPageStudent, setCurrentPageStudent] = useState(1);
  const [totalPagesStudent, setTotalPagesStudent] = useState(1);
  const [totalItemsStudent, setTotalItemsStudent] = useState(0);
  const itemsPerPageStudent = 10;

  // Lesson Planners
  const [lessonPlanners, setLessonPlanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Fee Schemes
  const [feeSchemes, setFeeSchemes] = useState([]);
  const [currentPageFee, setCurrentPageFee] = useState(1);
  const [totalPagesFee, setTotalPagesFee] = useState(1);
  const [totalItemsFee, setTotalItemsFee] = useState(0);
  const itemsPerPageFee = 10;

  // Fee Schemes Payment
  const [feeSchemePayments, setFeeSchemePayments] = useState([]);

  //student count & fee
  const [studentCount, setStudentCount] = useState(0);
  const [totalToBeReceived, setTotalToBeReceived] = useState(0);

  function formatTimeWithAMPM(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  }

  const fetchBatchDetails = async () => {
    try {
      setIsLoading(true);
      const response = await GetById(id);
      if (response.batch) {
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

  const fetchBatchStudentList = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await GetUsersByBatchId(id, page, itemsPerPageStudent);
      setUsers(response.users || []);
      setCurrentPageStudent(response.currentPage);
      setTotalPagesStudent(response.totalPages);
      setTotalItemsStudent(response.totalItems);
      setStudentCount(response.totalItems || 0);
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to load student data");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLessonPlanners = async (page = 1) => {
    try {
      setIsLoading(true);
      var response = await GetLessonPlannerByBatchId(id, page, itemsPerPage);
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

  const fetchFeeScheme = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await GetByBatchId(id, page, itemsPerPageFee);
      const schemes = response.feeSchemes || [];
      setFeeSchemes(schemes);
      setCurrentPageFee(response.currentPage);
      setTotalPagesFee(response.totalPages);
      setTotalItemsFee(response.totalItems);

      // Fetch payments for each scheme
      const paymentsMap = {};
      for (const scheme of schemes) {
        const res = await GetByFeeSchemeId(scheme._id, 1, 100); // first page, large limit
        paymentsMap[scheme._id] = res.feeSchemePayments || [];
      }
      setFeeSchemePayments(paymentsMap);

    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to load fee scheme data");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchLessonPlanners(currentPage);
    fetchBatchDetails();
    fetchBatchStudentList(currentPageStudent);
    fetchFeeScheme(currentPageFee);
  }, []);

  useEffect(() => {
    if (studentCount && batchDetails?.fee) {
      const fee = Number(batchDetails.fee);
      if (!isNaN(fee)) {
        setTotalToBeReceived(studentCount * fee);
      }
    }
  }, [studentCount, batchDetails]);

  return (
    <>
      <Helmet>
        <title>Batch Summary Details | {config.appName}</title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Batch Summary</h1>
            <span>
              <Link to="/"> Dashboard </Link> / <Link to={`/batch/list`}> Batch List </Link>
              / Batch Summary
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
                <div className='batch-details mt-2'>
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
                  </div>
                </div>
                <br></br>

                {/* Student Details */}
                <div className='row'>
                  <div className='col-lg-12 col-md-12 col-xs-12'>
                    <h5><b> <FontAwesomeIcon icon="fa-solid fa-users" /> Student Details</b></h5>
                    <div className='table-content'>
                      <div className="mobile-scroll">
                        <table className='table table-bordered table-condensed'>
                          <thead>
                            <tr>
                              <th>Student Name</th>
                              <th>Mobile</th>
                              <th>Email</th>
                              <th>Joining Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users && users.map((user) => (
                              <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.mobile}</td>
                                <td>{user.email}</td>
                                <td>
                                  {user.joiningDate
                                    ? (() => {
                                      const date = new Date(user.joiningDate);
                                      const day = String(date.getDate()).padStart(2, '0');
                                      const month = String(date.getMonth() + 1).padStart(2, '0');
                                      const year = date.getFullYear();
                                      return `${day}-${month}-${year}`;
                                    })()
                                    : ''}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {totalItemsStudent > itemsPerPageStudent && (
                        <div className="pagination mt-3 d-flex justify-content-center">
                          <span className="align-self-center me-3">
                            {currentPageStudent > 1 && (
                              <button
                                className="btn btn-outline-primary me-2"
                                onClick={() => fetchBatchStudentList(currentPageStudent - 1)}
                              >
                                Previous
                              </button>
                            )}
                            Page {currentPageStudent} of {totalPagesStudent}
                            {currentPageStudent < totalPagesStudent && (
                              <button
                                className="btn btn-outline-primary ms-2"
                                onClick={() => fetchBatchStudentList(currentPageStudent + 1)}
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

                <br></br>

                {/* Lesson Planner Details */}
                <div className='row'>
                  <div className='col-lg-12 col-md-12 col-xs-12'>
                    <h5><b> <FontAwesomeIcon icon="fa-solid fa-book" /> Lesson Planner Details</b></h5>
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
                              <th>Status</th>
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
                                  <td>{lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}</td>
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

                <br></br>

                {/* Fee Scheme Details */}
                <div className='row'>
                  <div className='col-lg-12 col-md-12 col-xs-12'>
                    <h5>
                      <b><FontAwesomeIcon icon="fa-solid fa-coins" /> Payment Scheme Details</b>
                    </h5>
                    <div className='table-content'>
                      <div className="mobile-scroll">
                        {/* Main table for Fee Schemes */}
                        {feeSchemes && feeSchemes.length > 0 ? (
                          feeSchemes.map((feeScheme) => (
                            <table className="table table-bordered w-100 mb-4" key={feeScheme._id}>
                              <thead>
                                <tr>
                                  <th> Fee Scheme  - {feeScheme.name}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* Nested payments table */}
                                <tr>
                                  <td>
                                    <table className="table table-sm table-bordered  mt-2 w-100">
                                      <thead>
                                        <tr>
                                          <th className="custom-thead">Payment Name</th>
                                          <th className="custom-thead">Due Date</th>
                                          <th className="custom-thead">Amount</th>
                                          <th className="custom-thead">Status</th>
                                          <th className="custom-thead">Remarks</th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {feeSchemePayments[feeScheme._id] && feeSchemePayments[feeScheme._id].length > 0 ? (
                                          feeSchemePayments[feeScheme._id].map(payment => (
                                            <tr key={payment._id}>
                                              <td>{payment.name}</td>
                                              <td>
                                                {payment.dueDate
                                                  ? (() => {
                                                    const date = new Date(payment.dueDate);
                                                    const day = String(date.getDate()).padStart(2, "0");
                                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                                    const year = date.getFullYear();
                                                    return `${day}-${month}-${year}`;
                                                  })()
                                                  : "-"}
                                              </td>
                                              <td>{payment.amount}</td>
                                              <td>{payment.status}</td>
                                              <td>{payment.remarks}</td>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td colSpan="5" className="text-center text-muted">
                                              No records found
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          ))
                        ) : (
                          // If no feeSchemes at all
                          <table className="table table-bordered table-striped w-100 mb-4">
                            <tbody>
                              <tr>
                                <td className="text-center text-muted">No records found</td>
                              </tr>
                            </tbody>
                          </table>
                        )}

                      </div>

                      {totalItemsFee > itemsPerPageFee && (
                        <div className="pagination mt-3 d-flex justify-content-center">
                          <span className="align-self-center me-3">
                            {currentPageFee > 1 && (
                              <button
                                className="btn btn-outline-primary me-2"
                                onClick={() => fetchFeeScheme(currentPageFee - 1)}
                              >
                                Previous
                              </button>
                            )}
                            Page {currentPageFee} of {totalPagesFee}
                            {currentPageFee < totalPagesFee && (
                              <button
                                className="btn btn-outline-primary ms-2"
                                onClick={() => fetchFeeScheme(currentPageFee + 1)}
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
        </div>
      </div >
    </>
  );
}

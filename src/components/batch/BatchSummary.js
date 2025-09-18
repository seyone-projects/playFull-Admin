import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetById, GetUsersByBatchId } from '../../service/BatchService';
import { GetUserById } from '../../service/UserService';
import { GetByBatchId as GetByBatchIdBatchStudent } from '../../service/BatchStudentService';
import { GetPaymentsByBatchStudentId } from '../../service/BatchStudentPaymentService';

export default function BatchSummary() {
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
  const { id, userId } = useParams();

  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);

  const [batchDetails, setBatchDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});

  const [amountPaid, setAmountPaid] = useState(0);
  const [balance, setBalance] = useState(0);
  const [total, setTotal] = useState(0);

  const [batchStudents, setBatchStudents] = useState([]);

  //student count 
  const [studentCount, setStudentCount] = useState(0);
  const [totalToBeReceived, setTotalToBeReceived] = useState(0);

  const [currentPageStudent, setCurrentPageStudent] = useState(1);
  const [totalPagesStudent, setTotalPagesStudent] = useState(1);
  const [totalItemsStudent, setTotalItemsStudent] = useState(0);
  const itemsPerPageStudent = 10;

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

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const response = await GetUserById(userId);
      if (response?.user) {
        setUserDetails(response.user);

      } else {
        setUserDetails({});
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

  const fetchBatchStudentList = async () => {
    try {
      setIsLoading(true);
      const response = await GetByBatchIdBatchStudent(id, 1, 9999);

      // For each batchStudent, fetch their payments
      const studentsWithPayments = await Promise.all(
        response.batchStudents.map(async (batchStudent) => {
          const paymentResponse = await GetPaymentsByBatchStudentId(batchStudent._id, 1, 9999);
          setStudentCount(paymentResponse.batchStats?.noOfStudents || 0);
          setTotal(paymentResponse.batchStats?.totalToBeReceived || 0);
          setAmountPaid(paymentResponse.batchStats?.totalReceived || 0);
          setBalance(paymentResponse.batchStats?.totalPending || 0);
          return {
            ...batchStudent,
            payments: paymentResponse?.payments || []
          };
        })
      );

      setBatchStudents(studentsWithPayments);
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

  const fetchBatchStudentListPayment = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await GetUsersByBatchId(id, page, itemsPerPageStudent);
      setUsers(response.users);
      setCurrentPageStudent(response.currentPage);
      setTotalPagesStudent(response.totalPages);
      setTotalItemsStudent(response.totalItems);
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
    fetchUserDetails();
    fetchBatchStudentList();
  }, []);


  React.useEffect(() => {
    fetchBatchStudentListPayment(currentPageStudent);
  }, []);

  useEffect(() => {
    if (studentCount && batchDetails?.fee) {
      const fee = Number(batchDetails.fee);
      if (!isNaN(fee)) {
        setTotalToBeReceived(studentCount * fee);
      }
    }
  }, [studentCount, batchDetails]);

  useEffect(() => {
    if (batchDetails && batchDetails.fee) {
      fetchBatchStudentList(); // now fee is available
    }
  }, [batchDetails]);


  return (
    <>
      <Helmet>
        <title>Fee Summary Details | {config.appName}</title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Fee Summary</h1>
            <span>
              <Link to="/"> Dashboard </Link> / <Link to={`/batch/list`}> Batch List </Link>
              / Fee Summary
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
                  </div>
                </div>
                <br></br>
                <div className='batch-details'>
                  <div className='row mb-3'>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      Joining Date : <strong>
                        {userDetails?.joiningDate
                          ? (() => {
                            const date = new Date(userDetails.joiningDate);
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}-${month}-${year}`;
                          })()
                          : '-'}
                      </strong>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      Mobile : <strong>
                        {userDetails?.mobile}
                      </strong>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      Gender <strong>{userDetails?.genderId?.name || '-'}</strong>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      City : <strong>{userDetails?.cityId?.name || '-'}</strong>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                      Trainer Name : <strong>{userDetails?.username || '-'}</strong>
                    </div>

                    <div className='col-lg-6 col-md-6 col-sm-12'>
                      Email : <strong>{userDetails?.email}</strong>
                    </div>
                  </div>
                </div>
                <br></br>
                <div className='row'>
                  <div className='mb-4'>
                    <div className='row g-3'>
                      <div className='col-md-3'>
                        <div className='card shadow-sm border-start border-4 border-primary'>
                          <div className='card-body d-flex justify-content-between align-items-center'>
                            <div>
                              <h6 className='text-muted mb-1'>No of students</h6>
                              <h5 className='text-primary mb-0'>{studentCount}</h5>
                            </div>
                            <div className='icon bg-primary text-white rounded-circle d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px' }}>
                              <FontAwesomeIcon icon="fa-solid fa-user" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='card shadow-sm border-start border-4 border-dark'>
                          <div className='card-body d-flex justify-content-between align-items-center'>
                            <div>
                              <h6 className='text-muted mb-1'>Total to be recieved</h6>
                              <h5 className='text-dark mb-0'>₹ {totalToBeReceived}</h5>
                            </div>
                            <div className='icon bg-dark text-white rounded-circle d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px' }}>
                              <FontAwesomeIcon icon="fa-solid fa-wallet" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='card shadow-sm border-start border-4 border-success'>
                          <div className='card-body d-flex justify-content-between align-items-center'>
                            <div>
                              <h6 className='text-muted mb-1'>Total recieved</h6>
                              <h5 className='text-success mb-0'>₹ {amountPaid}</h5>
                            </div>
                            <div className='icon bg-success text-white rounded-circle d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px' }}>
                              <FontAwesomeIcon icon="fa-money-bill-wave" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='card shadow-sm border-start border-4 border-danger'>
                          <div className='card-body d-flex justify-content-between align-items-center'>
                            <div>
                              <h6 className='text-muted mb-1'>Pending Balance</h6>
                              <h5 className='text-danger mb-0'>₹ {balance}</h5>
                            </div>
                            <div className='icon bg-danger text-white rounded-circle d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px' }}>
                              <FontAwesomeIcon icon="fa-solid fa-coins" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-lg-12 col-md-12 col-xs-12'>
                    <h5><b> <FontAwesomeIcon icon="fa-solid fa-users" /> Student & Payment Details</b></h5>
                    <div className='table-content'>
                      <div className="mobile-scroll">
                        {batchStudents && batchStudents.length > 0 ? (
                          batchStudents.map((batchStudent) => (
                            <div key={batchStudent._id} style={{ marginBottom: "20px", border: "1px solid #1f1515ff",  boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;" }}>

                              {/* Student Table */}
                              <table className="table table-bordered table-condensed mb-0">
                                <thead>
                                  <tr>
                                    <th>Student Name</th>
                                    <th>Mobile</th>
                                    <th>Email</th>
                                    <th>Joining Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td style={{ fontSize: "20px", color: "#ee1414ff", fontWeight: "bold" }}>{batchStudent.userId.username}</td>
                                    <td>{batchStudent.userId.mobile}</td>
                                    <td>{batchStudent.userId.email}</td>
                                    <td>
                                      {batchStudent.userId.joiningDate
                                        ? (() => {
                                          const date = new Date(batchStudent.userId.joiningDate);
                                          return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
                                        })()
                                        : '-'}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              {/* Payment Table */}
                              <div style={{ borderTop: "1px solid #ccc" }}>
                                <div style={{ background: "#f6faf6ff", color: "#201616", padding: "5px 10px", fontWeight: "bold", textAlign: "center" }}>
                                  Payment Details
                                </div>
                                <table className="table table-bordered table-condensed mb-0">
                                  <thead>
                                    <tr>
                                      <th>Due Date</th>
                                      <th>Amount (Rs.)</th>
                                      <th>Payment Date</th>
                                      <th>Payment Ref.</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {batchStudent.payments && batchStudent.payments.length > 0 ? (
                                      batchStudent.payments.map((payment) => (
                                        <tr key={payment._id}>
                                          <td>
                                            {payment.lastDate
                                              ? (() => {
                                                const date = new Date(payment.lastDate);
                                                return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
                                              })()
                                              : '-'}
                                          </td>
                                          <td>{payment.amount}</td>
                                          <td>
                                            {payment.paymentDateTime
                                              ? (() => {
                                                const date = new Date(payment.paymentDateTime);
                                                return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
                                              })()
                                              : '-'}
                                          </td>
                                          <td>{payment.paymentReference || '-'}</td>
                                          <td>{payment.status}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="5" style={{ textAlign: "center" }}>No Payments Found</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))
                        ) : (
                          // ELSE loop for no students
                          <div style={{ textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "6px" }}>
                            No Students Found in this Batch
                          </div>
                        )}
                      </div>

                      {totalItemsStudent > 10 && (
                        <div className="pagination mt-3 d-flex justify-content-center">
                          <span className="align-self-center me-3">
                            {currentPageStudent > 1 && (
                              <button
                                className="btn btn-outline-primary me-2"
                                onClick={() => fetchBatchStudentListPayment(currentPageStudent - 1)}
                              >
                                Previous
                              </button>
                            )}
                            Page {currentPageStudent} of {totalPagesStudent}
                            {currentPageStudent < totalPagesStudent && (
                              <button
                                className="btn btn-outline-primary ms-2"
                                onClick={() => fetchBatchStudentListPayment(currentPageStudent + 1)}
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
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetById } from '../../service/BatchService';
import { GetUserById } from '../../service/UserService';
import { GetPaymentsByBatchStudentId } from '../../service/BatchStudentPaymentService';

export default function BatchStudentFeeList() {
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
  const { id, userId, batchStudentId } = useParams();

  const [payments, setPayments] = useState([]);

  const [batchDetails, setBatchDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});

  //payment
  const [amount, setAmount] = useState('');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const [paymentDateTime, setPaymentDateTime] = useState(today);

  const [paymentReference, setPaymentReference] = useState('');
  const [reason, setReason] = useState('');
  const [amountPaid, setAmountPaid] = useState(0);
  const [balance, setBalance] = useState(0);
  const [total, setTotal] = useState(0);


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

  const fetchPaymentList = async (page = 1) => {
    try {
      setIsLoading(true);
      var response = await GetPaymentsByBatchStudentId(batchStudentId, page, itemsPerPage);
      console.log(response);
      setPayments(response.payments);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setAmountPaid(response.totalPaid);
      console.log(response.totalPaid);
      setBalance(response.totalPending);
      setTotal(response.totalFee);
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
    fetchPaymentList(currentPage);
  }, []);


  useEffect(() => {
    fetchBatchDetails();
    fetchUserDetails();
  }, []);



  return (
    <>
      <Helmet>
        <title>Fee Details | {config.appName}</title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Fee Details</h1>
            <span>
              <Link to="/"> Dashboard </Link> / <Link to={`/batch-student/manage/${id}`}> Batch Student List </Link>
              / Fee Details
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
                      Student Name : <strong>{userDetails?.username || '-'}</strong>
                    </div>

                    <div className='col-lg-6 col-md-6 col-sm-12'>
                      Email : <strong>{userDetails?.email}</strong>
                    </div>
                  </div>
                </div>
                <br></br>
                <div className='row'>
                  <div className='col-lg-12 col-md-12 col-xs-12'>
                    <h5><b> <FontAwesomeIcon icon="fa-solid fa-sack-dollar" /> Fee Details</b></h5>
                    <div className='table-content'>
                      <div className="mobile-scroll">
                        <table className='table table-bordered table-condensed'>
                          <thead>
                            <tr>
                              <th>Due Date</th>
                              <th>Amount (Rs.)</th>
                              <th>Payment Date</th>
                              <th>Payment Ref.</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments && payments.map((payment) => (
                              <tr key={payment._id}>
                                <td>
                                  {payment.lastDate
                                    ? (() => {
                                      const date = new Date(payment.lastDate);
                                      const day = String(date.getDate()).padStart(2, '0');
                                      const month = String(date.getMonth() + 1).padStart(2, '0');
                                      const year = date.getFullYear();
                                      return `${day}-${month}-${year}`;
                                    })()
                                    : '-'}
                                </td>
                                <td>{payment.amount}</td>
                                 <td>
                                  {payment.paymentDateTime
                                    ? (() => {
                                      const date = new Date(payment.paymentDateTime);
                                      const day = String(date.getDate()).padStart(2, '0');
                                      const month = String(date.getMonth() + 1).padStart(2, '0');
                                      const year = date.getFullYear();
                                      return `${day}-${month}-${year}`;
                                    })()
                                    : '-'}
                                </td>
                                <td>{payment.paymentReference || '-'}</td>
                                <td>{payment.status}</td>
                                <td>
                                  {payment.status === "active" ? (
                                    <Link
                                      to={`/batch-student-payment/manage/update/${id}/${userId}/${batchStudentId}/${payment._id}`}
                                      className="btn btn-sm btn-success"
                                    >
                                      <FontAwesomeIcon icon="fa-solid fa-wallet" /> Update Payment
                                    </Link>
                                  ) : (
                                    <span className="text-success fw-bold">Payment Updated</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {totalItems > 10 && (
                        <div className="pagination mt-3 d-flex justify-content-center">
                          <span className="align-self-center me-3">
                            {currentPage > 1 && (
                              <button
                                className="btn btn-outline-primary me-2"
                                onClick={() => fetchPaymentList(currentPage - 1)}
                              >
                                Previous
                              </button>
                            )}
                            Page {currentPage} of {totalPages}
                            {currentPage < totalPages && (
                              <button
                                className="btn btn-outline-primary ms-2"
                                onClick={() => fetchPaymentList(currentPage + 1)}
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
                <div className='row'>
                  <div className='mb-4'>
                    <div className='row g-3'>
                      <div className='col-md-4'>
                        <div className='card shadow-sm border-start border-4 border-primary'>
                          <div className='card-body d-flex justify-content-between align-items-center'>
                            <div>
                              <h6 className='text-muted mb-1'>Total Fee</h6>
                              <h5 className='text-primary mb-0'>₹ {total}</h5>
                            </div>
                            <div className='icon bg-primary text-white rounded-circle d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px' }}>
                              <FontAwesomeIcon icon="fa-solid fa-file-invoice-dollar" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='card shadow-sm border-start border-4 border-success'>
                          <div className='card-body d-flex justify-content-between align-items-center'>
                            <div>
                              <h6 className='text-muted mb-1'>Total Paid</h6>
                              <h5 className='text-success mb-0'>₹ {amountPaid}</h5>
                            </div>
                            <div className='icon bg-success text-white rounded-circle d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px' }}>
                              <FontAwesomeIcon icon="fa-solid fa-wallet" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='card shadow-sm border-start border-4 border-danger'>
                          <div className='card-body d-flex justify-content-between align-items-center'>
                            <div>
                              <h6 className='text-muted mb-1'>Balance Amount</h6>
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
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}
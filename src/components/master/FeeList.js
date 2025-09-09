import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetById } from '../../service/BatchService';
import { GetUserById } from '../../service/UserService';
import { GetAllPaymode } from '../../service/PaymodeService';
import { Add, GetByUserAndBatch, Delete } from '../../service/PaymentService';

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
  const { id, userId } = useParams();

  const [payments, setPayments] = useState([]);

  const [batchDetails, setBatchDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});

  // paymode
  const [paymodeId, setPaymodeId] = useState('');
  const [paymodes, setPaymodes] = useState([]);

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

  const fetchPaymodes = async () => {
    try {
      setIsLoading(true);
      const response = await GetAllPaymode();
      if (response?.paymodes) {
        // Filter only active paymodes
        const activePaymodes = response.paymodes.filter(paymode => paymode.status === "active");
        setPaymodes(activePaymodes);
      } else {
        setPaymodes([]);
      }
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to fetch paymodes");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };


  const fetchPaymentList = async (page = 1) => {
    try {
      setIsLoading(true);
      var response = await GetByUserAndBatch(userId, id, page, itemsPerPage);
      console.log(response);
      setPayments(response.payments);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setAmountPaid(response.totalPaidAmount);
      setBalance(response.balance);
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
    fetchPaymodes();
  }, []);


  //create a function to send the amount and image to axios post to save the cateogry
  const savePayment = async (event) => {
    event.preventDefault();


    // Validation 
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Payment amount must be greater than 0.");
      setAppErrorMode("error");
      return;
    }

    if (!paymodeId) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Please select a payment mode.");
      setAppErrorMode("error");
      return;
    }

    setIsLoading(true);

    try {
      let response = null;
      response = await Add(paymodeId, userId, id, amount, paymentDateTime, paymentReference, reason);

      if (response.status === 200) {
        setAppError(true);
        setAppErrorTitle("Action Response");
        setAppErrorMessage(response.message || "Payment Successfully Added");
        setAppErrorMode("success");
        if (userId && id) {
          window.location.href = `/batch-student-fee/manage/${userId}/${id}`;
        } else {
          console.error("Invalid userId or batch id");
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


  const handleDeleteUser = async (paymentId) => {
    const confirmed = window.confirm("Are you sure you want to remove this student?");
    if (confirmed) {
      const result = await Delete(paymentId);
      if (result.status === 200) {
        setAppError(true);
        setAppErrorTitle("Success");
        setAppErrorMessage(result.message || "Payment removed successfully");
        setAppErrorMode("success");
        if (userId && id) {
          window.location.href = `/batch-student-fee/manage/${userId}/${id}`;
        } else {
          console.error("Invalid userId or batch id");
        }
      } else {
        setAppError(true);
        setAppErrorTitle("Error");
        setAppErrorMessage(result.message || "Failed to delete payment");
        setAppErrorMode("error");
      }
    }
  };



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
                  <div className='col-lg-4 col-md-4 col-xs-12'>
                    <h5><b> <FontAwesomeIcon icon="fa-solid fa-plus-circle" /> Add Payment</b></h5>
                    <div className='batch-details'>
                      <form onSubmit={savePayment} encType='multipart/form-data'>
                        <div className='row'>
                          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Payment Date</label>
                              <input className='form-control' type='date' value={paymentDateTime} onChange={(e) => setPaymentDateTime(e.target.value)} />
                            </div>
                          </div>
                          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Amount</label>
                              <input className='form-control' type='text' value={amount} onChange={(e) => setAmount(e.target.value)} />
                            </div>
                          </div>
                          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Paymode</label>
                              <select
                                className="form-control"
                                value={paymodeId} // Ensure this state is defined
                                onChange={(e) => setPaymodeId(e.target.value)} // Update correctly
                              >
                                <option value="">Select Paymode</option>
                                {paymodes.map(paymodeOption => (
                                  <option key={paymodeOption._id} value={paymodeOption._id}>
                                    {paymodeOption.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Payment Reference</label>
                              <input className='form-control' type='text' value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} />
                            </div>
                          </div>
                          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Reason</label>
                              <input className='form-control' type='text' value={reason} onChange={(e) => setReason(e.target.value)} />
                            </div>
                          </div>
                          <div className='clearfix'></div>
                          <div className='col-12 text-end'>
                            <div className="mb-3">
                              <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Add Payment </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className='col-lg-8 col-md-8 col-xs-12'>
                    <h5><b> <FontAwesomeIcon icon="fa-solid fa-sack-dollar" /> Old Fee Details</b></h5>
                    <div className='table-content'>
                      <div className="mobile-scroll">
                      <table className='table table-bordered table-condensed'>
                        <thead>
                          <tr>
                            <th>Payment Date</th>
                            <th>Amount (Rs.)</th>
                            <th>Paymode</th>
                            <th>Payment Ref.</th>
                            <th>Reason</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments && payments.map((payment) => (
                            <tr key={payment._id}>
                              <td>
                                {payment.paymentDateTime
                                  ? (() => {
                                    const date = new Date(payment.paymentDateTime);
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    return `${day}-${month}-${year}`;
                                  })()
                                  : ''}
                              </td>
                              <td>{payment.amount}</td>
                              <td>{payment.paymodeId?.name || '-'}</td>
                              <td>{payment.paymentReference || '-'}</td>
                              <td>{payment.reason || '-'}</td>
                              <td>
                                <button
                                  className='btn btn-sm btn-danger'
                                  onClick={() => handleDeleteUser(payment._id)}
                                >
                                  <FontAwesomeIcon icon="fa-solid fa-trash" />
                                </button>
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
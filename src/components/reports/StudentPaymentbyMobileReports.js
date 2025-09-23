import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetUsersByRole } from '../../service/UserService';
import { GetSearchStudentPayments } from '../../service/PaymentService';
import { GetSearchPaymentsbyMobileReport } from '../../service/BatchStudentPaymentService';

export default function UserList() {

  const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  const itemsPerPage = 10;

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [mobile, setMobile] = useState('');

  //payments
  const [payments, setPayments] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchPaymentList = async (page = 1) => {
    if (!fromDate || !toDate || !mobile) {
      setHasSearched(true);
      setPayments([]); // show "No record found"
      return;
    }
    try {
      setIsLoading(true);
      setHasSearched(true);
      var response = await GetSearchPaymentsbyMobileReport(fromDate, toDate, mobile, page, itemsPerPage);
      console.log(response);
      setPayments(response.payments || []);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setTotalPaidAmount(response.totalPaidAmount);
      setTotalPendingAmount(response.totalPendingAmount);
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to load data");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserList = async () => {
    try {
      setIsLoading(true);
      var response = await GetUsersByRole("student", 1, 9999);
      setUsers(response.users || []);
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

  React.useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <>
      <Helmet>
        <title>Search Payment by Mobile| {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Search Payment by Mobile </h1>
            <span>
              <Link to="/"> Dashboard </Link> / Search Payment by Mobile
            </span>
          </div>
          <div className='page-content'>
            <div className="portal">
              <div className='portal-body'>
                <form>
                  <div className='row'>
                    {/* From Date */}
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="mb-3">
                        <label htmlFor="fromDate" className="form-label">From Date</label>
                        <input
                          type="date"
                          id="fromDate"
                          className="form-control"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* To Date */}
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="mb-3">
                        <label htmlFor="toDate" className="form-label">To Date</label>
                        <input
                          type="date"
                          id="toDate"
                          className="form-control"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="mb-3">
                        <label htmlFor="mobile" className="form-label">Student Mobile</label>
                        <input
                          type="text"
                          id="mobile"
                          className="form-control"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="Enter Mobile Number"
                        />
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12' style={{ marginTop: '30px' }}>
                      <div className="d-flex align-items-end mb-3">
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          onClick={() => fetchPaymentList(1)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-search" className="me-2" />
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {hasSearched && (
                  payments.length > 0 ? (
                    <div className='table-content'>
                      <div className="mobile-scroll">
                        <table className='table table-bordered table-condensed'>
                          <thead>
                            <tr>
                              <th>Batch Name</th>
                              <th>Payment Date</th>
                              <th>Payment Reference</th>
                              <th>Student name</th>
                              <th>Received Amount</th>
                              <th>Pending Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((payment) => (
                              <tr key={payment._id}>
                                <td>{payment.batchName} - {payment.batchCode}</td>
                                <td>
                                  {payment.paymentDateTime
                                    ? (() => {
                                      const date = new Date(payment.paymentDateTime);
                                      if (isNaN(date.getTime())) return '-'; // <- handle invalid date
                                      const day = String(date.getDate()).padStart(2, '0');
                                      const month = String(date.getMonth() + 1).padStart(2, '0');
                                      const year = date.getFullYear();
                                      return `${day}-${month}-${year}`;
                                    })()
                                    : '-'}
                                </td>
                                <td>{payment.paymentReference}</td>
                                <td>{payment.studentname}</td>
                                <td style={{ textAlign: 'right' }}>{payment.paidAmount}</td>
                                <td style={{ textAlign: 'right' }}>{payment.pendingAmount}</td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan={4} style={{ textAlign: 'right',fontWeight: 'bold', fontSize: '20px' }}>Overall totals</td>
                              <td style={{ textAlign: 'right', color: '#109c2eff', fontWeight: 'bold' }}>{totalPaidAmount}</td>
                              <td style={{ textAlign: 'right', color: '#c72e08ff', fontWeight: 'bold' }}>{totalPendingAmount}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {totalItems > itemsPerPage && (
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
                  ) : (
                    <div className="alert alert-warning mt-3">No record found</div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

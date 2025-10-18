import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetByDateRange } from '../../service/DemoRegisterService';

export default function DemoRegistrationList() {

  const { isLoading, setIsLoading, setAppError, setAppErrorMessage, setAppErrorTitle, setAppErrorMode } = useGlobalContext();

  const [registrations, setRegistrations] = useState();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchRegistrationList = async (page = 1) => {
    // validation: both dates required
    if (!fromDate || !toDate) {
      setAppError(true);      
      setAppErrorMessage("Please select both From Date and To Date before searching.");
      setAppErrorTitle("Validation Error");
      setAppErrorMode("error");
      return;
    }

    try {
      setIsLoading(true);
      var response = await GetByDateRange(fromDate, toDate);
      setRegistrations(response.demoRegistrations);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setShowTable(true);
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to load data");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Demo Registrations | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Demo Registration List</h1>
            <span>
              <Link to="/"> Dashboard </Link> / Demo Registration List
            </span>
          </div>
          <div className='page-content'>
            <div className="portal">
              <div className='portal-body'>

                {/* Filter Form */}
                <form>
                  <div className='row'>
                    {/* From Date */}
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="mb-3">
                        <label htmlFor="fromDate" className="form-label">From Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* To Date */}
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="mb-3">
                        <label htmlFor="toDate" className="form-label">To Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12' style={{ marginTop: '30px' }}>
                      <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={() => fetchRegistrationList(1)}
                      >
                        <FontAwesomeIcon icon="fa-solid fa-search" className="me-2" />
                        Search
                      </button>
                    </div>
                  </div>
                </form>

                {/* ✅ Show table only after filter is applied */}
                {showTable && (
                  <div className='table-content mt-4'>
                    <div className="mobile-scroll">
                      <table className='table table-bordered table-condensed'>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Demo Date</th>
                            <th>Demo Time</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations && registrations.length > 0 ? (
                            registrations.map((reg) => (
                              <tr key={reg._id}>
                                <td>{reg.name}</td>
                                <td>{reg.email}</td>
                                <td>{reg.mobile}</td>
                                <td>
                                  {reg.demoDate
                                    ? (() => {
                                      const date = new Date(reg.demoDate);
                                      const day = String(date.getDate()).padStart(2, '0');
                                      const month = String(date.getMonth() + 1).padStart(2, '0');
                                      const year = date.getFullYear();
                                      return `${day}-${month}-${year}`;
                                    })()
                                    : ''}
                                </td>
                                <td>{reg.demoTime}</td>
                                <td>{reg.status}</td>
                                <td>
                                  <Link to={`/demo-registration/manage/${reg._id}`} className='btn btn-sm btn-primary'>
                                    <FontAwesomeIcon icon="fa-solid fa-eye" />
                                  </Link>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center text-muted">No records found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalItems > 10 && (
                      <div className="pagination mt-3 d-flex justify-content-center">
                        <span className="align-self-center me-3">
                          {currentPage > 1 && (
                            <button
                              className="btn btn-outline-primary me-2"
                              onClick={() => fetchRegistrationList(currentPage - 1)}
                            >
                              Previous
                            </button>
                          )}

                          Page {currentPage} of {totalPages}

                          {currentPage < totalPages && (
                            <button
                              className="btn btn-outline-primary ms-2"
                              onClick={() => fetchRegistrationList(currentPage + 1)}
                            >
                              Next
                            </button>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

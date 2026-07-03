import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetUsersByRole } from '../../service/UserService';
import { GetSearchStudentAttendances } from '../../service/AttendanceService';
import { GetAll } from '../../service/BatchService';
import { GetAttendanceReportsByBatchId } from '../../service/AttendanceService';

export default function UserList() {

  const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const itemsPerPage = 10;

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [batchId, setBatchId] = useState('');

  //attendances
  const [attendances, setAttendances] = useState([]);

  //batchs
  const [batchs, setBatchs] = useState([]);

  const [hasSearched, setHasSearched] = useState(false);

  const fetchAttendanceList = async (page = 1) => {

    if (!fromDate || !toDate || !batchId) {
      setHasSearched(true);
      setAttendances([]); // show "No record found"
      return;
    }
    try {
      setIsLoading(true);
      setHasSearched(true);
      var response = await GetAttendanceReportsByBatchId(fromDate, toDate, batchId, page, itemsPerPage);
      console.log(response);
      setAttendances(response.attendances || []);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
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

  //fetch batches
  const FetchBatches = async () => {
    setIsLoading(true);
    try {
      const response = await GetAll(1, 9999, "");
      if (response && Array.isArray(response.batchs)) {
        // Filter only active batchs
        const activeBatchs = response.batchs.filter(batch => batch.status === "active");
        setBatchs(activeBatchs);
      } else {
        setAppError(true);
        setAppErrorMessage('No Batches Found.');
      }
    } catch (error) {
      setAppError(true);
      setAppErrorMessage('Error loading batch data');
      setAppErrorMode('Error');
    } finally {
      setIsLoading(false);
    }
  };


  React.useEffect(() => {
    fetchUserList();
    FetchBatches();
  }, []);

  return (
    <>
      <Helmet>
        <title>Batch wise Attendance Reports | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Batch wise Attendance Reports</h1>
            <span>
              <Link to="/"> Dashboard </Link> / Batch wise Attendance Reports
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

                    {/* Batches */}
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="mb-3">
                        <label htmlFor="batch" className="form-label">Batches</label>
                        <select
                          id="batch"
                          className="form-select"
                          value={batchId}
                          onChange={(e) => setBatchId(e.target.value)}
                        >
                          <option value="">-- Select Batch --</option>
                          {Array.isArray(batchs) && batchs.map((batch) => (
                            <option key={batch._id} value={batch._id}>
                              {batch.name} - {batch.code}
                            </option>
                          ))}

                          <option value="overall">Overall</option>
                        </select>

                      </div>
                    </div>
                    {/* Search Button */}
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12' style={{ marginTop: '30px' }}>
                      <div className="d-flex align-items-end mb-3">
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          onClick={() => fetchAttendanceList(1)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-search" className="me-2" />
                          Search
                        </button>

                      </div>
                    </div>
                  </div>
                </form>
                {hasSearched && (
                  attendances.length > 0 ? (
                    <div className='table-content'>
                      <div className="mobile-scroll">
                        <table className='table table-bordered table-condensed'>
                          <thead>
                            <tr>
                              <th>Batch Name</th>
                              <th>Student name</th>
                              <th>Attendance Date</th>
                              <th>Attendance Status</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              // Group attendances by date
                              const groupedByDate = attendances.reduce((acc, att) => {
                                const date = att.attendanceDate
                                  ? (() => {
                                    const d = new Date(att.attendanceDate);
                                    const day = String(d.getDate()).padStart(2, "0");
                                    const month = String(d.getMonth() + 1).padStart(2, "0");
                                    const year = d.getFullYear();
                                    return `${day}-${month}-${year}`;
                                  })()
                                  : "Unknown Date";

                                if (!acc[date]) acc[date] = [];
                                acc[date].push(att);
                                return acc;
                              }, {});

                              // Render grouped attendances
                              return Object.entries(groupedByDate).map(([date, records]) => (
                                <React.Fragment key={date}>
                                  {/* Date row */}
                                  <tr className="table-secondary">
                                    <td colSpan="5" className="fw-bold">
                                      {date}
                                    </td>
                                  </tr>

                                  {/* Attendance rows */}
                                  {records.map((attendance) => (
                                    <tr key={attendance._id}>
                                      <td>{attendance.batchId?.name} - {attendance.batchId?.code}</td>
                                      <td>{attendance.userId?.username}</td>
                                      <td>{date}</td>
                                      <td
                                        style={{
                                          color:
                                            attendance.attendanceStatus?.toLowerCase() === "present"
                                              ? "green"
                                              : attendance.attendanceStatus?.toLowerCase() === "absent"
                                                ? "red"
                                                : "inherit",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {attendance.attendanceStatus}
                                      </td>
                                      <td>{attendance.remarks}</td>
                                    </tr>
                                  ))}
                                </React.Fragment>
                              ));
                            })()}
                          </tbody>

                        </table>
                      </div>

                      {totalItems > itemsPerPage && (
                        <div className="pagination mt-3 d-flex justify-content-center">
                          <span className="align-self-center me-3">
                            {currentPage > 1 && (
                              <button
                                className="btn btn-outline-primary me-2"
                                onClick={() => fetchAttendanceList(currentPage - 1)}
                              >
                                Previous
                              </button>
                            )}

                            Page {currentPage} of {totalPages}
                            {currentPage < totalPages && (
                              <button
                                className="btn btn-outline-primary ms-2"
                                onClick={() => fetchAttendanceList(currentPage + 1)}
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

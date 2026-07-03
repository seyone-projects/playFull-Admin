import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetAll } from '../../service/BatchService';
import { GetMonthlySummaryReport } from '../../service/AttendanceService';

export default function ReportMonthlyAttendance() {
  const { isLoading, setIsLoading, setAppError, setAppErrorTitle, setAppErrorMessage, setAppErrorMode } = useGlobalContext();

  const [attendances, setAttendances] = useState([]);
  const [batchs, setBatchs] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const fetchMonthlyReport = async () => {
    if (!month || !year) {
      setHasSearched(true);
      setAttendances([]);
      return;
    }

    try {
      setIsLoading(true);
      setHasSearched(true);
      const response = await GetMonthlySummaryReport(month, year);
      console.log("Monthly Report:", response);

      setAttendances(response.summary || []);
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

  useEffect(() => {
    FetchBatches();
  }, []);

  return (
    <>
      <Helmet>
        <title>Attendance Monthly Reports | {config.appName}</title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Attendance Monthly Reports</h1>
            <span>
              <Link to="/"> Dashboard </Link> / Attendance Monthly Reports
            </span>
          </div>
          <div className='page-content'>
            <div className="portal">
              <div className='portal-body'>
                <form>
                  <div className='row'>
                    {/* Month Dropdown */}
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="mb-3">
                        <label htmlFor="month" className="form-label">Month</label>
                        <select
                          id="month"
                          className="form-select"
                          value={month}
                          onChange={(e) => setMonth(e.target.value)}
                        >
                          <option value="">-- Select Month --</option>
                          {[
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                          ].map((m, index) => (
                            <option key={index + 1} value={index + 1}>{m}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Year Input */}
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="mb-3">
                        <label htmlFor="year" className="form-label">Year</label>
                        <input
                          type="number"
                          id="year"
                          className="form-control"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="Enter Year"
                        />
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12' style={{ marginTop: '30px' }}>
                      <div className="d-flex align-items-end mb-3">
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          onClick={fetchMonthlyReport}
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
                          <tbody>
                            {hasSearched && (
                              attendances.length > 0 ? (
                                <div className='table-content mt-3'>
                                  <div className="mobile-scroll">
                                    <table className='table table-bordered table-condensed w-100'>
                                      <thead>
                                        <tr>
                                          <th>Batch</th>
                                          <th>Student / Trainer Name</th>
                                          <th>Total Present</th>
                                          <th>Total Absent</th>
                                          <th>Attendance %</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {attendances.map(batch => (
                                          <React.Fragment key={batch.id}>
                                            {/* Batch Header Row */}
                                            <tr className="table-primary">
                                              <td colSpan="5" className="fw-bold text-uppercase">
                                                {batch.name}
                                              </td>
                                            </tr>

                                            {/* Users under batch */}
                                            {batch.users.map(user => {
                                              const total = user.presentCount + user.absentCount;
                                              const percentage = total > 0 ? ((user.presentCount / total) * 100).toFixed(0) : "0";
                                              return (
                                                <tr key={batch.id + "-" + user.id}>
                                                  <td></td>
                                                  <td>{user.name}</td>
                                                  <td className="text-success fw-bold">{user.presentCount}</td>
                                                  <td className="text-danger fw-bold">{user.absentCount}</td>
                                                  <td>
                                                    <span
                                                      className={`badge ${percentage >= 75 ? "bg-success" : percentage >= 50 ? "bg-warning" : "bg-danger"}`}
                                                    >
                                                      {percentage} %
                                                    </span>
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </React.Fragment>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              ) : (
                                <div className="alert alert-warning mt-3">No record found</div>
                              )
                            )}

                          </tbody>
                        </table>
                      </div>
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

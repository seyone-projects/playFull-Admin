import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetUsersByRole } from '../../service/UserService';
import { GetSearchStudentAttendances } from '../../service/AttendanceService';
import { GetAllLessonPlanner } from '../../service/LessonPlannerService';
import { GetAttendanceReportsByLessonPlannerId } from '../../service/AttendanceService';

export default function ReportLessonPlannerAttendance() {

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
  const [lessonPlannerId, setLessonPlannerId] = useState('');

  //attendances
  const [attendances, setAttendances] = useState([]);

  //lessonPlanners
  const [lessonPlanners, setLessonPlanners] = useState([]);

  const [hasSearched, setHasSearched] = useState(false);

  const fetchAttendanceList = async (page = 1) => {

    if (!fromDate || !toDate || !lessonPlannerId) {
      setHasSearched(true);
      setAttendances([]); // show "No record found"
      return;
    }
    try {
      setIsLoading(true);
      setHasSearched(true);
      var response = await GetAttendanceReportsByLessonPlannerId(fromDate, toDate, lessonPlannerId, page, itemsPerPage);
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

  //fetch lessonPlanneres
  const FetchLessonPlanners = async () => {
    setIsLoading(true);
    try {
      const response = await GetAllLessonPlanner(1, 9999, "");
      console.log("lessonplanner", response);
      if (response && Array.isArray(response.lessonPlanners)) {
        // Take all lessonPlanners without filtering
        const activeLessonPlanners = response.lessonPlanners;
        setLessonPlanners(activeLessonPlanners);
      } else {
        setAppError(true);
        setAppErrorMessage('No LessonPlanneres Found.');
      }

    } catch (error) {
      setAppError(true);
      setAppErrorMessage('Error loading lessonPlanner data');
      setAppErrorMode('Error');
    } finally {
      setIsLoading(false);
    }
  };


  React.useEffect(() => {
    fetchUserList();
    FetchLessonPlanners();
  }, []);

  return (
    <>
      <Helmet>
        <title>Lesson wise Attendance Reports | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Lesson wise Attendance Reports</h1>
            <span>
              <Link to="/"> Dashboard </Link> / Lesson wise Attendance Reports
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

                    {/* LessonPlanneres */}
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="mb-3">
                        <label htmlFor="lessonPlanner" className="form-label">Lesson Planners</label>
                        <select
                          id="lessonPlanner"
                          className="form-select"
                          value={lessonPlannerId}
                          onChange={(e) => setLessonPlannerId(e.target.value)}
                        >
                          <option value="">-- Select Lesson Planners --</option>
                          {Array.isArray(lessonPlanners) && lessonPlanners.map((lessonPlanner) => (
                            <option key={lessonPlanner._id} value={lessonPlanner._id}>
                              {lessonPlanner.lessonTopic}
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
                              <th>Lesson Planner Name</th>
                              <th>Student name</th>
                              <th>Attendance Date</th>
                              <th>Attendance Status</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendances.map((attendance) => (
                              <tr key={attendance._id}>
                                <td>{attendance.lessonPlannerId?.lessonTopic}</td>
                                <td>{attendance.userId?.username}</td>
                                <td>
                                  {attendance.attendanceDate
                                    ? (() => {
                                      const date = new Date(attendance.attendanceDate);
                                      const day = String(date.getDate()).padStart(2, '0');
                                      const month = String(date.getMonth() + 1).padStart(2, '0');
                                      const year = date.getFullYear();
                                      return `${day}-${month}-${year}`;
                                    })()
                                    : ''}
                                </td>
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

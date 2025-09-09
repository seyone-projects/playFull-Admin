import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetAll } from '../../service/BatchService';
import { GetAllLessonPlanner } from '../../service/LessonPlannerService';
import { GetUsersByRole } from '../../service/UserService';
import { GetAll as GetAllCourses } from '../../service/CourseService';
import { GetAll as GetAllPayments } from '../../service/PaymentService';
import { GetUsersByBatchId } from '../../service/BatchService';

// Chart.js
import { Pie, Bar } from 'react-chartjs-2';
// Chart.js
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);


function Dashboard() {
  const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

  const [batchs, setBatchs] = useState();
  const [keyword, setKeyword] = useState('');
  const [lessonPlanners, setLessonPlanners] = useState([]);
  const [lessonPlanner, setLessonPlanner] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [totalBatches, setTotalBatches] = useState(0);
  const [todayPlanners, setTodayPlanners] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTrainers, setTotalTrainers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [payments, setPayments] = useState([]);
  const [batchWiseFeeData, setBatchWiseFeeData] = useState({
    labels: [],
    datasets: [],
  });

  const itemsPerPage = 10;

  // Simulated Fee Summary Data
  const [feeSummary, setFeeSummary] = useState({
    total: 0,
    paid: 0,
    balance: 0
  });

  const [timelineChartData, setTimelineChartData] = useState({
    labels: [],
    datasets: [],
  });


  const fetchPayments = async (page) => {
    try {
      const response = await GetAllPayments(page, 9999, "");
      if (response.status === 200) {
        setPayments(response.payments);

        let totalPaid = response.totalPaidAmount || 0;

        // Fetch all batches
        const batchResponse = await GetAll(1, 9999, '');
        const batches = batchResponse?.batchs || [];

        let totalToBeReceived = 0;
        let allStudents = [];

        // For each batch, fetch students and compute expected fee
        for (const batch of batches) {
          const studentRes = await GetUsersByBatchId(batch._id, 1, 9999);
          const students = studentRes?.users || [];

          const batchFee = parseFloat(batch.fee || 0);
          const receivedPerBatch = students.length * batchFee;

          totalToBeReceived += receivedPerBatch;

          console.log(`Batch: ${batch.name}, Fee: ${batchFee}, Students: ${students.length}, Total to be received: ${receivedPerBatch}`);
        }

        const pending = totalToBeReceived - totalPaid;

        setFeeSummary({
          total: totalToBeReceived,
          paid: totalPaid,
          balance: pending
        });

        //bar chart
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const timelineMap = {};

        // Initialize all dates of the current month with 0
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(currentYear, currentMonth, day).toLocaleDateString("en-CA"); // ✅ this creates dates like '2025-08-01', etc.
          timelineMap[date] = 0;
        }

        // Add payments to timelineMap
        response.payments.forEach(payment => {
          const createdAt = new Date(payment.paymentDateTime);
          const paymentMonth = createdAt.getMonth();
          const paymentYear = createdAt.getFullYear();

          if (paymentMonth === currentMonth && paymentYear === currentYear) {
            const date = createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
            const amount = parseFloat(payment.amount || 0);
            timelineMap[date] += amount;
          }
        });

        const sortedDates = Object.keys(timelineMap).sort(); // Sort the dates
        const sortedValues = sortedDates.map(date => timelineMap[date]);
        // Now pass `labels` and `data` to your bar chart
        setTimelineChartData({
          labels: sortedDates,
          datasets: [
            {
              label: " Fee Received",
              data: sortedValues,
              fill: false,
              borderColor: "#4bc0c0",
              backgroundColor: "#4bc0c0",
              tension: 0.1
            }
          ]
        });


        let batchNames = [];
        let batchAmounts = [];

        for (const batch of batches) {
          const studentRes = await GetUsersByBatchId(batch._id, 1, 9999);
          const students = studentRes?.users || [];

          const batchFee = parseFloat(batch.fee || 0);
          const totalReceived = students.length * batchFee;

          // ✅ Skip if total fee for this batch is 0
          if (totalReceived > 0) {
            batchNames.push(batch.name);
            batchAmounts.push(totalReceived);
          }

          totalToBeReceived += totalReceived;
        }

        setBatchWiseFeeData({
          labels: batchNames,
          datasets: [
            {
              label: ' Fee Per Batch',
              data: batchAmounts,
              backgroundColor: batchNames.map((_, i) => `hsl(${(i * 50) % 360}, 70%, 60%)`),
              borderWidth: 1,
            }
          ]
        });
      }
    } catch (error) {
      console.log("Payment Fetch Error:", error);
    }
  };

  const feeData = {
    labels: ['Received', 'Pending'],
    datasets: [
      {
        label: 'Fee Summary',
        data: [feeSummary.paid, feeSummary.balance],
        backgroundColor: ['#28a745', '#dc3545'],
        borderColor: ['#28a745', '#dc3545'],
        borderWidth: 1,
      },
    ],
  };

  const fetchBatchList = async (page = 1) => {
    try {
      setIsLoading(true);
      var response = await GetAll(page, 9999, '');
      setBatchs(response.batchs);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalBatches(response.totalItems);
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to load data");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLessonPlanners = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await GetAllLessonPlanner(page, itemsPerPage, '');
      setLessonPlanners(response.lessonPlanners);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTodayPlanners(response.totalItems);
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to load lesson planners");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

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

  const fetchUsersByStudent = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await GetUsersByRole("student", page, 9999, '');
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalStudents(response.totalItems);
      return response.users;
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to load users");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsersByTrainer = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await GetUsersByRole("trainer", page, 9999, '');
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalTrainers(response.totalItems);
      return response.users;
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to load users");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllCourses = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await GetAllCourses(page, itemsPerPage, '');
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalCourses(response.totalItems);
      return response.courses;
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to load courses");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLessonPlanners(currentPage);
  }, []);

  React.useEffect(() => {
    fetchBatchList();
    fetchUsersByStudent("student", 1);
    fetchUsersByTrainer("trainer", 1);
    fetchAllCourses(1);
    fetchPayments(1);
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Dashboard</h1>
          </div>

          <div className='page-content'>

            {/* Dashboard Counter Section */}
            <div className='dashboard-counter-section'>
              <div className='row'>
                <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                  <div className='dashboard-counter dashboard-counter-blue'>
                    <i className="bi bi-people-fill"></i>
                    <span className='counter-value'> {totalStudents} </span>
                    <b>Total Students</b>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                  <div className='dashboard-counter dashboard-counter-brown'>
                    <i className="bi bi-person-badge-fill"></i>
                    <span className='counter-value'> {totalTrainers} </span>
                    <b>Total Trainers</b>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                  <div className='dashboard-counter dashboard-counter-pink'>
                    <i className="bi bi-grid-fill"></i>
                    <span className='counter-value'> {totalBatches} </span>
                    <b>Total Batches</b>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                  <div className='dashboard-counter dashboard-counter-green'>
                    <i className="bi bi-book"></i>
                    <span className='counter-value'> {totalCourses} </span>
                    <b>Total Courses</b>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                <div className="portal">
                  <div className='portal-title-bar'>
                    <h4 className='portal-heading'>
                      Today's Topics to Cover [
                      <span style={{ color: '#f00', paddingLeft: '5px', paddingRight: '5px' }}>
                        {new Date().toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      ]
                    </h4>
                  </div>
                  <div className='portal-body'>
                    <div className='table-content'>
                      <div className="mobile-scroll">
                        <table className='table table-bordered table-condensed'>
                          <thead>
                            <tr>
                              <th>Batch</th>
                              <th>Trainer</th>
                              <th>Category</th>
                              <th>Sub Category</th>
                              <th>Course</th>
                              <th>Topic</th>
                              <th>Time</th>
                              <th>Link</th>
                              <th>Status</th>
                              <th>Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(lessonPlanners) && lessonPlanners.length > 0 ? (
                              lessonPlanners.map((lessonPlanner) => (
                                <tr key={lessonPlanner._id}>
                                  <td>{lessonPlanner.batchId?.name}</td>
                                  <td>{lessonPlanner.trainerId?.username}</td>
                                  <td>{lessonPlanner.batchId?.courseId?.categoryId?.name}</td>
                                  <td>
                                    {lessonPlanner.batchId?.courseId?.subCategoryIds
                                      ?.map(sub => sub.name)
                                      .join(", ")}
                                  </td>
                                  <td>{lessonPlanner.batchId?.courseId?.name}</td>
                                  <td>{lessonPlanner.lessonTopic}</td>
                                  <td>{formatTimeWithAMPM(lessonPlanner.lessonTime)}</td>
                                  <td>
                                    {lessonPlanner.link ? (
                                      <a href={lessonPlanner.link} target="_blank" rel="noopener noreferrer">
                                        Join
                                      </a>
                                    ) : (
                                      <span>—</span>
                                    )}
                                  </td>
                                  <td>{lessonPlanner.status.charAt(0).toUpperCase() + lessonPlanner.status.slice(1)}</td>
                                  <td>
                                    <Link to={`/batch/summary/manage/${lessonPlanner.trainerId?._id}/${lessonPlanner.batchId?._id}`} className='btn btn-sm btn-success' style={{ marginTop: '5px' }}>
                                      <FontAwesomeIcon icon="fa-solid fa-coins" /> Batch / Fee Summary
                                    </Link>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center">No lesson planners found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />

            {feeSummary.paid > 0 && (
              <>
                <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                  <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                      <div className="row mb-4">
                        <div className="col-lg-12 col-md-12 col-sm-12 mx-auto">
                          <div className="card shadow-sm">
                            <div className="card-body">
                              <h5 className="text-center mb-3">Batch wise Fee Summary</h5>
                              <Pie data={batchWiseFeeData} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                      <div className="row mb-4">
                        <div className="col-lg-12 col-md-12 col-sm-12 mx-auto">
                          <div className="card shadow-sm">
                            <div className="card-body">
                              <h5 className="text-center mb-3">Overall Fee Summary</h5>
                              <Pie data={feeData} />
                              <div className="text-center mt-3">
                                <span className="badge bg-primary mx-2">Total Fee: ₹ {feeSummary.total}</span>
                                <span className="badge bg-success mx-2">Received: ₹ {feeSummary.paid}</span>
                                <span className="badge bg-danger mx-2">Pending: ₹ {feeSummary.balance}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                    <div className="row mb-4">
                      <div className="col-lg-12 col-md-12 mx-auto">
                        <div className="card shadow-sm">
                          <div className="card-body">
                            <h5 className="text-center mb-3">Fees Received Over Time</h5>
                            <Bar
                              data={timelineChartData}
                              options={{
                                scales: {
                                  x: {
                                    ticks: {
                                      autoSkip: false,
                                      maxRotation: 90,
                                      minRotation: 45,
                                    }
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

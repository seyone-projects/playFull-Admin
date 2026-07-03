//icons
import "bootstrap-icons/font/bootstrap-icons.css";
import "remixicon/fonts/remixicon.css";

//bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

//font awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import "./App.css";
import Header from "./components/navigation/Header";
import SideBar from "./components/side-navigation/SideBar";

//router
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  BrowserRouter,
} from "react-router-dom";
import Dashboard from "./components/profile-management/Dashboard";
import MyProfile from "./components/profile-management/MyProfile";
import { useGlobalContext } from "./GlobalContext";
import Login from "./components/general/Login";
import MyPassword from "./components/profile-management/MyPassword";
import ConfigVariables from "./components/profile-management/ConfigVariables";
import { LoggedUserDetail } from "./service/UserService";
import { useEffect } from "react";


import SectionNew from "./components/section/SectionNew";
import SectionList from "./components/master/SectionList";
import CategoryNew from "./components/category/CategoryNew";
import CategoryList from "./components/master/CategoryList";
import SubCategoryNew from "./components/sub-category/SubCategoryNew";
import SubCategoryList from "./components/master/SubCategoryList";
import CourseNew from "./components/course/CourseNew";
import CourseList from "./components/master/CourseList";
import BatchNew from "./components/batch/BatchNew";
import BatchList from "./components/master/BatchList";
import BatchStudentList from "./components/master/BatchStudentList";
import BatchStudentFeeList from "./components/master/FeeList";
import BatchLessonPlannerList from "./components/master/BatchLessonPlannerList";
import BatchLessonPlannerEdit from "./components/lesson-planner/LessonPlannerEdit";
import BatchSummary from "./components/batch/BatchSummary";
import UserNew from "./components/user/UserNew";
import TrainerList from "./components/master/TrainerList";
import StudentList from "./components/master/StudentList";
import UserEdit from "./components/user/UserEdit";
import UserPasswordUpdate from "./components/user/UserPasswordUpdate";
import AttendanceNew from "./components/attendance/AttendanceNew";
import BatchFeeSchemeList from "./components/master/BatchFeeSchemeList";
import FeeSchemePaymentList from "./components/master/FeeSchemePaymentList";
import BatchFeeSchemeEdit from "./components/fee-scheme/BatchFeeSchemeEdit";
import FeeSchemePaymentEdit from "./components/fee-scheme-payment/FeeSchemePaymentEdit";
import BatchOverview from "./components/batch/BatchOverview";
import UserKyc from "./components/user/UserKyc";
import ReportStudentPayment from "./components/reports/StudentPaymentReports"; 
import ReportStudentCollectionPayment from "./components/reports/StudentCollectionPaymentReports";
import ReportStudentPendingPayment from "./components/reports/StudentPendingPaymentReports";
import ReportBatchAttendance from "./components/reports/AttendanceBatchWiseReports";
import ReportStudentAttendance from "./components/reports/AttendanceStudentWiseReports";
import ReportLessonPlannerAttendance from "./components/reports/AttendanceLessonPlannerWiseReports";
import ReportMonthlyAttendance from "./components/reports/AttendanceMonthlyReports";
import ReportMonthlyPayment from "./components/reports/PaymentMonthlyReports";
import BatchStudentPaymentUpdate from "./components/batchStudentPayment/PaymentUpdate";
import LessonPlannerScreenshots from "./components/lesson-planner/LessonPlannerScreenshots";
import LeaveRequestList from "./components/leave-request/LeaveRequestList";
import LeaveRequestUpdate from "./components/leave-request/LeaveRequestUpdate";
import SingleSignin from "./components/general/SingleSignin";
import ReportStudentPaymentbyMobile from "./components/reports/StudentPaymentbyMobileReports";
import PageNew from "./components/page/PageNew";
import PageList from "./components/master/PageList";
import DemoRegisterList from "./components/master/DemoRegisterList";
import DemoRegisterView from "./components/demo-register/DemoRegisterView";
import UserCourse from "./components/master/UserCourseList";

function App() {
  library.add(fas); 

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
    setAppUser,
    isLogin,
    setIsLogin,
    isLogoutRequest,
    setIsLogoutRequest,
  } = useGlobalContext();

  //call LoggedUserDetail on component load using useEffect
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await LoggedUserDetail();
        if (response.status === 200) {
          setAppUser(response.user);
          setIsLogin(true);
        }
      } catch (error) {
        setAppError(true);
        setAppErrorTitle("Error");
        setAppErrorMessage("Failed to load user details");
        setAppErrorMode("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    document.querySelectorAll("input").forEach((input) => {
      input.setAttribute("autocomplete", "off");
    });
  }, []);

   const handleRetry = () => {
    setAppError(false); // Close the modal when retry is triggered
  };

  return (
    <>
      {/* loading screen */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Modal Error Message */}
      {isAppError && (
        <div
          className={appErrorMode + " app-error-message modal d-block"} // `d-block` ensures it always displays
          tabIndex="-1"
          role="dialog"
          aria-labelledby="errorModalLabel"
          aria-hidden="true"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }} // Optional backdrop styling
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="errorModalLabel">
                  {appErrorTitle}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleRetry}
                ></button>
              </div>
              <div className="modal-body">
                <p>{appErrorMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}     

      {isLogin ? (
        <>
          <main id="main" className="main">
            <BrowserRouter>
              <Header></Header>
              <SideBar></SideBar>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/myprofile" element={<MyProfile />} />
                <Route path="/mypassword" element={<MyPassword />} />

                {/* user */}                
                <Route path="/user/manage" element={<UserNew />} />
                <Route path="/user/trainer/list" element={<TrainerList />} />
                <Route path="/user/student/list" element={<StudentList />} />
                <Route path="/user/manage/edit/:id" element={<UserEdit />} />
                <Route path="/user/manage/password/:id" element={<UserPasswordUpdate />} />
                <Route path="/user/manage/kyc/:id" element={<UserKyc />} />
                <Route path="/user/manage/course/:id" element={<UserCourse />} />
                
                {/* section */}
                <Route path="/section/manage" element={<SectionNew />} />
                <Route path="/section/list" element={<SectionList />} />
                <Route path="/section/manage/:id" element={<SectionNew />} /> 

                {/* category */}
                <Route path="/category/manage" element={<CategoryNew />} />
                <Route path="/category/list" element={<CategoryList />} />
                <Route path="/category/manage/:id" element={<CategoryNew />} /> 

                {/* sub-category */}               
                <Route path="/sub-category/manage" element={<SubCategoryNew />} />
                <Route path="/sub-category/list" element={<SubCategoryList />} />
                <Route path="/sub-category/manage/:id" element={<SubCategoryNew />} /> 

                {/* course */}               
                <Route path="/course/manage" element={<CourseNew />} />
                <Route path="/course/list" element={<CourseList />} />
                <Route path="/course/manage/:id" element={<CourseNew />} /> 

                {/* batch */}
                <Route path="/batch/manage" element={<BatchNew />} />
                <Route path="/batch/list" element={<BatchList />} />
                <Route path="/batch/manage/:id" element={<BatchNew />} />  
                <Route path="/batch/summary/manage/:userId/:id" element={<BatchSummary />} />
                <Route path="/batch/overview/manage/:id" element={<BatchOverview />} />

                {/* batch student */}  
                <Route path="/batch-student/manage/:id" element={<BatchStudentList />} /> 

                {/* fees */} 
                <Route path="/batch-student-fee/manage/:userId/:id/:batchStudentId" element={<BatchStudentFeeList />} />
                <Route path="/batch-student-payment/manage/update/:id/:userId/:batchStudentId/:batchStudentPaymentId" element={<BatchStudentPaymentUpdate />} />

                {/* lesson planner */}
                <Route path="/batch-lesson-planner/manage/:id" element={<BatchLessonPlannerList />} />
                <Route path="/batch-lesson-planner/manage/edit/:id/:batchId" element={<BatchLessonPlannerEdit />} />
                <Route path="/batch-lesson-planner/manage/screenshots/:id/:batchId" element={<LessonPlannerScreenshots />} /> 

                {/* attendance */}
                <Route path="/attendance/manage/:id/:batchId" element={<AttendanceNew />} />

                {/* fee scheme */}
                <Route path="/batch-fee-scheme/manage/:id" element={<BatchFeeSchemeList />} />
                <Route path="/batch-fee-scheme/manage/edit/:id/:batchId" element={<BatchFeeSchemeEdit />} />

                {/* fee scheme payment */}
                <Route path="/fee-scheme-payment/manage/:id/:batchId" element={<FeeSchemePaymentList />} />
                <Route path="/fee-scheme-payment/manage/edit/:id/:batchId/:feeSchemeId" element={<FeeSchemePaymentEdit />} />

                {/* reports */}
                <Route path="/report/student/payment" element={<ReportStudentPayment />} />
                <Route path="/report/student/collection/payment" element={<ReportStudentCollectionPayment />} />
                <Route path="/report/student/pending/payment" element={<ReportStudentPendingPayment />} />
                <Route path="/report/batch/attendance" element={<ReportBatchAttendance />} />
                <Route path="/report/student/attendance" element={<ReportStudentAttendance />} />
                <Route path="/report/lessonplanner/attendance" element={<ReportLessonPlannerAttendance />} />
                <Route path="/report/monthly/attendance" element={<ReportMonthlyAttendance />} />
                <Route path="/report/monthly/payment" element={<ReportMonthlyPayment />} />
                <Route path="/report/student/search/payment" element={<ReportStudentPaymentbyMobile />} />

                {/* leave request */}
                <Route path="/leave-request/list" element={<LeaveRequestList />} />
                <Route path="/leave-request/manage/:id/:batchId/:lessonPlannerId" element={<LeaveRequestUpdate />} />

                {/* page */}
                <Route path="/page/manage" element={<PageNew />} />
                <Route path="/page/list" element={<PageList />} />
                <Route path="/page/manage/:id" element={<PageNew />} />

                {/* demo registration */ }
                <Route path="/demo-registration/list" element={<DemoRegisterList />} />
                <Route path="/demo-registration/manage/:id" element={<DemoRegisterView />} />

               

                {/* 404 Page */}   
                 <Route path="*"  element={<Dashboard />} />          
              </Routes>
              <Outlet></Outlet>
            </BrowserRouter>
          </main>
        </>
      ) : (
        <>
          <BrowserRouter>
            <Routes>              
              <Route path="/login" element={<Login />} />
              <Route path="/singleSignIn" element={<SingleSignin />} />

              {/* 404 Page */}
              <Route path="*" element={<Login />} />
            </Routes>
            <Outlet></Outlet>
          </BrowserRouter>
        </>
      )}
    </>
  );
}

export default App;

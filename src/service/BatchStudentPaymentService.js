import axios from 'axios';
import config from '../config';

//update BatchStudentPayment by id
const Update = async (id, paymentReference, paymentDateTime) => {
    try {
        const data = new FormData();
        data.append("paymentReference", paymentReference);
        data.append("paymentDateTime", paymentDateTime);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + `batchStudentPayments/update/${id}`, data,
            {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    "Content-Type": "application/json",
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                updatedPayment: response.data.updatedPayment,
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error.response.data.message
        };

    }
}


//Get collection reports with date and batch filters
const GetCollectionReports = async (fromDate, toDate, batchId, page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}batchStudentPayments/collection-report?fromDate=${fromDate}&toDate=${toDate}&batchId=${batchId}&page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

        if (response.status === 200) {
            const d = response.data.data; // ✅ correct level
            return {
                status: 200,
                message: response.data.message,
                collections: d.collections,
                totalItems: d.totalItems,
                totalPages: d.totalPages,
                currentPage: d.currentPage,
                totalAmount: d.summary?.totalAmount || 0,
                receivedAmount: d.summary?.receivedAmount || 0,
                pendingAmount: d.summary?.pendingAmount || 0
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error.response.data.message
        };
    }
}

//Get pending reports with date and batch filters
const GetPendingReports = async (fromDate, toDate, batchId, page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}batchStudentPayments/pending-report?fromDate=${fromDate}&toDate=${toDate}&batchId=${batchId}&page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

        if (response.status === 200) {
            const d = response.data.data;
            return {
                status: 200,
                message: response.data.message,
                collections: d.collections,
                totalItems: d.totalItems,
                totalPages: d.totalPages,
                currentPage: d.currentPage,
                totalAmount: d.summary?.totalAmount || 0,
                receivedAmount: d.summary?.receivedAmount || 0,
                pendingAmount: d.summary?.pendingAmount || 0
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error.response.data.message
        };
    }
}

//get batchstudentpayemts by batchStudentId with pagination
const GetPaymentsByBatchStudentId = async (batchStudentId, page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}batchStudentPayments/byStudent/${batchStudentId}?page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

        if (response.status === 200) {
            const d = response.data.data;
            return {
                status: 200,
                message: response.data.message,
                payments: d.payments,
                totalItems: d.totalItems,
                totalPages: d.totalPages,
                currentPage: d.currentPage,
                amount: d.amount,
                totalPaid: d.totalPaid,
                totalPending: d.totalPending,
                totalFee: d.totalFee,

                //added batchwise summary              
                batchStats: {
                    noOfStudents: d.batchStats?.noOfStudents || 0,
                    totalToBeReceived: d.batchStats?.totalToBeReceived || 0,
                    totalReceived: d.batchStats?.totalReceived || 0,
                    totalPending: d.batchStats?.pendingBalance || 0
                }
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error.response.data.message
        };
    }
}


//get GetMonthlySummaryReport by month, year
const GetMonthlySummaryReport = async (month, year) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(
            `${config.apiUrl}batchStudentPayments/monthly-summary?month=${month}&year=${year}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        );

        if (response.status === 200) {
            const d = response.data.data;
            
             // Map batches to include overall totals directly
            const batchesWithTotals = d.batch.map(batch => ({
                ...batch,
                overallTotalFee: batch.overallTotalFee || 0,
                overallTotalPaid: batch.overallTotalPaid || 0,
                overallTotalPending: batch.overallTotalPending || 0
            }));

            return {
                status: 200,
                message: response.data.message,
                summary: d.batch   // <-- use d.batch, not totalAmount etc.
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error?.response?.data?.message || "Something went wrong"
        };
    }
};


//get all batchstudentpayments reports by fromdate, todate, user mobile
const GetSearchPaymentsbyMobileReport = async (fromDate, toDate, mobile) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(
            `${config.apiUrl}batchStudentPayments/search-payment-by-mobile?fromDate=${fromDate}&toDate=${toDate}&mobile=${mobile}`,
            {
                headers: { 'Authorization': 'Bearer ' + token }
            }
        );

        if (response.status === 200) {
            const d = response.data.data;
            return {
                status: 200,
                message: response.data.message,
                payments: d.payments.map(payment => ({
                    batchName: payment.batchName,
                    batchCode: payment.batchCode,
                    studentname: payment.studentname,
                    paymentDateTime: payment.paymentDateTime,
                    paymentReference: payment.paymentReference,
                    paidAmount: payment.paidAmount,      
                    pendingAmount: payment.pendingAmount
                })),
                totalItems: d.totalItems,
                totalPages: d.totalPages,
                currentPage: d.currentPage,
                totalPaidAmount: d.summary.totalPaid,     
                totalPendingAmount: d.summary.totalPending
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error?.response?.data?.message || "Something went wrong"
        };
    }
}


export { Update, GetCollectionReports, GetPendingReports, GetPaymentsByBatchStudentId, GetMonthlySummaryReport, GetSearchPaymentsbyMobileReport };





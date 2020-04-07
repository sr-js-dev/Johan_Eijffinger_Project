const BASEURL = 'https://eijffinger-api-dev.azurewebsites.net';
export default {
    GetToken: `${BASEURL}/api/Token`,  
    PostResetPassword: `${BASEURL}/api/Account/ResetPassword`,  
    GetOrdersData: `${BASEURL}/api/Orders`,
    GetUserData: `${BASEURL}/api/users/SearchUser?excludeInactiveUser=false`,
    PostUserData: `${BASEURL}/api/users/Create`,
    GetUserDataById: `${BASEURL}/api/users/GetById/`,
    PostUserUpdate: `${BASEURL}/api/users/Update/`,
    PostDeaActivateUser: `${BASEURL}/api/users/DeactivateUser/`,
    PostForgotPassEmail: `${BASEURL}/api/Account/ForgotPassword/`,
    GetDeliveriesData: `${BASEURL}/api/SapFactory/execute/get/GetDeliveries`,
    GetReturnsData: `${BASEURL}/api/SapFactory/execute/get/GetReturns`,
    GetSalesInvoicesData: `${BASEURL}/api/SapFactory/execute/get/SalesInvoices`,
    GetCreditNotesData: `${BASEURL}/api/SapFactory/execute/get/CreditNotes`,
    GetInvoiceByDate: `${BASEURL}/api/SapFactory/execute/get/InvoiceByDate`,
    GetLastOrdersData: `${BASEURL}/api/SapFactory/execute/get/Latest5Orders`,
    GetLastDelivriesData: `${BASEURL}/api/SapFactory/execute/get/Latest5Deliverables`,
    GetLastOutstandingData: `${BASEURL}/api/SapFactory/execute/get/Latest5OutstandingInvoices`,
    GetDownloadFile: `${BASEURL}/api/SapProxy/pdf`,
  };
  
  
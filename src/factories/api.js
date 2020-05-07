const BASEURL = 'https://eijffinger-api-dev.azurewebsites.net';
export default {
    GetToken: `${BASEURL}/api/Token`,  
    PostResetPassword: `${BASEURL}/api/Account/ResetPassword`,  
    GetOrdersData: `${BASEURL}/api/Orders`,
    GetUserData: `${BASEURL}/api/users/SearchUser?excludeInactiveUser=false&pageNumber=1&pageSize=`,
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
    PostLoginAsUser: `${BASEURL}/api/Token/LoginAs/`,
    GetCustomerData: `${BASEURL}/api/SapFactory/execute/get/GetCustomer`,
    GetItemData: `${BASEURL}/api/Items/StockItems/`,
    GetDiscountPrice: `${BASEURL}/api/SapProxy/discountprice`,
    GetDashboardData: `${BASEURL}/api/Dashboard`,
    PostItems: `${BASEURL}/api/Items`,
    GetOrderDetails: `${BASEURL}/api/Orders/GetOrderDetails/`,
    PostPatroonberekening: `${BASEURL}/api/SapProxy/patroonberekening`,
    PostOrder: `${BASEURL}/api/SapFactory/execute/post/PostOrder`,
    GetOrderExpenses: `${BASEURL}/api/SapProxy/orderexpenses`,
    GetReturnDetails: `${BASEURL}/api/Orders/GetReturnDetails/`,
    GetInvoiceDetails: `${BASEURL}/api/Orders/GetInvoiceDetails/`,
    GetDeliveryDetails: `${BASEURL}/api/Orders/GetDeliveryDetails/`,
  };
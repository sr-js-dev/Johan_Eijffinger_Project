const BASEURL = 'http://eijffinger-api-dev.azurewebsites.net';
export default {
    GetToken   : `${BASEURL}/api/Token`,  
    GetUserData: `${BASEURL}/api/users/SearchUser?excludeInactiveUser=true`,
    PostUserData: `${BASEURL}/api/users/Create`,
  };
  
  
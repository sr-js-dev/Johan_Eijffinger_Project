export const getUserToken = () => {
    return(window.localStorage.getItem('eijf_token'))
};

export const removeAuth = () => {
    window.localStorage.setItem('eijf_token', '')
    window.localStorage.setItem('eijf_userName', '')
    window.localStorage.setItem('eijf_role', '')
    window.localStorage.setItem('eijf_loggedUser', '')
    window.localStorage.setItem('admin_role', '')
    window.localStorage.setItem('admin_userName', '')
    window.localStorage.setItem('admin_token', '')
    window.localStorage.setItem('eijf_showPrice', '')
    return true
};

export const getAuth = () => {
    return(window.localStorage.getItem('eijf_token'))
};

export const getRole = () => {
    return(window.localStorage.getItem('eijf_role'))
};

export const getUserInfo = () => {
    let userInfo = [];
    userInfo.role = window.localStorage.getItem('eijf_role');
    userInfo.userName = window.localStorage.getItem('eijf_userName');
    userInfo.userToken = window.localStorage.getItem('eijf_token');
    return userInfo;
};

export const getLoggedUserInfo = () => {
    var loggedUserInfo = JSON.parse(localStorage.getItem("eijf_loggedUser"));
    return loggedUserInfo;
};

export const getAdminInfo = () => {
    let adminInfo = [];
    adminInfo.role = window.localStorage.getItem('admin_role');
    adminInfo.userName = window.localStorage.getItem('admin_userName');
    adminInfo.userToken = window.localStorage.getItem('admin_token');
    return adminInfo;
}


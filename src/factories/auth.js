export const getUserToken = () => {
    console.log("111111", localStorage.getItem('eijf_token'))
    return(window.localStorage.getItem('eijf_token'))
};

export const removeAuth = () => {
    localStorage.setItem('eijf_token', '');
    localStorage.setItem('eijf_userName', '');
    localStorage.setItem('eijf_role', '');
    localStorage.setItem('eijf_loggedUser', '');
    localStorage.setItem('admin_role', '');
    localStorage.setItem('admin_userName', '');
    localStorage.setItem('admin_token', '');
    localStorage.setItem('eijf_showPrice', '');
    localStorage.setItem('userType', '');
    localStorage.removeItem('eij_address_book');
    return true
};

export const getAuth = () => {
    return(localStorage.getItem('eijf_token'))
};

export const getRole = () => {
    return(localStorage.getItem('eijf_role'))
};

export const getUserInfo = () => {
    let userInfo = [];
    userInfo.role = localStorage.getItem('eijf_role');
    userInfo.userName = localStorage.getItem('eijf_userName');
    userInfo.userToken = localStorage.getItem('eijf_token');
    userInfo.addressBook = localStorage.getItem('eij_address_book');
    return userInfo;
};

export const getLoggedUserInfo = () => {
    var loggedUserInfo = JSON.parse(localStorage.getItem("eijf_loggedUser"));
    return loggedUserInfo;
};

export const getAdminInfo = () => {
    let adminInfo = [];
    adminInfo.role = localStorage.getItem('admin_role');
    adminInfo.userName = localStorage.getItem('admin_userName');
    adminInfo.userToken = localStorage.getItem('admin_token');
    return adminInfo;
}

export const getUsetType = () => {
    return localStorage.getItem('userType');
}


export const getUserToken = () => {
    return(window.localStorage.getItem('eijf_token'))
};

export const removeAuth = () => {
    window.localStorage.setItem('eijf_token', '')
    window.localStorage.setItem('eijf_userName', '')
    window.localStorage.setItem('eijf_role', '')
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
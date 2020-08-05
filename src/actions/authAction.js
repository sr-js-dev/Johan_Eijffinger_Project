import * as types from '../constants/actionTypes';
import $ from 'jquery';
import API from '../factories/api'
import history from '../history';

export const fetchLoginData = (params) => {
    return (dispatch) => {
        dispatch(fetchLoginDataFail(''));
        dispatch(fetchPageLoading(true));
        var settings = {
            "url": API.GetToken,
            "method": "POST",
            "headers": {
              "Content-Type": "application/json",
            },
            "data": JSON.stringify({"userName":params.username,"password":params.password}),
          }
          $.ajax(settings).done(function (response) {
          })
          .then(response => {
            localStorage.setItem('eijf_token', response.token);
            localStorage.setItem('eijf_userName', response.claims.UserName);
            localStorage.setItem('eijf_role', response.claims.Role);
            localStorage.setItem('eijf_loggedUser', JSON.stringify(response.claims));
            let lang = response.claims.Language ? response.claims.Language : "Dutch"
            localStorage.setItem('eijf_lang',  lang);
            localStorage.setItem('eijf_label',  lang);
            localStorage.setItem('eij_address_book', response.claims.U_EIJFF_PORTAL_ADRESBOEK)
            dispatch(fetchLoginDataSuccess(response));
            history.push('/dashboard')
        })
        .catch(err => {
            dispatch(fetchLoginDataFail(err.responseJSON.Error[0]));
        });
    };
}

export const fetchPageLoading = (data) => {
    
    return {
        type: types.FETCH_PAGE_LOADING,
        loading:data
    }
}
//login fail
export const fetchLoginDataFail = (param) => {
    return {
        type: types.FETCH_LOGIN_FAIL,
        error:param
    }
}

//login success
export const fetchLoginDataSuccess = (data) => {
    
    return {
        type: types.FETCH_LOGIN_SUCCESS,
        UserName:data.userName,
        Role:data.roles
    }
}
//change lang
export const changeLan = (params) => {
    return (dispatch) => {
        window.localStorage.setItem('eijf_lang',  params.value);
        window.localStorage.setItem('eijf_label',  params.value);
        dispatch(fetchChangeLan(params.value));
    };
}

export const fetchChangeLan = (value) => {
    return{
        type: types.FETCH_LANGUAGE_DATA,
        lang:value
    }
}

export const blankdispatch = (flag) => {
    return (dispatch) => {
        dispatch(fetchBlankData(flag));
    };
}
//error
export const fetchBlankData = (flag) => {
    return{
        type: types.FETCH_BlANK_DATA,
        error: !flag ? true : false
    }
}

export const dataServerFail = (params) => {
    return (dispatch) => {
        dispatch(fetchDataServerFail(params));
    };
}
//error
export const fetchDataServerFail = (params) => {
    return{
        type: types.FETCH_SERVER_FAIL,
        error:params
    }
}

export const userType = (param) => {
    return{
        type: types.ADMIN_FLAG,
        flag: param
    }
}



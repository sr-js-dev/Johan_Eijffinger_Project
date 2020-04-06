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
            window.localStorage.setItem('eijf_token', response.token);
            window.localStorage.setItem('eijf_userName', response.claims.UserName);
            window.localStorage.setItem('eijf_role', response.claims.Role);
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
        window.localStorage.setItem('eijf_label',  params.label);
        dispatch(fetchChangeLan(params.value));
    };
}

export const fetchChangeLan = (value) => {
    return{
        type: types.FETCH_LANGUAGE_DATA,
        lang:value
    }
}

export const blankdispatch = () => {
    return (dispatch) => {
        dispatch(fetchBlankData());
    };
}
//error
export const fetchBlankData = () => {
    return{
        type: types.FETCH_BlANK_DATA,
        error:""
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


import * as types from '../constants/actionTypes';
export const initialState = {
    salesData: [],
    error: null
}
export default function (state = initialState, action) {
    switch (action.type) {
    case types.FETCH_SALES_GETDATA:
        return { ...state, salesData: action.deploy, error: null }
    default:

        return state
    }
}
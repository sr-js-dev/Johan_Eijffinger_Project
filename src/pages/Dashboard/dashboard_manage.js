import React, {Component} from 'react'
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
import { Container, Row, Col } from 'react-bootstrap';
import SessionManager from '../../factories/session_manage';
// import Select from 'react-select';
import API from '../../factories/api'
import Axios from 'axios';
// import * as Auth from '../../components/auth'
import  { Link } from 'react-router-dom';
import * as Common from '../../factories/common';
import * as authAction  from '../../actions/authAction';
// import * as authAction  from '../../actions/authAction';
// import Slider from 'react-bootstrap-slider';
// import "bootstrap-slider/dist/css/bootstrap-slider.css"
// import Map from './map.js'

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
                dispatch(authAction.blankdispatch()),
});

class Dashboard extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            pastDueData: '',
            dueSoon: '',
            totalOutstanding: '',
            lastOrdersData: [],
            lastDeliveriesData: [],
            lastOutstandingData: []
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this.getPastDueData();
        this.getLastOrdersData();
        this.getLastDeliveriesData();
        this.getLastOutstandingData();
    }

    getPastDueData = () => {
        this._isMounted = true;
        var headers = SessionManager.shared().getAuthorizationHeader();
        let params = {};
        let pastDay = new Date();
        let soonDay = new Date(pastDay.getTime() + 7 * 24 * 60 * 60 * 1000);
        params = {
            p_DocDueDate: Common.formatDate1(pastDay)
        }
        Axios.post(API.GetInvoiceByDate, params, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({pastDueData: result.data.value[0]})
            }
        })
        params = {
            p_DocDueDate: Common.formatDate1(soonDay)
        }
        Axios.post(API.GetInvoiceByDate, params, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({dueSoon: result.data.value[0]})
            }
        })
        params = {
            p_DocDueDate: ''
        }
        Axios.post(API.GetInvoiceByDate, params, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({totalOutstanding: result.data.value[0]})
            }
        })
    }
    
    getLastOrdersData = () => {
        this._isMounted = true;
        let params = {};
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetLastOrdersData, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.value.length){
                    this.setState({lastOrdersData: result.data.value})
                }
               
            }
        })
    }

    getLastDeliveriesData = () => {
        this._isMounted = true;
        let params = {};
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetLastDelivriesData, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.value.length){
                    this.setState({lastDeliveriesData: result.data.value})
                }
            }
        })
    }

    getLastOutstandingData = () => {
        this._isMounted = true;
        let params = {};
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetLastOutstandingData, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.value.length){
                    this.setState({lastOutstandingData: result.data.value})
                }
            }
        })
    }

    visitPlaceOrder = () => {
        this.props.blankdispatch()
    }

    visitOrder = () => {
        this.props.blankdispatch()
    }

    render(){   
        const { pastDueData, dueSoon, totalOutstanding, lastOrdersData, lastDeliveriesData, lastOutstandingData } = this.state;
        return (
            <Container>
                <div className="dashboard-header content__header content__header--with-line">
                    <h2 className="title">{trls('Dashboard')}</h2>
                </div>
                <Row className="dashboard-container">
                    <Col sm={4} className="top-content" >
                        <div className="dashboard__top-long">
                            <div>
                                <div className="dashboard__top-long-title">{trls('Place_an_order')}</div>
                            </div>
                            <div className="dashboard__top-long-img">
                                <Link to={'/place-order'}>
                                    <img src={require("../../assets/images/icon-cart-white.svg")} style={{cursor: "pointer"}} alt="cart" onClick={this.visitPlaceOrder}/>
                                </Link>
                            </div>
                        </div>
                        <div className="dashboard__top-long top_long-payment">
                            <div>
                                <div className="dashboard__top-long-title">{trls('Orders')}</div>
                            </div>
                            <div className="dashboard__top-long-img">
                                <Link to={'/orders'}>
                                    <svg width="30" height="30" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={this.visitOrder}>
                                        <path className="dashboard-order__icon" d="M13 5H11V4C11 1.8 9.2 0 7 0C4.8 0 3 1.8 3 4V5H1C0.4 5 0 5.4 0 6V15C0 15.6 0.4 16 1 16H13C13.6 16 14 15.6 14 15V6C14 5.4 13.6 5 13 5ZM5 4C5 2.9 5.9 2 7 2C8.1 2 9 2.9 9 4V5H5V4Z"/>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </Col>
                    <Col sm={3} className="top__top-small">
                        <div className="dashboard__top-small">
                            <div className="dashboard__top-small-header">
                                <i className="fas fa-exclamation-circle" style={{fontSize: "20px", marginRight: 10}}></i>
                                <span>{trls('Past_Due')}</span>
                            </div>
                            <div className="dashboard__top-small-value">
                                {Common.formatMoney(pastDueData)}
                            </div>
                        </div>
                    </Col>
                    <Col sm={3} className="top__top-small">
                        <div className="dashboard__top-small">
                            <div className="dashboard__top-small-header">
                                <i className="far fa-clock" style={{fontSize: "20px", marginRight: 10}}></i>
                                <span>{trls('Due_Soon')}</span>
                            </div>
                            <div className="dashboard__top-small-value">
                                {Common.formatMoney(dueSoon)}
                            </div>
                        </div>
                    </Col>
                    <Col sm={3} className="top__top-small">
                        <div className="dashboard__top-small">
                            <div className="dashboard__top-small-header">
                                <i className="far fa-flag" style={{fontSize: "20px", marginRight: 10}}></i>
                                <span>{trls('Total_Outstanding')}</span>
                            </div>
                            <div className="dashboard__top-small-value">
                                {Common.formatMoney(totalOutstanding)}
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="dashboard-container" style={{paddingTop:40}}>
                    <Col sm={4} style={{paddingBottom:20}} >
                        <div className="dashboard__bottom-item ">
                            <div className="dashboard__bottom-item-header">
                                <h6 className="dashboard__bottom-item-title">{trls('Last_5_Orders')}</h6>
                                <div className="dashboard__bottom-item-img">
                                    <img src={require("../../assets/images/icon-orders-white.svg")} alt="shipped"/>
                                </div>
                            </div>
                            <table className="dashboard__bottom-item-table">
                                <thead>
                                    <tr>
                                        <th>{trls('DocNum')}</th>
                                        <th>{trls('DocDate')}</th>
                                        <th>{trls('DocTotal')}</th>
                                    </tr>
                                </thead>
                                    {lastOrdersData &&(<tbody >
                                        {
                                            lastOrdersData.map((data,i) =>(
                                            <tr id={i} key={i}>
                                                <td>{data.DocNum}</td>
                                                <td>{Common.formatDate(data.DocDate)}</td>
                                                <td>{Common.formatMoney(data.DocTotal)}</td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>)}
                            </table>
                        </div>
                    </Col>
                    <Col sm={4} style={{paddingBottom:20}}>
                        <div className="dashboard__bottom-item">
                            <div className="dashboard__bottom-item-header">
                                <h6 className="dashboard__bottom-item-title">{trls('Next_5_Deliveries_Due')}</h6>
                                <div className="dashboard__bottom-item-img">
                                    <img src={require("../../assets/images/icon-orders-white.svg")} alt="shipped"/>
                                </div>
                            </div>
                            <table className="dashboard__bottom-item-table">
                                <thead>
                                    <tr>
                                        <th>{trls('DocNum')}</th>
                                        <th>{trls('DocDate')}</th>
                                        <th>{trls('DocTotal')}</th>
                                    </tr>
                                </thead>
                                {lastDeliveriesData &&(<tbody >
                                    {
                                        lastDeliveriesData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.DocNum}</td>
                                            <td>{Common.formatDate(data.DocDate)}</td>
                                            <td>{Common.formatMoney(data.DocTotal)}</td>
                                        </tr>
                                    ))
                                    }
                                </tbody>)}
                            </table>
                        </div>
                    </Col>
                    <Col sm={4} style={{paddingBottom:20}}>
                        <div className="dashboard__bottom-item">
                            <div className="dashboard__bottom-item-header">
                                <h6 className="dashboard__bottom-item-title">{trls('Outstanding_Payments')}</h6>
                                <div className="dashboard__bottom-item-img">
                                    <img src={require("../../assets/images/icon-orders-white.svg")} alt="shipped"/>
                                </div>
                            </div>
                            <table className="dashboard__bottom-item-table">
                                <thead>
                                    <tr>
                                        <th>{trls('DocNum')}</th>
                                        <th>{trls('DocDate')}</th>
                                        <th>{trls('DocTotal')}</th>
                                    </tr>
                                </thead>
                                {lastOutstandingData &&(<tbody >
                                    {
                                        lastOutstandingData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.DocNum}</td>
                                            <td>{Common.formatDate(data.DocDate)}</td>
                                            <td>{Common.formatMoney(data.DocTotal)}</td>
                                        </tr>
                                    ))
                                    }
                                </tbody>)}
                            </table>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
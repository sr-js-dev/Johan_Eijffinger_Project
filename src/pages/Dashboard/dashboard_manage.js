import React, {Component} from 'react'
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
import { Container, Row, Col } from 'react-bootstrap';
import SessionManager from '../../factories/session_manage';
import API from '../../factories/api'
// import * as Queries  from '../../factories/queries'
import Axios from 'axios';
import  { Link } from 'react-router-dom';
import * as Common from '../../factories/common';
import * as authAction  from '../../actions/authAction';
import Pageloadspiiner from '../../components/page_load_spinner';
import history from '../../history';

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
            dashBoardData: [],
            lastOrdersData: [],
            lastDeliveriesData: [],
            lastOutstandingData: [],
            pageLodingFlag: true,
            dashBoardFlag: false,
            lastOrdersFlag: false,
            lastDeleiversFlag: false,
            lastOutstanding: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this.getDashBoardData();
        this.getLastOrdersData();
        this.getLastDeliveriesData();
        this.getLastOutstandingData();
    }

    getDashBoardData = () => {
        this._isMounted = true;
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetDashboardData, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data){
                    this.setState({dashBoardData: result.data, dashBoardFlag: true});
                }
            }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
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
                if(result.data.value){
                    this.setState({lastOrdersData: result.data.value, lastOrdersFlag: true})
                }
               
            }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
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
                if(result.data.value){
                    this.setState({lastDeliveriesData: result.data.value, lastDeleiversFlag: true})
                }
            }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
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
                if(result.data.value){
                    this.setState({lastOutstandingData: result.data.value, lastOutstanding: true})
                }
            }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
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
        const { 
            dashBoardData,
            lastOrdersData, 
            lastDeliveriesData, 
            lastOutstandingData, 
            pageLodingFlag, 
            dashBoardFlag,
            lastOrdersFlag,
            lastDeleiversFlag,
            lastOutstanding } = this.state;
        let lodingFlag = pageLodingFlag;
        if(dashBoardFlag && lastOrdersFlag && lastDeleiversFlag && lastOutstanding){
            lodingFlag = false;
        }
        console.log('1111');
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
                                <Link to={'/placemanage'}>
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
                                {Common.formatMoney(dashBoardData.pastDue)}
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
                                {Common.formatMoney(dashBoardData.dueSoon)}
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
                                {Common.formatMoney(dashBoardData.total)}
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
                                        <th>#</th>
                                        <th>{trls('Date')}</th>
                                        <th>{trls('Total')}</th>
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
                                        <th>#</th>
                                        <th>{trls('Date')}</th>
                                        <th>{trls('Total')}</th>
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
                                        <th>#</th>
                                        <th>{trls('Date')}</th>
                                        <th>{trls('Total')}</th>
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
                <Pageloadspiiner loading = {lodingFlag}/>
            </Container>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
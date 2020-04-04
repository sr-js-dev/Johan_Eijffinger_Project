import React, {Component} from 'react'
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
import { Container, Row, Col } from 'react-bootstrap';
// import SessionManager from '../../components/session_manage';
// import Select from 'react-select';
// import API from '../../components/api'
// import Axios from 'axios';
// import * as Auth from '../../components/auth'
import  { Link } from 'react-router-dom';
// import * as authAction  from '../../actions/authAction';
// import Slider from 'react-bootstrap-slider';
// import "bootstrap-slider/dist/css/bootstrap-slider.css"
// import Map from './map.js'

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({

});

class Dashboard extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {

    }
    
    render(){   
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
                                <div style={{fontSize: 12}}>{trls('Search_Lines')}</div>
                            </div>
                            <div className="dashboard__top-long-img">
                                <Link to={'/place-order'}>
                                    <img src={require("../../assets/images/icon-cart-white.svg")} style={{cursor: "pointer"}} alt="cart" onClick={this.customer}/>
                                </Link>
                            </div>
                        </div>
                        <div className="dashboard__top-long top_long-payment">
                            <div>
                                <div className="dashboard__top-long-title">{trls('Make_a_Payment')}</div>
                                <div style={{fontSize: 12}}>{trls('Credit_card')}</div>
                            </div>
                            <div className="dashboard__top-long-img">
                                <Link to={'/make-payment'}>
                                    <img src={require("../../assets/images/icon-payment-white.svg")} style={{cursor: "pointer"}} alt="payment" onClick={this.createVisitReport}/>
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
                                € 369.22
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
                                € 369.22
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
                                € 369.22
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
                                        <th>{trls('Sales_Number')}</th>
                                        <th>{trls('Order_Date')}</th>
                                        <th>{trls('Status')}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                    {/* {topCustmer &&(<tbody >
                                        {
                                            topCustmer.map((data,i) =>(
                                            <tr id={i} key={i}>
                                                <td>{i+1}</td>
                                                <td>{data.Klantnaam}</td>
                                                <td>{this.formatNumber(data.Revenue)}</td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>)} */}
                                <tbody>
                                    <tr>
                                        <td><a href="/#">08272718</a></td>
                                        <td>20/04/19</td>
                                        <td>
                                            <div className="table-status">
                                                <img src={require("../../assets/images/icon-shipped.svg")} alt="shipped"/>
                                                <span>Shipped</span>
                                            </div>
                                        </td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/#">72817283</a></td>
                                        <td>19/04/19</td>
                                        <td>
                                            <div className="table-status">
                                                <img src={require("../../assets/images/icon-open-box.svg")} alt="open"/>
                                                <span>Open</span>
                                            </div>
                                        </td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/#">92047147</a></td>
                                        <td>19/04/19</td>
                                        <td>
                                            <div className="table-status">
                                                <img src={require("../../assets/images/icon-shipped.svg")} alt="shipped"/>
                                                <span>Shipped</span>
                                            </div>
                                        </td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/#">72819374</a></td>
                                        <td>18/04/19</td>
                                        <td>
                                            <div className="table-status">
                                                <img src={require("../../assets/images/icon-open-box.svg")} alt="open"/>
                                                <span>Open</span>
                                            </div>
                                        </td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/#">46381922</a></td>
                                        <td>17/04/19</td>
                                        <td>
                                            <div className="table-status">
                                                <img src={require("../../assets/images/icon-open-box.svg")} alt="open"/>
                                                <span>Open</span>
                                            </div>
                                        </td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                </tbody>
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
                                        <th>{trls('Delivery_Number')}</th>
                                        <th>{trls('Due_Date')}</th>
                                        <th>{trls('Status')}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                    {/* {topItem &&(<tbody >
                                        {
                                            topItem.map((data,i) =>(
                                            <tr id={i} key={i}>
                                                <td>{i+1}</td>
                                                <td>{data.itemnr}</td>
                                                <td>{this.formatNumber(data.revenue)}</td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>)} */}
                                <tbody>
                                    <tr>
                                        <td><a href="/#">08272718</a></td>
                                        <td>20/04/19</td>
                                        <td>
                                            <div className="table-status">
                                                <img src={require("../../assets/images/icon-shipped.svg")} alt="shipped"/>
                                                <span>Shipped</span>
                                            </div>
                                        </td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/#">72817283</a></td>
                                        <td>19/04/19</td>
                                        <td>
                                            <div className="table-status">
                                                <img src={require("../../assets/images/icon-open-box.svg")} alt="open"/>
                                                <span>Open</span>
                                            </div>
                                        </td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/#">92047147</a></td>
                                        <td>19/04/19</td>
                                        <td>
                                            <div className="table-status">
                                                <img src={require("../../assets/images/icon-shipped.svg")} alt="shipped"/>
                                                <span>Shipped</span>
                                            </div>
                                        </td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/#">72819374</a></td>
                                        <td>18/04/19</td>
                                        <td>
                                            <div className="table-status">
                                                <img src={require("../../assets/images/icon-open-box.svg")} alt="open"/>
                                                <span>Open</span>
                                            </div>
                                        </td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/#">46381922</a></td>
                                        <td>17/04/19</td>
                                        <td>
                                            <div className="table-status">
                                                <img src={require("../../assets/images/icon-open-box.svg")} alt="open"/>
                                                <span>Open</span>
                                            </div>
                                        </td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                </tbody>
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
                                        <th>{trls('Invoice_Number')}</th>
                                        <th>{trls('Due_Date')}</th>
                                        <th>{trls('Amount')}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                    {/* {topModel &&(<tbody >
                                        {
                                            topModel.map((data,i) =>(
                                            <tr id={i} key={i}>
                                                <td>{i+1}</td>
                                                <td>{data.Model}</td>
                                                <td>{this.formatNumber(data.Revenue)}</td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>)} */}
                                <tbody>
                                    <tr>
                                        <td><a href="/#">08272718</a></td>
                                        <td>20/04/19</td>
                                        <td>€289.25</td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/#">72817283</a></td>
                                        <td>19/04/19</td>
                                        <td>€738.98</td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/#">92047147</a></td>
                                        <td>19/04/19</td>
                                        <td>€378.38</td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/#">72819374</a></td>
                                        <td>18/04/19</td>
                                        <td>€137.98</td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/#">46381922</a></td>
                                        <td>17/04/19</td>
                                        <td>€649.22</td>
                                        <td><img src={require("../../assets/images/icon-vertical-dots.svg")} alt="dots"/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
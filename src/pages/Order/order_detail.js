import React, {Component} from 'react'
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
import { Container, Row, Col } from 'react-bootstrap';
// import SessionManager from '../../components/session_manage';
// import Select from 'react-select';
// import API from '../../components/api'
// import Axios from 'axios';
// import * as Auth from '../../components/auth'
// import  { Link } from 'react-router-dom';
// import * as authAction  from '../../actions/authAction';
// import Slider from 'react-bootstrap-slider';
// import "bootstrap-slider/dist/css/bootstrap-slider.css"
// import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'datatables.net';
// import history from '../../history';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({

});

class Orderdetail extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            orderId: ''
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        let pathname = window.location.pathname;
        let pathArray = pathname.split('/')
        let orderId = pathArray.pop();
        this.setState({orderId: orderId})
    }

    // showOrderDetail = (orderId) => {
    //     history.push({
    //         pathname: '/order-detail/orderId',
    //         state: { id: orderId, newSubmit:true }
    //       })
    // }
    
    render(){   
        return (
            <div className="order_div">
                <div className="content__header content__header--with-line">
                    <div id="google_translate_element"></div>
                    <h2 className="title">{trls("Orders")} > <span style={{color: "#1755C7", fontSize: 22}}>{this.state.orderId}</span></h2>
                </div>
                <Container>
                    <div className="order__info-salesNum">
                        {trls("Sales_Number")}: <span style={{color: "#1755C7", fontSize: 18}}>{this.state.orderId}</span>
                    </div>
                    <Row className="order__info-bill">
                        <Col sm={4} style={{paddingLeft: 0, paddingTop: 10}}>
                            <div style={{fontWeight: "bold"}}>Bill to</div>
                            <div>Johan Boerema</div>
                            <div>Neue Mainzer Str. 52-58, 60311 Frankfurt am Main, Germany</div>
                        </Col>
                        <Col sm={4} style={{paddingLeft: 0, paddingTop: 10}}>
                            <div style={{fontWeight: "bold"}}>Ship to</div>
                            <div>Johan Boerema</div>
                            <div>Neue Mainzer Str. 52-58, 60311 Frankfurt am Main, Germany</div>
                        </Col>
                        <Col sm={4} style={{ paddingLeft: 0, paddingTop: 10}}>
                            <div style={{float: "right"}}>
                                <div><span style={{fontWeight: "bold", marginRight: 10}}>Order Date:</span>09/04/18</div>
                                <div><span style={{fontWeight: "bold", marginRight: 10}}>Order Status:</span><img src={require("../../assets/images/icon-open-box-gray.svg")} style={{marginRight: 10}} alt={'open'}/>Open</div>
                                <div><span style={{fontWeight: "bold", marginRight: 10}}>PO Ref No:</span>#ABC-728178</div>
                            </div>
                            
                        </Col>
                    </Row>
                    <div className="table-responsive">
                        <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>{trls("Item_Name")}</th>
                                <th>{trls("Description")}</th>
                                <th>{trls("Quantity")}</th>
                                <th>{trls("Shipped_Quantity")}</th>
                                <th>{trls("Price")}</th>
                                <th>{trls("Action")}</th>
                            </tr>
                        </thead>
                        {/* {productData && !this.state.loading&&(<tbody>
                            {
                                productData.map((data,i) =>(
                                <tr id={data.id} key={i}>
                                    <td>
                                    <div id={data.id} style={{cursor: "pointer", color:'#004388', fontSize:"14px", fontWeight:'bold'}} onClick={this.loadProductDetail}>{data.Productcode}</div>
                                    </td>
                                    <td>
                                        {data.Supplier}
                                    </td>
                                    <td>{data.Product}</td>
                                    <td>{data.Customer}</td>
                                    <td>{data.Productgroup}</td>
                                    <td>{data.SalesUnit}</td>
                                    <td>{data.Kilogram}</td>
                                    <td>
                                    <Row style={{justifyContent:"center"}}>
                                        <img src={require("../../assets/images/icon-orders.svg")} id={data.id} alt="copy" className="statu-item" onClick={()=>this.copyProduct(data)}/>
                                    </Row>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>)} */}
                        <tbody>
                            <tr>
                                <td>
                                    <span className="txt-bold">7234</span>
                                </td>
                                <td>
                                    <div className="open-order__item">
                                        <img src="https://eijffinger-585084.c.cdn77.org/content/images/thumbs/000/0009596_pip-studio-5_480.png" style={{width: 25}} alt={'img1'}/>
                                        <span>Lorem ipsum dolor sit amet</span>
                                    </div>
                                </td>
                                <td>Vivamus at dolor ut nunc vehicula suscipit</td>
                                <td>
                                    20
                                </td>
                                <td>20</td>
                                <td>
                                    €1,025.00
                                </td>
                                <td style={{textAlign: 'center'}}>
                                    <i className="fas fa-trash-alt action-icon" style={{color: '#DF3535'}}></i>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="txt-bold">7235</span>
                                </td>
                                <td>
                                    <div className="open-order__item">
                                        <img src="https://eijffinger-585084.c.cdn77.org/content/images/thumbs/000/0009596_pip-studio-5_480.png" style={{width: 25}} alt={'img2'}/>
                                        <span>Lorem ipsum dolor sit amet</span>
                                    </div>
                                </td>
                                <td>Vivamus at dolor ut nunc vehicula suscipit</td>
                                <td>
                                    20
                                </td>
                                <td>10</td>
                                <td>
                                    €1,025.00
                                </td>
                                <td style={{textAlign: 'center'}}>
                                    <i className="fas fa-trash-alt action-icon" style={{color: '#DF3535'}}></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="open-order__total-block">
                        <div className="open-order__total-block-row">
                            <span className="txt-bold">Sub-total:</span>
                            <span>€4,100.00</span>
                        </div>
                        <div className="open-order__total-block-row">
                            <span className="txt-bold">Discount:</span>
                            <span>0.00%</span>
                        </div>
                        <div className="open-order__total-block-row">
                            <span className="txt-bold">VAT:</span>
                            <span>20%</span>
                        </div>
                        <div className="open-order__total">EUR 4,100.00</div>
                    </div>
                    { this.state.loading&& (
                    <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                        <BallBeat
                            color={'#222A42'}
                            loading={this.state.loading}
                        />
                    </div>
                    )}
                </div>
            </Container>
        </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Orderdetail);
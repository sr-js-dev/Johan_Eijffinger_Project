import React, {Component} from 'react'
import { connect } from 'react-redux';
import { trls } from '../../components/translate';
import { Container, Row, Col, Button } from 'react-bootstrap';
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

class Paymentmanage extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            rows: []
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        // let pathname = window.location.pathname;
        // let pathArray = pathname.split('/')
        // let orderId = pathArray.pop();
        // this.setState({orderId: orderId})
    }
    
    handleAddRow = () => {
        const item = {
          productcode:''
        };
        // if(!this.state.addnum){
          this.setState({
              rows: [...this.state.rows, item]
          });
          this.setState({addnum:true})
        // }
        
      };
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
                    <h2 className="title">{trls("Make_a_payment")}</h2>
                </div>
                <Container style={{paddingTop: 20}}>
                    <div className="table-responsive">
                        <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls("Pay")}</th>
                                <th>{trls("Type")}</th>
                                <th>{trls("Invoice_No")}</th>
                                <th>{trls("Documet_Date")}</th>
                                <th>{trls("Due_Date")}</th>
                                <th>{trls("Status")}</th>
                                <th>{trls("Amount")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="checkbox"/></td>
                                <td>
                                    Invoice
                                </td>
                                <td>09/04/18</td>
                                <td>
                                    <a href="/#">ABC-728178</a>
                                </td>
                                <td>13/04/18</td>
                                <td>
                                    <div className="table-status">
                                        <img src={require("../../assets/images/icon-exclamation-red.svg")} alt={'exc'}/>
                                        <span>Past Due</span>
                                    </div>
                                </td>
                                <td>
                                    €573.92
                                </td>
                            </tr>
                            <tr>
                                <td><input type="checkbox"/></td>
                                <td>
                                    Invoice
                                </td>
                                <td>09/04/18</td>
                                <td>
                                    <a href="/#">ABC-728178</a>
                                </td>
                                <td>13/04/18</td>
                                <td>
                                    <div className="table-status">
                                        <img src={require("../../assets/images/icon-warning.svg")} alt={'warning'}/>
                                        <span>Due Soon</span>
                                    </div>
                                </td>
                                <td>
                                    €573.92
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    { this.state.loading&& (
                    <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                        <BallBeat
                            color={'#222A42'}
                            loading={this.state.loading}
                        />
                    </div>
                    )}
                </div>
                <Row style={{justifyContent: 'space-between'}}>
                        <Col sm={4} style={{paddingLeft: 0, paddingRight: 0, paddingTop: 20}}>
                            <div className="info-block">
                                <span className="txt-bold">Credit on Account</span>
                                <span>€400.00</span>
                            </div>
                        </Col>
                        <Col sm={4} style={{paddingLeft: 0, paddingRight: 0, paddingTop: 20}}>
                            <div className="info-block" style={{marginBottom: 20}}>
                                <span className="txt-bold">Balance remaining</span>
                                <span>€1,928.00</span>
                            </div>
                            <div className="info-block">
                                <span className="txt-bold">Total selected to pay</span>
                                <span>€428.00</span>
                            </div>
                            <div style={{paddingTop: 20}}>
                                <Button variant="secondary" style={{height: 40, borderRadius: 20, float: 'right'}} onClick={()=>this.handleAddRow()}>{trls('Make_Payment')}</Button>
                            </div>
                        </Col>
                    </Row>
            </Container>
        </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Paymentmanage);
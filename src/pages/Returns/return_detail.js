import React, {Component} from 'react'
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
// import SessionManager from '../../components/session_manage';
import Select from 'react-select';
import API from '../../factories/api'
import * as Common from '../../factories/common';
import Axios from 'axios';
import * as Auth from '../../factories/auth'
// import  { Link } from 'react-router-dom';
// import * as authAction  from '../../actions/authAction';
// import Slider from 'react-bootstrap-slider';
// import "bootstrap-slider/dist/css/bootstrap-slider.css"
import SessionManager from '../../factories/session_manage';
import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'datatables.net';
// import history from '../../history';
import Pageloadspiiner from '../../components/page_load_spinner';
// import { add } from 'date-fns';
import history from '../../history';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({

});

class Returndetail extends Component {
    _isMounted = false;
    constructor(props) {
        let pathname = window.location.pathname;
        let pathArray = pathname.split('/');
        super(props);
        this.state = {  
            orderData: [],
            businessPartnerOption: [],
            shippingAddressOption: [],
            pageLodingFlag: false,
            userInfo: Auth.getUserInfo(), 
            billAddress: [],
            shippingAddress: [],
            setSippingAddress: [],
            orderId: pathArray[2] ? pathArray[2] : '',
            showPrice: localStorage.getItem('eijf_showPrice')==="true"
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this.getCustomerData();
    }

    getCustomerData = () => {
        this._isMounted = true;
        this.setState({pageLodingFlag: true});
        let params = {};
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerData, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.value.length){
                    let addressData = this.getShippingAddressOptionData(result.data.value);
                    let shippingData = addressData[1].map( s => ({value:s.BPCode,label: s.Street+" "+s.ZipCode+" "+s.City+" "+s.Country}));
                    this.setState({businessPartnerOption: result.data.value, shippingAddressOption: shippingData, billAddress: addressData[0][0], shippingAddress: addressData[1], selectShippingAddress: shippingData[0], setSippingAddress: addressData[1][0]});
                }
                this.getOrderData();
            }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        });
    }

    getShippingAddressOptionData = (optionData) => {
        let returnOptionData = [];
        let billAddress = [];
        let shippingAddress = [];
        optionData.map((data, index)=>{
            data.BPAddresses.map((bpAddress, key)=>{
                if(bpAddress.AddressName==="Bill to"){
                    billAddress.push(bpAddress);
                }else if(bpAddress.AddressName==="Ship To"){
                    shippingAddress.push(bpAddress)
                }
                return bpAddress;
            })
            return data;
        });
        returnOptionData[0] = billAddress;
        returnOptionData[1] = shippingAddress;
        return returnOptionData;
    }

    getOrderData = () => {
        this._isMounted = true;
        this.setState({pageLodingFlag: true});
        const { orderId } = this.state;
        var settings = {
            "url": API.GetReturnDetails+orderId,
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+Auth.getUserToken(),
        }
        }
        $.ajax(settings).done(function (response) {
        })
        .then(response => {
            if(this._isMounted){
                if(response){
                    this.setState({orderData: response})
                }
                this.setState({pageLodingFlag: false})
            }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        });
    }

    render(){   
        let totalAmount = 0;
        const { businessPartnerOption, 
            shippingAddressOption, 
            pageLodingFlag, 
            userInfo, 
            billAddress, 
            setSippingAddress,
            orderData,
            selectShippingAddress,
            showPrice
        } = this.state;
        orderData.map((data, key)=>{
            totalAmount +=  data.OpenAmount ? data.OpenAmount : 0;
            return data
        })
        return (
            <div className="order_div">
                <div className="content__header content__header--with-line">
                    <div id="google_translate_element"></div>
                    <h2 className="title">{trls("Return details")}</h2>
                </div>
                <Container>
                    <Form className="container product-form" onSubmit = { this.handleSubmit }>
                        <Row className="order__info-bill">
                            <Col sm={6} style={{paddingLeft: 0, paddingTop: 10}}>
                                    <Form.Group as={Row} controlId="formPlaintextPassword">
                                        <Form.Label column sm="4">
                                            {trls("Customer_reference")}  
                                        </Form.Label>
                                        <Col sm="8" className="product-text">
                                            <Form.Control type="text" name="reference" required readOnly placeholder={trls('Customer_reference')} />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="formPlaintextPassword">
                                        <Form.Label column sm="4">
                                            {trls("Business_partner")}  
                                        </Form.Label>
                                        <Col sm="8" className="product-text">
                                            <Form.Control type="text" name="reference" required defaultValue = {businessPartnerOption[0] ? businessPartnerOption[0].CardName : ''} readOnly placeholder={trls('Customer_reference')} />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="formPlaintextPassword">
                                        <Form.Label column sm="4">
                                            {trls("Contact")}  
                                        </Form.Label>
                                        <Col sm="8" className="product-text">
                                            <Form.Control type="text" name="contact" defaultValue = {userInfo.userName} readOnly required placeholder={trls('Contact')} />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        {trls("Shipping_Address")}  
                                    </Form.Label>
                                    <Col sm="8" className="product-text">
                                        <Select
                                            name="usinesspartner"
                                            placeholder={trls('Shipping_Address')}
                                            options={shippingAddressOption}
                                            onChange={val => this.changeShippigAddress(val)}
                                            value={selectShippingAddress}
                                            isDisabled={true}
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col sm={6} className = "bill-shipping__address">
                                <div className="place-order__address">
                                    <p className="address-header">{trls('Billing_Address')}</p>
                                    <p>{billAddress.City ? billAddress.Street : '' }</p>
                                    <p>{billAddress.City ? billAddress.ZipCode + " " + billAddress.City : ''}</p>
                                    <p>{billAddress.Country ? billAddress.Country : ''}</p>
                                </div>
                                <div className="place-order__address">
                                    <p className="address-header">{trls('Shipping_Address')}</p>
                                    <p>{setSippingAddress.City ? setSippingAddress.Street : '' }</p>
                                    <p>{setSippingAddress.City ? setSippingAddress.ZipCode + " " + setSippingAddress.City : ''}</p>
                                    <p>{setSippingAddress.Country ? setSippingAddress.Country : ''}</p>
                                </div>
                            </Col>
                        </Row>                   
                    </Form>
                    <div className="table-responsive">
                        <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls("Product_code")}</th>
                                <th>{trls("Product_description")}</th>
                                {/* <th>{trls("Unit")}</th> */}
                                <th>{trls("Quantity")}</th>
                                {showPrice ? (
                                    <th>{trls("Price")}</th>
                                ): null}
                                {showPrice ? (
                                    <th>{trls("Amount")}</th>
                                ): null}
                                <th>{trls("Image")}</th>
                                <th>{trls("Customer_reference")}</th>
                                <th>{trls("Expected_deliver_week")}</th>
                                <th>{trls("Action")}</th>
                            </tr>
                        </thead>
                        {orderData &&(<tbody>
                            {
                                orderData.map((data,index) =>(
                                <tr id={index} key={index}>
                                    <td style={{display: "flex"}}>
                                        <Form.Control id={"itemCode"+data.rowId} disabled type="text" name="productcode" autoComplete="off" required style={{width: '80%'}} placeholder={trls('Product_code')} defaultValue={data.ItemCode ? data.ItemCode : ''} onChange={(evt)=>this.changeProductCode(evt.target.value)} onBlur={()=>this.getItemData(data.rowId, index+1, data.ItemCode)}/>
                                        <i className="fas fa-search place-order__itemcode-icon"></i>
                                    </td>
                                    <td>
                                        <Form.Control type="text" name="description" disabled readOnly required defaultValue = {data.ItemDescription ? data.ItemDescription : ''} placeholder={trls('Description')} />
                                    </td>
                                    {/* <td>
                                        {data.SalesUnit ? data.SalesUnit : ''}
                                    </td> */}
                                    <td>
                                        <Row style={{justifyContent: "space-around"}}>
                                            <Form.Control type="text" name="quantity" style={{width: '80%'}} disabled required placeholder={trls('Quantity')} onChange={(evt)=>this.changeQuantityData(evt.target.value, data.rowId)}/>
                                        </Row>
                                    </td>
                                    {showPrice ? (
                                        <td>
                                        {/* {Common.formatMoney(itemPriceData[data.rowId] ? itemPriceData[data.rowId].NewUnitPrice : '')} */}
                                        {/* {Common.formatMoney()} */}
                                        </td>
                                    ): null}
                                    {showPrice ? (
                                        <td>
                                            {data.OpenAmount ? Common.formatMoney(data.OpenAmount) : ''}
                                        </td>
                                    ): null}
                                    <td>
                                        {data.picture&&(
                                            <img src={ data.Image ? "data:image/png;base64," + data.picture : ''} className = "image__zoom" alt={index}></img>
                                        ) 
                                        }
                                    </td>
                                    <td>
                                        <Form.Control type="text" name="customerReference" disabled required placeholder={trls('Customer_reference')} onChange={(evt)=>this.setState({quantity: evt.target.value})} />
                                    </td>
                                    <td>
                                        <DatePicker name="startdate" className="myDatePicker" disabled dateFormat="dd-MM-yyyy" selected={new Date(data.docDate)} onChange={date =>this.setState({startdate:date})} />
                                    </td>
                                    <td>
                                        <Row style={{justifyContent: "space-around"}}>
                                            <i className="fas fa-trash-alt add-icon" disabled></i>
                                        </Row>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>)}
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
                <div>
                    <Button variant="light" disabled onClick={()=>this.handleAddRow()}><i className="fas fa-plus add-icon"></i>{trls('Click_to_make_new_row')}</Button> 
                </div>
                <Col sm={4} style={{float: 'right', paddingLeft: 0, paddingRight: 0}}>
                    {showPrice ? (
                        <div className="info-block info-block--green">
                            <span className="txt-bold">Order Total</span>
                            <span>{Common.formatMoney(totalAmount)}</span>
                        </div>
                    ): null}
                    
                    <Button type="button" className="place-submit__order" disabled onClick={()=>this.setState({modalResumeShow: true})}>Submit order</Button>
                </Col>
            </Container>
            <Pageloadspiiner loading = {pageLodingFlag}/>
        </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Returndetail);
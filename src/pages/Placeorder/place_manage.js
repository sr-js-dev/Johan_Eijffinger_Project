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
import Productsearchform from './product_searchform';
import Resumeform from './resume_form';
// import history from '../../history';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({

});

class Placemanage extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            rows: [],
            businessPartnerOption: [],
            shippingAddressOption: [],
            itemData: [],
            itemCode: '',
            itemQuantity: 0,
            itemPriceData: [],
            orderType: [{"value": 'Default', "label": 'Default'}, {"value": 'Sample', "label": 'Sample'}],
            productSearch: [{'value': '7745-2', 'label': '7745-2'}, {'value': '7745-2', 'label': '7745-2'}],
            productDesription: '',
            itemPrice: '',
            quantity: '',
            unit: '',
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
        let params = {};
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerData, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.value.length){
                    let businessPartner = result.data.value.map( s => ({value:s.CardCode,label:s.CardName}));
                    let shippingAddress = this.getShippingAddressOptionData(result.data.value);
                    let shippingData = shippingAddress.map( s => ({value:s.BPCode,label:s.AddressName+" "+s.Street+" "+s.City+" "+s.Country}));
                    this.setState({businessPartnerOption: businessPartner, shippingAddressOption: shippingData});
                }
            }
        });
    }

    getShippingAddressOptionData = (optionData) => {
        let returnOptionData = [];
        optionData.map((data, index)=>{
            data.BPAddresses.map((bpAddress, key)=>{
                returnOptionData.push(bpAddress);
                return bpAddress;
            })
            return data;
        });
        return returnOptionData;
    }

    getItemPriceData = (value) => {
        this._isMounted = true;
        const { itemCode } = this.state;
        this.setState({itemQuantity: value})
        let params = {
            "itemCode": itemCode,
            "quantity": value,
            "date": Common.formatDate1(new Date()),
            "orderType": "B2B"
        };
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetDiscountPrice, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data){
                    this.setState({itemPriceData: result.data})                    
                }
            }
        });
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

    changeProductList = (evt) => {
        this.setState({productDesription: evt.target.value, itemPrice: 120, unit: 'unit'})
    }

    getItemData = (itemCode) => {
        this._isMounted = true;
        this.setState({itemCode: itemCode});
        var settings = {
            "url": API.GetItemData+itemCode,
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+Auth.getUserToken(),
        }
        }
        $.ajax(settings).done(function (response) {
        })
        .then(response => {
            this.setState({itemData: response});
        });
    }

    render(){   
        const { businessPartnerOption, shippingAddressOption, itemData, itemPriceData, itemQuantity } = this.state;
        console.log('123', itemPriceData)
        return (
            <div className="order_div">
                <div className="content__header content__header--with-line">
                    <div id="google_translate_element"></div>
                    <h2 className="title">{trls("Place_an_order")}</h2>
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
                                            <Form.Control type="text" name="reference" required placeholder={trls('Customer_reference')} />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="formPlaintextPassword">
                                        <Form.Label column sm="4">
                                            {trls("Business_partner")}  
                                        </Form.Label>
                                        <Col sm="8" className="product-text">
                                            <Select
                                                name="usinesspartner"
                                                placeholder={trls('Business_partner')}
                                                options={businessPartnerOption}
                                                onChange={val => this.setState({val1:val})}
                                                // defaultValue = {this.getSupplierData()}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="formPlaintextPassword">
                                        <Form.Label column sm="4">
                                            {trls("Contact")}  
                                        </Form.Label>
                                        <Col sm="8" className="product-text">
                                            <Select
                                                name="usinesspartner"
                                                placeholder={trls('Contact')}
                                                // options={this.state.supplier}
                                                onChange={val => this.setState({val1:val})}
                                                // defaultValue = {this.getSupplierData()}
                                            />
                                        </Col>
                                    </Form.Group>
                            </Col>
                            <Col sm={6} style={{paddingLeft: 0, paddingTop: 10}}>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        {trls("Shipping_Address")}  
                                    </Form.Label>
                                    <Col sm="8" className="product-text">
                                        <Select
                                            name="usinesspartner"
                                            placeholder={trls('Shipping_Address')}
                                            options={shippingAddressOption}
                                            onChange={val => this.setState({val1:val})}
                                            // defaultValue = {this.getSupplierData()}
                                        />
                                    </Col>
                                </Form.Group>
                            </Col> 
                        </Row>                   
                    </Form>
                    {/* <div className="table-responsive"> */}
                        <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls("Product_code")}</th>
                                <th>{trls("Product_description")}</th>
                                <th>{trls("Unit")}</th>
                                <th>{trls("Quantity")}</th>
                                <th>{trls("Price")}</th>
                                <th>{trls("Amount")}</th>
                                <th>{trls("Image")}</th>
                                <th>{trls("Customer_reference")}</th>
                                <th>{trls("Expected_deliver_week")}</th>
                            </tr>
                        </thead>
                        {this.state.rows &&(<tbody>
                            {
                                this.state.rows.map((data,i) =>(
                                <tr id={data.id} key={i}>
                                    <td>
                                        {/* <Form.Control type="text" name="product" required placeholder={trls('Search')} /> */}
                                        <Select
                                            name="search"
                                            arrowRenderer={"<i class='fas fa-search'></i>"}
                                            placeholder={<i className='fas fa-search'>Search</i>}
                                            options={this.state.productSearch}
                                            // className="select-search-class"
                                            onChange={val => this.getItemData(val.value)}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control type="text" name="description" readOnly required  defaultValue = {itemData.ItemName} placeholder={trls('Description')} />
                                    </td>
                                    <td>
                                        {itemData.SalesUnit}
                                    </td>
                                    <td>
                                        <Form.Control type="text" name="quantity" required placeholder={trls('Quantity')} onChange={(evt)=>this.getItemPriceData(evt.target.value)} />
                                    </td>
                                    <td>
                                        {Common.formatMoney(itemPriceData.NewUnitPrice)}
                                    </td>
                                    <td>
                                        {Common.formatMoney(itemPriceData.NewUnitPrice*itemQuantity)}
                                    </td>   
                                    <td>
                                        <img src={"data:image/png;base64,"+itemData.Image} alt={itemData.Image} style={{width: 20, height: 20}}></img>
                                    </td>
                                    <td>
                                        <Form.Control type="text" name="customerReference" required placeholder={trls('Customer_reference')} onChange={(evt)=>this.setState({quantity: evt.target.value})} />
                                    </td>
                                    <td>
                                        {this.state.productDesription&&(
                                            <DatePicker name="startdate" className="myDatePicker" dateFormat="dd-MM-yyyy" selected={new Date()} onChange={date =>this.setState({startdate:date})} />
                                        )}
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
                {/* </div> */}
                <div>
                    <Button variant="secondary" style={{height: 40, borderRadius: 20}} onClick={()=>this.handleAddRow()}>{trls('Click_to_make_new_row')}</Button>
                </div>
                <Col sm={4} style={{float: 'right', paddingLeft: 0, paddingRight: 0}}>
                    <div className="info-block info-block--green">
                        <span className="txt-bold">Order Total</span>
                        <span>€428.00</span>
                    </div>
                    <Button variant="secondary" style={{height: 50, borderRadius: 5, float: 'right'}} onClick={()=>this.setState({modalResumeShow: true})}>{trls('Submit_Order')}</Button>
                </Col>
            </Container>
            {/* <Productsearchform
                show={this.state.modaladdShow}
                onHide={() => this.setState({modaladdShow: false})}
            />
            <Resumeform
                show={this.state.modalResumeShow}
                onHide={() => this.setState({modalResumeShow: false})}
            /> */}
        </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Placemanage);
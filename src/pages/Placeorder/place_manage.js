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
import ItemSearchform from './Item_searchform';
import Patterncalculateform from './patterncalculate_form';
// import history from '../../history';
import Pageloadspiiner from '../../components/page_load_spinner';
// import { add } from 'date-fns';
import history from '../../history';

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
            itemQuantityData: [],
            itemProductCodeData: [],
            pageLodingFlag: false,
            productDesription: '',
            itemPrice: '',
            quantity: '',
            unit: '',
            billAddress: [],
            shippingAddress: [],
            setSippingAddress: [],
            productSearch: [{'value': '7745-2', 'label': '7745-2'}, {'value': '7745-2', 'label': '7745-2'}],
            userInfo: Auth.getUserInfo(), 
            rowId: 0,
            selectShippingAddress: [],
            itemFlag: [],
            slideItemFormFlag: false,
            slidePatternFormFlag: false,
            addRow: false,
            orderLineNumber: '',
            rowNum: 0
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
                    // let businessPartner = result.data.value.map( s => ({value:s.CardCode,label:s.CardName}));
                    let addressData = this.getShippingAddressOptionData(result.data.value);
                    let shippingData = addressData[1].map( s => ({value:s.BPCode,label: s.Street+" "+s.ZipCode+" "+s.City+" "+s.Country}));
                    this.setState({businessPartnerOption: result.data.value, shippingAddressOption: shippingData, billAddress: addressData[0][0], shippingAddress: addressData[1], selectShippingAddress: shippingData[0], setSippingAddress: addressData[1][0]});
                }
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
        // let shippingAddress = data.BPAddresses.filter(item => item.AddressName==="Ship To");
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
    
    handleAddRow = () => {
        let rowNum = this.state.rowNum;
        const item = {
          rowId: rowNum
        };
        rowNum += 1;
        // if(!addRow){
            this.setState({
                rows: [...this.state.rows, item],
                rowId: rowNum
            });
            this.setState({rowNum: rowNum});
        // }
    };

    changeProductList = (evt) => {
        this.setState({productDesription: evt.target.value, itemPrice: 120, unit: 'unit'})
    }

    // getItemData = (itemCode, rowId) => {
    //     this._isMounted = true;
    //     let itemData = this.state.itemData;
    //     let itemFlag = this.state.itemFlag;
    //     this.setState({itemCode: itemCode, pageLodingFlag: true});
    //     var settings = {
    //         "url": API.GetItemData+itemCode,
    //         "method": "GET",
    //         "headers": {
    //             "Content-Type": "application/json",
    //             "Authorization": "Bearer "+Auth.getUserToken(),
    //     }
    //     }
    //     $.ajax(settings).done(function (response) {
    //     })
    //     .then(response => {
    //        itemData[rowId] = response;
    //        itemFlag[rowId] = true;
    //         this.setState({itemData: itemData, pageLodingFlag: false});
    //     })
    //     .catch(err => {
    //         itemFlag[rowId] = true;
    //         this.setState({pageLodingFlag: false, itemFlag: itemFlag});
    //     });;
    // }

    // getItemPriceData = (value, rowId, productCode) => {
    //     this._isMounted = true;
    //     let itemPriceData = this.state.itemPriceData;
    //     let itemQuantityData = this.state.itemQuantityData;
    //     itemQuantityData[rowId] = value;
    //     itemPriceData[rowId] = '';
    //     this.setState({itemPriceData: itemPriceData, pageLodingFlag: true, itemQuantityData: itemQuantityData});
    //     let params = {
    //         "itemCode": productCode,
    //         "quantity": value ? value : 0,
    //         "date": Common.formatDate1(new Date()),
    //         "orderType": "B2B"
    //     };
    //     var headers = SessionManager.shared().getAuthorizationHeader();
    //     Axios.post(API.GetDiscountPrice, params, headers)
    //     .then(result => {
    //         if(this._isMounted){
    //             if(result.data){
    //                 itemPriceData[rowId] = result.data;
    //                 itemPriceData[rowId].itemQuantity = parseFloat(value);
    //                 this.setState({itemPriceData: itemPriceData, pageLodingFlag: false})                    
    //             }
    //         }
    //     });
    // }

    getItemData = (rowId, lineNumber, code) => {
        this._isMounted = true;
        let itemFlag = this.state.itemFlag;
        let itemCode = this.state.itemCode;
        let rows = this.state.rows;
        itemCode =$("#itemCode"+rowId).val();
        this.setState({itemCode: itemCode, pageLodingFlag: true});
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
            itemFlag[rowId]=false;
            rows.map((data, index) => {
                if(data.rowId===rowId){
                    data.ItemName = response.ItemName;
                    data.SalesUnit = response.SalesUnit;
                    data.Image = response.Image;
                }
                return data;
            })
            this.setState({itemData: response, orderLineNumber: lineNumber, slidePatternFormFlag: response.U_DBS_PARTIJCONTR==="Y" ? true : false, pageLodingFlag: false, itemCode: itemCode, rowId: rowId, rows: rows});
            if(response.U_DBS_PARTIJCONTR==="Y"){
                Common.showSlideForm();
            }
        })
        .catch(err => {
            itemFlag[rowId]=true;
            this.setState({pageLodingFlag: false, itemFlag: itemFlag});
        });
    }

    getItemPriceData = (value, rowId) => {
        this._isMounted = true;
        let itemPriceData = this.state.itemPriceData;
        let itemQuantityData = this.state.itemQuantityData;
        itemQuantityData[rowId] = value;
        itemPriceData[rowId] = '';
        this.setState({itemPriceData: itemPriceData, pageLodingFlag: true, itemQuantityData: itemQuantityData});
        let params = {
            "itemCode": $("#itemCode"+rowId).val(),
            "quantity": value ? value : 0,
            "date": Common.formatDate1(new Date()),
            "orderType": "B2B"
        };
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetDiscountPrice, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data){
                    itemPriceData[rowId] = result.data;
                    itemPriceData[rowId].itemQuantity = parseFloat(value);
                    this.setState({itemPriceData: itemPriceData, pageLodingFlag: false})                    
                }
            }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        });
    }

    changeProductCode = (itemCode, rowId) => {
        this.setState({itemFlag: [], itemCode: itemCode})
    }

    changeQuantityData = (quantity, rowId) => {
        let itemQuantityData = this.state.itemQuantityData;
        itemQuantityData[rowId] = quantity;
        this.setState({itemQuantityData: itemQuantityData})
    }

    changeShippigAddress = (data) =>{
        const { shippingAddress } = this.state;
        this.setState({selectShippingAddress: data})
        let setSippingAddress = shippingAddress.filter(item => item.BPCode===data.value);
        if(setSippingAddress){
            this.setState({setSippingAddress: setSippingAddress[0]})
        }
        
    }

    removeOrderRow = (rowId) => {
        const { rows } = this.state;
        let rowsArr = rows.filter((item, key) => item.rowId !== rowId);
        if(rowsArr.length===0){
            this.setState({addRow: false});
        }
        this.setState({
            rows: rowsArr,
        });
    }

    searchItemForm = () => {
        this.setState({slideItemFormFlag: true})
        Common.showSlideForm();
    }

    setOrderItem = (itemList) => {
        let rowNum = this.state.rowNum;
        let rows = this.state.rows;
        itemList.map((data, index) => {
            data.rowId = rowNum;
            if(index===0){
                rows[rowNum-1] = data;
            }else{
                rows.push(data);
            }
            rowNum += 1;
            return data
        })
        this.setState({rows: rows, rowNum: rowNum});
    }

    setLenghQuantity = (length, rowId) => {
        let itemQuantityData = this.state;
        itemQuantityData[rowId] = length;
        this.setState({itemQuantityData: itemQuantityData});
    }

    render(){   
        let totalAmount = 0;
        const { businessPartnerOption, 
            shippingAddressOption, 
            itemPriceData, 
            pageLodingFlag, 
            userInfo, 
            billAddress, 
            setSippingAddress,
            itemQuantityData,
            rows,
            selectShippingAddress,
            itemFlag,
            slideItemFormFlag,
            slidePatternFormFlag
        } = this.state;
        if(itemPriceData){
            rows.map((data, key)=>{
                totalAmount +=  itemPriceData[data.rowId] ? itemPriceData[data.rowId].NewUnitPrice*itemPriceData[data.rowId].itemQuantity : 0;
                return data
            })
        }
        console.log('123', rows);
        // console.log('33232', itemPriceData);
        console.log('itemQuantityData', itemQuantityData);
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
                                            <Form.Control type="text" name="reference" required defaultValue = {businessPartnerOption[0] ? businessPartnerOption[0].CardName : ''} readOnly placeholder={trls('Customer_reference')} />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="formPlaintextPassword">
                                        <Form.Label column sm="4">
                                            {trls("Contact")}  
                                        </Form.Label>
                                        <Col sm="8" className="product-text">
                                            <Form.Control type="text" name="contact" defaultValue = {userInfo.userName} required placeholder={trls('Contact')} />
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
                                <th>{trls("Unit")}</th>
                                <th>{trls("Quantity")}</th>
                                <th>{trls("Price")}</th>
                                <th>{trls("Amount")}</th>
                                <th>{trls("Image")}</th>
                                <th>{trls("Customer_reference")}</th>
                                <th>{trls("Expected_deliver_week")}</th>
                                <th>{trls("Action")}</th>
                            </tr>
                        </thead>
                        {rows &&(<tbody>
                            {
                                rows.map((data,index) =>(
                                <tr id={index} key={index}>
                                    <td style={{display: "flex"}}>
                                        <Form.Control id={"itemCode"+data.rowId} type="text" name="productcode" autoComplete="off" required style={{width: '80%'}} className={itemFlag[data.rowId] ? "place-order__product-code" : ''} placeholder={trls('Product_code')} defaultValue={data.ItemCode ? data.ItemCode : ''} onChange={(evt)=>this.changeProductCode(evt.target.value)} onBlur={()=>this.getItemData(data.rowId, index+1, data.ItemCode)}/>
                                        <i className="fas fa-search place-order__itemcode-icon" onClick={()=>this.searchItemForm()}></i>
                                    </td>
                                    <td>
                                        <Form.Control type="text" name="description" readOnly required  defaultValue = {data.ItemName ? data.ItemName : ''} placeholder={trls('Description')} />
                                    </td>
                                    <td>
                                        {data.SalesUnit ? data.SalesUnit : ''}
                                    </td>
                                    <td>
                                        <Row style={{justifyContent: "space-around"}}>
                                            <Form.Control type="text" name="quantity" style={{width: '80%'}} required placeholder={trls('Quantity')} value={itemQuantityData[data.rowId] ? itemQuantityData[data.rowId] : ''} onChange={(evt)=>this.changeQuantityData(evt.target.value, data.rowId)} onBlur={()=>this.getItemPriceData(itemQuantityData[data.rowId], data.rowId)}/>
                                        </Row>
                                    </td>
                                    <td>
                                        {Common.formatMoney(itemPriceData[data.rowId] ? itemPriceData[data.rowId].NewUnitPrice : '')}
                                    </td>
                                    <td>
                                        {Common.formatMoney(itemPriceData[data.rowId] ? itemPriceData[data.rowId].NewUnitPrice*itemPriceData[data.rowId].itemQuantity : '')}
                                    </td>   
                                    <td>
                                        {data.Image&&(
                                            <img src={ data.Image ? "data:image/png;base64," + data.Image : ''} className = "image__zoom" alt={data.rowId}></img>
                                        ) 
                                        }
                                    </td>
                                    <td>
                                        <Form.Control type="text" name="customerReference" required placeholder={trls('Customer_reference')} onChange={(evt)=>this.setState({quantity: evt.target.value})} />
                                    </td>
                                    <td>
                                        {this.state.productDesription&&(
                                            <DatePicker name="startdate" className="myDatePicker" dateFormat="dd-MM-yyyy" selected={new Date()} onChange={date =>this.setState({startdate:date})} />
                                        )}
                                    </td>
                                    <td>
                                        <Row style={{justifyContent: "space-around"}}>
                                            <i className="fas fa-trash-alt add-icon" onClick = {()=>this.removeOrderRow(data.rowId) }></i>
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
                    <Button variant="light" onClick={()=>this.handleAddRow()}><i className="fas fa-plus add-icon"></i>{trls('Click_to_make_new_row')}</Button> 
                </div>
                <Col sm={4} style={{float: 'right', paddingLeft: 0, paddingRight: 0}}>
                    <div className="info-block info-block--green">
                        <span className="txt-bold">Order Total</span>
                        <span>{Common.formatMoney(totalAmount)}</span>
                    </div>
                    <Button type="button" className="place-submit__order" onClick={()=>this.setState({modalResumeShow: true})}>Submit order</Button>
                </Col>
            </Container>
            {slideItemFormFlag ? (
                <ItemSearchform
                    // mode={this.state.mode}
                    onHide={() => this.setState({slideItemFormFlag: false})}
                    onSetItemData={(itemList) => this.setOrderItem(itemList)}
                    // userUpdateData={this.state.userUpdateData}
                /> 
            ): null}
            {slidePatternFormFlag ? (
                 <Patterncalculateform
                    onHide={() => this.setState({slidePatternFormFlag: false})}
                    orderLineNumber={this.state.orderLineNumber}
                    itemData={this.state.itemData}
                    itemCode={this.state.itemCode}
                    rowId={this.state.rowId}
                    onSetQuantity={(length, rowId)=>this.setLenghQuantity(length, rowId)}
                />
            ): null}
            <Pageloadspiiner loading = {pageLodingFlag}/>
        </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Placemanage);
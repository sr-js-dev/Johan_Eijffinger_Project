import React, {Component} from 'react'
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import API from '../../factories/api'
import * as Common from '../../factories/common';
import Axios from 'axios';
import * as Auth from '../../factories/auth'
import SessionManager from '../../factories/session_manage';
import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'datatables.net';
import ItemSearchform from './Item_searchform';
import Patterncalculateform from './patterncalculate_form';
import Pageloadspiiner from '../../components/page_load_spinner';
import history from '../../history';
import Orderdetailform from './orderdetail_form';
import Shippingaddressform from './shippingaddress_form';

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
            patternRowId: [],
            selectShippingAddress: [],
            itemFlag: [],
            slideItemFormFlag: false,
            slidePatternFormFlag: false,
            addRow: false,
            orderLineNumber: '',
            rowNum: 0,
            currentUserInfo: Auth.getLoggedUserInfo(),
            customer_reference: '',
            docDueDate: new Date(),
            orderDetailData: [],
            orderExpenses: [],
            showDetailModal: false,
            itemCodeList: [],
            patternCheckFlag: [],
            patternRowLengthCalcFlag: false,
            patternCalcuRowData: [],
            editPatternCalcuRow: [],
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
        const { addRow } = this.state;
        const item = {
          rowId: rowNum,
          ItemCode: ''
        };
        rowNum += 1;
        if(!addRow){
            this.setState({
                rows: [...this.state.rows, item],
                rowId: rowNum,
            });
            this.setState({rowNum: rowNum, addRow: true});
        }
    };

    changeProductList = (evt) => {
        this.setState({productDesription: evt.target.value, itemPrice: 120, unit: 'unit'})
    }

    onSubmitOrder = () => {
        this._isMounted = true;
        this.setState({pageLodingFlag: true});
        const { currentUserInfo, customer_reference, docDueDate, setSippingAddress, billAddress, rows, itemQuantityData } = this.state;
        let documentLineArray = [];
        if(rows){
            rows.map((data, index)=>{
                let lineArray = [];
                lineArray = {
                    ItemCode: data.ItemCode,
                    Quantity: itemQuantityData[data.rowId]
                }
                documentLineArray.push(lineArray);
                return data;
            })
        }
        let params = {
            "requestData": {
                "CardCode": currentUserInfo.SapCustomerCode,
                "DocDate": Common.formatDate1(new Date()),
                "DocDueDate": Common.formatDate1(docDueDate),
                "Reference1": customer_reference,
                 "BillingAddress": {
                        "ShipToStreet": setSippingAddress.Street,
                        "ShipToStreetNo": null,
                        "ShipToBlock": null,
                        "ShipToBuilding": "",
                        "ShipToCity": setSippingAddress.City,
                        "ShipToZipCode": setSippingAddress.ZipCode,
                        "ShipToCounty": null,
                        "ShipToState": null,
                        "ShipToCountry": setSippingAddress.Country,
                        "ShipToAddressType": null,
                        "BillToStreet": billAddress.Street,
                        "BillToStreetNo": null,
                        "BillToBlock": null,
                        "BillToBuilding": "",
                        "BillToCity": billAddress.City,
                        "BillToZipCode": billAddress.ZipCode,
                        "BillToCounty": null,
                        "BillToState": null,
                        "BillToCountry": "NL",
                        "BillToAddressType": null,
                        "ShipToGlobalLocationNumber": null,
                        "BillToGlobalLocationNumber": null,
                        "ShipToAddress2": null,
                        "ShipToAddress3": null,
                        "BillToAddress2": null,
                        "BillToAddress3": null,
                        "PlaceOfSupply": null,
                        "PurchasePlaceOfSupply": null
                     },
                     "DocumentLines": documentLineArray
            },
              "parameters": {
              }
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostOrder, params, headers)
        .then(result => {
            if(this._isMounted){
                let param = {
                    "docEntry": result.data.DocEntry
                }
                result.data.customerReference = customer_reference;
                let orderDetailData = result.data;
                Axios.post(API.GetOrderExpenses, param, headers)
                .then(result => {
                    if(this._isMounted){
                        this.setState({orderDetailData: orderDetailData, showDetailModal: true, orderExpenses: result.data, pageLodingFlag: false});
                    }
                })
            }
        })
        // .catch(err => {
        //     if(err.response.status===401){
        //         history.push('/login')
        //     }
        // });
    }

    getItemData = (rowId, lineNumber, code) => {
        this._isMounted = true;
        const { itemCodeList, patternCheckFlag } = this.state;
        let itemFlag = this.state.itemFlag;
        let itemCode = '';
        let patternRowId = this.state.patternRowId;
        let rows = this.state.rows;
        itemCode = itemCodeList[rowId];
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
            patternRowId.push(rowId);
            response.rowId = rowId;
            let rowLength = rows.length;
            rows[rowLength-1] = response;
            this.setState({itemData: response, orderLineNumber: lineNumber, pageLodingFlag: false, itemCode: itemCode, patternRowId: patternRowId, rows: rows, itemFlag: itemFlag, patternRowLengthCalcFlag: patternCheckFlag[rowId]}, function(){
            });
        })
        .catch(err => {
            itemFlag[rowId]=true;
            this.setState({pageLodingFlag: false, itemFlag: itemFlag});
        });
    }

    getItemPriceData = (rowId, itemCode) => {
        this._isMounted = true;
        const { itemFlag } = this.state;
        let itemPriceData = this.state.itemPriceData;
        let itemQuantityData = this.state.itemQuantityData;
        if(!itemCode || itemFlag[rowId]!==false){
            return;
        }
        this.setState({pageLodingFlag: true});
        itemPriceData[rowId] = '';
        let params = {
            "itemCode": itemCode ? itemCode : '' ,
            "quantity": itemQuantityData[rowId] ? itemQuantityData[rowId] : 0,
            "date": Common.formatDate1(new Date()),
            "orderType": "B2B"
        };
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetDiscountPrice, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data){
                    itemPriceData[rowId] = result.data;
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

    changeProductCode = (itemCode, rowId, index, evt) => {
        let itemCodeList = this.state.itemCodeList;
        let rows = this.state.rows;
        rows[index].ItemCode = itemCode;
        itemCodeList[rowId] = itemCode;
        this.setState({itemCode: itemCode, itemCodeList: itemCodeList, rows: rows})
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
        let rowNum = this.state.rowNum;
        this.setState({addRow: false, rowNum: rowNum});
        this.setState({
            rows: rowsArr,
        });
    }

    removeOredrLine = (patternRowId) => {
        let rowsArr  = this.state.rows;
        let rowNum = this.state.rowNum;
        patternRowId.map((rowId, index)=>{
            rowsArr = rowsArr.filter((item, key) => item.rowId !== rowId);
            return rowId;
        })
        this.setState({addRow: false, rowNum: rowNum, slidePatternFormFlag: false});
        Common.hideSlideForm();
        this.setState({
            rows: rowsArr,
        });
    }

    searchItemForm = (itemCode) => {
        this.setState({slideItemFormFlag: true, itemCode: itemCode, editPatternCalcuRow: []})
        Common.showSlideForm();
    }

    setOrderItem = (itemList) => {
        let rowNum = this.state.rowNum;
        let patternRowId = [];
        let rows = this.state.rows;
        let rowLength = rows.length;
        let itemCodeList = this.state.itemCodeList;
        itemList.map((data, index) => {
            if(index===0){
                data.rowId = rowNum-1;
                let row_id = rowNum-1;
                patternRowId.push(row_id);
                rows[rowLength-1] = data;
                itemCodeList[rowNum-1] = data.ItemCode
            }else{
                data.rowId = rowNum;
                patternRowId.push(rowNum);
                rows[rowLength] = data;
                itemCodeList[rowNum] = data.ItemCode
                rowLength++;
                rowNum += 1;
            }
            return data
        })
        Common.showSlideForm();
        this.setState({rows: rows, rowNum: rowNum, patternRowId: patternRowId, itemData: itemList[0], itemCode: itemList[0].ItemCode, itemCodeList: itemCodeList, slidePatternFormFlag: true, itemFlag: []});
    }

    setLenghQuantity = (length, patternRowId, calcuRowData) => {
        let itemQuantityData = this.state.itemQuantityData;
        let patternCalcuRowData = this.state.patternCalcuRowData;
        patternRowId.map((rowId, index)=>{
            itemQuantityData[rowId] = length ? length : 0;
            patternCalcuRowData[rowId] = calcuRowData;
            return rowId;
        })
        this.setState({itemQuantityData: itemQuantityData, patternCalcuRowData: patternCalcuRowData, addRow: false});
    }

    calculatePattern = (itemData, itemCode, rowId) => {
        const { patternCheckFlag, patternCalcuRowData } =  this.state;
        let patternRowId = this.state.patternRowId;
        patternRowId = [rowId];
        Common.showSlideForm();
        this.setState({itemData: itemData, itemCode: itemCode, patternRowId: patternRowId, slidePatternFormFlag: true, patternRowLengthCalcFlag: patternCheckFlag[rowId], editPatternCalcuRow: patternCalcuRowData[rowId] ? patternCalcuRowData[rowId] : []})
    }

    editShippingAddree = () => {
        this.setState({showShippingAddressModal: true}); 
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
            slidePatternFormFlag,
            docDueDate,
        } = this.state; 
        let showPrice = localStorage.getItem('eijf_showPrice')==="true";
        if(itemPriceData){
            rows.map((data, key)=>{
                totalAmount +=  itemPriceData[data.rowId] ? itemPriceData[data.rowId].NewUnitPrice*itemQuantityData[data.rowId] : 0;
                return data
            })
        }
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
                                        <Form.Control type="text" name="reference" required placeholder={trls('Customer_reference')} onChange = {(evt)=>this.setState({customer_reference: evt.target.value})} />
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
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        {trls("DocDueDate")}  
                                    </Form.Label>
                                    <Col sm="8" className="product-text">
                                        <DatePicker name="docDueDate" className="myDatePicker order-docdue__datepicker" dateFormat="dd-MM-yyyy" selected={new Date(docDueDate)} onChange={date =>this.setState({docDueDate:date})} />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col sm={6} className = "bill-shipping__address">
                                <div className="place-order__address">
                                    <p className="address-header">{trls('Billing_Address')}</p>
                                    <p>{billAddress.City ? billAddress.Street + " " + billAddress.StreetNo : '' }</p>
                                    <p>{billAddress.City ? billAddress.ZipCode + " " + billAddress.City : ''}</p>
                                    <p>{billAddress.Country ? billAddress.Country : ''}</p>
                                </div>
                                <div className="place-order__address">
                                    <p className="address-header">{trls('Shipping_Address')}<i className="fas fa-pen add-icon shipping-address_edit" onClick={()=>this.editShippingAddree()}></i></p>
                                    <p>{setSippingAddress.City ? setSippingAddress.Street + " " + setSippingAddress.StreetNo : '' }</p>
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
                                {showPrice ? (
                                    <th>{trls("Price")}</th>
                                ): null}
                                {showPrice ? (
                                    <th>{trls("Amount")}</th>
                                ): null}
                                <th>{trls("Image")}</th>
                                <th>{trls("Customer_reference")}</th>
                                <th>{trls("Expected_deliver_week")}</th>
                                {/* <th>{trls("NoPatternCalculation")}</th> */}
                                <th>{trls("Action")}</th>
                            </tr>
                        </thead>
                        {rows &&(<tbody>
                            {
                                rows.map((data,index) =>(
                                <tr id={index} key={index}>
                                    <td style={{display: "flex"}}>
                                        <Form.Control id="itemCode" type="text" name="productcode" autoComplete="off" required style={{width: '80%'}} className={itemFlag[data.rowId] ? "place-order__product-code" : ''} placeholder={trls('Product_code')} value={data.ItemCode ? data.ItemCode : ''} onChange={(evt)=>this.changeProductCode(evt.target.value, data.rowId, index)} onBlur={()=>this.getItemData(data.rowId, index+1, data.ItemCode)} 
                                            onKeyPress={event => {
                                                if (event.key === 'Enter') {
                                                    this.getItemData(data.rowId, index+1, data.ItemCode)
                                                }
                                            }}
                                        />
                                        <i className="fas fa-search place-order__itemcode-icon" onClick={()=>this.searchItemForm(data.ItemCode)}></i>
                                    </td>
                                    <td>
                                        <Form.Control type="text" name="description" readOnly required  defaultValue = {data.ItemName ? data.ItemName : ''} placeholder={trls('Description')} />
                                    </td>
                                    <td>
                                        {data.SalesUnit ? data.SalesUnit : ''}
                                    </td>
                                    <td>
                                        { data.ItemName && data.U_DBS_STUKSCONTR!=='Y' ? (
                                            <Row style={{justifyContent: "space-around"}}>
                                                <Form.Control type="text" name="quantity" className="place_an_orrder-quantity-y" readOnly required placeholder={trls('Quantity')} value={itemQuantityData[data.rowId] ? itemQuantityData[data.rowId] : 0} onChange={(evt)=>this.changeQuantityData(evt.target.value, data.rowId)} onBlur={()=>this.getItemPriceData(data.rowId, data.ItemCode)}
                                                    onKeyPress={event => {
                                                        if (event.key === 'Enter') {
                                                            this.getItemPriceData(data.rowId, data.ItemCode)
                                                        }
                                                    }}
                                                />
                                                <i className="fas fa-pen place-order__itemcode-icon" onClick={()=>this.calculatePattern(data, data.ItemCode, data.rowId)}></i>
                                            </Row>
                                        ): 
                                            <Row>
                                                <Form.Control type="text" name="quantity" className="place_an_orrder-quantity" readOnly={itemFlag[data.rowId]===true ? true : false} required placeholder={trls('Quantity')} value={itemQuantityData[data.rowId] ? itemQuantityData[data.rowId] : 0} onChange={(evt)=>this.changeQuantityData(evt.target.value, data.rowId)} onBlur={()=>this.getItemPriceData(data.rowId, data.ItemCode)}
                                                    onKeyPress={event => {
                                                        if (event.key === 'Enter') {
                                                        this.getItemPriceData(data.rowId, index+1, data.ItemCode)
                                                        }
                                                    }}
                                                />
                                            </Row>
                                        }
                                    </td>
                                    {showPrice ? (
                                        <td>
                                            {Common.formatMoney(itemPriceData[data.rowId] ? itemPriceData[data.rowId].NewUnitPrice : '')}
                                        </td>
                                    ): null}
                                    {showPrice ? (
                                        <td>
                                            {Common.formatMoney(itemPriceData[data.rowId] ? itemPriceData[data.rowId].NewUnitPrice*itemQuantityData[data.rowId] : '')}
                                        </td> 
                                    ): null}
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
                        {showPrice ? (
                            <span>{Common.formatMoney(totalAmount)}</span>
                        ): null}
                    </div>
                    <Button type="button" className="place-submit__order" onClick={()=>this.onSubmitOrder()}>Submit order</Button>
                </Col>
            </Container>
            {slideItemFormFlag ? (
                <ItemSearchform
                    onHide={() => this.setState({slideItemFormFlag: false})}
                    onSetItemData={(itemList) => this.setOrderItem(itemList)}
                    itemCode={this.state.itemCode}
                /> 
            ): null}
            {slidePatternFormFlag ? (
                <Patterncalculateform
                    onHide={() => this.setState({slidePatternFormFlag: false}) }
                    removeOrderLine={(patternRowId) => this.removeOredrLine(patternRowId)}
                    orderLineNumber={this.state.orderLineNumber}
                    itemData={this.state.itemData}
                    itemCode={this.state.itemCode}
                    patternRowId={this.state.patternRowId}
                    editPatternCalcuRow={this.state.editPatternCalcuRow}
                    patternRowLengthCalcFlag={this.state.patternRowLengthCalcFlag}
                    onSetQuantity={(length, patternRowId, patternCalcuRowData)=>this.setLenghQuantity(length, patternRowId, patternCalcuRowData)}
                />
            ): null}
            <Orderdetailform
                show={this.state.showDetailModal}
                onHide={() => this.setState({showDetailModal: false})}
                orderDetailData={this.state.orderDetailData}
                orderExpenses={this.state.orderExpenses}
            />
            <Shippingaddressform
                show={this.state.showShippingAddressModal}
                onHide={() => this.setState({showShippingAddressModal: false})}
                shippingAddress={setSippingAddress}
                setSippingAddress={(shippingAddress)=>{this.setState({setSippingAddress: shippingAddress})}}
            />
            <Pageloadspiiner loading = {pageLodingFlag}/>
        </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Placemanage);
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
import ItemSearchform from './Item_searchform';
import Patterncalculateform from './patterncalculate_form';
import Pageloadspiiner from '../../components/page_load_spinner';
import history from '../../history';
import Orderdetailform from './orderdetail_form';
import Shippingaddressform from './shippingaddress_form';
import Newitemform from './newitem_form';
import currentWeekNumber from 'current-week-number';
import Sweetalert from 'sweetalert';
import * as authAction  from '../../actions/authAction';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: (blankFlag) =>
        dispatch(authAction.blankdispatch(blankFlag)),
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
            itemPrice: '',
            quantity: '',
            unit: '',
            billAddress: [],
            shippingAddress: [],
            setSippingAddress: [],
            userInfo: Auth.getUserInfo(), 
            rowId: 0,
            patternRowId: [],
            selectShippingAddress: [],
            slideItemFormFlag: false,
            slidePatternFormFlag: false,
            addRow: false,
            orderLineNumber: '',
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
            stockItemData: [],
            patternCalculateCheck:true,
            orderSubmitFlag: false,
            orderApproveFlag: false,
            docEntry: '',
            orderLineNum: 0,
            itemCustomerRefData: [],
            quantityFocusFlag: false,
            showNewItemModal: false,
            setItemCodeFlag: false
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
    
    onSubmitOrder = () => {
        this._isMounted = true;
        const { rows, currentUserInfo, customer_reference, setSippingAddress } = this.state;
        let documentLineArray = [];
        let params = [];
        if(rows){
            let lineArray = [];
            rows.map((row, index)=>{
                lineArray = {
                    ItemCode: row.ItemCode,
                    Quantity: row.order_quantity ? parseFloat(row.order_quantity) : 0,
                    U_DBS_CUSTREF: row.order_customerreference,
                    UnitPrice: row.order_price ? row.order_price : ''
                }
                documentLineArray.push(lineArray);
                return row;
            })
        }
        this.setState({pageLodingFlag: true});
        var headers = SessionManager.shared().getAuthorizationHeader();
        params = {
            "requestData": {
                "CardCode": currentUserInfo.SapCustomerCode,
                "DocDate": Common.formatDate1(new Date()),
                "DocDueDate": Common.formatDate1(new Date()),
                "NUMATCARD": customer_reference,
                "AddressExtension": {
                    "ShipToStreet": setSippingAddress.Street, 
                    "ShipToCity": setSippingAddress.City, 
                    "ShipToZipCode": setSippingAddress.ZipCode,
                    "ShipToCountry": setSippingAddress.Country
                },
                "DocumentLines": documentLineArray
            },
            "parameters": {
            }
        }
        Axios.post(API.PostOrder, params, headers)
        .then(result => {
            if(this._isMounted){
                let orderResult = [];
                orderResult[0] =  result.data;
                this.setState({docEntry: result.data.DocEntry})
                let param = {
                    "docEntry": result.data.DocEntry
                }
                Axios.post(API.PostDeliveryDate, param, headers)
                .then(result => {
                    let orderLineData = this.setOrderLineData(orderResult);
                    Axios.post(API.GetOrderExpenses, param, headers)
                    .then(result => {
                        this.setState({ orderDetailData: orderLineData[0], orderExpenses: result.data, pageLodingFlag: false, showDetailModal: true});
                    })
                })
            }
        })
        .catch(err => {
            this.setState({pageLodingFlag: false});
        });
    }

    confirmOrderLines = () => {
        let orderDetailData = this.state.orderDetailData;
        let confirmPatchParam  = [];
        let lineArray = [];
        orderDetailData.DocumentLines.map((row, index)=>{
            lineArray = {
                LineNum: row.LineNum,
                ItemCode: row.ItemCode,
                Quantity: row.InventoryQuantity ? parseFloat(row.InventoryQuantity) : 0,
            }
            confirmPatchParam.push(lineArray);
            return row;
        })
        let patchParams = {
            "requestData": {
                "DocumentLines": confirmPatchParam,
                "Confirmed": "tYES"
            },
            "parameters": {
            "p_DocEntry": this.state.docEntry
            }
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.patch(API.PatchOrder, patchParams, headers)
        .then(result => {
                Sweetalert("Success!", {
                    icon: "success",
                })
                .then((value) => {
                    history.push('/orders')
                    this.props.blankdispatch(this.props.blankFlag);
                });
                this.setState({orderApproveFlag: true, pageLodingFlag: false})
                return;
        })
    }

    setOrderLineData = (deliveriesData) => {
        let documentLineData = [];
        deliveriesData.map((data, index)=>{
            data.DocumentLines.map((documentLine, key)=>{
                if(documentLine.TreeType==="iSalesTree"){
                    documentLineData.push(documentLine);
                }
                return documentLine;
            })
            data.DocumentLines = documentLineData;
            return data;
        });
        return deliveriesData;
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
        this.setState({
            rows: rowsArr,
        });
    }

    removeOredrLine = () => {
        this.setState({slidePatternFormFlag: false, showNewItemModal: false});
    }

    searchItemForm = (itemCode, orderLineNumber) => {
        let orderLineNum  = this.state.orderLineNumber;
        this.setState({slideItemFormFlag: true, itemCode: itemCode, editPatternCalcuRow: [], orderLineNumber: orderLineNumber ? orderLineNumber : orderLineNum})
    }

    setOrderItem = (itemList) => {
        this.setState({itemData: itemList[0], itemCode: itemList[0].ItemCode, setItemCodeFlag: true}, ()=>{
            this.checkPatternCalculate(itemList[0].ItemCode);
        });
    }

    checkPatternCalculate = (itemCode) => {
        let patternCalculateCheck = this.state.patternCalculateCheck;
        this._isMounted = true;
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
            if(this._isMounted){
                if(response.U_DBS_ONDERMATEN==="Y"){
                    patternCalculateCheck = false;
                    this.setState({slidePatternFormFlag: true, stockItemData: response});
                }else{
                    patternCalculateCheck = true;
                    this.setState({pageLodingFlag: false});
                }
                this.setState({patternCalculateCheck: patternCalculateCheck})
            }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        });
    }

    setLenghQuantity = (length, calcuRowData) => {
        this.setState({itemQuantityData: length, patternCalcuRowData: calcuRowData});
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

    addOrderRow = (rowData) => {
        let rows = this.state.rows;
        rows.push(rowData);
        this.setState({rows: rows});
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
            slideItemFormFlag,
            slidePatternFormFlag,
            patternCalculateCheck,
            deliveryWeek,
            itemCustomerRefData,
            quantityFocusFlag,
            itemData,
            setItemCodeFlag
        } = this.state; 
        let showPrice = localStorage.getItem('eijf_showPrice')==="true";
        if(itemPriceData){
            rows.map((data, key)=>{
                totalAmount += data.order_price ? data.order_price*data.order_quantity*1 : 0;
                return data
            })
        }
        console.log('total', totalAmount);

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
                                
                            </Col>
                            <Col sm={3}>
                                <div className="place-order__address">
                                    <p className="address-header">{trls('Billing_Address')}</p>
                                    <p>{billAddress.City ? billAddress.Street + " " + (billAddress.StreetNo ? billAddress.StreetNo : '') : '' }</p>
                                    <p>{billAddress.City ? billAddress.ZipCode + " " + billAddress.City : ''}</p>
                                    <p>{billAddress.Country ? billAddress.Country : ''}</p>
                                </div>
                            </Col>
                            <Col sm={3} className="place-order-shipping-address">
                                <Col  className="place-order__address">
                                    <Form.Group as={Row} controlId="formPlaintextPassword" className="place-order-ship-address">
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
                                    <div >
                                        <p className="address-header">{trls('Shipping_Address')}<i className="fas fa-pen add-icon shipping-address_edit" onClick={()=>this.editShippingAddree()}></i></p>
                                        <p>{setSippingAddress.City ? setSippingAddress.Street + " " + (setSippingAddress.StreetNo ? setSippingAddress.StreetNo : '') : '' }</p>
                                        <p>{setSippingAddress.City ? setSippingAddress.ZipCode + " " + setSippingAddress.City : ''}</p>
                                        <p>{setSippingAddress.Country ? setSippingAddress.Country : ''}</p>
                                    </div>
                                </Col>
                            </Col>
                        </Row>                   
                    </Form>
                    <div className="table-responsive order-row">
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
                        {rows &&(<tbody>
                            {
                                rows.map((data,index) =>(
                                <tr id={index} key={index}>
                                    <td style={{display: "flex"}}>
                                        <Form.Control id="itemCode" type="text" name="productcode" readOnly placeholder={trls('Product_code')} defaultValue={data.ItemCode ? data.ItemCode : ''}/>
                                    </td>
                                    <td>
                                        <Form.Control type="text" name="description" className="place-order_description" readOnly defaultValue = {data.ItemName ? data.ItemName : ''} placeholder={trls('Description')} />
                                    </td>
                                    { !data.patterCalculateCheck ? (
                                        <td style={{display: "flex"}}>
                                            <Form.Control type="text" name="quantity" className="place_an_orrder-quantity-y" readOnly defaultValue={data.order_quantity ? data.order_quantity : ''} placeholder={trls('Quantity')}/>
                                            {/* <i className="fas fa-pen place-order__itemcode-icon" onClick={()=>this.calculatePattern(data, data.ItemCode, data.rowId)}></i> */}
                                        </td>
                                    ): 
                                        <td style={{display: "flex"}}>
                                            <Form.Control type="text" name="quantity" className="place_an_orrder-quantity" ref="quantity" readOnly defaultValue={data.order_quantity ? data.order_quantity : ''} placeholder={trls('Quantity')} />
                                        </td>
                                    }
                                    {showPrice ? (
                                        <td >
                                            <div style={{width:80}}>{Common.formatMoney(data.order_price ? data.order_price : '')}</div>
                                        </td>
                                    ): null}
                                    {showPrice ? (
                                        <td style={{width:100}}>
                                            {Common.formatMoney(data.order_price ? data.order_price*data.order_quantity : '')}
                                        </td> 
                                    ): null}
                                    <td>
                                        {data.Image&&(
                                            <img src={ data.Image ? "data:image/png;base64," + data.Image : ''} className = "image__zoom" alt={data.rowId}></img>
                                        ) 
                                        }
                                    </td>
                                    <td>
                                        <Form.Control type="text" name="customerReference" className="place-order_Customer-reference" readOnly defaultValue={data.order_customerreference ? data.order_customerreference : ''} placeholder={trls('Customer_reference')}/>
                                    </td>
                                    <td>
                                        {data.order_deliveryWeek ? data.order_deliveryWeek : ''}
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
                    {/* <Button variant="light" onClick={()=>this.handleAddRow(totalAmount)}><i className="fas fa-plus add-icon"></i>{trls('Click_to_make_new_row')}</Button>  */}
                    <Button variant="light" onClick={()=>this.setState({showNewItemModal: true})}><i className="fas fa-plus add-icon"></i>{trls('Click_to_make_new_row')}</Button> 
                </div>
                <Col sm={4} className="info-block info-block--green">
                    <span className="txt-bold">Order Total</span>
                    {showPrice ? (
                        <span>{Common.formatMoney(totalAmount)}</span>
                    ): null}
                   
                    {/* <Button type="button" className="place-submit__order" onClick={()=>this.onSubmitOrder(null, true)}>Submit order</Button> */}
                </Col>
                <div style={{textAlign: "right", height: 50}}>
                    <Button type="button" className="place-submit__order" onClick={()=>this.onSubmitOrder(null, true)}>Submit order</Button>
                </div>
                
            </Container>
            <Newitemform
                show={this.state.showNewItemModal}
                onHide={() => this.setState({showNewItemModal: false, itemQuantityData: '', itemData: '', patternCalculateCheck: true, setItemCodeFlag: false, itemSearchformFlag: false})}
                getItemData={()=>this.getItemData()}
                searchItemForm={(itemCode)=>this.searchItemForm(itemCode)}
                checkPatternCalculate={(itemCode)=>this.checkPatternCalculate(itemCode)}
                onSetItemCodeFlag={()=>this.setState({setItemCodeFlag: false})}
                onAddOrderRow={(rowData)=>this.addOrderRow(rowData)}
                itemQuantityData={itemQuantityData}
                itemData={itemData}
                patternCalculateCheck={patternCalculateCheck}
                slidePatternFormFlag={slidePatternFormFlag}
                setItemCodeFlag={setItemCodeFlag}
                itemSearchformFlag={slideItemFormFlag}
            />
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
                    removeOrderLine={() => this.removeOredrLine()}
                    orderLineNumber={this.state.orderLineNumber}
                    itemData={this.state.stockItemData}
                    itemCode={this.state.itemCode}
                    patternRowId={this.state.patternRowId}
                    editPatternCalcuRow={this.state.editPatternCalcuRow}
                    patternRowLengthCalcFlag={this.state.patternRowLengthCalcFlag}
                    onSetQuantity={(length, patternCalcuRowData)=>this.setLenghQuantity(length, patternCalcuRowData)}
                />
            ): null}

            <Orderdetailform
                show={this.state.showDetailModal}
                onHide={() => this.setState({showDetailModal: false, orderApproveFlag: false})}
                orderDetailData={this.state.orderDetailData}
                orderExpenses={this.state.orderExpenses}
                approveOrder={()=>this.confirmOrderLines()}
                orderApproveFlag={this.state.orderApproveFlag}
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
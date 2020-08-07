import React, {Component} from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
import "react-datepicker/dist/react-datepicker.css";
import API from '../../factories/api'
import * as Common from '../../factories/common';
import Axios from 'axios';
import * as Auth from '../../factories/auth'
import SessionManager from '../../factories/session_manage';
import $ from 'jquery';
import Pageloadspiiner from '../../components/page_load_spinner';
import history from '../../history';
import Sweetalert from 'sweetalert';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({

});

class Newitemform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        const { editOrderRowData } = this.props;
        this.state = {  
            itemCode: editOrderRowData.ItemCode ? editOrderRowData.ItemCode : '',
            itemData: [],
            itemFlag: false,
            pageLodingFlag: false,
            quantity: editOrderRowData.order_quantity ? editOrderRowData.order_quantity : '',
            customerReference: editOrderRowData.order_customerreference ? editOrderRowData.order_customerreference : '',
            itemEnable: false
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
        $(document).on('keypress', ':input', function (e) {
            if (e.which === 13) e.preventDefault();
        });
    }

    handleSubmit = (event) => {
        this.setState({pageLodingFlag: true});
        // const { patternCalculateCheck, itemQuantityData, editPatternCalcuRow } = this.props;
        const {itemQuantityData, editPatternCalcuRow } = this.props;
        const { itemFlag } = this.state;
        this._isMounted = true;
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let quantity = 0;
        // if((patternCalculateCheck && !editPatternCalcuRow.rowId) || (itemFlag&&!itemQuantityData)){
        if(!editPatternCalcuRow.rowId || (itemFlag&&!itemQuantityData)){
            quantity = parseFloat(data.quantity);
        } else if(itemQuantityData){
            quantity = parseFloat(itemQuantityData);
        }
        let params = {
            "itemCode": data.itemcode ? data.itemcode : '' ,
            "quantity": data.quantity ? quantity.toFixed(0) : 0,
            "date": Common.formatDate1(new Date()),
            "orderType": "B2B"
        };
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetDiscountPrice, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data){
                    this.getItemByDeliveryWeek(data.itemcode, quantity, result.data.NewUnitPrice, data.customerreference);
                }
            }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        });
    }

    getItemByDeliveryWeek = (itemCode, quantity, price, customerreference) => {
        // const { setItemCodeFlag, patternCalculateCheck, editOrderRowFlag, editOrderRowData } = this.props;
        const { setItemCodeFlag, editOrderRowFlag, editOrderRowData } = this.props;
        const { itemFlag } = this.state;
        
        this._isMounted = true; 
        let itemData = [];
        var settings = {
            "url": API.GetItemByDeliveryWeek+itemCode+'/'+quantity,
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+Auth.getUserToken(),
        }
        }
        $.ajax(settings).done(function () {
        })
        .then(response => {
            if(this._isMounted){
                if(!editOrderRowFlag || itemFlag) {
                    if(!setItemCodeFlag) {
                        itemData = this.state.itemData;
                    } else {
                        itemData = this.props.itemData;
                    }
                } else {
                    if(setItemCodeFlag) {
                        itemData = this.props.itemData;
                    } else {
                        itemData = editOrderRowData;
                    }
                }
                if(!itemData.ItemCode){
                    this.setState({itemEnable: false})
                    return;
                }
                itemData.order_quantity = quantity; 
                itemData.order_price = price;
                itemData.order_customerreference = customerreference;
                // itemData.patterCalculateCheck = patternCalculateCheck;
                itemData.order_deliveryWeek = response.value[0].DeliveryWeek;
                this.setState({pageLodingFlag: false});
                Sweetalert("Success!", {
                    icon: "success",
                })
                .then((value) => {
                    if(!editOrderRowFlag) {
                        this.props.onAddOrderRow(itemData); 
                    }else {
                        this.props.updateOrderRowLine(itemData);
                    }
                    this.onHide();
                });
                
            }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        });
    }

    getItemData = () => {
        this._isMounted = true;
        let itemCodeData = '';
        const { itemCode } = this.state;
        const { setItemCodeFlag, itemData } = this.props;
        if(setItemCodeFlag) {
            itemCodeData = itemData.ItemCode;
        }else{
            itemCodeData = itemCode;
        }
        let code = 0;
        if(itemCodeData!==""){
            code = itemCodeData;
        }
        this.setState({pageLodingFlag: true})
        var settings = {
            "url": API.GetSampleItemByItemCode + code,
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+Auth.getUserToken(),
        }
        }
        $.ajax(settings).done(function (response) {
        })
        .then(response => {
            this.setState({itemData: response, itemFlag: true, pageLodingFlag: false, itemEnable: true}, ()=>{
                // this.props.checkPatternCalculate(itemCodeData);
                $(".fade").attr("tabindex","disable");
            });
        })
        .catch(err => {
            this.setState({pageLodingFlag: false, itemEnable: false})
            $(".fade").attr("tabindex","disable");
            this.props.searchItemForm(itemCodeData);
        });
    }

    showSearchItem = () => {
        let itemCodeData = '';
        const { itemCode } = this.state;
        const { setItemCodeFlag, itemData } = this.props;
        if(setItemCodeFlag) {
            itemCodeData = itemData.ItemCode;
        }else{
            itemCodeData = itemCode;
        }
        this.props.searchItemForm(itemCodeData);
        $(".fade").attr("tabindex","disable");
    }

    changeItemCode = (e) => {
        this.setState({itemCode: e.target.value});
        this.props.onSetItemCodeFlag();
    }

    onHide = () => {
        this.setState({
            itemCode: '',
            itemData: [],
            itemFlag: false,
            pageLodingFlag: false,
            quantity: ''
        })
        this.props.onHide();
    }

    // editPatternCalculate = () => {
    //     $(".fade").attr("tabindex","disable");
    //     this.props.calculatePattern();
    // }

    render(){
        const { quantity, itemFlag, itemCode, pageLodingFlag, customerReference, itemEnable } = this.state;
        // const { itemQuantityData, itemData, patternCalculateCheck, setItemCodeFlag, itemSearchformFlag, slidePatternFormFlag, editPatternCalcuRow } = this.props;
        const { itemQuantityData, itemData, setItemCodeFlag, itemSearchformFlag, editPatternCalcuRow } = this.props;
        return (
            <Modal
                show={this.props.show}
                onHide={()=>this.onHide()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                tabIndex={"disable"}
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('New Item')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="itemcode" autoComplete="off" required disabled={itemSearchformFlag} value={ setItemCodeFlag ? itemData.ItemCode : itemCode} className={!itemEnable ? "place-order__product-code active" : 'place-order__product-code'} placeholder={trls('Product_code')} onChange={(e)=>this.changeItemCode(e)} onBlur={this.getItemData}/>
                            <label className="placeholder-label">{trls('Product_code')}</label>
                            <i className="fas fa-search place-an-order__loop" aria-hidden="true" onClick={()=>this.showSearchItem()}></i>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            {/* <Form.Control type="text" name="quantity" required disabled={ (!patternCalculateCheck || itemSearchformFlag) || (editPatternCalcuRow.rowId && !itemFlag) ? true : false} value={ !patternCalculateCheck || itemQuantityData ? itemQuantityData : quantity} placeholder={trls('Quantity')} onChange={(e)=>this.setState({quantity: e.target.value})}/> */}
                            <Form.Control type="text" name="quantity" required disabled={ itemSearchformFlag || (editPatternCalcuRow.rowId && !itemFlag) ? true : false} value={ itemQuantityData ? itemQuantityData : quantity} placeholder={trls('Quantity')} onChange={(e)=>this.setState({quantity: e.target.value})}/>
                            <label className="placeholder-label">{trls('Quantity')}</label>
                            {/* { editPatternCalcuRow.rowId && !itemFlag && (
                                <i className="fas fa-pen place-an-order__loop" aria-hidden="true" onClick={()=>this.editPatternCalculate()}></i>
                            )} */}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="customerreference" defaultValue={customerReference} placeholder={trls('Customer_reference')}/>
                            <label className="placeholder-label">{trls('Customer_reference')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="Submit" style={{width: "10%"}}>Submit</Button>
                    </Form.Group>
                </Form>    
            </Modal.Body>
            <Pageloadspiiner loading = {pageLodingFlag}/>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Newitemform);
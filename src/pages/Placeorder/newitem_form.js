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
        this.state = {  
            itemCode: '',
            itemData: [],
            itemFlag: false,
            pageLodingFlag: false,
            quantity: ''
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
        
    }

    handleSubmit = (event) => {
        this.setState({pageLodingFlag: true});
        const { patternCalculateCheck, itemQuantityData } = this.props;
        this._isMounted = true;
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let quantity = 0;
        if(patternCalculateCheck){
            quantity = parseFloat(data.quantity);
        } else {
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
        const { setItemCodeFlag, patternCalculateCheck } = this.props;
        
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
                if(!setItemCodeFlag) {
                    itemData = this.state.itemData;
                } else {
                    itemData = this.props.itemData;
                }
                itemData.order_quantity = quantity;
                itemData.order_price = price;
                itemData.order_customerreference = customerreference;
                itemData.patterCalculateCheck = patternCalculateCheck;
                itemData.order_deliveryWeek = response.value[0].DeliveryWeek;
                this.setState({pageLodingFlag: false});
                Sweetalert("Success!", {
                    icon: "success",
                })
                .then((value) => {
                    this.props.onAddOrderRow(itemData);
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
        const { itemCode } = this.state;
        let code = 0;
        if(itemCode!==""){
            code = itemCode;
        }
        this.setState({pageLodingFlag: true})
        var settings = {
            "url": API.GetItemDataByItemCode+'/'+code,
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+Auth.getUserToken(),
        }
        }
        $.ajax(settings).done(function (response) {
        })
        .then(response => {
            this.setState({itemData: response, itemFlag: false, pageLodingFlag: false}, ()=>{
                this.props.checkPatternCalculate(itemCode);
            });
        })
        .catch(err => {
            this.setState({itemFlag: true, pageLodingFlag: false})
            $(".fade").attr("tabindex","disable");
            this.props.searchItemForm(itemCode);
        });
    }

    showSearchItem = () => {
        const { itemCode } = this.state;
        this.props.searchItemForm(itemCode);
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

    render(){
        const { itemFlag, itemCode, pageLodingFlag, quantity } = this.state;
        const { itemQuantityData, itemData, patternCalculateCheck, setItemCodeFlag, itemSearchformFlag } = this.props;
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
                            <Form.Control type="text" name="itemcode" required disabled={itemSearchformFlag ? true : false} value={ setItemCodeFlag ? itemData.ItemCode : itemCode} className={itemFlag ? "place-order__product-code active" : 'place-order__product-code'} placeholder={trls('Product_code')} onChange={(e)=>this.changeItemCode(e)} onBlur={()=>this.getItemData()}/>
                            <label className="placeholder-label">{trls('Product_code')}</label>
                            <i className="fas fa-search place-an-order__loop" aria-hidden="true" onClick={()=>this.showSearchItem()}></i>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="quantity" required disabled={!patternCalculateCheck || itemSearchformFlag ? true : false} value={ !patternCalculateCheck ? itemQuantityData : quantity} placeholder={trls('Quantity')} onChange={(e)=>this.setState({quantity: e.target.value})}/>
                            <label className="placeholder-label">{trls('Quantity')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="customerreference" placeholder={trls('Customer_reference')}/>
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
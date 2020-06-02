import React, {Component} from 'react'
import { trls } from '../../factories/translate';
import { Container } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Form, Row, Col, Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";
import * as Common from '../../factories/common';
import * as Auth from '../../factories/auth';
import currentWeekNumber from 'current-week-number';
import Pageloadspiiner from '../../components/page_load_spinner';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
});
class Productpriceform extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            userInfo: Auth.getLoggedUserInfo(),
            showPrice: localStorage.getItem('eijf_showPrice')==="true",
            approveActive: false,
            approveLoading: false
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    approveOrder = () => {
        this.setState({approveLoading: true});
        this.props.approveOrder();
    }

    render(){
        const { userInfo, showPrice, approveActive } = this.state;
        const { orderDetailData, orderExpenses, orderApproveFlag } = this.props;
        let approveLoading = this.state.approveLoading;
        let totalAmount = 0;
        if(orderDetailData.DocumentLines){
            orderDetailData.DocumentLines.map((data, index)=>{
                totalAmount += data.OpenAmount;
                return data;
            })
        }
        if(orderExpenses.expenses){
            totalAmount += orderExpenses.expenses;
        }
        if(orderApproveFlag){
            approveLoading = false;
        }
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {trls('OrderSummary')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="order_div">
                        <Container>
                            <Form className="container product-form">
                                <Row className="order__info-bill">
                                    <Col sm={6} style={{paddingLeft: 0, paddingTop: 10}}>
                                        <Form.Group as={Row} controlId="formPlaintextPassword">
                                            <Form.Label column sm="4">
                                                {trls("Customer_reference")}  
                                            </Form.Label>
                                            <Col sm="8" className="product-text">
                                                <Form.Control type="text" name="reference" required readOnly defaultValue={orderDetailData ? orderDetailData.customerReference : ''} placeholder={trls('Customer_reference')} />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="formPlaintextPassword">
                                            <Form.Label column sm="4">
                                                {trls("Business_partner")}  
                                            </Form.Label>
                                            <Col sm="8" className="product-text">
                                                <Form.Control type="text" name="reference" required readOnly defaultValue={orderDetailData ? orderDetailData.CardName : ''} placeholder={trls('Customer_reference')} />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="formPlaintextPassword">
                                            <Form.Label column sm="4">
                                                {trls("Contact")}  
                                            </Form.Label>
                                            <Col sm="8" className="product-text">
                                                <Form.Control type="text" name="contact" readOnly required  defaultValue={userInfo ? userInfo.UserName : ''} placeholder={trls('Contact')} />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="formPlaintextPassword">
                                            <Form.Label column sm="4">
                                                    {trls("Shipping_Address")}  
                                                </Form.Label>
                                                <Col sm="8" className="product-text">
                                                    <Form.Control type="text" name="contact" readOnly defaultValue={orderDetailData.AddressExtension ? orderDetailData.AddressExtension.ShipToStreet+' '+orderDetailData.AddressExtension.ShipToZipCode+' '+orderDetailData.AddressExtension.ShipToCity+' '+orderDetailData.AddressExtension.ShipToCountry : ''} required placeholder={trls('Contact')} />
                                                </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="formPlaintextPassword">
                                            <Form.Label column sm="4">
                                                    {trls("DocDate")}  
                                                </Form.Label>
                                                <Col sm="8" className="product-text">
                                                    <Form.Control type="text" name="contact" readOnly defaultValue={orderDetailData ? Common.formatDate(orderDetailData.DocDate) : ''} required placeholder={trls('Contact')} />
                                                </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="formPlaintextPassword">
                                            <Form.Label column sm="4">
                                                    {trls("DocDueDate")}  
                                                </Form.Label>
                                                <Col sm="8" className="product-text">
                                                    <Form.Control type="text" name="contact" readOnly defaultValue={orderDetailData ? Common.formatDate(orderDetailData.DocDueDate) : ''} required placeholder={trls('Contact')} />
                                                </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6} className = "bill-shipping__address">
                                        <div className="place-order__address">
                                            <p className="address-header">{trls('Billing_Address')}</p>
                                            <p>{orderDetailData.AddressExtension ? orderDetailData.AddressExtension.BillToStreet : '' }</p>
                                            <p>{orderDetailData.AddressExtension ? orderDetailData.AddressExtension.BillToZipCode + " " + orderDetailData.AddressExtension.BillToCity : ''}</p>
                                            <p>{orderDetailData.AddressExtension ? orderDetailData.AddressExtension.BillToCountry : ''}</p>
                                        </div>
                                        <div className="place-order__address">
                                            <p className="address-header">{trls('Shipping_Address')}</p>
                                            <p>{orderDetailData.AddressExtension ? orderDetailData.AddressExtension.ShipToStreet : '' }</p>
                                            <p>{orderDetailData.AddressExtension ? orderDetailData.AddressExtension.ShipToZipCode + " " + orderDetailData.AddressExtension.ShipToCity : ''}</p>
                                            <p>{orderDetailData.AddressExtension ? orderDetailData.AddressExtension.ShipToCountry : ''}</p>
                                        </div>
                                    </Col>
                                </Row>                   
                            </Form>
                            
                            <div className="table-responsive">
                                <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable order_detail-table" width="100%">
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
                                        {/* <th>{trls("Action")}</th> */}
                                    </tr>
                                </thead>
                                {orderDetailData.DocumentLines &&(<tbody>
                                    {
                                        orderDetailData.DocumentLines.map((data,index) =>(
                                        <tr id={index} key={index}>
                                            <td style={{display: "flex"}}>
                                                <Form.Control id={"itemCode"+data.rowId} type="text" name="productcode" disabled autoComplete="off" required style={{width: '80%'}} placeholder={trls('Product_code')} defaultValue={data.ItemCode ? data.ItemCode : ''}/>
                                                <i className="fas fa-search place-order__itemcode-icon"></i>
                                            </td>
                                            <td>
                                                <Form.Control type="text" name="description" readOnly required defaultValue = {data.ItemDescription ? data.ItemDescription : ''} placeholder={trls('Description')} />
                                            </td>
                                            <td>
                                                {data.MeasureUnit ? data.MeasureUnit : ''}
                                            </td>
                                            <td>
                                                <Row style={{justifyContent: "space-around"}}>
                                                    <Form.Control type="text" name="quantity" style={{width: '80%'}} disabled required placeholder={trls('Quantity')} defaultValue = {data.InventoryQuantity ? data.InventoryQuantity : ''}/>
                                                </Row>
                                            </td>
                                            {showPrice ? (
                                                <td>
                                                    {data.Price ? Common.formatMoney(data.Price) : ''}
                                                </td> 
                                            ): null}
                                            {showPrice ? (
                                                <td>
                                                     {data.OpenAmount ? Common.formatMoney(data.OpenAmount) : ''}
                                                </td>
                                            ): null}
                                            <td>
                                                {/* {data.picture&&(
                                                    <img src={ data.Image ? "data:image/png;base64," + data.picture : ''} className = "image__zoom" alt={index}></img>
                                                ) 
                                                } */}
                                            </td>
                                            <td>
                                                <Form.Control type="text" name="customerReference" disabled required placeholder={trls('Customer_reference')} defaultValue={orderDetailData ? orderDetailData.customerReference : ''} />
                                            </td>
                                            <td>
                                                {currentWeekNumber(orderDetailData.DocumentLines[0].ShipDate )}
                                            </td>
                                        </tr>
                                    ))
                                    }
                                    {orderExpenses.expenses.length>0 && (
                                        <tr>
                                            <td style={{display: "flex"}}>
                                                <Form.Control type="text" name="productcode" autoComplete="off" required style={{width: '80%'}} placeholder={trls('Product_code')}/>
                                            </td>
                                            <td>
                                                <Form.Control type="text" name="description" readOnly required placeholder={trls('Description')} />
                                            </td>
                                            <td>
                                                {/* {data.MeasureUnit ? data.MeasureUnit : ''} */}
                                            </td>
                                            <td>
                                                <Row style={{justifyContent: "space-around"}}>
                                                    <Form.Control type="text" name="quantity" style={{width: '80%'}} disabled defaultValue={1} required placeholder={trls('Quantity')}/>
                                                </Row>
                                            </td>
                                            {showPrice ? (
                                                <td>
                                                </td>
                                            ): null}
                                            {showPrice ? (
                                                <td>
                                                    {orderExpenses.expenses ? Common.formatMoney(orderExpenses.expenses) : ''}
                                                </td> 
                                            ): null}
                                            <td>
                                                {/* {data.picture&&(
                                                    <img src={ data.Image ? "data:image/png;base64," + data.picture : ''} className = "image__zoom" alt={index}></img>
                                                ) 
                                                } */}
                                            </td>
                                            <td>
                                                <Form.Control type="text" name="customerReference" disabled required placeholder={trls('Customer_reference')} defaultValue={orderDetailData ? orderDetailData.customerReference : ''} />
                                            </td>
                                            <td>
                                                {currentWeekNumber(orderDetailData.DocumentLines[0].ShipDate )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>)}
                            </table>
                        </div>
                        <Row>
                            <Col className="place-order_summary-check-div">
                                <Form.Check type="checkbox" label={trls("No partial deliveries")} className="place-order_summary-check"/>
                                <Form.Check type="checkbox" label={trls("I agree with the Terms and Conditions")} className="place-order_summary-check" onChange={(evt)=>this.setState({approveActive: evt.target.checked})}/>
                            </Col>
                            <Col sm={4} style={{float: 'right', paddingLeft: 0, paddingRight: 0}}>
                                <div className="info-block info-block--green">
                                    <span className="txt-bold">Expenses</span>
                                    <span>{Common.formatMoney(orderExpenses.expenses)}</span>
                                </div>
                                <div className="info-block info-block--green">
                                    <span className="txt-bold">Order Total</span>
                                    <span>{Common.formatMoney(totalAmount)}</span>
                                </div>
                                <Button type="button" className="place-submit__order summary-submit" disabled={!approveActive ? true : false} onClick={()=>this.approveOrder()}>{trls("Approve order")}</Button>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Modal.Body>
            <Pageloadspiiner loading = {approveLoading}/>
        </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Productpriceform);
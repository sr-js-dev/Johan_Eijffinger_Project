import React, {Component} from 'react'
import { trls } from '../../factories/translate';
import { Container } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Form, Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { connect } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";
import * as Common from '../../factories/common';
import * as Auth from '../../factories/auth'

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
});
class Productpriceform extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            userInfo: Auth.getLoggedUserInfo()
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    render(){
        const { userInfo } = this.state;
        const { orderDetailData, orderExpenses } = this.props;
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
        
        return (
            <Modal
                show={this.props.show}
                onHide={this.onHide}
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
                                        <th>{trls("Price")}</th>
                                        <th>{trls("Amount")}</th>
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
                                                <Form.Control id={"itemCode"+data.rowId} type="text" name="productcode" autoComplete="off" required style={{width: '80%'}} placeholder={trls('Product_code')} defaultValue={data.ItemCode ? data.ItemCode : ''}/>
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
                                            <td>
                                            </td>
                                            <td>
                                                {data.OpenAmount ? Common.formatMoney(data.OpenAmount) : ''}
                                            </td>   
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
                                                <DatePicker name="startdate" className="myDatePicker" disabled dateFormat="dd-MM-yyyy" selected={new Date(data.ShipDate)} />
                                            </td>
                                            {/* <td>
                                                <Row style={{justifyContent: "space-around"}}>
                                                    <i className="fas fa-trash-alt add-icon" disabled></i>
                                                </Row>
                                            </td> */}
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
                                            <td>
                                            </td>
                                            <td>
                                                {orderExpenses.expenses ? Common.formatMoney(orderExpenses.expenses) : ''}
                                            </td>   
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
                                                <DatePicker name="startdate" className="myDatePicker" disabled dateFormat="dd-MM-yyyy" selected={new Date(orderDetailData.DocumentLines ? orderDetailData.DocumentLines[0].ShipDate : '')} />
                                            </td>
                                            {/* <td>
                                                <Row style={{justifyContent: "space-around"}}>
                                                    <i className="fas fa-trash-alt add-icon" disabled></i>
                                                </Row>
                                            </td> */}
                                        </tr>
                                    )}
                                </tbody>)}
                            </table>
                        </div>
                        <Col sm={4} style={{float: 'right', paddingLeft: 0, paddingRight: 0}}>
                            <div className="info-block info-block--green">
                                <span className="txt-bold">Order Total</span>
                                <span>{Common.formatMoney(totalAmount)}</span>
                            </div>
                        </Col>
                    </Container>
                </div>
            </Modal.Body>
        </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Productpriceform);
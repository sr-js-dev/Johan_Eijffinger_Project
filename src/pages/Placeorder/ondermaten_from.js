import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
import * as authAction  from '../../actions/authAction';
import SessionManager from '../../factories/session_manage';
import API from '../../factories/api'
import Axios from 'axios';
// import Select from 'react-select';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});
class Ondermatenform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            productSearch: [{'value': 'Description: Product with strokes', 'label': '7512-1'}, {'value': 'Product without strokes', 'label': '7513-1'}]
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
        this.props.blankdispatch();
    }

    handleSubmit = (event) => {
        this._isMounted = true;
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetUrl+'postRegistrationNumber', data, headers)
        .then(result => {
            this.props.onHide();
            this.props.onGetNumberData();
        })
    }

    onHide = () => {
        this.props.onHide() 
        this.props.blankdispatch();
    }
    
    render(){
        return (
            <Modal
                show={this.props.show}
                onHide={this.onHide}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Ondermaten
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={9}>
                        <Form className="container product-form" onSubmit = { this.handleSubmit }>
                            <Form.Group as={Row} controlId="email">
                                <Form.Label column sm="2">
                                {trls('OrderNumber')}   
                                </Form.Label>
                                <Col sm="4" className="product-text input-div">
                                    <Form.Control type="text" name="role" className="input-text" disabled defaultValue={"19000089"} required placeholder={trls('OrderNumber')} />
                                </Col>
                                <Form.Label column sm="2">
                                {trls('Order_rule')}   
                                </Form.Label>
                                <Col sm="4" className="product-text input-div" style={{paddingRight: 0}}>
                                    <Form.Control type="text" name="role" className="input-text"  disabled defaultValue={"1"} required placeholder={trls('Order_rule')} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="email">
                            <Form.Label column sm="2">
                                {trls('Product_code')}   
                                </Form.Label>
                                <Col sm="10" className="product-text input-div">
                                    <Form.Control type="text" name="role" className="input-text" disabled defaultValue={"0194"} required placeholder={trls('Product_code')} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="email">
                                <Form.Label column sm="2">
                                {trls('Description')}   
                                </Form.Label>
                                <Col sm="10" className="product-text input-div">
                                    <Form.Control type="text" name="role" className="input-text" disabled defaultValue={"ALFORD"} required placeholder={trls('Description')} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="email">
                                <Form.Check type="checkbox" label={trls('Verspringend')} />
                                <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>{trls("Jobs")}</th>
                                            <th>{trls("Length_specified")}</th>
                                            <th>{trls("Length_calculated")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td>2</td>
                                            <td>2,540</td>
                                            <td>5.4 <i className="fas fa-calculator" style={{float: 'right', cursor: 'pointer'}}></i></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr style={{backgroundColor: "green"}}>
                                            <td>total</td>
                                            <td></td>
                                            <td></td>
                                            <td>54</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col sm="4" className="product-text input-div">
                                    <Button style={{width: "100%"}} variant="secondary">{trls('Add_stroke')}</Button>
                                </Col>
                                <Col sm="4" className="product-text input-div">
                                    <Button style={{width: "100%"}} variant="secondary">{trls('Remove_stroke')}</Button>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col sm="4" className="product-text input-div">
                                    <Button style={{width: "100%"}} variant="secondary">{trls('Calculate_pattern_length')}</Button>
                                </Col>
                                <Col sm="4" className="product-text input-div">
                                    <Button style={{width: "100%"}} variant="secondary">{trls('Processing')}</Button>
                                </Col>
                                <Col sm="4" className="product-text input-div">
                                    <Button style={{width: "100%"}} variant="primary">{trls('Cancel')}</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col>
                        <Form.Group as={Row} controlId="email">
                            <Form.Label column sm="4">
                                {trls('Pattern')}   
                            </Form.Label>
                            <Col sm="8" className="product-text input-div">
                                <Form.Control type="text" name="role" className="input-text" disabled defaultValue={"0194"} required placeholder={trls('Product_code')} />
                                <p style={{paddingTop: 10}}>2 X 27 = 54</p>
                                <p>2 X 27 = 54</p>
                                <p>3 X 27 = 81</p>
                                <p>4 X 27 = 108</p>
                                <p>5 X 27 = 135</p>
                                <p>6 X 27 = 162</p>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Ondermatenform);
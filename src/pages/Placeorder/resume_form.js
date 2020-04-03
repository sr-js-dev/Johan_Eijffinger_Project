import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { trls } from '../../components/translate';
import * as authAction  from '../../actions/authAction';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
// import Select from 'react-select';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});
class Resumeform extends Component {
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
        console.log('123132');
        this.props.onHide() 
        this.props.blankdispatch();
    }
    
    render(){
        return (
            <Modal
                show={this.props.show}
                onHide={this.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Resume')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row}>
                        <div style={{fontWeight: "bold", paddingRight: 20}}>Customer Name:</div>
                        <div>Frankfurt</div>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <div style={{fontWeight: "bold", paddingRight: 20}}>Address:</div>
                        <div>Neue Mainzer Str. 52-58, 60311 Frankfurt am Main Germany</div>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th>{trls("Product_image")}</th>
                                    <th>{trls("Product")}</th>
                                    <th>{trls("Quantity")}</th>
                                    <th>{trls("Amount")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><img src="https://eijffinger-585084.c.cdn77.org/content/images/thumbs/000/0009596_pip-studio-5_480.png" style={{width: 25}} alt={'img1'}/></td>
                                    <td>2758</td>
                                    <td>10</td>
                                    <td>€ 200</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Allowance</td>
                                    <td>1</td>
                                    <td>€ 10,-</td>
                                </tr>
                                <tr style={{backgroundColor: "green"}}>
                                    <td>total</td>
                                    <td></td>
                                    <td></td>
                                    <td>210</td>
                                </tr>
                            </tbody>
                        </table>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm="6" className="product-text input-div" style={{textAlign: 'center'}}>
                            <Form.Check type="checkbox" label={trls('Accept_delivery')} />
                        </Col>
                        <Col sm="6" className="product-text input-div" style={{textAlign: 'center'}}>
                            <Form.Check type="checkbox" label={trls('No_partial_deliveries')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm="6" className="product-text input-div" style={{textAlign: 'center'}}>
                            <Button variant="primary" onClick={()=>this.onHide()} ><i className="fas fa-undo" style={{paddingRight:5}} ></i>{trls('Go_back_to_the_order')}</Button>
                        </Col>
                        <Col sm="6" className="product-text input-div" style={{textAlign: 'center'}}>
                            <Button type="submit" variant="primary" ><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Submit_Order')}</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Resumeform);
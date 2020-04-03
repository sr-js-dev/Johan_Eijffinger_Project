import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { trls } from '../../components/translate';
import * as authAction  from '../../actions/authAction';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import Select from 'react-select';
import Ondermatenform from './ondermaten_from';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});
class Productsearchform extends Component {
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
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Collection_or_historical_orders')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Product')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Select
                                name="search"
                                // arrowRenderer={"<i class='fas fa-search'></i>"}
                                options={this.state.productSearch}
                                placeholder={trls('Search')}
                                onChange={()=>this.setState({modalondermantenShow: true})}
                                // options={this.state.productSearch}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" variant="primary" style={{width:"100px"}}><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Ondermatenform
                show={this.state.modalondermantenShow}
                onHide={() => this.setState({modalondermantenShow: false})}
            />
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Productsearchform);
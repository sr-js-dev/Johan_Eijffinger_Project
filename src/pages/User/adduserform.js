import React, {Component} from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
import * as authAction  from '../../actions/authAction';
import SessionManager from '../../factories/session_manage';
import API from '../../factories/api'
import Axios from 'axios';
import { trls } from '../../factories/translate';
import * as Common from '../../factories/common';

const mapStateToProps = state => ({ 
    ...state.auth,
});
const mapDispatchToProps = (dispatch) => ({
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
    removeState: () =>
        dispatch(authAction.blankdispatch()),
});
class Adduserform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            roles:[{"value":"Administrator","label":"Administrator"},{"value":"Customer","label":"Customer"}],
            val1:'',
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
    }

    handleSubmit = (event) => {
        this._isMounted = true;
        var headers = SessionManager.shared().getAuthorizationHeader();
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let params = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            userCode: data.userCode,
            customerCode: data.customerCode,
            roles:[data.roles]
        }        
        if(this.props.mode==="add"){
            Axios.post(API.PostUserData, params, headers)
            .then(result => {
                if(this._isMounted){
                    this.props.onGetUser()
                    this.onHide();
                    this.props.removeState();
                }
            })
            .catch(err => {
            });
        }else{
            params = {
                "firstName": data.firstName,
                "lastName": data.lastName,
                "userCode": data.userCode,
                "customerCode": data.customerCode,
                "roles": [data.roles]
              }
            headers = SessionManager.shared().getAuthorizationHeader();
            Axios.put(API.PostUserUpdate+this.props.userUpdateData.id, params, headers)
            .then(result => {
                this.props.onGetUser()
                this.onHide();
                this.props.removeState();
            })
            .catch(err => {
            });
        }
    }

    getRoles (value) {
        this.setState({val1:value.value})
    }
    
    onHide = () => {
        this.props.onHide();
        Common.hideSlideForm();
    }

    render(){   
        const { userUpdateData, mode } = this.props;
        return (
            <div className = "slide-form__controls open" style={{height: "100%"}}>
                <div style={{marginBottom:30}}>
                    <i className="fas fa-times slide-close" style={{ fontSize: 20, cursor: 'pointer'}} onClick={()=>this.onHide()}></i>
                </div>
                <Form className="container" onSubmit = { this.handleSubmit }>
                    <Col className="title add-product">{mode!=="update" ? trls('Add_User') : trls('Edit_User')}</Col>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="email" name="email" defaultValue={mode==="update" ? userUpdateData.email : ''} required placeholder={trls('Email')}/>
                            <label className="placeholder-label">{trls('Email')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="firstName" defaultValue={mode==="update" ? userUpdateData.firstName : ''} required placeholder={trls('FirstName')}/>
                            <label className="placeholder-label">{trls('FirstName')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="lastName" defaultValue={mode==="update" ? userUpdateData.lastName : ''} required placeholder={trls('LastName')}/>
                            <label className="placeholder-label">{trls('LastName')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="number" name="userCode" required placeholder={trls('UserCode')}/>
                            <label className="placeholder-label">{trls('UserCode')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="number" name="customerCode" required placeholder={trls('CustomerCode')}/>
                            <label className="placeholder-label">{trls('CustomerCode')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                        <Col>
                            <Select
                                name="roles"
                                placeholder={trls('Roles')}
                                options={this.state.roles}
                                onChange={val => this.setState({val1: val})}
                                defaultValue = {[{'label': userUpdateData.roles[0].name, 'value': userUpdateData.roles[0].name}]}
                            />
                            <label className="placeholder-label">{trls('Roles')}</label>
                            {!this.props.disabled&&this.props.mode==="add" && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity: 0, height: 0 }}
                                    value={this.state.val1}
                                    required
                                />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group >
                        <Col>
                            <Button type="submit" style={{width:"100px"}}>{trls('Save')}</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Adduserform);
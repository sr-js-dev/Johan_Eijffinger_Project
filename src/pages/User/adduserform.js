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
        var headers = SessionManager.shared().getAuthorizationHeader();
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        if(this.props.mode==="add"){
            Axios.post(API.PostUserData, data, headers)
            .then(result => {
                this.props.onGetUser()
                this.onHide();
                this.props.removeState();
            })
            .catch(err => {
            });
        }else{
            // params = {
            //     "Id": this.props.userID,
            //     "PhoneNumber": data.PhoneNumber,
            //     "RoleName": data.roles,
            // }
            // headers = SessionManager.shared().getAuthorizationHeader();
            // Axios.put( "https://cors-anywhere.herokuapp.com/"+API.PostUserUpdate, params, headers)
            // .then(result => {
            //     this.props.onGetUser()
            //     this.onHide();
            //     this.setState({selectflag:true})
            //     this.props.removeState();
            // })
            // .catch(err => {
            // });
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
        let updateData = [];
        let roles = [];
        // let roledata=''
        if(this.props.userUpdateData){
            updateData=this.props.userUpdateData;
            roles = updateData.roles;
            if(roles){
                // roledata=roles[0].name;
            }
        }
        return (
            <div className = "slide-form__controls open" style={{height: "100%"}}>
                <div style={{marginBottom:30}}>
                    <i className="fas fa-times slide-close" style={{ fontSize: 20, cursor: 'pointer'}} onClick={()=>this.onHide()}></i>
                </div>
                <Form className="container" onSubmit = { this.handleSubmit }>
                    <Col className="title add-product">{trls('Add_User')}</Col>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="email" name="email" defaultValue={this.props.mode==="update" ? updateData.Email : ''} required placeholder={trls('Email')}/>
                            <label className="placeholder-label">{trls('Email')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="firstName" required placeholder={trls('FirstName')}/>
                            <label className="placeholder-label">{trls('FirstName')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="lastName" required placeholder={trls('LastName')}/>
                            <label className="placeholder-label">{trls('LastName')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="userCode" required placeholder={trls('UserCode')}/>
                            <label className="placeholder-label">{trls('UserCode')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="customerCode" required placeholder={trls('CustomerCode')}/>
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
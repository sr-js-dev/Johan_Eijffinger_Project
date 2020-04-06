import { Link } from 'react-router-dom';
import React from 'react';
import * as authAction  from '../../actions/authAction';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Message from '../../components/message';
import { trls } from '../../factories/translate';
import SessionManager from '../../factories/session_manage';
import API from '../../factories/api'
import Axios from 'axios';
import history from '../../history';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
    removeState: () =>
        dispatch(authAction.blankdispatch()),
});

class Resetpassword extends React.Component {

    componentDidMount() {
        let token = this.getUrlParameter('token', window.location.href);
        let email = this.getUrlParameter('email', window.location.href);
        this.setState({token: token})
        this.setState({email: email})
    }
    getUrlParameter = (name, url) => {
        name = name.replace(/\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&]*)');
        var results = regex.exec(url);
        return results === null ? '' : results[1];
    }
    handleSubmit = (event) => {
        this.props.removeState();
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        var params = {
            "email": this.state.email,
            "password": data.password,
            "confirmPassword": data.confirmpassword,
            "token": this.state.token
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostResetPassword, params, headers)
        .then(result => {
            history.push('/login')
        })
        .catch(err => {
            if(err.response.data.errors){
                if(err.response.data.errors.Password)
                    this.props.postUserError(err.response.data.errors.Password[0])
                else if(err.response.data.errors.ConfirmPassword)
                    this.props.postUserError(err.response.data.errors.ConfirmPassword)
            }else{
                this.props.postUserError(err.response.data.InvalidToken[0])
            }
            
        });
    }
    render() {
        return (
            <div className="container">
                <div className="col-xl-5 col-lg-7 col-md-12  vertical-center">
                    <Row>
                    <div className="login-side-div">
                        <img src='https://www.eijffinger.com/Themes/Eijffinger/Content/images/logo.svg' alt="appzmakerz" className="login-logo-img"></img>
                    </div>
                    <Col>
                        <Form className="container login-form" onSubmit = { this.handleSubmit }>
                            <p className="login-title">Reset Password</p>
                            <Form.Group controlId="form">
                                <Col className="login-form__control">
                                    <Form.Control type="password" name="password" className="login-input-email" required placeholder={trls("New_Password")}/>
                                    <label className="placeholder-label__login">{trls('New_Password')}</label>
                                </Col>
                            </Form.Group>
                            <Form.Group controlId="form">
                                <Col className="login-form__control">
                                    <Form.Control type="password" name="confirmpassword" className="login-input-email" required placeholder={trls("Confirm_Password")}/>
                                    <label className="placeholder-label__login">{trls('Confirm_Password')}</label>
                                </Col>
                            </Form.Group>
                            <p className="text-xs-center" style={{textAlign: "center"}}>
                                <Link to="/login" className="back-to_signin">
                                    {trls("Back_to_Sign_in")}
                                </Link>
                            </p>
                            <Button variant="primary" type="submit" style={{width: "100%", height: 42}} onClick={()=>this.setState({modalResumeShow: true})}>{trls('Save')}</Button>
                            <Message message={this.props.error} type={"error"}/>
                        </Form>
                    </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resetpassword);

import { Link } from 'react-router-dom';
import React from 'react';
import * as authAction  from '../../actions/authAction';
import { connect } from 'react-redux';
import { Row, Col, Form } from 'react-bootstrap';
import ListErrors from '../../components/listerrors';
import { trls } from '../../components/translate';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import queryString from 'query-string'
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
        let search = window.location.search;
        let query = queryString.parse(search);
        var res = search.split("&");
        var codearray=res[0].split("=")
        this.setState({code:codearray[1]})
        this.setState({email:query.email})
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }

    var params = {
        "email": this.state.email,
        "password": data.password,
        "confirmPassword": data.confrmpassword,
        "code": this.state.code
    }
    var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostResetPassword, params, headers)
        .then(result => {
            history.push('/login')
        })
        .catch(err => {
            if(err.response.data.ConfirmPassword)
                this.props.postUserError(err.response.data.ConfirmPassword)
            else if(err.response.data.Password)
                this.props.postUserError(err.response.data.Password)
        });
    }
    render() {
        return (
            <div className="auth-page" style={{height:"100%"}}>
            <div className="container login-page">
                <div className="row addQuestion">
                <div className="col-md-5 offset-md-1 col-xs-12  vertical-center">
                    <Row style={{height:"100%",width:"100%"}}>
                        <div className="login-side-div">
                        </div>
                        <Col  className="login-form-div">
                            <img src='https://www.eijffinger.com/Themes/Eijffinger/Content/images/logo.svg' alt="appzmakerz" style={{marginTop:"70px"}}></img>
                            {/* <form className="login-form" onSubmit = { this.handleSubmit }>
                                <ListErrors errors={this.props.error} />
                                <fieldset>  
                                    <fieldset className="form-group">
                                        <input type="password" name="password" className="orders__filters-search input-password" placeholder={trls("New_Password")}/>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <input type="password" name="confrmpassword" className="orders__filters-search input-password" placeholder={trls("Repeat")}/>
                                    </fieldset>
                                    <p className="text-xs-center">
                                        <Link to="/login" style={{color:"rgb(84, 79, 79)"}}>
                                            {trls("Back_to_Sign_in")}
                                        </Link>
                                    </p>
                                    <button type="submit" className="btn-small place-and-orders__add-row-btn add-row sign-in">{trls("Next_Step")}</button>
                                </fieldset>
                            </form> */}
                            <Form className="container login-form" onSubmit = { this.handleSubmit }>
                                <ListErrors errors={this.props.error} />
                                <Form.Group as={Row} controlId="form">
                                    <Form.Control type="password" name="password" className="login-input-email" placeholder={trls("New_Password")}/>
                                </Form.Group>
                                <Form.Group as={Row} controlId="form">
                                    <Form.Control type="password" name="confrmpassword" className="login-input-password" placeholder={trls("Confirm_Password")}/>
                                </Form.Group>
                                <p className="text-xs-center">
                                    <Link to="/login" style={{color:"white"}}>
                                    {trls("Back_to_Sign_in")}
                                    </Link>
                                </p>
                                <button type="submit" className="btn-small place-and-orders__add-row-btn add-row sign-in">{trls("Next_Step")}</button>
                            </Form>
                        </Col>
                    </Row>
                </div>
                </div>
            </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resetpassword);

import { Link } from 'react-router-dom';
import React from 'react';
// import * as authAction  from '../../actions/authAction';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Message from '../../components/message';
import { trls } from '../../factories/translate';
import API from '../../factories/api'
import $ from 'jquery';
import * as Auth from '../../factories/auth';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    // authLogin: (params) =>
    //           dispatch(authAction.fetchLoginData(params)),
});

class Forgotpassword extends React.Component {

  constructor() {   
    super();
    this.state = {  
      sendEamilFlag: false,
      userInfo: Auth.getUserInfo(),
      loginUser: false
    };
  }

  componentDidMount() {
    let loginUser = this.getUrlParameter('loginUser', window.location.href);
    this.setState({loginUser: loginUser})
}
getUrlParameter = (name, url) => {
    name = name.replace(/\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&]*)');
    var results = regex.exec(url);
    return results === null ? '' : results[1];
}

  handleSubmit = (event) => {
    const { loginUser, userInfo } = this.state
    this.setState({sendEamilFlag: false});
    event.preventDefault();
    const clientFormData = new FormData(event.target);
    const data = {};
    for (let key of clientFormData.keys()) {
        data[key] = clientFormData.get(key);
    }
    var settings = {
      "url": !loginUser ? API.PostForgotPassEmail+data.email : API.PostForgotPassEmail+userInfo.userName ,
      "method": "post",
      "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+Auth.getUserToken(),
    }
    }
    $.ajax(settings).done(function (response) {
    })
    .then(response => {
      this.setState({sendEamilFlag: true})
    });
  }
  render() {
    const { sendEamilFlag, userInfo,  loginUser} = this.state;
    return (
      <div className="container">
          <div className="col-xl-5 col-lg-7 col-md-12  vertical-center">
              <Row>
                  <div className="login-side-div">
                      <img src='https://www.eijffinger.com/Themes/Eijffinger/Content/images/logo.svg' alt="appzmakerz" className="login-logo-img"></img>
                  </div>
                  <Col>
                      <Form className="container login-form" onSubmit = { this.handleSubmit }>
                          <p className="login-title">Enter Email</p>
                          <Form.Group controlId="form">
                              <Col className="login-form__control">
                                {loginUser ? (
                                  <Form.Control type="email" name="email" className="login-input-email" disabled defaultValue={loginUser ? userInfo.userName : ''} required placeholder={trls("Enter_email")}/>
                                ):
                                  <Form.Control type="email" name="email" className="login-input-email" required placeholder={trls("Enter_email")}/>
                                }
                                  <label className="placeholder-label__login">{trls('Enter_email')}</label>
                              </Col>
                          </Form.Group>
                          <p className="text-xs-center" style={{textAlign: "center"}}>
                              <Link to="/login" className="back-to_signin">
                                  {trls("Back_to_Sign_in")}
                              </Link>
                          </p>
                          <Button variant="primary" type="submit" style={{width: "100%", height: 42}} onClick={()=>this.setState({modalResumeShow: true})}>{trls('Next_Step')}</Button>
                          <Message message={sendEamilFlag ? "Done! Please check your email": ''} type={"success"}/>
                      </Form>
                  </Col>
              </Row>
          </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Forgotpassword);

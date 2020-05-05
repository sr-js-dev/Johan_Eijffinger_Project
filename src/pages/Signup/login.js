import { Link } from 'react-router-dom';
import React from 'react';
import * as authAction  from '../../actions/authAction';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Message from '../../components/message';
import { trls } from '../../factories/translate';
import Pageloadspiiner from '../../components/page_load_spinner';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    authLogin: (params) =>
              dispatch(authAction.fetchLoginData(params)),
    changeLan: (params) =>
              dispatch(authAction.changeLan(params)),
});

class Login extends React.Component {
  
  constructor() {   
    super();
    this.state = {  
     
    };
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const clientFormData = new FormData(event.target);
    const data = {};
    for (let key of clientFormData.keys()) {
        data[key] = clientFormData.get(key);
    }
    this.props.authLogin(data);
  }

  changeLangauge = (val) => {
    this.setState({selectrolvalue:val.value, selectrollabel: val.label});
    this.props.changeLan(val)
  }

  changeShowPrice = (evt) => {
      localStorage.setItem('eijf_showPrice', evt.target.checked);
  }

  render() {
    const { loading } = this.props;
    return (
      <div className="container">
          <div className="col-xl-5 col-lg-7 col-md-12  vertical-center">
              <Row>
                <div className="login-side-div">
                  <img src='https://www.eijffinger.com/Themes/Eijffinger/Content/images/logo.svg' alt="appzmakerz" className="login-logo-img"></img>
                </div>
                <Col>
                  <Form className="container login-form" onSubmit = { this.handleSubmit }>
                      <p className="login-title">Log In</p>
                      <Form.Group controlId="form">
                          <Col className="login-form__control">
                            <Form.Control type="text" name="username" className="login-input-email" placeholder={trls("Email")}/>
                            <label className="placeholder-label__login">{trls('Email')}</label>
                          </Col>
                      </Form.Group>
                      <Form.Group controlId="form">
                          <Col className="login-form__control">
                            <Form.Control type="password" name="password" className="login-input-password" placeholder={trls("Password")}/>
                            <label className="placeholder-label__login">{trls('Password')}</label>
                          </Col>
                      </Form.Group>
                      <Form.Group controlId="form">
                          <Form.Check type="checkbox" label={trls('ShowPrice')} style={{color: '#B9C0CE'}} onChange={(evt)=>this.changeShowPrice(evt)}/>
                      </Form.Group>
                      <Button variant="primary" type="submit" style={{width: "100%", height: 42}} onClick={()=>this.setState({modalResumeShow: true})}>{trls('Sign_in')}</Button>
                      <p className="text-xs-center" style={{marginTop: 10}}>
                          <Link to="/forgot-password" className="back-to_signin">
                              {trls("Forgot_password")}
                          </Link>
                      </p>
                      <Message message={this.props.error} type={"error"}/>
                  </Form>
                </Col>
              </Row>
          </div>
          <Pageloadspiiner loading = {loading}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

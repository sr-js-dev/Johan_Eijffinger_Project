import { Link } from 'react-router-dom';
import React from 'react';
import * as authAction  from '../../actions/authAction';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Message from '../../components/message';
import { trls } from '../../factories/translate';
import Pageloadspiiner from '../../components/page_load_spinner';
import Select from 'react-select';

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
      roles:[{"value":"en_US","label":"English"},{"value":"nl_BE","label":"Dutch"},{"value":"de_DE","label":"German"},{"value":"fr_FR","label":"French"}],
      selectrolvalue:window.localStorage.getItem('eijf_lang'),
      selectrollabel:window.localStorage.getItem('eijf_label')
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
                      <p className="login-title">Log In</p>
                      <Form.Group controlId="form" style={{textAlign:'left'}}>
                          <Select
                              name="lan"
                              options={this.state.roles}
                              className="login-select-lang-class"
                              value={{"label":this.state.selectrollabel,"value":this.state.selectrolvalue}}
                              onChange={val => this.changeLangauge(val)}
                          />
                      </Form.Group>
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
                          <Form.Check type="checkbox" label={trls('keep_logged_in')} style={{color: '#B9C0CE'}}/>
                      </Form.Group>
                      <Button variant="primary" type="submit" style={{width: "100%", height: 42}} onClick={()=>this.setState({modalResumeShow: true})}>{trls('Sign_in')}</Button>
                      <div className="login-have__account">
                          <p>Don't have account?</p><span style={{marginLeft: 10}}><Link to="/forgot-password" style={{color:"#666666"}}>{trls("Sign_up")}</Link></span>
                      </div>
                      <Message message={this.props.error} type={"error"}/>
                  </Form>
                </Col>
              </Row>
          </div>
          <Pageloadspiiner/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

import { Link } from 'react-router-dom';
import React from 'react';
// import * as authAction  from '../../actions/authAction';
import { connect } from 'react-redux';
import { Row, Col, Form } from 'react-bootstrap';
import ListErrors from '../../components/listerrors';
import { trls } from '../../components/translate';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    // authLogin: (params) =>
    //           dispatch(authAction.fetchLoginData(params)),
});

class Forgotpassword extends React.Component {
//   constructor() {   
//     super();
//     };
  handleSubmit = (event) => {
    event.preventDefault();
    const clientFormData = new FormData(event.target);
    const data = {};
    for (let key of clientFormData.keys()) {
        data[key] = clientFormData.get(key);
    }
    
    var params = {
        "email": data.email,
        "resetPasswordBaseUrl": "https://portal.tekwoods.nl/reset-password"
      }
    var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostForgotPassEmail, params, headers)
        .then(result => {
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
                                  <input type="text" name="email" className="orders__filters-search input-email" placeholder={trls("Enter_email")}/>
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
                            <Form.Control type="text" name="email" className="login-input-email" placeholder={trls("Enter_email")}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Forgotpassword);

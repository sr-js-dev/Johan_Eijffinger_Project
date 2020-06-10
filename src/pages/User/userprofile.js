import React from 'react';
import * as authAction  from '../../actions/authAction';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Message from '../../components/message';
import { trls } from '../../factories/translate';
import SessionManager from '../../factories/session_manage';
import * as Auth from '../../factories/auth';
import API from '../../factories/api'
import Axios from 'axios';
import history from '../../history';
import Select from 'react-select';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: (blankFlag) =>
        dispatch(authAction.blankdispatch(blankFlag)),
});

class Userprofile extends React.Component {

    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {
            languageOption: [{"value":"English","label":"English"},{"value":"Dutch","label":"Dutch"},{"value":"German","label":"German"},{"value":"French","label":"French"}],
            loggedinUserInfo: Auth.getLoggedUserInfo(),
            showPrice: localStorage.getItem('eijf_showPrice')
        };
    }

    componentDidMount() {
      
    }

    handleSubmit = (event) => {
        const { loggedinUserInfo } = this.state; 
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let params = {
            firstName: data.firstName,
            lastName: data.lastName,
            language: data.language,
            userCode: loggedinUserInfo.UserCode,
            customerCode: loggedinUserInfo.SapCustomerCode,
            roles: [loggedinUserInfo.Role],
            showPrice: localStorage.getItem('eijf_showPrice')==="true" ? true : false
          }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.put(API.LoggedUserProfileUpdate, params, headers)
        .then(result => {
            loggedinUserInfo.FirstName = data.firstName;
            loggedinUserInfo.LastName = data.lastName;
            localStorage.setItem('eijf_loggedUser', JSON.stringify(loggedinUserInfo));
            localStorage.setItem('eijf_lang',  data.language);
            localStorage.setItem('eijf_label',  data.language);
            this.props.onHide();
            this.props.blankdispatch(this.props.blankFlag);
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        })
    }

    changeShowPrice = (evt) => {
        localStorage.setItem('eijf_showPrice', evt.target.checked);
        // this.props.blankdispatch(this.props.blankFlag);
    }

    // gotoPreviousPage = () =>{
    //     history.goBack();
    // }
    
    closeProfilePage = () =>{
        this.props.onHide();
    }

    render() {
        const { languageOption, loggedinUserInfo } = this.state;
        let selectLang = localStorage.getItem('eijf_lang');
        let showPrice = localStorage.getItem('eijf_showPrice')==="true";
        let setUserLang = languageOption.filter((item, key)=>item.value===selectLang);
        return (
            <div className="slide-form__controls open user-profile">
                <div className="col-xl-5 col-lg-7 col-md-12  vertical-center">
                    <Row>
                        <div className="login-side-div">
                            <img src='https://www.eijffinger.com/Themes/Eijffinger/Content/images/logo.svg' alt="appzmakerz" className="login-logo-img"></img>
                        </div>
                        <Col>
                            <div className="profile-back__icon" style={{textAlign: "right"}}>
                                <i className="fas fa-undo-alt add-icon" onClick={()=>this.closeProfilePage()}></i>
                            </div>
                            <Form className="container login-form" onSubmit = { this.handleSubmit }>
                                <p className="profile-title">{trls('Profile')}</p>
                                <Form.Group controlId="form">
                                    <Col className="login-form__control">
                                        <Form.Control type="text" name="username" className="login-input-email" required readOnly defaultValue={loggedinUserInfo.UserName} placeholder={trls("Username")}/>
                                        <label className="placeholder-label__login">{trls('Username')}</label>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="form">
                                    <Col className="login-form__control">
                                        <Form.Control type="text" name="firstName" className="login-input-email" required defaultValue={loggedinUserInfo.FirstName} placeholder={trls("FirstName")}/>
                                        <label className="placeholder-label__login">{trls('FirstName')}</label>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="form">
                                    <Col className="login-form__control">
                                        <Form.Control type="text" name="lastName" className="login-input-email" required defaultValue={loggedinUserInfo.LastName} placeholder={trls("LastName")}/>
                                        <label className="placeholder-label__login">{trls('LastName')}</label>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="form">
                                    <Col className="login-form__control">
                                        <Form.Control type="text" name="customername" className="login-input-email" required readOnly defaultValue={loggedinUserInfo.SapCustomerName} placeholder={trls("CustomerName")}/>
                                        <label className="placeholder-label__login">{trls('CustomerName')}</label>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="form">
                                    <Col className="login-form__control">
                                        <Select
                                            name="language"
                                            placeholder={123}
                                            options={languageOption}
                                            onChange={val => this.setState({val2: val})}
                                            defaultValue = {setUserLang}
                                        />
                                        <label className="placeholder-label__login">{trls('Language')}</label>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId="form">
                                    <Form.Check type="checkbox" label={trls('ShowPrice')} style={{color: '#B9C0CE'}} defaultChecked={showPrice} onChange={(evt)=>this.changeShowPrice(evt)}/>
                                </Form.Group>
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

export default connect(mapStateToProps, mapDispatchToProps)(Userprofile);

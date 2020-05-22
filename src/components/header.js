import React, {Component} from 'react'
import * as authAction  from '../actions/authAction';
import { Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import history from '../history';
import * as Auth from '../factories/auth';
import $ from 'jquery';
import { Button } from 'react-bootstrap';
import { trls } from '../factories/translate';
import * as Common from '../factories/common';
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import Userprofile from '../pages/User/userprofile'

const mapStateToProps = state => ({ 
    ...state.auth,
});
const mapDispatchToProps = (dispatch) => ({
    changeLan: (params) =>
        dispatch(authAction.changeLan(params)),
    setUserType: (param) =>
        dispatch(authAction.userType(param)),
});
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang:  [{"value":"English","label":"US"},{"value":"Dutch","label":"NL"},{"value":"German","label":"DE"},{"value":"French","label":"FR"}],
            selectLangValue: window.localStorage.getItem('eijf_lang'),
            userInfo: Auth.getUserInfo(),
            userType: this.props.userType,
            loggedUserInfo: Auth.getLoggedUserInfo(),
            userProfileSlide: false
        };
    }

    componentWillReceiveProps = nextProps => {
        this.setState({
            userType: nextProps.userType
        });
    };

    componentDidMount () {
        $(".header__burger-btn").click(function() {
            $(".header__burger-btn").toggleClass("open")
            $(".sidebar").toggleClass("open")
        })
        $(".header__user").click(function() {
            $(".header__controls").toggleClass("open")
        })
    }
    logOut = () => {
        var removeFlag = Auth.removeAuth();
        if(removeFlag){
            history.push('/login')
        }
    }
    changeItem = (mode) => {
        if(mode==="resetPassword"){
            history.push('/forgot-password?loginUser=true');
        }else if(mode==="profile"){
            this.setUserProfile();
        }
        
    }
    goBackAdmin = () => {
        const info = Auth.getAdminInfo();
        window.localStorage.setItem('eijf_token', info.userToken);
        window.localStorage.setItem('eijf_userName', info.userName);
        window.localStorage.setItem('eijf_role', info.role);
        this.setState({userInfo : Auth.getUserInfo()});
        this.props.setUserType("admin");
    }

    changeLangauge = (val) => {
        let lang = this.state.lang;
        lang = lang.filter((item, key)=>item.label===val);
        this.props.changeLan(lang[0]);
    }

    setUserProfile = () => {
        this.setState({userProfileSlide: true})
        Common.showSlideForm();
    }

    closeProfilePaga = () => {
        this.setState({userProfileSlide: false})
        Common.hideSlideForm();
    }

    render () {
        const { loggedUserInfo, lang, selectLangValue } = this.state;
        let selectLang = lang.filter((item, key)=>item.value===selectLangValue);
      return (
        <div>
            <header className="header">
                <div className="header__burger-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <a href="/" className="header__logo-mob">
                    <img title="" className="Logo--mobile" alt="Eijffinger Nederland" src="https://www.eijffinger.com/Themes/Eijffinger/Content/images/logo--mobile.svg"/>
                </a>
                <div className="header__controls">
                    {this.state.userType === "user" ? <Button variant="primary" onClick={()=>this.goBackAdmin()}>{trls('Go_Back_Admin')}</Button>
                    : '' }
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" style={{color:"#000000"}}>
                            {loggedUserInfo.FirstName +" "+loggedUserInfo.LastName}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.logOut}>{trls('Logout')}</Dropdown.Item>
                            <Dropdown.Item onClick={()=>this.changeItem('profile')}>{trls('Profile')}</Dropdown.Item>
                            <Dropdown.Item onClick={()=>this.changeItem('resetPassword')}>{trls('ResetPassword')}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <ReactFlagsSelect
                        countries={["US", "NL", "DE", "FR"]}
                        // placeholder="Select Language"
                        defaultCountry={selectLang[0].label}
                        showSelectedLabel={false}
                        showOptionLabel={false}
                        selectedSize={18}
                        optionsSize={14} 
                        onSelect={val=>this.changeLangauge(val)}
                    />

                </div>
                <div className="header__user">
                    <span className="header__user-name">
                    </span>
                    <img src={require("../assets/images/avatar.jpg")} alt="User avatar" className="header__user-img"/>
                </div>
            </header>
            {this.state.userProfileSlide ? (
                <Userprofile
                    onHide={() => this.closeProfilePaga()}
                /> 
            ): null}
        </div>
      )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Header);

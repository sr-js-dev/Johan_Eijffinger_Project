import React, {Component} from 'react'
import * as authAction  from '../actions/authAction';
import { Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import history from '../history';
import { removeAuth } from '../factories/auth';
import $ from 'jquery';

const mapStateToProps = state => ({ 
    ...state.auth,
});
const mapDispatchToProps = (dispatch) => ({
    changeLan: (params) =>
        dispatch(authAction.changeLan(params)),
});
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            roles:[{"value":"en_US","label":"English"},{"value":"nl_BE","label":"Dutch"},{"value":"de_DE","label":"German"},{"value":"fr_FR","label":"French"}],
            selectrolvalue:window.localStorage.getItem('eijf_lang'),
            selectrollabel:window.localStorage.getItem('eijf_label'),
        };
    }
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
        var removeFlag = removeAuth();
        if(removeFlag){
            history.push('/login')
        }
    }
    changeLangauge = (val) => {
        this.setState({selectrolvalue:val.value, selectrollabel: val.label});
        this.props.changeLan(val)
    }
    render () {
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
                        {/* <Select
                                name="lan"
                                options={this.state.roles}
                                className="select-lang-class"
                                value={{"label":this.state.selectrollabel,"value":this.state.selectrolvalue}}
                                onChange={val => this.changeLangauge(val)}
                            /> */}
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic" style={{color:"#000000"}}>
                                Johan Boerema<img src={require("../assets/images/avatar.jpg")} alt="User avatar" className="header__user-dropdown-img"/> 
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{marginLeft:15}}>
                                <Dropdown.Item onClick={this.logOut}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                </div>
                <div className="header__user">
                    <span className="header__user-name">
                    </span>
                    <img src={require("../assets/images/avatar.jpg")} alt="User avatar" className="header__user-img"/>
                </div>
            </header>
        </div>
      )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Header);

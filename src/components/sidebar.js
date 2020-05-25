import React, {Component} from 'react'
import { trls } from '../factories/translate';
import  { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Auth from '../factories/auth';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({

});
class Sidebar extends Component {
    constructor(props){
        super(props);
        this.state = {
            userInfo: Auth.getUserInfo(),
        }
    }

    changeItem = () => {
        this.setState({flag:1})
    }

    render () {
        const { userInfo } = this.state;
        console.log('222', userInfo);
        return (
            <div>
                <aside className="sidebar">
                    <div className="logo">
                        <a href="/nl-nl">
                            <img title="" className="Logo--desktop" alt="Eijffinger Nederland" src='https://www.eijffinger.com/Themes/Eijffinger/Content/images/logo.svg'/>
                        </a>
                    </div>
                    <nav className="menu">
                        <ul className="menu__list">
                            <li id="0" className="menu__item" onClick={this.changeItem}>
                                <Link to="/dashboard" className={window.location.pathname === "/dashboard" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                    <span className="menu__link-img-wrap">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="menu-link__icon menu-link__icon--active" d="M8 0C3.589 0 0 3.589 0 8C0 12.411 3.589 16 8 16C12.411 16 16 12.411 16 8C16 3.589 12.411 0 8 0ZM13.91 9H8.677L6.929 4.628L5.071 5.372L6.523 9H2.09C2.0321 8.66977 2.002 8.33526 2 8C2 4.691 4.691 2 8 2C11.309 2 14 4.691 14 8C14 8.341 13.965 8.674 13.91 9Z"/>
                                        </svg>
                                    </span>
                                    <span>{trls("Dashboard")}</span>
                                </Link>
                            </li>
                            <li id="0" className="menu__item" onClick={this.changeItem}>
                                <Link to={'/user'} className={window.location.pathname === "/user" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                    <span className="menu__link-img-wrap">
                                        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="menu-link__icon menu-link__icon--active" d="M15.2751 10.293L13.0871 9.66802C12.9102 9.61746 12.7508 9.51911 12.6262 9.38379C12.5017 9.24848 12.4168 9.08143 12.3811 8.90102L12.2471 8.22602C12.7696 7.98721 13.2126 7.60336 13.5234 7.12012C13.8341 6.63687 13.9996 6.07456 14.0001 5.50002V4.12602C14.0122 3.33047 13.7164 2.56101 13.1745 1.97846C12.6325 1.3959 11.8864 1.04534 11.0921 1.00002C10.4991 0.98213 9.91412 1.14045 9.41111 1.45497C8.90809 1.76948 8.50962 2.22608 8.26607 2.76702C8.74312 3.4613 8.99899 4.28365 9.00007 5.12602V6.50002C8.99828 6.86379 8.94611 7.22556 8.84507 7.57502C9.1043 7.84696 9.41231 8.06779 9.75307 8.22602L9.61907 8.90002C9.5833 9.08043 9.49848 9.24748 9.37392 9.3828C9.24936 9.51811 9.0899 9.61646 8.91307 9.66702L8.07007 9.90802L9.55007 10.331C9.96727 10.4515 10.3341 10.7041 10.5956 11.0509C10.857 11.3976 10.999 11.8198 11.0001 12.254V14.5C10.9984 14.6707 10.9673 14.8399 10.9081 15H15.5001C15.6327 15 15.7599 14.9473 15.8536 14.8536C15.9474 14.7598 16.0001 14.6326 16.0001 14.5V11.254C16 11.0368 15.9292 10.8256 15.7984 10.6522C15.6676 10.4788 15.4839 10.3527 15.2751 10.293Z" fill="#CCCCCC"/>
                                            <path className="menu-link__icon menu-link__icon--active" d="M9.275 11.293L7.087 10.668C6.91004 10.6174 6.75049 10.5189 6.62592 10.3834C6.50135 10.2479 6.4166 10.0806 6.381 9.90001L6.247 9.22501C6.7694 8.98626 7.21228 8.60257 7.52303 8.11952C7.83377 7.63648 7.99932 7.07438 8 6.50001V5.12601C8.01213 4.33045 7.71632 3.56099 7.17439 2.97844C6.63246 2.39589 5.88636 2.04532 5.092 2.00001C4.69036 1.98768 4.29034 2.05617 3.91568 2.20141C3.54101 2.34665 3.19935 2.56567 2.91095 2.84549C2.62256 3.1253 2.39332 3.4602 2.23683 3.8303C2.08035 4.20041 1.99981 4.59818 2 5.00001V6.50001C2.00049 7.07454 2.16595 7.63686 2.4767 8.1201C2.78746 8.60335 3.23045 8.98719 3.753 9.22601L3.619 9.90001C3.58323 10.0804 3.49841 10.2475 3.37385 10.3828C3.24929 10.5181 3.08983 10.6164 2.913 10.667L0.725 11.292C0.516025 11.3518 0.332214 11.478 0.201397 11.6516C0.0705796 11.8252 -0.000120636 12.0367 1.54521e-07 12.254V14.5C1.54521e-07 14.6326 0.0526786 14.7598 0.146447 14.8536C0.240215 14.9473 0.367392 15 0.5 15H9.5C9.63261 15 9.75979 14.9473 9.85355 14.8536C9.94732 14.7598 10 14.6326 10 14.5V12.254C9.9999 12.0368 9.9291 11.8256 9.7983 11.6522C9.6675 11.4788 9.48381 11.3527 9.275 11.293Z" fill="#CCCCCC"/>
                                        </svg>
                                    </span>
                                    <span>{trls("User")}</span>
                                </Link>
                            </li>
                            <li id="0" className="menu__item" onClick={this.changeItem}>
                                <Link to={'/orders'} className={window.location.pathname === "/orders" || window.location.pathname === "/order-detail" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                    <span className="menu__link-img-wrap">
                                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="menu-link__icon menu-link__icon--active" d="M13 5H11V4C11 1.8 9.2 0 7 0C4.8 0 3 1.8 3 4V5H1C0.4 5 0 5.4 0 6V15C0 15.6 0.4 16 1 16H13C13.6 16 14 15.6 14 15V6C14 5.4 13.6 5 13 5ZM5 4C5 2.9 5.9 2 7 2C8.1 2 9 2.9 9 4V5H5V4Z"/>
                                        </svg>
                                    </span>
                                    <span>{trls("Orders")}</span>
                                </Link>
                            </li>
                            <li id="0" className="menu__item" onClick={this.changeItem}>
                                <Link to={'/deliveries'} className={window.location.pathname === "/deliveries" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                    <span className="menu__link-img-wrap">
                                        <svg width="14" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="menu-link__icon menu-link__icon--active" d="M15.7 7.3L8.7 0.3C8.5 0.1 8.3 0 8 0H3C2.7 0 2.5 0.1 2.3 0.3L0.3 2.3C0.1 2.5 0 2.7 0 3V8C0 8.3 0.1 8.5 0.3 8.7L7.3 15.7C7.5 15.9 7.7 16 8 16C8.3 16 8.5 15.9 8.7 15.7L15.7 8.7C16.1 8.3 16.1 7.7 15.7 7.3ZM4 5C3.4 5 3 4.6 3 4C3 3.4 3.4 3 4 3C4.6 3 5 3.4 5 4C5 4.6 4.6 5 4 5Z" fill="#CCCCCC"/>
                                        </svg>
                                    </span>
                                    <span>{trls("Deliveries")}</span>
                                </Link>
                            </li>
                            <li id="0" className="menu__item" onClick={this.changeItem}>
                                <Link to={'/placemanage'} className={window.location.pathname === "/placemanage" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                    <span className="menu__link-img-wrap">
                                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="menu-link__icon menu-link__icon--active" d="M13 5H10V9L8 8L6 9V5H3C2.4 5 2 5.4 2 6V13C2 13.6 2.4 14 3 14H13C13.6 14 14 13.6 14 13V6C14 5.4 13.6 5 13 5Z" fill="#CCCCCC"/>
                                            <path className="menu-link__icon menu-link__icon--active" d="M0 0H16V4H0V0Z"/>
                                        </svg>
                                    </span>
                                    <span>{trls("Place_an_order")}</span>
                                </Link>
                            </li>
                            <li id="0" className="menu__item" onClick={this.changeItem}>
                                <Link to={'/salesinvoices'} className={window.location.pathname === "/salesinvoices"? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                    <span className="menu__link-img-wrap">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="menu-link__icon menu-link__icon--active" d="M15 4H4C3.4 4 3 3.6 3 3V1C3 0.4 3.4 0 4 0H15C15.6 0 16 0.4 16 1V3C16 3.6 15.6 4 15 4Z" fill="#CCCCCC"/>
                                            <path className="menu-link__icon menu-link__icon--active" d="M12 10H1C0.4 10 0 9.6 0 9V7C0 6.4 0.4 6 1 6H12C12.6 6 13 6.4 13 7V9C13 9.6 12.6 10 12 10Z" fill="#CCCCCC"/>
                                            <path className="menu-link__icon menu-link__icon--active" d="M15 16H4C3.4 16 3 15.6 3 15V13C3 12.4 3.4 12 4 12H15C15.6 12 16 12.4 16 13V15C16 15.6 15.6 16 15 16Z" fill="#CCCCCC"/>
                                        </svg>
                                    </span>
                                    <span>{trls("Salesinvoices")}</span>
                                </Link>
                            </li>
                            <li id="0" className="menu__item" onClick={this.changeItem}>
                                <Link to={'/returns'} className={window.location.pathname === "/returns"? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                    <span className="menu__link-img-wrap">
                                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="menu-link__icon menu-link__icon--active" d="M13 0H1C0.4 0 0 0.4 0 1V16L3 14L5 16L7 14L9 16L11 14L14 16V1C14 0.4 13.6 0 13 0ZM11 10H3V8H11V10ZM11 6H3V4H11V6Z" fill="#CCCCCC"/>
                                        </svg>
                                    </span>
                                    <span>{trls("Returns")}</span>
                                </Link>
                            </li>
                            {userInfo.role==="Administrator" && (
                                <li id="0" className="menu__item" onClick={this.changeItem}>
                                    <Link to={'/news'} className={window.location.pathname === "/news"? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                        <span className="menu__link-img-wrap">
                                            <i className="fas fa-file-alt menu-link__icon menu-link__icon--active"></i>
                                        </span>
                                        <span>{trls("News")}</span>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                </aside>
            </div>
        )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

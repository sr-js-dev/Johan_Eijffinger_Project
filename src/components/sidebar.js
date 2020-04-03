import React, {Component} from 'react'
import { trls } from './translate';
import  { Link } from 'react-router-dom';
import { connect } from 'react-redux';
const mapStateToProps = state => ({ 
    ...state.auth,
});
const mapDispatchToProps = (dispatch) => ({

});
class Sidebar extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }
    changeItem = () => {
        this.setState({flag:1})
    }
    render () {
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
                            <Link to="./dashboard" className={window.location.pathname === "/dashboard" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
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
                                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="menu-link__icon menu-link__icon--active" d="M13 5H11V4C11 1.8 9.2 0 7 0C4.8 0 3 1.8 3 4V5H1C0.4 5 0 5.4 0 6V15C0 15.6 0.4 16 1 16H13C13.6 16 14 15.6 14 15V6C14 5.4 13.6 5 13 5ZM5 4C5 2.9 5.9 2 7 2C8.1 2 9 2.9 9 4V5H5V4Z"/>
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
                            <Link to={'/place-order'} className={window.location.pathname === "/place-order" || window.location.pathname === "/place-order" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <span className="menu__link-img-wrap">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="menu-link__icon menu-link__icon--active" d="M15.7 7.3L8.7 0.3C8.5 0.1 8.3 0 8 0H3C2.7 0 2.5 0.1 2.3 0.3L0.3 2.3C0.1 2.5 0 2.7 0 3V8C0 8.3 0.1 8.5 0.3 8.7L7.3 15.7C7.5 15.9 7.7 16 8 16C8.3 16 8.5 15.9 8.7 15.7L15.7 8.7C16.1 8.3 16.1 7.7 15.7 7.3ZM4 5C3.4 5 3 4.6 3 4C3 3.4 3.4 3 4 3C4.6 3 5 3.4 5 4C5 4.6 4.6 5 4 5Z" fill="#CCCCCC"/>
                                    </svg>
                                </span>
                                <span>{trls("Place_an_order")}</span>
                            </Link>
                        </li>
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/invoices'} className={window.location.pathname === "/invoices" || window.location.pathname === "/make-payment" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <span className="menu__link-img-wrap">
                                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="menu-link__icon menu-link__icon--active" d="M13 0H1C0.4 0 0 0.4 0 1V16L3 14L5 16L7 14L9 16L11 14L14 16V1C14 0.4 13.6 0 13 0ZM11 10H3V8H11V10ZM11 6H3V4H11V6Z" fill="#CCCCCC"/>
                                    </svg>
                                </span>
                                <span>{trls("Invoices")}</span>
                            </Link>
                        </li>
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/place-sample-order'} className={window.location.pathname === "/place-sample-order" || window.location.pathname === "/make-payment" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <span className="menu__link-img-wrap">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="menu-link__icon menu-link__icon--active" d="M15.7 7.3L8.7 0.3C8.5 0.1 8.3 0 8 0H3C2.7 0 2.5 0.1 2.3 0.3L0.3 2.3C0.1 2.5 0 2.7 0 3V8C0 8.3 0.1 8.5 0.3 8.7L7.3 15.7C7.5 15.9 7.7 16 8 16C8.3 16 8.5 15.9 8.7 15.7L15.7 8.7C16.1 8.3 16.1 7.7 15.7 7.3ZM4 5C3.4 5 3 4.6 3 4C3 3.4 3.4 3 4 3C4.6 3 5 3.4 5 4C5 4.6 4.6 5 4 5Z" fill="#CCCCCC"/>
                                    </svg>
                                </span>
                                <span>{trls("Place_sample_order")}</span>
                            </Link>
                        </li>
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={window.location.pathname} onClick={()=> window.open("https://www.woontotaal.nl/", "_blank")} className={window.location.pathname === "/make-payment" || window.location.pathname === "/make-payment" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <span className="menu__link-img-wrap">
                                    <img title="" className="Logo--desktop" alt="Eijffinger Nederland" style={{width: 37, height: 20}} src='https://www.woontotaal.nl/wp-content/uploads/2014/07/logo21.png'/>
                                </span>
                                <span>Woontotaal</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
      )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

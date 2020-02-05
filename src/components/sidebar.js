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
                            <Link to="/dashboard" className={window.location.pathname === "/dashboard" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <span className="menu__link-img-wrap">
                                    <i className="fas fa-home menu__link-img-wrap"></i>
                                </span>
                                <span className="menu_item-span">{trls("Dashboard")}</span>
                            </Link>
                        </li>
                        <li className="menu__separator"></li>
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/orders'} className={window.location.pathname === "/orders" || window.location.pathname === "/order-detail" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <span className="menu__link-img-wrap">
                                    <i className="far fa-copy menu__link-img-wrap"></i>
                                </span>
                                <span className="menu_item-span">{trls("Orders")}</span>
                            </Link>
                        </li>
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/place-order'} className={window.location.pathname === "/place-order" || window.location.pathname === "/place-order" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <span className="menu__link-img-wrap">
                                    <i className="fas fa-cart-arrow-down"></i>
                                </span>
                                <span className="menu_item-span">{trls("Place_an_order")}</span>
                            </Link>
                        </li>
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/make-payment'} className={window.location.pathname === "/make-payment" || window.location.pathname === "/make-payment" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <span className="menu__link-img-wrap">
                                    <i className="fas fa-money-check-alt"></i>
                                </span>
                                <span className="menu_item-span">{trls("Make_a_payment")}</span>
                            </Link>
                        </li>
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/invoices'} className={window.location.pathname === "/invoices" || window.location.pathname === "/make-payment" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <span className="menu__link-img-wrap">
                                    <i className="far fa-credit-card"></i>
                                </span>
                                <span className="menu_item-span">{trls("Invoices")}</span>
                            </Link>
                        </li>
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={window.location.pathname} onClick={()=> window.open("https://www.woontotaal.nl/", "_blank")} className={window.location.pathname === "/make-payment" || window.location.pathname === "/make-payment" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <span className="menu__link-img-wrap">
                                    <img title="" className="Logo--desktop" alt="Eijffinger Nederland" style={{width: 37, height: 20}} src='https://www.woontotaal.nl/wp-content/uploads/2014/07/logo21.png'/>
                                </span>
                                <span className="menu_item-span">Woontotaal</span>
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

import React, {Component} from 'react'
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Dashboard from '../pages/Dashboard/dashboard_manage';
import User from '../pages/User/user_register';
import Order from '../pages/Order/order_manage';
import Orderdetail from '../pages/Order/order_detail';
import Deliveries from '../pages/Deliveries/deliveries_manage';
import Deliverydetail from '../pages/Deliveries/delivery_detail';
import Salesinvoices from '../pages/Salesinvoices/salesinvoices_manage';
import Salesinvoicedetail from '../pages/Salesinvoices/salesinvoice_deail';
import Returns from '../pages/Returns/returns_manage';
import Returndetail from '../pages/Returns/return_detail';
import Placemanage from '../pages/Placeorder/place_manage';
import Newsmanage from '../pages/News/news_manage';
// import Paymentmanage from '../pages/Makepayment/payment_manage';
// import Invoices from '../pages/Invoice/invoice_manage';
import { Switch,Router, Route } from 'react-router-dom';
import history from '../history';
import * as Auth from '../factories/auth';

window.localStorage.setItem('AWT', true);
class Layout extends Component {
  constructor(props){
    super(props);
    this.state = {
        userInfo: Auth.getUserInfo(),
    }
  }
  render () {
    const { userInfo } = this.state;
    return (
        <Row style={{height:"100%", display: "flex"}}>
          <Sidebar/>
          <Col style={{paddingLeft:0, paddingRight:0, width: "75%"}}>
            <Header/>
            <Router history={history}>
              <Switch>
                <Route path="/dashboard" component={Dashboard}/>
                {/* {userInfo.role==="Administrator" && ( */}
                  <Route path="/user" component={User}/>
                {/* )} */}
                {/* {userInfo.role!=="Administrator" && ( */}
                  <Route path="/orders" component={Order}/>
                {/* )} */}
                {/* {userInfo.role!=="Administrator" && ( */}
                  <Route path="/order-detail" component={Orderdetail}/>
                {/* )} */}
                {/* {userInfo.role!=="Administrator" && ( */}
                  <Route path="/deliveries" component={Deliveries}/>
                {/* )} */}
                {/* {userInfo.role!=="Administrator" && ( */}
                  <Route path="/delivery-detail" component={Deliverydetail}/>
                {/* )} */}
                {/* {userInfo.role!=="Administrator" && ( */}
                  <Route path="/salesinvoices" component={Salesinvoices}/>
                {/* )} */}
                {/* {userInfo.role!=="Administrator" && ( */}
                  <Route path="/salesinvoice-deail" component={Salesinvoicedetail}/>
                {/* )} */}
                {/* {userInfo.role!=="Administrator" && ( */}
                  <Route path="/returns" component={Returns}/> 
                {/* )} */}
                {/* {userInfo.role!=="Administrator" && ( */}
                  <Route path="/return-detail" component={Returndetail}/> 
                {/* )} */}
                {/* {userInfo.role!=="Administrator" && ( */}
                  <Route path="/placemanage" component={Placemanage}/>
                {/* )}  */}
                {/* {userInfo.role==="Administrator" && ( */}
                  <Switch>
                      <Route path="/news" component={Newsmanage}/>
                  </Switch>
                {/* )} */}
              </Switch>
            </Router>
          </Col>
          <div className="fade-display"></div>
      </Row>
    )
  };
}
export default Layout;

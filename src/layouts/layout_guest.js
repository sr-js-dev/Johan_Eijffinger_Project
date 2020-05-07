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
// import Paymentmanage from '../pages/Makepayment/payment_manage';
// import Invoices from '../pages/Invoice/invoice_manage';
import { Switch,Router, Route } from 'react-router-dom';
import history from '../history';

window.localStorage.setItem('AWT', true);
class Layout extends Component {
  
    render () {
      return (
          <Row style={{height:"100%", display: "flex"}}>
            <Sidebar/>
            <Col style={{paddingLeft:0, paddingRight:0, width: "75%"}}>
              <Header/>
              <Router history={history}>
                <Switch>
                  <Route path="/dashboard" component={Dashboard}/>
                  <Route path="/user" component={User}/>
                  <Route path="/orders" component={Order}/>
                  <Route path="/order-detail" component={Orderdetail}/>
                  <Route path="/deliveries" component={Deliveries}/>
                  <Route path="/delivery-detail" component={Deliverydetail}/>
                  <Route path="/salesinvoices" component={Salesinvoices}/>
                  <Route path="/salesinvoice-deail" component={Salesinvoicedetail}/>
                  <Route path="/returns" component={Returns}/> 
                  <Route path="/return-detail" component={Returndetail}/> 
                  <Route path="/placemanage" component={Placemanage}/>
                </Switch>
              </Router>
            </Col>
            <div className="fade-display"></div>
        </Row>
      )
    };
  }
  export default Layout;

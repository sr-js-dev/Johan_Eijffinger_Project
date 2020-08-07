import React, {Component} from 'react'
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
import API from '../../factories/api';
import SessionManager from '../../factories/session_manage';
import Axios from 'axios';
import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
import "react-datepicker/dist/react-datepicker.css";
import 'datatables.net';
import history from '../../history';
import * as Common from '../../factories/common';
import Pagination from '../../components/pagination_order';
import Pageloadspiiner from '../../components/page_load_spinner';
import * as Auth from '../../factories/auth';
import Sweetalert from 'sweetalert';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({

});

class Returnordersform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            // loading: false,
            ordersData: [],
            originFilterData: [],
            deliveriesData: [],
            filterColunm: [
                {"label": '', "value": "", "type": 'text', "show": true},
                {"label": 'Order', "value": "DocNum", "type": 'text', "show": true},
                {"label": 'Order_Date', "value": "DocDate", "type": 'date', "show": true},
                {"label": 'Status', "value": "Status", "type": 'text', "show": true},
                {"label": 'Product', "value": "Product", "type": 'text', "show": true},
                {"label": 'ItemCode', "value": "ItemCode", "type": 'text', "show": true},
                {"label": 'Quantity', "value": "Quantity", "type": 'text', "show": true},
                {"label": 'Batch', "value": "BatchNumbers", "type": 'text', "show": true},
            ],
            filterColunmDeliveries: [
                {"label": '', "value": "", "type": 'text', "show": true},
                {"label": 'Delivery', "value": "DocNum", "type": 'text', "show": true},
                {"label": 'DeliveryDate', "value": "DocDate", "type": 'date', "show": true},
                {"label": 'Status', "value": "LineStatus", "type": 'text', "show": true},
                {"label": 'Product', "value": "Product", "type": 'text', "show": true},
                {"label": 'ItemCode', "value": "ItemCode", "type": 'text', "show": true},
                {"label": 'Quantity', "value": "Quantity", "type": 'text', "show": true},
                {"label": 'Reference', "value": "NumAtCard", "type": 'text', "show": true},
                {"label": 'Batch', "value": "BatchNumbers", "type": 'text', "show": true},
                {"label": 'Action', "value": "Action", "type": 'text', "show": true},
            ],
            pageLodingFlag: false,
            pages:[{"value":"all","label":"all"}, {"value":5,"label":5}, {"value":10,"label":10}, {"value":20,"label":20}, {"value":30,"label":30}, {"value":40,"label":40}],
            obj: this,
            recordNum: 0,
            filterDataFlag: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this.getRecordNum(null);
        var editor;
        
// $(document).ready(function() {
//     editor = new $.fn.dataTable.Editor( {   
//         table: "#orders-table",
//         fields: [ {
//                 label: "Quantity:",
//                 name: "quantity"
//             }
//         ]
//     } );
//     $('#orders-table').on( 'click', 'tbody td', function (e) {
//         editor.inline( this );
//     } );
    $('.filter_orders').on( 'keyup', function () {
        orderTable.search( this.value ).draw();
    } );
    $('#orders-table').dataTable().fnDestroy();
    var orderTable = $('#orders-table').DataTable(
        {
            "language": {
                "lengthMenu": trls("Show")+" _MENU_ "+trls("Result_on_page"),
                "zeroRecords": "Nothing found - sorry",
                "info": trls("Show_page")+" _PAGE_ "+trls('Results_of')+" _PAGES_",
                "infoEmpty": "No records available",
                "infoFiltered": "(filtered from _MAX_ total records)",
                "search": trls('Search'),
                "paginate": {
                    "previous": trls('Previous'),
                    "next": trls('Next')
                }
            },
            "dom": 't<"bottom-datatable" lip>',
            "columnDefs": [{
                "targets": [0, 3, 4, 6, 7],
                "orderable": false
            }],
            // columns: [
            //     {
            //         data: null,
            //         defaultContent: '',
            //         className: 'select-checkbox',
            //         orderable: false
            //     },
            //     { data: 'Order'},
            //     { data: 'Order_Date'},
            //     { data: 'Status' },
            //     { data: 'Product' },
            //     { data: 'ItemCode' },
            //     // { data: 'Quantity', render: $.fn.dataTable.render.number( ',', '.', 0, '$' ), className: 'editable' }
            //     { data: 'Quantity', className: 'editable' }
            // ],
            // select: {
            //     style:    'os',
            //     selector: 'td:first-child'
            // },
            // buttons: [
            //     { extend: 'create', editor: editor },
            //     { extend: 'edit',   editor: editor },
            //     { extend: 'remove', editor: editor }
            // ]
        }
    );
// })
        
        
        $('.filter_deliveries').on( 'keyup', function () {
            deliveryTable.search( this.value ).draw();
        } );
        $('#deliveries-table').dataTable().fnDestroy();
        var deliveryTable = $('#deliveries-table').DataTable(
            {
                "language": {
                    "lengthMenu": trls("Show")+" _MENU_ "+trls("Result_on_page"),
                    "zeroRecords": "Nothing found - sorry",
                    "info": trls("Show_page")+" _PAGE_ "+trls('Results_of')+" _PAGES_",
                    "infoEmpty": "No records available",
                    "infoFiltered": "(filtered from _MAX_ total records)",
                    "search": trls('Search'),
                    "paginate": {
                        "previous": trls('Previous'),
                        "next": trls('Next')
                    }
                },
                "dom": 't<"bottom-datatable" lip>',
                
            }
        );
    
    }

    getRecordNum = () => {
        this._isMounted = true;
        var settings = {
            "url": API.GetOrdersData,
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+Auth.getUserToken(),
            },
            "data": JSON.stringify({"top": 5})
        }
        $.ajax(settings).done(function (response) {
        })
        .then(response => {
            this.setState({recordNum: response['@odata.count']})
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        });
    }

    

    showOrderDetail = (orderId) => {
        history.push({
            pathname: '/order-detail/'+orderId,
            state: { id: orderId, newSubmit:true }
          })
    }

    removeColumn = (value) => {
        let filterColunm = this.state.filterColunm;
        filterColunm = filterColunm.filter(function(item, key) {
            if(item.label===value){
            item.show = false;
            }
            return item;
        })
        this.setState({filterColunm: filterColunm})
    }

    showColumn = (value) => {
        let filterColum = this.state.filterColunm;
        filterColum = filterColum.filter((item, key)=>item.label===value);
        return filterColum[0].show;
    }

    showColumnDeliveries = (value) => {
        let filterColum = this.state.filterColunmDeliveries;
        filterColum = filterColum.filter((item, key)=>item.label===value);
        return filterColum[0].show;
    }

    changeOrderCheck = (value, id) => {
        let ordersData = this.state.ordersData;
        ordersData.map((item, index)=>{
            if(item.id__===id){
                item.checked=value;
            }
            return item;
        })
        this.setState({ordersData: ordersData});
    }
    changeDeliveryCheck = (value, id) => {
        let deliveriesData = this.state.deliveriesData;
        deliveriesData.map((item, index)=>{
            if(item.id__===id){
                item.checked=value;
            }
            return item;
        })
        this.setState({deliveriesData: deliveriesData});
    }
    orderReturn = () => {
        const { patternRowId } = this.props;
        Sweetalert({
            title: trls("Are you sure?"),
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.returnOrderLine(patternRowId);
            //     Sweetalert("Success!", {
            //     icon: "success",
            //   });
            } else {
            }
        });
    }

    returnOrderLine = () => {
        let ordersData = this.state.ordersData;
        ordersData = ordersData.filter(function(item, key) {
            return item.checked;
        })
        let orderLenght = ordersData.length;
        let documentLineArray = [];
        let lineArray = [];
        ordersData.map((data, index)=>{
            documentLineArray = [];
            lineArray = [];
            lineArray = {
                ItemCode: data.ItemCode,
                Quantity: data.Quantity,
                Price: data.Price
            }
            documentLineArray.push(lineArray);
            let params = {
                "requestData": {
                    "CardCode": data.CardCode,
                    "DocDate": Common.formatDate1(data.DocDate),
                    "DocDueDate": Common.formatDate1(data.DocDueDate),
                    "AddressExtension": {
                    },
                    "DocumentLines": documentLineArray
                },
                "parameters": {
                }
            }
            var headers = SessionManager.shared().getAuthorizationHeader();
            Axios.post(API.ReturnOrder, params, headers)
            .then(result => {
                if(index===orderLenght-1){
                    Sweetalert("Success!", {
                        icon: "success",
                    });
                }
                            })
            .catch(err => {
                if(err.response.status===401){
                    history.push('/login')
                }
            })
            return data;
        })
    }
    showPlaceOrder = (orderId) => {
        this.props.onHide();
        history.push('/order-detail/'+orderId);
    }

    showDeliveryDetail = (docNumber, trackAndTrace) => {
        this.props.onHide();
        history.push({
            pathname: '/delivery-detail/'+docNumber,
            state: { id: docNumber, newSubmit:true, trackAndTrace:  trackAndTrace}
          })
    }

    render(){
        const {filterColunm, pageLodingFlag, filterColunmDeliveries} = this.state;
        const { deliveriesData, ordersData} = this.props;
        return (
            <Modal
                show={this.props.show}
                onHide={()=>this.props.onHide()}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {trls('Orders')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="order_div return-order_div">
                        <div className="orders">
                            <Row>
                                <Col sm={6} className="return-order-form_header">
                                    <Button variant="primary" onClick = {()=>this.orderReturn()}><i className="fas fa-undo add-icon"></i>{trls('Return')}</Button> 
                                </Col>
                                <Col sm={6} className="has-search">
                                    <div style={{display: 'flex', float: 'right'}}>
                                        <div style={{marginLeft: 20}}>
                                            <span className="fa fa-search form-control-feedback"></span>
                                            <Form.Control className="form-control filter_orders" type="text" name="number"placeholder={trls("Quick_search")}/>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div className="table-responsive credit-history">
                                <table id="orders-table" className="place-and-orders__table table return-order__table" width="100%">
                                    <thead>
                                        <tr>
                                            {filterColunm.map((item, key)=>(
                                                <th className={!item.show ? "filter-show__hide" : ''} key={key} style={item.value==="Action" ? {width: 25} : {}}>
                                                    {trls(item.label) ? trls(item.label) : ''}
                                                </th>
                                                )
                                            )}
                                        </tr>
                                    </thead>
                                    {ordersData &&(
                                    <tbody >
                                        {
                                            ordersData.map((data,i) =>(
                                                <tr id={i} key={i}>
                                                    <td><Form.Check type="checkbox" onChange={(evt)=>this.changeOrderCheck(evt.target.checked, data.id__)}/></td>
                                                    <td className={!this.showColumn(filterColunm[0].label) ? "filter-show__hide" : ''}><div id={data.id} className="action-div" onClick={()=>this.showPlaceOrder(data.DocNum)}>{data.DocNum}</div></td>
                                                    <td className={!this.showColumn(filterColunm[1].label) ? "filter-show__hide" : ''}>{Common.formatDate(data.DocDate)}</td>
                                                    <td className={!this.showColumn(filterColunm[2].label) ? "filter-show__hide" : ''}><div className={data.OpenQty > 0 ? "order-open__state" : "order-Send__state"}>{data.OpenQty > 0 ? "Open" : 'Send'}</div></td>
                                                    <td className={!this.showColumn(filterColunm[3].label) ? "filter-show__hide" : ''}><img src={data.picture ? "data:image/png;base64,"+data.picture : ''} alt={data.picture ? i : ''} className = "image__zoom"></img> {data.ItemName}</td>
                                                    <td className={!this.showColumn(filterColunm[4].label) ? "filter-show__hide" : ''}>{data.ItemCode}</td>
                                                    <td className={!this.showColumn(filterColunm[5].label) ? "filter-show__hide" : ''}>{data.Quantity}</td>
                                                    <td className={!this.showColumn(filterColunm[6].label) ? "filter-show__hide" : ''}>{data.BatchNumbers}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>)}
                                </table>
                                {/* {!this.state.filterDataFlag&&(
                                    <Pagination
                                        recordNum={this.state.recordNum}
                                        getData={(pageSize, page)=>this.getOrdersData(pageSize, page)}
                                    />
                                )} */}
                                {/* { this.state.loading&& (
                                    <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                                        <BallBeat
                                            color={'#222A42'}
                                            loading={this.state.loading}
                                        />
                                    </div>
                                )} */}
                            </div>
                        </div>
                        <div className="orders">
                            <Row>
                                <Col sm={6} className="return-order-form_header" />
                                <Col sm={6} className="has-search">
                                    <div style={{display: 'flex', float: 'right'}}>
                                        <div style={{marginLeft: 20}}>
                                            <span className="fa fa-search form-control-feedback"></span>
                                            <Form.Control className="form-control filter_deliveries" type="text" name="number"placeholder={trls("Quick_search")}/>
                                        </div>
                                    </div>
                                </Col>
                            </Row>        
                            <div className="table-responsive credit-history">
                                <table id="deliveries-table" className="place-and-orders__table table" width="100%">
                                    <thead>
                                        <tr>
                                            {filterColunmDeliveries.map((item, key)=>(
                                                <th className={!item.show ? "filter-show__hide" : ''} key={key}>
                                                    {trls(item.label) ? trls(item.label) : ''}
                                                </th>
                                                )
                                            )}
                                        </tr>
                                    </thead>
                                    {deliveriesData&& !this.state.loading &&(
                                        <tbody>
                                            {
                                                deliveriesData.map((data,i) =>(
                                                    <tr id={i} key={i}>
                                                        <td><Form.Check type="checkbox" onChange={(evt)=>this.changeDeliveryCheck(evt.target.checked, data.id__)}/></td>
                                                        <td className={!this.showColumnDeliveries(filterColunmDeliveries[0].label) ? "filter-show__hide" : ''}><div id={data.id} className="action-div" onClick={()=>this.showDeliveryDetail(data.DocNum, data.TrackAndTrace)}>{data.DocNum}</div></td>
                                                        <td className={!this.showColumnDeliveries(filterColunmDeliveries[1].label) ? "filter-show__hide" : ''}>{Common.formatDate(data.DocDate)}</td>
                                                        <td className={!this.showColumnDeliveries(filterColunmDeliveries[2].label) ? "filter-show__hide" : ''}><div className={data.OpenAmount > 0 ? "order-open__state" : "order-Send__state"}>{data.OpenAmount > 0 ? "Open" : 'Send'}</div></td>
                                                        <td className={!this.showColumnDeliveries(filterColunmDeliveries[3].label) ? "filter-show__hide" : ''}><img src={data.picture ? "data:image/png;base64,"+data.picture : ''} alt={data.picture ? i : ''} className = "image__zoom"></img> {data.ItemDescription}</td>
                                                        <td className={!this.showColumnDeliveries(filterColunmDeliveries[4].label) ? "filter-show__hide" : ''}>{data.ItemCode}</td>
                                                        <td className={!this.showColumnDeliveries(filterColunmDeliveries[5].label) ? "filter-show__hide" : ''}>{data.Quantity}</td>
                                                        <td className={!this.showColumnDeliveries(filterColunmDeliveries[6].label) ? "filter-show__hide" : ''}>{data.NumAtCard}</td>
                                                        <td className={!this.showColumnDeliveries(filterColunmDeliveries[7].label) ? "filter-show__hide" : ''}>{data.BatchNumbers}</td>
                                                        <td className={!this.showColumnDeliveries(filterColunmDeliveries[8].label) ? "filter-show__hide" : ''}>
                                                            <Row style={{justifyContent: "space-around", width: 70}}>
                                                                <i className="far fa-file-pdf add-icon" onClick={()=>this.getFileDownLoad(data)}><span className="action-title"></span></i>
                                                                {data.TrackAndTrace !==null &&
                                                                <a href={data.TrackAndTrace}  target="_blank" rel="noopener noreferrer">
                                                                    <img src={require("../../assets/images/mark.png")} className="mark_image" alt="woon"/>
                                                                </a>}
                                                            </Row>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    )}
                                </table>
                                {/* {this.state.loading&& (
                                    <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                                        <BallBeat
                                            color={'#222A42'}
                                            loading={this.state.loading}
                                        />
                                    </div>
                                )} */}
                            </div>
                        </div>
                        {/* <Pageloadspiiner loading = {pageLodingFlag}/> */}
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Returnordersform);
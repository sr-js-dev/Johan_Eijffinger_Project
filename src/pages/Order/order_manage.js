import React, {Component} from 'react'
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
import { Row, Col, Button, Form } from 'react-bootstrap';
import SessionManager from '../../factories/session_manage';
import API from '../../factories/api'
import Axios from 'axios';
import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
import "react-datepicker/dist/react-datepicker.css";
// import 'datatables.net';
import history from '../../history';
import * as Common from '../../factories/common';
import Pageloadspiiner from '../../components/page_load_spinner';
import Sweetalert from 'sweetalert';
import * as authAction  from '../../actions/authAction';
// import Pagination from '../../components/pagination_order';
import * as Auth from '../../factories/auth';
import Filtercomponent from '../../components/filtercomponent';
const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: (blankFlag) =>
        dispatch(authAction.blankdispatch(blankFlag)),
});

class Ordermanage extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            loading: false,
            ordersData: [],
            originFilterData: [],
            filterColunm: [
                {"label": 'Order', "value": "DocNum", "type": 'text', "show": true},
                {"label": 'Order_Date', "value": "DocDate", "type": 'date', "show": true},
                {"label": 'Status', "value": "Status", "type": 'text', "show": true},
                {"label": 'Product', "value": "Product", "type": 'text', "show": true},
                {"label": 'ItemCode', "value": "ItemCode", "type": 'text', "show": true},
                {"label": 'Quantity', "value": "Quantity", "type": 'text', "show": true},
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
        this.getOrdersData(5, 1);
       
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
            "data": JSON.stringify({"top":5})
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
    // filter module
    filterOptionData = (filterOption) =>{
        let dataA = []
        dataA = Common.filterData(filterOption, this.state.originFilterData);
        if(!filterOption.length){
            dataA=null;
        }
        this.getOrdersData(5, 1, dataA);
    }

    getOrdersData (pageSize, page, data) {
        this._isMounted = true;
        this.setState({loading: true});
        var settings = {
            "url": API.GetOrdersData,
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+Auth.getUserToken(),
            },
            "data": JSON.stringify({"top":pageSize,"skip":page})
        }
        $.ajax(settings).done(function (response) {
        })
        .then(response => {
            
            if(this._isMounted){
                console.log("dddddd", response.value)
                if(!data){
                    this.setState({ordersData: response.value, originFilterData: response.value});
                }else{
                    this.setState({ordersData: data});
                }
                this.setState({loading:false})
                // $('#order-table').dataTable().fnDestroy();
                // if(this.state.filterDataFlag){
                    $('.filter').on( 'keyup', function () {
                        table.search( this.value ).draw();
                    } );
                    
                    $('#order-table').dataTable().fnDestroy();
                    
                    var table = $('#order-table').DataTable(
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
                            // "searching": false,
                            "dom": 't<"bottom-datatable" lip>',
                            // "ordering": false
                            "columnDefs": [{
                                "targets": [2, 3, 5, 6, 7],
                                "orderable": false
                            }]
                        }
                    );
                // }
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

    // filter module
    // filterOptionData = (filterOption) =>{
    //     let dataA = []
    //     dataA = Common.filterData(filterOption, this.state.originFilterData);
    //     if(!filterOption.length){
    //         this.setState({filterDataFlag: false});
    //         dataA=null;
    //     }else{
    //         this.setState({filterDataFlag: true});
    //     }
    //     this.getOrdersData(dataA);
    // }
    changeFilter = () => {
        if(this.state.filterFlag){
            this.setState({filterFlag: false})
        }else{
            this.setState({filterFlag: true})
        }
    }
    // filter module
    getFileDownLoad = (data) => {
        this.setState({pageLodingFlag: true})
        this._isMounted = true;
        let params = {
            objectId: "Orders",
            keyValue: data.DocNum
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetDownloadFile, params, headers)
        .then(result => {
            if(result.data.pdf){
                this.setState({pageLodingFlag: false})
                this.downloadWithName("data:application/octet-stream;charset=utf-16le;base64,"+result.data.pdf, data.ItemCode+'.pdf');
            }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        })
    }

    downloadWithName = (uri, name) => {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        link.click();
    }

    openPlaceOrder = () => {
        history.push('/placeorder');
        this.props.blankdispatch(this.props.blankFlag);
    }

    showPlaceOrder = (orderId) => {
        // this._isMounted = true;
        // var settings = {
        //     "url": API.GetOrderDetails+orderId,
        //     "method": "GET",
        //     "headers": {
        //         "Content-Type": "application/json",
        //         "Authorization": "Bearer "+Auth.getUserToken(),
        // }
        // }
        // $.ajax(settings).done(function (response) {
        // })
        // .then(response => {
        //     if(this._isMounted){
        //         console.log('22222', response);
        //     }
        // })
        // .catch(err => {
        //     if(err.response.status===401){
        //         history.push('/login')
        //     }
        // });
        history.push('/order-detail/'+orderId);
    }

    returnOrderConform = (data) => {
        Sweetalert({
            title: "Are you sure?",
            text: trls("Are you sure that you want to return this item?"),
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.returnOrder(data);
           
            } else {
            }
        });
    }

    returnOrder = (data) => {
        this._isMounted = true;
        // let params1 = {
        //     "requestData": {
        //     "CardCode": data.CardCode,
        //     "DocumentLines": [
        //     {
            
        //                "ItemCode": data.CardCode,
        //                "Quantity": data.OpenQty,
        //                 "TaxCode": null,
        //                "UnitPrice": data.Price
            
        //             }
        //          ]
        //     },
        //     "parameters": {
            
        //     }
        // }
        let documentLineArray = [];
        let lineArray = [];

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
                "Reference1": '',
                 "BillingAddress": {
                        "ShipToStreet": null,
                        "ShipToStreetNo": null,
                        "ShipToBlock": null,
                        "ShipToBuilding": "",
                        "ShipToCity": null,
                        "ShipToZipCode": null,
                        "ShipToCounty": null,
                        "ShipToState": null,
                        "ShipToCountry": null,
                        "ShipToAddressType": null,
                        "BillToStreet": null,
                        "BillToStreetNo": null,
                        "BillToBlock": null,
                        "BillToBuilding": "",
                        "BillToCity": null,
                        "BillToZipCode": null,
                        "BillToCounty": null,
                        "BillToState": null,
                        "BillToCountry": "NL",
                        "BillToAddressType": null,
                        "ShipToGlobalLocationNumber": null,
                        "BillToGlobalLocationNumber": null,
                        "ShipToAddress2": null,
                        "ShipToAddress3": null,
                        "BillToAddress2": null,
                        "BillToAddress3": null,
                        "PlaceOfSupply": null,
                        "PurchasePlaceOfSupply": null
                     },
                     "DocumentLines": documentLineArray
            },
              "parameters": {
              }
        }      
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.ReturnOrder, params, headers)
        .then(result => {
             Sweetalert("Success!", {
                icon: "success",
             });
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        })
    }
    
    render(){   
        const {filterColunm, ordersData, pageLodingFlag} = this.state;
        let filterData = [
            {"label": trls('Order'), "value": "DocNum", "type": 'text', "show": true},
            {"label": trls('Order_Date'), "value": "DocDate", "type": 'date', "show": true},
            {"label": trls('Status'), "value": "LineStatus", "type": 'text', "show": true},
            {"label": trls('ItemCode'), "value": "ItemCode", "type": 'text', "show": true}
        ]
        return (
            <div className="order_div">
                <div className="content__header content__header--with-line">
                    <div id="google_translate_element"></div>
                    <h2 className="title">{trls("Orders")}</h2>
                </div>
                <div className="orders">
                    <Row>
                        <Col sm={6}>
                            <Button variant="primary" onClick = {()=>this.openPlaceOrder()}><i className="fas fa-plus add-icon"></i>{trls('Add_order')}</Button> 
                        </Col>
                        <Col sm={6} className="has-search">
                            <div style={{display: 'flex', float: 'right'}}>
                                <Button variant="light" onClick={()=>this.changeFilter()}><i className="fas fa-filter add-icon"></i>{trls('Filter')}</Button>
                                <div style={{marginLeft: 20}}>
                                    <span className="fa fa-search form-control-feedback"></span>
                                    <Form.Control className="form-control filter" type="text" name="number"placeholder={trls("Quick_search")}/>
                                </div>
                            </div>
                        </Col>
                        {filterColunm.length&&(
                            <Filtercomponent
                                onHide={()=>this.setState({filterFlag: false})}
                                filterData={filterData}
                                onFilterData={(filterOption)=>this.filterOptionData(filterOption)}
                                showFlag={this.state.filterFlag}
                            />
                        )}
                    </Row>
                    <div className="table-responsive credit-history">
                        <table id="order-table" className="place-and-orders__table table" width="100%">
                        <thead>
                            <tr>
                                {filterColunm.map((item, key)=>(
                                    <th className={!item.show ? "filter-show__hide" : ''} key={key} style={item.value==="Action" ? {width: 25} : {}}>
                                        {trls(item.label) ? trls(item.label) : ''}
                                        {/* <Contextmenu
                                            triggerTitle = {item.label}
                                            addFilterColumn = {(value)=>this.addFilterColumn(value)}
                                            removeColumn = {(value)=>this.removeColumn(value)}
                                        /> */}
                                    </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        {ordersData && !this.state.loading &&(<tbody >
                            {
                                ordersData.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td className={!this.showColumn(filterColunm[0].label) ? "filter-show__hide" : ''}><div id={data.id} className="action-div" onClick={()=>this.showPlaceOrder(data.DocNum)}>{data.DocNum}</div></td>
                                        <td className={!this.showColumn(filterColunm[1].label) ? "filter-show__hide" : ''}>{Common.formatDate(data.DocDate)}</td>
                                        <td className={!this.showColumn(filterColunm[2].label) ? "filter-show__hide" : ''}><div className={data.OpenQty > 0 ? "order-open__state" : "order-Send__state"}>{data.OpenQty > 0 ? "Open" : 'Send'}</div></td>
                                        <td className={!this.showColumn(filterColunm[3].label) ? "filter-show__hide" : ''}><img src={data.picture ? "data:image/png;base64,"+data.picture : ''} alt={data.picture ? i : ''} className = "image__zoom"></img> {data.ItemName}</td>
                                        <td className={!this.showColumn(filterColunm[4].label) ? "filter-show__hide" : ''}>{data.ItemCode}</td>
                                        <td className={!this.showColumn(filterColunm[5].label) ? "filter-show__hide" : ''}>{data.Quantity}</td>
                                        <td className={!this.showColumn(filterColunm[6].label) ? "filter-show__hide" : ''}>{data.BatchNumbers}</td>
                                        <td className={!this.showColumn(filterColunm[7].label) ? "filter-show__hide" : ''}>
                                            <Row style={{justifyContent: "space-around", width: 70}}>
                                                <i className="far fa-file-pdf add-icon" onClick={()=>this.getFileDownLoad(data)}><span className="action-title"></span></i>
												<i className="fas fa-undo add-icon" onClick={()=>this.returnOrderConform(data)}><span className="action-title"></span></i>
											</Row>
                                        </td>
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
                        { this.state.loading&& (
                            <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                                <BallBeat
                                    color={'#222A42'}
                                    loading={this.state.loading}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <Pageloadspiiner loading = {pageLodingFlag}/>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Ordermanage);
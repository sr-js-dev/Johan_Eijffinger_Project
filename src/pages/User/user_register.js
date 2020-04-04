import React, {Component} from 'react'
import { Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Adduserform from './adduserform';
import $ from 'jquery';
import SessionManager from '../../factories/session_manage';
import API from '../../factories/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { getUserToken } from '../../factories/auth';
import { trls } from '../../factories/translate';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'datatables.net';
import * as Common from '../../factories/common';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});
class Userregister extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            userData:[],
            flag:'',
            userUpdateData:[],
            loading:true,
            slideFormFlag: false,
            originFilterData: [],
            filterFlag: false,
            filterData: [],
            filterColunm: [
                {"label": trls('UserName'), "value": "UserName", "type": 'text', "show": true},
                {"label": trls('Email'), "value": "Email", "type": 'text', "show": true},
                {"label": trls('PhoneNumber'), "value": "PhoneNumber", "type": 'text', "show": true},
                {"label": trls('Active'), "value": "active", "type": 'text', "show": true},
                {"label": trls('Action'), "value": "action", "type": 'text', "show": true},
            ]
        };
      }
    componentDidMount() {
        this._isMounted=true
        this.getUserData();
        this.setFilterData();
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    getUserData (data) {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetUserData, headers)
        .then(result => {
            console.log('11111', result);
            if(this._isMounted){
                if(!data){
                    this.setState({userData: result.data.data, originFilterData: result.data.data});
                }else{
                    this.setState({userData: data});
                }
                this.setState({loading:false})
                $('#example').dataTable().fnDestroy();
                $('#example').DataTable(
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
                          "searching": false,
                          "dom": 't<"bottom-datatable" lip>'
                      }
                  );
            }
        });
    }

    // filter module
    setFilterData = () => {
        let filterData = [
            {"label": trls('UserName'), "value": "UserName", "type": 'text'},
            {"label": trls('Email'), "value": "Email", "type": 'text'},
        ]
        this.setState({filterData: filterData});
    }

    filterOptionData = (filterOption) =>{
        let dataA = []
        dataA = Common.filterData(filterOption, this.state.originFilterData);
        if(!filterOption.length){
            dataA=null;
        }
        $('#project_table').dataTable().fnDestroy();
        this.getUserData(dataA);
    }

    changeFilter = () => {
        if(this.state.filterFlag){
            this.setState({filterFlag: false})
        }else{
            this.setState({filterFlag: true})
        }
    }
    // filter module

    userUpdate = (id) => {
        let userID=id;
        var settings = {
            "url": API.GetUserDataById+id,
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+getUserToken(),
        }
        }
        $.ajax(settings).done(function (response) {
        })
        .then(response => {
            this.setState({userUpdateData: response, mode:"update",userID:userID, flag:true, slideFormFlag: true});
            Common.showSlideForm();
        });
    }

    viewUserData = (event) => {
        this._isMounted = true;
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetUserDataById+event.currentTarget.id, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({userUpdateData: result.data})
                this.setState({modalShow:true, mode:"view", flag:true})
            }
        });
    }

    userDelete = () => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.delete("https://cors-anywhere.herokuapp.com/"+API.DeleteUserData+this.state.userId, headers)
        .then(result => {
            this.setState({loading:true})
            this.getUserData();               
        });
    }

    userDeleteConfirm = (id) => {
        this.setState({userId: id})
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure to do this.',
            buttons: [
              {
                label: 'Delete',
                onClick: () => {
                   this.userDelete()
                }
              },
              {
                label: 'Cancel',
                onClick: () => {}
              }
            ]
          });
    }

    addUser = () => {
        this.setState({mode:"add", flag:false, slideFormFlag: true})
        Common.showSlideForm();
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

    render () {
        const {filterColunm, userData} = this.state;
        return (
            <div className="order_div">
                <div className="content__header content__header--with-line">
                    <h2 className="title">{trls('Users')}</h2>
                </div>
                <div className="orders">
                    <Row>
                        <Col sm={6}>
                            <Button variant="primary" onClick={()=>this.addUser()}><i className="fas fa-plus add-icon"></i>{trls('Add_User')}</Button> 
                        </Col>
                        {/* <Col sm={6} className="has-search">
                            <div style={{display: 'flex', float: 'right'}}>
                                <Button variant="light" onClick={()=>this.changeFilter()}><i className="fas fa-filter add-icon"></i>{trls('Filter')}</Button>
                                <div style={{marginLeft: 20}}>
                                    <span className="fa fa-search form-control-feedback"></span>
                                    <Form.Control className="form-control fitler" type="text" name="number"placeholder={trls("Quick_search")}/>
                                </div>
                            </div>
                        </Col>
                        {this.state.filterData.length&&(
                            <Filtercomponent
                                onHide={()=>this.setState({filterFlag: false})}
                                filterData={this.state.filterData}
                                onFilterData={(filterOption)=>this.filterOptionData(filterOption)}
                                showFlag={this.state.filterFlag}
                            />
                        )} */}
                    </Row>
                    <div className="table-responsive credit-history">
                        <table id="example" className="place-and-orders__table table" width="100%">
                        <thead>
                            <tr>
                                {filterColunm.map((item, key)=>(
                                    <th className={!item.show ? "filter-show__hide" : ''} key={key}>
                                       {item.label}
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
                        {userData && !this.state.loading &&(<tbody >
                            {
                                userData.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td className={!this.showColumn(filterColunm[0].label) ? "filter-show__hide" : ''}>{data.userName}</td>
                                        <td className={!this.showColumn(filterColunm[1].label) ? "filter-show__hide" : ''}>{data.email}</td>
                                        <td className={!this.showColumn(filterColunm[2].label) ? "filter-show__hide" : ''}>{data.phoneNumber}</td>
                                        <td className={!this.showColumn(filterColunm[3].label) ? "filter-show__hide" : ''}>
                                            {data.isActive ? (
                                                <i className ="fas fa-check-circle active-icon"></i>
                                            ):
                                                <i className ="fas fa-check-circle inactive-icon"></i>
                                            }
                                        </td>
                                        <td className={!this.showColumn(filterColunm[4].label) ? "filter-show__hide" : ''} style={{width: 200}}>
                                            <Row style={{justifyContent:"space-around"}}>
												<i className="fas fa-trash-alt add-icon" onClick={()=>this.userDeleteConfirm(data.Id)}><span className="action-title">{trls('Delete')}</span></i>
												<i className="fas fa-pen add-icon" onClick={()=>this.userUpdate(data.Id)}><span className="action-title">{trls('Edit')}</span></i>
											</Row>
                                        </td>
                                    </tr>
                            ))
                            }
                        </tbody>)}
                    </table>
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
                {this.state.slideFormFlag ? (
                    <Adduserform
                        show={this.state.modalShow}
                        mode={this.state.mode}
                        onHide={() => this.setState({slideFormFlag: false})}
                        onGetUser={() => this.getUserData()}
                        userUpdateData={this.state.userUpdateData}
                        userID={this.state.userID}
                    /> 
                ): null}
                
            </div>
        )
        };
  }
    
  export default connect(mapStateToProps, mapDispatchToProps)(Userregister);
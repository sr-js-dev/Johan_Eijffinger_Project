import React, {Component} from 'react'
import { Row, Col, Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Addnewsform from './addnewsform';
import $ from 'jquery';
import SessionManager from '../../factories/session_manage';
import API from '../../factories/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../factories/translate';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'datatables.net';
import * as Common from '../../factories/common';
import * as Auth from '../../factories/auth';
import Filtercomponent from '../../components/filtercomponent';
import history from '../../history';
import Parser from 'html-react-parser';
import Sweetalert from 'sweetalert';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});

class Newsmanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            slideFormFlag: false,
            originFilterData: [],
            filterFlag: false,
            filterColunm: [
                {"label": 'Subject Dutch', "value": "subjectDutch", "type": 'text', "show": true},
                {"label": 'Subject English', "value": "subjectEnglish", "type": 'text', "show": true},
                {"label": 'Subject German', "value": "subjectGerman", "type": 'text', "show": true},
                {"label": 'Subject French', "value": "subjectFrench", "type": 'text', "show": true},
                {"label": 'Text Dutch', "value": "textDutch", "type": 'text', "show": true},
                {"label": 'Text English', "value": "textEnglish", "type": 'text', "show": true},
                {"label": 'Text German', "value": "textGerman", "type": 'text', "show": true},
                {"label": 'Text French', "value": "textFrench", "type": 'text', "show": true},
                {"label": 'Action', "value": "Action", "type": 'text', "show": true},
            ],
            userInfo: Auth.getUserInfo(), 
            mode: 'add',
            newsData: []
        };
    }

    componentDidMount() {
        this.getNewsData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    getNewsData (data) {    
        this._isMounted = true;
        this.setState({loading: true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetNews, headers)
        .then(result => {
            if(this._isMounted){
                if(!data){
                    this.setState({newsData: result.data, originFilterData: result.data});
                }else{
                    this.setState({newsData: data});
                }
                this.setState({loading:false})
                $('#news').dataTable().fnDestroy();
                $('#news').DataTable(
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
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        })
        
    }
    // filter module
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
    newsUpdate = (id) => {
        var settings = {
            "url": API.GetNewsDataById+id,
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+Auth.getUserToken(),
        }
        }
        $.ajax(settings).done(function (response) {
        })
        .then(response => {
            this.setState({newsUpdateData: response, mode:"update", slideFormFlag: true});
            Common.showSlideForm();
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        });
    }

    newView = (id) => {
        var settings = {
            "url": API.GetNewsDataById+id,
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+Auth.getUserToken(),
        }
        }
        $.ajax(settings).done(function (response) {
        })
        .then(response => {
            this.setState({newsUpdateData: response, mode:"view", slideFormFlag: true});
            Common.showSlideForm();
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        });
    }

    newsDelete = (id) => {
        var settings = {
            "url": API.DeleteNews+id,
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+Auth.getUserToken(),
        }
        }
        $.ajax(settings).done(function (response) {
        })
        .then(response => {
            Sweetalert("Success!", {
                icon: "success",
            });
            this.getNewsData();     
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        });
    }

    newsDeleteConfirm = (id) => {
        Sweetalert({
            title: "Are you sure?",
            text: trls("Are you sure to do this?"),
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.newsDelete(id)
            } else {
            }
        });
    }

    addNews = () => {
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
        const {filterColunm, newsData } = this.state;
        let filterData = [
            {"label": trls('Subject Dutch'), "value": "subjectDutch", "type": 'text'},
            {"label": trls('Subject English'), "value": "subjectEnglish", "type": 'text'},
            {"label": trls('Subject German'), "value": "subjectGerman", "type": 'text'},
            {"label": trls('Subject French'), "value": "subjectFrench", "type": 'text'},
            {"label": trls('Text Dutch'), "value": "textDutch", "type": 'text'},
            {"label": trls('Text Enghlish'), "value": "textEnglish", "type": 'text'},
            {"label": trls('Text German'), "value": "textGerman", "type": 'text'},
            {"label": trls('Text French'), "value": "textFrench", "type": 'text'},
        ]
        return (
            <div className="order_div">
                <div className="content__header content__header--with-line">
                    <h2 className="title">{trls('News')}</h2>
                </div>
                <div className="orders">
                    <Row>
                        <Col sm={6}>
                            {Auth.getRole()==="Administrator" || Auth.getRole()==="Customer" ?(
                                <Button variant="primary" onClick={()=>this.addNews()}><i className="fas fa-plus add-icon"></i>{trls('Add News')}</Button> 
                            ): <Button variant="primary" disabled onClick={()=>this.addNews()}><i className="fas fa-plus add-icon"></i>{trls('Add News')}</Button> }
                            
                        </Col>
                        <Col sm={6} className="has-search">
                            <div style={{display: 'flex', float: 'right'}}>
                                <Button variant="light" onClick={()=>this.changeFilter()}><i className="fas fa-filter add-icon"></i>{trls('Filter')}</Button>
                                <div style={{marginLeft: 20}}>
                                    <span className="fa fa-search form-control-feedback"></span>
                                    <Form.Control className="form-control fitler" type="text" name="number"placeholder={trls("Quick_search")}/>
                                </div>
                            </div>
                        </Col>
                        {filterData.length&&(
                            <Filtercomponent
                                onHide={()=>this.setState({filterFlag: false})}
                                filterData={filterData}
                                onFilterData={(filterOption)=>this.filterOptionData(filterOption)}
                                showFlag={this.state.filterFlag}
                            />
                        )}
                    </Row>
                    <div className="table-responsive credit-history">
                        <table id="news" className="place-and-orders__table table" width="99%">
                        <thead>
                            <tr>
                                {filterColunm.map((item, key)=>(
                                    <th className={!item.show ? "filter-show__hide" : ''} key={key}>
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
                        {newsData && !this.state.loading &&(<tbody >
                            {
                                newsData.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td className={!this.showColumn(filterColunm[0].label) ? "filter-show__hide" : ''}>{data.subjectDutch}</td>
                                        <td className={!this.showColumn(filterColunm[1].label) ? "filter-show__hide" : ''}>{data.subjectEnglish}</td>
                                        <td className={!this.showColumn(filterColunm[2].label) ? "filter-show__hide" : ''}>{data.subjectGerman}</td>
                                        <td className={!this.showColumn(filterColunm[3].label) ? "filter-show__hide" : ''}>{data.subjectFrench}</td>
                                        <td className={!this.showColumn(filterColunm[4].label) ? "filter-show__hide" : ''}>{Parser(data.textDutch)}</td>
                                        <td className={!this.showColumn(filterColunm[5].label) ? "filter-show__hide" : ''}>{Parser(data.textEnglish)}</td>
                                        <td className={!this.showColumn(filterColunm[6].label) ? "filter-show__hide" : ''}>{Parser(data.textGerman)}</td>
                                        <td className={!this.showColumn(filterColunm[7].label) ? "filter-show__hide" : ''}>{Parser(data.textFrench)}</td>
                                        <td className={!this.showColumn(filterColunm[8].label) ? "filter-show__hide" : ''} style={{width: 200}}>
                                            <Row style={{justifyContent:"space-around"}}>
                                                <i className="fas fa-pen add-icon" onClick={()=>this.newsUpdate(data.id)}><span className="action-title">{trls('Edit')}</span></i>
                                                <i className="fas fas fa-eye add-icon" onClick={()=>this.newView(data.id)}><span className="action-title">{trls('View')}</span></i>
                                                <i className="fas fa-trash-alt add-icon" onClick={()=>this.newsDeleteConfirm(data.id)}><span className="action-title">{trls('Delete')}</span></i>
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
                    <Addnewsform
                        show={this.state.modalShow}
                        mode={this.state.mode}
                        onHide={() => this.setState({slideFormFlag: false, newsUpdateData: [], mode: 'add'})}
                        onGetnewData={() => this.getNewsData()}
                        newsUpdateData={this.state.newsUpdateData}
                    /> 
                ): null}
            </div>
        )
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Newsmanage);

import React, {Component} from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../factories/session_manage';
import API from '../../factories/api'
import Axios from 'axios';
import { trls } from '../../factories/translate';
import * as Common from '../../factories/common';
import history from '../../history';
import DatePicker from "react-datepicker";
import CKEditor from "react-ckeditor-component"

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
});

class Addnewform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        const { newsUpdateData, mode } = this.props;
        this.state = {  
            val1: '',
            val2: '1',
            startDate: mode==='add' ? new Date() : new Date(newsUpdateData.startDate),
            endDate: mode==='add' ? new Date() : new Date(newsUpdateData.endDate),
            textDutch: mode==='add' ? '' : newsUpdateData.textDutch,
            textEnglish: mode==='add' ? '' : newsUpdateData.textEnglish,
            textGerman: mode==='add' ? '' : newsUpdateData.textGerman,
            textFrench: mode==='add' ? '' : newsUpdateData.textFrench,
            subjectDutch: mode==='add' ? '' : newsUpdateData.subjectDutch,
            subjectEnglish: mode==='add' ? '' : newsUpdateData.subjectEnglish,
            subjectGerman: mode==='add' ? '' : newsUpdateData.subjectGerman,
            subjectFrench: mode==='add' ? '' : newsUpdateData.subjectFrench,
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
    }

    handleSubmit = (event) => {
        this._isMounted = true;
        var headers = SessionManager.shared().getAuthorizationHeader();
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        const { textDutch, textEnglish, textGerman, textFrench, startDate, endDate } = this.state;
        const { newsUpdateData } = this.props;
        let params = {
            "subjectDutch": data.subjectdutch,
            "subjectEnglish": data.subjectenglish,
            "subjectGerman": data.subjectfrench,
            "subjectFrench": data.subjectgerman,
            "textDutch": textDutch,
            "textEnglish": textEnglish,
            "textGerman": textGerman,
            "textFrench": textFrench,
            "startDate": startDate,
            "endDate": endDate,
        }     
        if(this.props.mode==="add"){
            Axios.post(API.Postnews, params, headers)
            .then(result => {
                if(this._isMounted){
                    this.onHide();
                }
            })
            .catch(err => {
            });
        }else{
            params = {
                "subjectDutch": data.subjectdutch,
                "subjectEnglish": data.subjectenglish,
                "subjectGerman": data.subjectfrench,
                "subjectFrench": data.subjectgerman,
                "textDutch": textDutch,
                "textEnglish": textEnglish,
                "textGerman": textGerman,
                "textFrench": textFrench,
                "startDate": startDate,
                "endDate": endDate,
              }
            headers = SessionManager.shared().getAuthorizationHeader();
            Axios.post(API.UpdateNews+newsUpdateData.id, params, headers)
            .then(result => {
                this.onHide();
            })
            .catch(err => {
                if(err.response.status===401){
                    history.push('/login')
                }
            })
        }
    }

    getRoles (value) {
        this.setState({val1:value.value})
    }
    
    onHide = () => {
        this.props.onGetnewData()
        this.props.onHide();
        Common.hideSlideForm();
    }

    render(){   
        const { mode } = this.props;
        const { textDutch, textEnglish, textGerman, textFrench, subjectDutch, subjectEnglish, subjectGerman, subjectFrench } = this.state;
        return (
            <div className = "slide-form__controls open" style={{height: "100%"}}>
                <div style={{marginBottom:30}}>
                    <i className="fas fa-times slide-close" style={{ fontSize: 20, cursor: 'pointer'}} onClick={()=>this.onHide()}></i>
                </div>
                <Form className="container" onSubmit = { this.handleSubmit }>
                    <Col className="title add-product">{mode==="add" ? trls('Add News') : (mode==="update" ? trls('Edit News') : trls('View News'))}</Col>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col>
                            <DatePicker name="startdate" className="myDatePicker"  dateFormat="dd-MM-yyyy" selected={this.state.startDate} onChange={date =>this.setState({startDate: date})} readOnly={mode==="view" ? true : false}/>
                            <label className="placeholder-label">{trls('StartDate')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col>
                            <DatePicker name="enddate" className="myDatePicker"  dateFormat="dd-MM-yyyy" selected={this.state.endDate} onChange={date =>this.setState({endDate: date})} readOnly={mode==="view" ? true : false}/>
                            <label className="placeholder-label">{trls('EndDate')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col>
                            <Form.Control type="text" name="subjectdutch" required defaultValue={subjectDutch} placeholder={trls('Subject Dutch')} readOnly={mode==="view" ? true : false}/>
                            <label className="placeholder-label">{trls('Subject Dutch')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col>
                            <CKEditor 
                                activeClass="p30" 
                                height="30px"
                                content={textDutch} 
                                config={{
                                    height:"80px" ,
                                    readOnly: mode==="view" ? true : false
                                }}
                                events={{
                                    "change":(evt)=>this.setState({textDutch: evt.editor.getData()})
                                }}
                            />
                            <label className="placeholder-label">{trls('Text Dutch')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col>
                            <Form.Control type="text" name="subjectenglish" required defaultValue={subjectEnglish} placeholder={trls('Subject English')} readOnly={mode==="view" ? true : false}/>
                            <label className="placeholder-label">{trls('Subject English')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col>
                            <CKEditor 
                                activeClass="p30" 
                                height="30px"
                                content={textEnglish} 
                                config={{
                                    height:"80px" ,
                                    readOnly: mode==="view" ? true : false
                                }}
                                events={{
                                    "change":(evt)=>this.setState({textEnglish: evt.editor.getData()})
                                }}
                            />
                            <label className="placeholder-label">{trls('Text English')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col>
                            <Form.Control type="text" name="subjectgerman" required defaultValue={subjectGerman} placeholder={trls('Subject German')} readOnly={mode==="view" ? true : false}/>
                            <label className="placeholder-label">{trls('Subject German')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col>
                            <CKEditor 
                                activeClass="p30" 
                                height="30px"
                                content={textGerman} 
                                config={{
                                    height:"80px" ,
                                    readOnly: mode==="view" ? true : false
                                }}
                                events={{
                                    "change":(evt)=>this.setState({textGerman: evt.editor.getData()})
                                }}
                            />
                            <label className="placeholder-label">{trls('Text German')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col>
                            <Form.Control type="text" name="subjectfrench" required defaultValue={subjectFrench} placeholder={trls('Subject French')} readOnly={mode==="view" ? true : false}/>
                            <label className="placeholder-label">{trls('Subject French')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col>
                            <CKEditor 
                                activeClass="p30" 
                                height="30px"
                                content={textFrench} 
                                config={{
                                    height:"80px" ,
                                    readOnly: mode==="view" ? true : false
                                }}
                                events={{
                                    "change":(evt)=>this.setState({textFrench: evt.editor.getData()})
                                }}
                            />
                            <label className="placeholder-label">{trls('Text French')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group >
                        <Col>
                            <Button type="submit" style={{width: "15%"}}>{trls('Save')}</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Addnewform);
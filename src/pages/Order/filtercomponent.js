import React from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import { trls } from '../../factories/translate';
import DatePicker from "react-datepicker";

class Filtercomponent extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            validation: true,
            conditions: [{"value": "And", "label": "And"}, {"value": "Or", "label": "Or"}],
            selectedFilterOption: {},
            selectedValue: {
                // docDate: new Date()
            },
            // actions: [{"value": "Contains", "label": "Contains"}, {"value": "Is", "label": "Is"}],
            // dateaActions: [{"value": "Between", "label": "Between"}],
            filterData: this.props.filterData,
            filterOptionData: [],
            selectDate: new Date()
            // endDate: new Date(),
            // datePickerFlag: false
        };

    }
    
    addFilterOption = () => {
        let filterOptionData = this.state.filterOptionData;
        let filterData = this.state.filterData;
        if(filterOptionData.length > 0){
            let usedFilterOptions = filterOptionData.map(data => data.filterOption);
            let newFilterData = filterData.filter(data => {return usedFilterOptions.indexOf(data.value) === -1 })
            this.setState({
                filterData: newFilterData
            })
        }

        // let data = [];
        // data.startDate = this.state.selectDate;
        // data.endDate = this.state.endDate;
        // if(filterOptionData.length===0){
        //     data.condition = 'where';
        // }
        filterOptionData.push({});
        this.checkFilterOptionValidation(filterOptionData);
        this.setState({filterOptionData: filterOptionData});
    }
    checkFilterOptionValidation = (filterOptionData) => {
        let temp = filterOptionData.filter(data => {
            return data.filterOption === undefined || data.value === undefined
         })
         if(temp.length > 0){
             this.setState({ validation: false })
         } else {
            
            this.setState({ validation: true })
         }
    }

    removeFilterOption = (index) => {
        let arr = this.state.filterOptionData; //removed filter option
        // let temp = this.state.filterData;//available filter options
        // console.log("temp", temp)
        // console.log("UUUUU", arr[index])
        // temp = [...temp, arr[index]];
        // this.setState({
        //     filterData: temp
        // })
        // arr = arr.filter(function(item, key) {
        //     return key !== index
        // })
        arr.splice(index, 1);
        this.checkFilterOptionValidation(arr);
        this.setState({filterOptionData: arr});
    }

    // handleEnterKeyPress = (e, index) => {
    //     console.log("*********")
    //     this.setState({flag: true});
    //     if(e.target.value.length===4){
    //         let today = new Date();
    //         let year = today.getFullYear();
    //         let date_day_month = e.target.value;
    //         let day = date_day_month.substring(0,2);
    //         let month = date_day_month.substring(2,4);
    //         let setDate = new Date(year + '-'+ month + '-' + day)
    //         let arr = this.state.filterOptionData;
    //         arr.map((item, key)=>{
    //             if(key===index){
    //                 item.date = setDate;
    //                 // if(mode==="start"){
    //                 //     item.startDate = setDate;
    //                 // }else{
    //                 //     item.endDate = setDate;
    //                 // }
    //             }
    //             return item;
    //         })
    //         this.setState({filterOptionData: arr});
    //         // if(mode==="start"){
    //         //     this.setState({selectDate: setDate})
    //         // }else{
    //         //     this.setState({endDate: setDate})
    //         // }
    //     }
    // }
    dateConvert = (str) => {
        var date = new Date(str),
        mm = ("0" + (date.getMonth() + 1)).slice(-2),
        dd = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mm, dd].join("-");
    }

    onChangeDate = (dt, e, index, filterOption) => {
        // let temp = {};
        // temp = this.state.selectedValue;
        // arr = arr.filter(function(item, key) {
        //     return item.value !== val.value
        // })
        // if(option.type==="date"){
        //     this.setState({datePickerFlag: true});
        // }else{
        //     this.setState({datePickerFlag: false});
        // }

        // this.setState({filterData: arr})
        // temp[filterOption] = dt;
        // this.setState({selectedValue: temp})
        this.setState({selectDate: dt})

        let date = this.dateConvert(dt)
        let arr = this.state.filterOptionData;
        if(e.type==="click"){
            arr.map((item, key)=>{
                if(key===index){
                    item.value = date;
                    // if(mode==="start"){
                    //     item.startDate = date;
                    // }else{
                    //     item.endDate = date;
                    // }
                }
                return item;
            })
            this.setState({filterOptionData: arr});
            // if(mode==="start"){
            //     this.setState({selectDate: date})
            // }else{
            //     this.setState({endDate: date})
            // }
        }
    }

    // changeCondition = (val, index) => {
    //     let arr_condition = this.state.conditions;
    //     if(val.value==="where"){
    //         arr_condition = arr_condition.filter(function(item, key) {
    //             return item.value !== val.value
    //         })
    //         this.setState({conditions: arr_condition})
    //     }
    //     let arr = this.state.filterOptionData;
    //     arr.map((item, key)=>{
    //         if(key===index){
    //             item.condition = val.value;
    //         }
    //         return item;
    //     })
    //     this.setState({filterOptionData: arr});
    // }

    changeFilterOption = (option, index) => {
        // let arr = this.state.filterData;
        let temp = {};
        temp = this.state.selectedFilterOption;
        // arr = arr.filter(function(item, key) {
        //     return item.value !== val.value
        // })
        // if(option.type==="date"){
        //     this.setState({datePickerFlag: true});
        // }else{
        //     this.setState({datePickerFlag: false});
        // }

        // this.setState({filterData: arr})
        temp[option.value] = option;
        this.setState({selectedFilterOption: temp})

        let arr_option = this.state.filterOptionData;
        arr_option.map((item, key)=>{
            if(key===index){
                if(option.type==="date"){
                    item.value = this.dateConvert(this.state.selectDate);
                    item.dateFlag = true;
                }else{
                    item.dateFlag = false;
                }
                item.filterOption = option.value;
            }
            return item;
        })
        this.checkFilterOptionValidation(arr_option);
        this.setState({filterOptionData: arr_option});
    }

    // filterChangeMode = (val, index) => {
    //     let arr = this.state.filterOptionData;
    //     arr.map((item, key)=>{
    //         if(key===index){
    //             item.mode = val.value;
    //         }
    //         return item;
    //     })
    //     this.setState({filterOptionData: arr});
    // }

    changeValue = (evt, index, filterOption) => {
        let arr = this.state.filterOptionData;
        let temp = {};
        temp[filterOption] = evt.target.value;
        this.setState({
            selectedValue: temp
        })
        arr.map((item, key)=>{
            if(key===index){
                item.value = evt.target.value;
            }
            return item;
        })
        this.checkFilterOptionValidation(arr);
        this.setState({filterOptionData: arr});
    }

    onFilterData = () => {
        let filterOptionData = this.state.filterOptionData;
        var mergedObj = {};
        filterOptionData.map((data, index) => {
            if(JSON.stringify(data) !== '{}'){
                var temp = {};
                 if(data.filterOption === 'docNum'){
                     temp = {
                         'docNum': data.value
                     }
                 } else if(data.filterOption === 'docDate'){
                    temp = {
                        'docDate': data.value
                    }
                 } else if(data.filterOption === 'lineStatus'){
                    temp = {
                        'lineStatus': data.value
                    }
                 } else if(data.filterOption === 'itemCode'){
                    temp = {
                        'itemCode': data.value
                    }
                 }
                Object.assign(mergedObj, temp);
            }
            return mergedObj;
        })
        // console.log("&&&&&&&&&&", mergedObj)
        this.props.onFilterData(mergedObj);
        this.props.onHide();
    }

    render() {
        const{filterData, filterOptionData, selectDate, validation, selectedFilterOption, selectedValue} = this.state;
        return (
            <Col sm={3} className={!this.props.showFlag ? "multi-filter__div filter-show__hide" : "multi-filter__div" }>
                {filterOptionData.map((data, index) =>(
                    <div key={index} style={{display: 'flex', paddingTop: 10, justifyContent: "space-between"}}>
                        {/* {data.condition==="where" ? (
                            <div style={{width: "20%"}}>{filterOptionData[0].condition}</div>
                        ):
                            <Select
                                name="filter"
                                className="filter-header__option"
                                options={this.state.conditions}
                                onChange={(val)=>this.changeCondition(val, index)}
                            /> 
                        } */}
                        <Select
                            name="filter"
                            className="order-filter-header__option"
                            options={filterData}
                            onChange={(val)=>this.changeFilterOption(val, index)}
                            value={selectedFilterOption[data.filterOption]}
                            // isDisabled={index !== filterOptionData.length && Object.keys(data).length > 0}
                        />
                        {/* {!data.dateFlag && (
                            <Select
                                name="filter"
                                className="filter-header__option"
                                options={datePickerFlag ? dateaActions : actions}
                                onChange={(val)=>this.filterChangeMode(val, index)}
                            />
                        )} */}
                        {!data.dateFlag ? (
                            <Form.Control className="order-filter-header__option" type="text" name="number" placeholder="value" value={selectedValue[data.filterOption]} onChange={(evt)=>this.changeValue(evt, index, data.filterOption)}/>
                        ):(
                            <div className="order-filter-header__option">
                                <DatePicker name="date" id="date" className="myDatePicker filter-date__picker" dateFormat="dd-MM-yyyy" selected={selectDate} onChange = {(value, e)=>this.onChangeDate(value, e, index, data.filterOption)} />
                            </div>
                        )}
                        {/* {data.dateFlag && (
                             <div className="filter-header__option">
                                <DatePicker name="enddate" id="enddate" className="myDatePicker filter-date__picker" dateFormat="dd-MM-yyyy" selected={this.state.endDate} onChange = {(value, e)=>this.onChangeDate(value, e, index, 'end')} customInput={<input onKeyUp={(event)=>this.handleEnterKeyPress(event, index, 'end')}/>}/>
                            </div>
                        )} */}
                        <i className="fas fa-times" style={{ fontSize: 20, cursor: 'pointer', marginTop: 4}} onClick={()=>this.removeFilterOption(index)}></i>
                    </div>
                ))}
                <div style={{padding:"20px 10px", fontSize: 12, display: 'flex'}}>
                    <Button disabled={!validation} variant="primary" style={{cursor: "pointer"}} onClick={this.addFilterOption}><i className="fas fa-plus add-icon"></i>{trls('Add_filter')}</Button> 
                    <Button disabled={!validation} variant="primary" style={{cursor: "pointer", marginLeft: "auto"}}  onClick={this.onFilterData}><i className="fas fa-filter add-icon"></i>{trls('Filter')}</Button> 
                </div>
            </Col>
        );
    } 
}
export default Filtercomponent;
    
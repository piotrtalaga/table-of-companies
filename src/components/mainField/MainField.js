import React, {Component} from "react";
import getDataFromAPI from '../../api/GetDataFromAPI';
import getCompaniesIncome from './GetCompaniesIncome';
import Table from "./Table";

/**
 * A component that launches all the main functions, like getting data from API and counting incomes and gives them to
 * component that creates Table
 */
class MainField extends Component{

    state = {
        companiesData: null,
        sortedBy: null,
        filteredData: null
    };

    /**
     * launches the functions that gets data from API and calculate incomes and passes it to the state
     * @method
     */
    loadAllCompaniesData = () => {
        getDataFromAPI('companies').then(companies => {
            companies.sort((a, b) => {
                return a.id - b.id;
            });
            getCompaniesIncome(companies).then(companies => {
                this.setState({
                    companiesData: companies,
                    sortedBy: 'id',
                    filteredData: companies
                });
            });
        })
    };

    /**
     * sorts the data by chosen value and saves the filtered data in state
     * @method
     * @param {event} e event
     * @param {string} dataType type of data by which the data is sorted
     */
    dataSort = (e, dataType) => {
        const companiesToSort = [...this.state.filteredData];
        let sorted = this.state.sortedBy;
        if(dataType==='name' || dataType==='city'){
            if(sorted === dataType){
                companiesToSort.sort((a, b) => {
                    return b[`${dataType}`].localeCompare(a[`${dataType}`]);
                });
                sorted = "-"+dataType;
            }
            else{
                companiesToSort.sort((a, b) => {
                    return a[`${dataType}`].localeCompare(b[`${dataType}`]);
                });
                sorted = dataType;
            }
        }
        else {
            if(sorted === dataType){
                companiesToSort.sort((a, b) => {
                    return b[`${dataType}`] - a[`${dataType}`];
                });
                sorted = "-"+dataType;
            }
            else{
                companiesToSort.sort((a, b) => {
                    return a[`${dataType}`] - b[`${dataType}`];
                });
                sorted = dataType;
            }
        }
        this.setState({
            filteredData: companiesToSort,
            sortedBy: sorted
        });
    };

    /**
     * filters the data by chosen value and phrase that is passed in props and saves the filtered data in state
     * @method
     * @param {string} phrase a phrase by which data is filtered
     * @param {string} dataType type of data by which the data is sorted
     */
    filterData = (phrase, dataType) => {
        let newFilteredData = [...this.state.companiesData];
        if(phrase) {
            newFilteredData = newFilteredData.filter((element) => {
                return String(element[`${dataType}`]).includes(phrase);
            });
        }
        this.setState({
           filteredData: newFilteredData
        });
    };

    componentDidMount() {
        this.loadAllCompaniesData();
    }

    componentDidUpdate(prevProps) {
        const {searchedPhrase, askType} = this.props;
        if(searchedPhrase !== prevProps.searchedPhrase || askType !== prevProps.askType){
            this.filterData(searchedPhrase, askType);
        }
    }

    render() {
        return <Table companies={this.state.filteredData} dataSort={this.dataSort}/>
    }
}

export default MainField;

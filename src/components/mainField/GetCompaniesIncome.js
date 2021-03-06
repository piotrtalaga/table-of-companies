import getDataFromAPI from "../../api/GetDataFromAPI";

/**
 * function that gets incomes from API for each company and counts total, average and last month income
 * @function
 * @param {array} companies an array of data about companies
 * @return {companies} an array with data about companies with added data about incomes for each company
 */
const getCompaniesIncome = async (companies) => {
    let companiesUpdate = companies;
    let urls = [];
    companies.forEach( company=> {
        urls.push(`incomes/${company.id}`);
    });
    let requests = urls.map(url => getDataFromAPI(url));
    await Promise.all(requests)
        .then(incomes => incomes.forEach(
            (income, index) => {
                companiesUpdate[index].total_income = countTotalIncome(income.incomes);
                companiesUpdate[index].average_income = countAverageIncome(income.incomes);
                companiesUpdate[index].last_month_income = countLastMonthIncome(income.incomes);
            }
        ));
    return companiesUpdate;
};

/**
 * function that counts total income of one company
 * @function
 * @param {array} incomes an array of data about company incomes
 * @return {number} a total income
 */
const countTotalIncome = (incomes) => {
    let totalIncome = 0;
    for (let i = 0; i < incomes.length ; i++){
        totalIncome += parseFloat(incomes[i].value);
    }
    return parseFloat(totalIncome.toFixed(2));
};

/**
 * function that counts average income of one company
 * @function
 * @param {array} incomes an array of data about company incomes
 * @return {number} an average income
 */
const countAverageIncome = (incomes) => {
    return parseFloat((countTotalIncome(incomes)/incomes.length).toFixed(2));
};

/**
 * function that counts total income of one company from recent month
 * @function
 * @param {array} incomes an array of data about company incomes
 * @return {number} a total income from recent month
 */
const countLastMonthIncome = (incomes) => {
    let lastMonthIncomes = [...incomes];
    let recentData = 0;
    lastMonthIncomes.forEach( income => {
        let yearAndMonth = Number(income.date.substr(0,7).replace("-", ""));
        if(yearAndMonth > recentData){
            recentData = yearAndMonth;
        }
    });
    lastMonthIncomes = lastMonthIncomes.filter( income => {
        return recentData === Number(income.date.substr(0,7).replace("-", ""));
    });
    return countTotalIncome(lastMonthIncomes);
};

export default getCompaniesIncome;
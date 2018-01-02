const _ = require('lodash');
const moment = require('moment');
const { importCsv } = require('./csv-import-export')

const getNewId = (i => () => i++)(0);

const parseSterlingToFloat = (sterling) => parseInt(sterling.replace('£','').replace('.', ''));


const newTransactionObj = (transaction, modifiers) => {
  const id = getNewId();
  const methods = {
    id: () => id,
    transaction: () => transaction,
    date: () => moment(modifiers.date || transaction.date, 'DD-MM-YYYY').toDate(),
    amount: () => parseSterlingToFloat(transaction.amount),
    description: () => transaction.description,
    toString: () => ({ id, transaction }),
    addModifier: newModifiers => newTransactionObj(transaction, Object.assign({}, modifiers, newModifiers)),
  }
  return methods;
}

const csv = importCsv('./data/statement.csv', (headers) => {
  const headerMap = { Date: 'date', Description: 'description', Value: 'amount' }
  return headers.map(header => headerMap[header] || header);
})

const transactions = csv.map(newTransactionObj)

/* const transactions = [
 *   { date: '02/06/2016', description: 'Description string', amount: "-£34.20" },
 *   { date: '01/06/2016', description: 'Description string', amount: "-£10" },
 *   { date: '01/06/2016', description: 'Description string', amount: "-£5" },
 *   { date: '01/06/2016', description: 'Description string', amount: "-£2" },
 *   { date: '03/06/2016', description: 'Description string', amount: "£200.34" },
 *   { date: '09/06/2016', description: 'rent', amount: "£750" },
 *   { date: '02/07/2016', description: 'Description string', amount: "-£18" },
 *   { date: '08/07/2016', description: 'Description string', amount: "-£37" },
 *   { date: '30/06/2016', description: 'Description string', amount: "-£52" },
 *   { date: '02/06/2016', description: 'This is rent', amount: "-£2.86" },
 * ].map(newTransactionObj);
 * */
const minDate = () => _.minBy(transactions, t => t.date()).date();
const maxDate = () => _.maxBy(transactions, t => t.date()).date();

const createOrderedDateRange = (firstDay, lastDay) => {
  const start = moment(firstDay)
  const finish = moment(lastDay)
  const range = [];
  for(let day = start; day <= finish; day = day.add(1, 'days')){
    range.push(day.toDate());
  }
  return range;
}

const isRent = (transaction) => {
  return transaction.description().includes('rent')
}

const category = (transaction) => {
  if (isRent(transaction))
    return 'rent';
  if (transaction.amount() > 0)
    return 'income';
  return 'spending';
}

const keyByDateAndCategory = (transactions) => {
  return transactions.reduce((memo, t) =>
    _.update(memo, [t.date(), category(t)], val => (val || []).concat(t)),
    {}
  ) };

const total = (transactions) => {
  return (transactions || []).reduce((sum, t) => sum + t.amount(), 0)
};


const createTotalsByDate = (transactions) => {
  const transactionsByDateAndCategory = keyByDateAndCategory(transactions);
  const dateRange = createOrderedDateRange(minDate(transactions), maxDate(transactions));
  return dateRange.map(date => {
    const transactionsOnThisDate = transactionsByDateAndCategory[date] || {};
    const spending = total(transactionsOnThisDate.spending);
    const rent = total(transactionsOnThisDate.rent);
    const income = total(transactionsOnThisDate.income);
    return {
      date, spending, rent, income, transactions: transactionsOnThisDate,
    };
  });
};

const createMonthlyTotals = (totalsByDate) => {
  const monthlyTotals = {};
  totalsByDate.forEach(dayTotals => {
    const month = moment(dayTotals.date).format('MM-YYYY')
    if(!monthlyTotals[month])
      monthlyTotals[month] = {spending: 0, rent: 0, income: 0 }
    monthlyTotals[month].spending += dayTotals.spending;
    monthlyTotals[month].rent += dayTotals.rent;
    monthlyTotals[month].income += dayTotals.income;
  })
  return monthlyTotals;
}

const addBalances = (totalsByDate, monthlyTotals) => {
  let spendingSoFar = 0;
  let balance = 0;
  return totalsByDate.map(dayTotals => {
    const dayOfMonth = moment(dayTotals.date).date();
    spendingSoFar = (dayOfMonth !== 1 ? spendingSoFar : 0) + dayTotals.spending;
    balance += (dayTotals.spending + dayTotals.income + dayTotals.rent)
    return { date: dayTotals.date, spendingSoFar, balance }
  })
}


const totalsByDate = createTotalsByDate(transactions)

const monthlyTotals = createMonthlyTotals(totalsByDate)

const balances = addBalances(totalsByDate, monthlyTotals);
console.log(balances.map(( date, i ) => Object.assign({}, totalsByDate[i], balances[i])))

console.log(_.sumBy(transactions, t => t.amount()))


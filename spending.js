const _ = require('lodash');
const moment = require('moment');

const getNewId = (i => () => i++)(0);

const newTransactionObj = (transaction, modifiers) => {
  const id = getNewId();
  const methods = {
    id: () => id,
    transaction: () => tansaction,
    date: () => modifiers.date || transaction.date,
    amount: () => transaction.amount,
    description: () => transaction.description,
    toString: () => ({ id, transaction }),
    addModifier: newModifiers => newTransactionObj(transaction, Object.assign({}, modifiers, newModifiers)),
  }
  return methods;
}

const transactions = [
  { date: new Date('2016-06-02'), description: 'Description string', amount: -34.20 },
  { date: new Date('2016-06-01'), description: 'Description string', amount: -10 },
  { date: new Date('2016-06-01'), description: 'Description string', amount: -5 },
  { date: new Date('2016-06-01'), description: 'Description string', amount: -2 },
  { date: new Date('2016-06-03'), description: 'Description string', amount: 200.34 },
  { date: new Date('2016-06-09'), description: 'rent', amount: 750 },
  { date: new Date('2016-07-02'), description: 'Description string', amount: -18 },
  { date: new Date('2016-07-08'), description: 'Description string', amount: -37 },
  { date: new Date('2016-06-30'), description: 'Description string', amount: -52 },
  { date: new Date('2016-06-02'), description: 'This is rent', amount: -2.86 },
].map(newTransactionObj);

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

const createBalances = (totalsByDate, monthlyTotals) => {
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

const balances = createBalances(totalsByDate, monthlyTotals);
console.log(balances.map(( date, i ) => Object.assign({}, totalsByDate[i], balances[i])))

console.log(_.sumBy(transactions, t => t.amount()))

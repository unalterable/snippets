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
  { date: new Date('2016-06-09'), description: 'cash', amount: 750 },
  { date: new Date('2016-07-01'), description: 'Description string', amount: -18 },
  { date: new Date('2016-06-02'), description: 'This is rent', amount: -2.86 },
].map(newTransactionObj);

const minDate = () => _.minBy(transactions, t => t.date()).date();
const maxDate = () => _.maxBy(transactions, t => t.date()).date();

const dateRange = (firstDay, lastDay) => {
  const start = moment(firstDay)
  const finish = moment(lastDay)
  const range = [];
  for(let day = start; day <= finish; day = day.add(1, 'days')){
    range.push(day.toDate());
  }
  return range;
}

const rentMatchers = [
  t => t.description().includes('rent'),
  t => t.amount() === -750 && t.description().includes('cash'),
];

const category = transaction => {
  if (_.some(rentMatchers, matcher => matcher(transaction)))
    return 'rent';
  if (transaction.amount() > 0)
    return 'income';
  return 'spending';
}

const keyByDateAndCategory = transactions => transactions.reduce((memo, t) =>
  _.update(memo, [t.date(), category(t)], val => (val || []).concat(t)),
  {}
)
const total = transactions => (transactions || []).reduce((sum, t) => sum + t.amount(), 0);

console.log(transactions.map(t => t.toString()))
console.log()

const transactionsByDateAndCategory = keyByDateAndCategory(transactions)
console.log(transactionsByDateAndCategory)
console.log()

const thisDateRange = dateRange(minDate(transactions), maxDate(transactions));
console.log(thisDateRange.map(date => ({
  date: moment(date).format('DD-MM-YYYY'),
  spending: total(( transactionsByDateAndCategory[date] || {} ).spending),
  rent: total(( transactionsByDateAndCategory[date] || {} ).rent),
  income: total(( transactionsByDateAndCategory[date] || {} ).income),
  transactions: transactionsByDateAndCategory[date] || {},
})))

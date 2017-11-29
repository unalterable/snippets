const _ = require( 'lodash');

const transactions = [
  { date: 0, amount: -206 },
  { date: 0, amount: -231 },
  { date: 1, amount: -391 },
  { date: 3, amount: 178 },
  { date: 2, amount: -432 },
  { date: 2, amount: 485 },
  { date: 4, amount: -299 },
  { date: 5, amount: -125 },
  { date: 6, amount: 447 },
  { date: 2, amount: 30 },
  { date: 3, amount: -305 },
  { date: 5, amount: 66 },
  { date: 12, amount: -469 },
  { date: 8, amount: -184 },
  { date: 0, amount: 492 },
  { date: 12, amount: -171 },
  { date: 6, amount: 325 },
  { date: 16, amount: 91 },
  { date: 4, amount: 71 },
  { date: 9, amount: -123 },
  { date: 10, amount: 390 },
  { date: 10, amount: 60 },
  { date: 11, amount: 258 },
  { date: 17, amount: 152 },
  { date: 20, amount: -217 },
  { date: 16, amount: -467 },
  { date: 15, amount: -48 },
  { date: 4, amount: 405 },
  { date: 11, amount: 435 },
  { date: 19, amount: -70 },
  { date: 11, amount: 122 },
  { date: 28, amount: -127 },
  { date: 19, amount: 319 },
  { date: 20, amount: -449 },
  { date: 15, amount: -296 },
  { date: 6, amount: 383 },
  { date: 29, amount: -427 },
  { date: 25, amount: 229 },
  { date: 20, amount: -132 },
  { date: 9, amount: -274 },
  { date: 2, amount: -92 },
  { date: 1, amount: 35 },
  { date: 40, amount: -291 },
  { date: 39, amount: -427 },
  { date: 18, amount: -266 },
  { date: 25, amount: -213 },
  { date: 29, amount: 355 },
  { date: 40, amount: -466 },
  { date: 35, amount: -215 },
  { date: 46, amount: -415 },
  { date: 3, amount: 215 },
  { date: 42, amount: -119 },
  { date: 4, amount: -336 },
  { date: 38, amount: -151 },
  { date: 35, amount: -386 },
  { date: 22, amount: -135 },
  { date: 8, amount: 350 },
  { date: 13, amount: -14 },
  { date: 41, amount: 420 },
  { date: 30, amount: 347 },
  { date: 33, amount: -273 },
  { date: 29, amount: -121 },
  { date: 37, amount: -407 },
  { date: 1, amount: 312 },
  { date: 10, amount: 126 },
  { date: 34, amount: 477 },
  { date: 17, amount: 218 },
  { date: 1, amount: 39 },
  { date: 32, amount: 107 },
  { date: 28, amount: 499 },
  { date: 12, amount: 261 },
  { date: 20, amount: -222 },
  { date: 31, amount: 278 },
  { date: 46, amount: -44 },
  { date: 9, amount: 102 },
  { date: 33, amount: -430 },
  { date: 36, amount: -129 },
  { date: 4, amount: 134 },
  { date: 3, amount: 180 },
  { date: 35, amount: 116 },
  { date: 28, amount: 206 },
  { date: 42, amount: 286 },
  { date: 12, amount: 164 },
  { date: 30, amount: 242 },
  { date: 20, amount: 168 },
  { date: 3, amount: -153 },
  { date: 41, amount: 75 },
  { date: 37, amount: -50 },
  { date: 16, amount: 51 },
  { date: 13, amount: -355 },
  { date: 41, amount: -473 }
];

let calcs = {};

const calc = msg => calcs[msg] = (calcs[msg] || 0) + 1;

const showCalcs = func => {
  console.log('================================');
  console.log(func.toString());
  console.log();
  func();
  _.forIn(calcs, (v, k) => console.log(k+':', v))
  console.log('================================');
  console.log();
  calcs = {};
}

const resolver = (...args) => JSON.stringify(args);

const allDates = Array(50).fill().map((a,i)=>i);

const filterByDate = (transactions, date) => {
  calc('filterByDate');
  return transactions.filter(transaction => transaction.date === date);
}

const mFilterByDate = _.memoize(filterByDate, resolver)

const totaller = (...transactions) => {
  calc('totaller');
  return { amount: transactions.reduce((sum, t)=>t.amount+sum, 0) };
}

const mTotaller = _.memoize(totaller, resolver)

const dateList = (transactions) => allDates.map((date) => mFilterByDate(transactions, date))

const totals = (listOfLists) => listOfLists.map(list => mTotaller(...list));



showCalcs(() => {
  dateList(transactions);
})

showCalcs(() => {
  totals(dateList(transactions));
})


showCalcs(() => {
  transactions.push({ date: 9, amount: 1000000 })
  totals(dateList(transactions))
})

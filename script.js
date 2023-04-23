'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Bohdan Alieksieiev',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2023-04-15T14:11:59.604Z',
    '2023-04-19T17:01:17.194Z',
    '2023-04-20T23:36:17.929Z',
    '2023-04-21T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'uk', // de-DE
  flag: '/ua.png',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
  flag: '/pt.png',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
  flag: '/us.png',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
  flag: '/pt.png',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.floor(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatCur(
      mov,
      acc.locale,
      acc.currency
    )}</div>
  </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCur(incomes, acc.locale, acc.currency)}`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc - mov, 0);
  labelSumOut.textContent = `${formatCur(outcomes, acc.locale, acc.currency)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${formatCur(
    interest,
    acc.locale,
    acc.currency
  )}`;
};
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //display movements
  displayMovements(acc);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};

const updateUIOnLogOut = function () {
  containerApp.style.opacity = 0;
  containerApp.style.display = 'none';
  currentAccount = 0;
  labelWelcome.textContent = 'Log in to get started';
};

//logout
const startLogOutTimer = function () {
  const tick = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String((time % 60) - 1).padStart(2, 0);
    //in each callback, print time to UI
    labelTimer.textContent = `${minutes}:${seconds}`;
    //decrees 1 sec
    time--;
    //when time at 0 -> stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      updateUIOnLogOut();
    }
  };
  //set time to 5 minutes
  let time = 5;
  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
};

//event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value.trim()
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    const flag = `
    <img src="${currentAccount.flag}" alt="flag" class="flag" />
`;

    //display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    labelWelcome.insertAdjacentHTML('beforeend', flag);
    //beforeBegin', 'afterBegin', 'beforeEnd', or 'afterEnd'.
    //Create date and time
    /*
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;
    // day/month/year
    */

    //experimenting with API
    const now = new Date();
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      // weekday: 'long',
    };

    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    containerApp.style.opacity = 100;
    containerApp.style.display = 'grid';

    //clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    startLogOutTimer();

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(any => any >= amount * 0.1)) {
    setTimeout(function () {
      //add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());

    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());
    //update UI
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value.trim() === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    inputCloseUsername.value = inputClosePin.value = '';

    //delete account
    accounts.splice(index, 1);

    //hide UI
    updateUIOnLogOut();
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault;
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

*/
//#region -----Lectures 142-145-------`

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];
//slice
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -1));
console.log(arr.slice());

//splice
// console.log(arr.splice(2));
// arr.splice(-1);
arr.splice(1, 2);
console.log(arr);

//reverse
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2);
console.log(arr2.reverse());
console.log(arr2);

//concat
const letters = arr.concat(arr2);
console.log(letters);

//join
console.log(letters.join(' - '));
*/

//at Method
/*
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

//getting last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));
console.log(arr.at(-2));

console.log('Jay'.at(-1));
console.log('Jay'.at(1));
*/

//forEach method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`${i} You deposited ${movement}`);
  } else {
    console.log(`${i} You withdrew ${Math.abs(movement)}`);
  }
}

console.log('------FOREACH-----');
movements.forEach(function (movement, index, array) {
  movement > 0
    ? console.log(`${index} You deposited ${movement}`)
    : console.log(`${index} You withdrew ${Math.abs(movement)}`);
});
*/

//forEach on Map
/*
//map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});
*/
//#endregion

//#region ----- Coding Challenge #1 ------

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const checkDogs = function (dogsJulia, dogsKate) {
  // const realDogsJulia = dogsJulia.slice(1, -2); //my solution
  const realDogsJulia = dogsJulia.slice(); // jonas solution
  realDogsJulia.splice(0, 1);
  realDogsJulia.splice(-2);
  const totalDogs = realDogsJulia.concat(dogsKate);
  totalDogs.forEach(function (dog, i) {
    dog > 3
      ? console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`)
      : console.log(`Dog number ${i + 1} is spill a puppy 🐶`);
  });
};

console.log('---------test 1---------');
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
console.log('---------test 2  ---------');
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
*/
//#endregion

//#region  -----Lecture 150 the map Method-----
/*
const eurToUsd = 1.1;

const movementsUSD = movements.map(mov => mov * eurToUsd);
console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) {
  movementsUSDfor.push(mov * eurToUsd);
}
console.log(movementsUSDfor);

const movementsDescr = movements.map(
  (mov, i, arr) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementsDescr);
*/
//#endregion

//#region  -----Lecture 152 the filter Method-----
/*
//filter method
const deposits = movements.filter(function (mov) {
  return mov > 0;
});

//forof loop
const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) depositsFor.push(mov);
}

const withdrawals = movements.filter(mov => mov < 0);

console.log(movements);
console.log(deposits);
console.log(depositsFor);
console.log(withdrawals);
*/
//#endregion

//#region ------Lecture 153 the reduce Method ------
/*
console.log(movements);

// accumolator is like a snowball

//reduce method
const balance = movements.reduce(function (accum, cur, i, arr) {
  console.log(`${i}: ${accum}`);
  return accum + cur;
}, 0); //0 is first value of accumulator

//forof
let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}

console.log(balance);
console.log(balance2);

//maximum value
const maxValue = movements.reduce(
  (acc, val) => (val > acc ? val : acc),
  movements[0]
);
console.log(maxValue);
*/
//#endregion

//#region ------ Coding challenge #2 -----
///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const calcAverageHumanAge = function (ages) {
  const dogToHumanAge = ages
    .map(dogAge => (dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4))
    .filter(dogAge => dogAge >= 18)
    .reduce((acc, val, i, arr) => acc + val / arr.length, 0);

  // const averageAge = dogToHumanAge.reduce((acc, val) => acc + val, 0) / dogToHumanAge.length;

  return dogToHumanAge;
};
console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
*/
//#endregion

//#region ------ Lecture 155 magic of methods -----
/*
const eurToUsd = 1.1;

//pipeline
const totalDepositsInUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsInUSD);
*/
//#endregion

//#region ------ Challenge #3 --------
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const calcAverageHumanAge = ages =>
  ages
    .map(dogAge => (dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4))
    .filter(dogAge => dogAge >= 18)
    .reduce((acc, val, i, arr) => acc + val / arr.length, 0);

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
*/
//#endregion

//#region ------ Lecture 157 find methods -----
/*
const findWithdrawal = movements.find(mov => mov < 0);

console.log(movements);
console.log(findWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

//forof loop
let accountFor = {};
for (const account of accounts) {
  if (account.owner === 'Jessica Davis') accountFor = account;
}
console.log(accountFor);
*/
//#endregion

//#region ----- Lecture 161 some and every -----
/*
//check for equality

console.log(movements);
console.log(movements.includes(-130));

//SOME: check for condition
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 150);
console.log(anyDeposits);

//EVERY - true is every item in the array satisfy the condition
const everyDeposit = movements.every(mov => mov > 0);
console.log(everyDeposit);

//separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/
//#endregion

//#region ----- Lecture 162 flat and flatMap -----

/*
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat());

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

//Flat
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

//flatMap
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);
*/
//#endregion

//#region ----- Lecture 163 Sorting arrays -----
/*
//Strings
const owners = ['Jay', 'Zebra', 'Adam', 'Martha', 'Bohdan'];
console.log(owners.sort());

//Numbers
console.log(movements);
// console.log(movements.sort());

//return <0 -> A,B
//return >0 -> B,A

//ascending
// let sortingMov = movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
let sortingMov = movements.sort((a, b) => a - b);
console.log(sortingMov);

//descending
// sortingMov = movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
sortingMov = movements.sort((a, b) => b - a);
console.log(sortingMov);
*/
//#endregion

//#region ----- Lecture 164 More Ways of Creating and Filling Arrays -----
/*
const arr = [1, 2, 3, 4, 5, 6, 7, 8];
console.log(new Array(1, 2, 3, 4, 5, 6, 7, 8));

const x = new Array(7);
console.log(x);
// x.fill(1);
console.log(x);
// x.fill(1, 3);
console.log(x);
x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

//Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

// Challenge
const diceRolls = Array.from(
  { length: 100 },
  cur => (cur = Math.floor(Math.random() * 6) + 1)
);
console.log(diceRolls);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});
*/
//#endregion

//#region ----- 166 Array Methods -----

//1.
/*
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositSum);

//2.
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposits1000);

//Prefixed operator
let a = 10;
console.log(++a);

//3.
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

//4.
//this is a nice title -> This Is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = [
    'a',
    'an',
    'the',
    'but',
    'or',
    'on',
    'in',
    'with',
    'is',
    'are',
    'and',
  ];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/
//#endregion

//#region ------ Challenge #4 -----
///////////////////////////////////////
// Coding Challenge #4

// TEST DATA:
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).
*/
/*
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
*/
// dogs.map(dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28)));
// console.log(dogs);
/*
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
*/
// const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(
//   `${sarahDog.owners.join(' & ')}'s Dog is eating too ${
//     sarahDog.curFood > sarahDog.recommendedFood ? 'much ⬆️' : 'little ⬇️'
//   } `
// );
/*
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
*/
// const ownersEatTooMuch = [];
// const ownersEatTooLittle = [];
// dogs.map(dog =>
//   dog.curFood > dog.recommendedFood
//     ? ownersEatTooMuch.push(...dog.owners)
//     : ownersEatTooLittle.push(...dog.owners)
// );
// console.log(ownersEatTooMuch, ownersEatTooLittle);
/*
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
*/
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);
/*
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
*/
// console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

/*
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
*/
// console.log(
//   dogs.some(
//     dog =>
//       dog.curFood > dog.recommendedFood * 0.9 &&
//       dog.curFood < dog.recommendedFood * 1.1
//   )
// );
/*
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
*/
// const dogsThatOkay = dogs.filter(
//   dog =>
//     dog.curFood > dog.recommendedFood * 0.9 &&
//     dog.curFood < dog.recommendedFood * 1.1
// );
// console.log(dogsThatOkay);
/*
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)
*/
// const sortedDogs = dogs
//   .slice()
//   .sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(sortedDogs);
/*
HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
GOOD LUCK 😀
*/
//#endregion

//#region ----- Lecture 170-171 Operations with Numbers ----
/*
console.log(23 === 23.0);

//base 10 - 0 to 9
//Binary base 2 - 0 and 1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

//conversion
console.log(Number('23'));
console.log(+'23  ');

//parsing
console.log(Number.parseInt('30px', 10)); //30
console.log(Number.parseInt('px30', 10)); //NaN

console.log(Number.parseInt('2.5rem')); //2
console.log(Number.parseFloat('2.5rem')); //2.5

//console.log(parseFloat('2.5rem')); //2.5

//Check is value is NaN
console.log(Number.isNaN(70)); //false
console.log(Number.isNaN('70')); //false
console.log(Number.isNaN(+'70x')); //true
console.log(Number.isNaN(23 / 0)); //false

//Checking is value is a Number
console.log(Number.isFinite(20)); //true
console.log(Number.isFinite('20')); //false
console.log(Number.isFinite(+'20x')); //false
console.log(Number.isFinite('20x')); //false
console.log(Number.isFinite(23 / 0)); //false

console.log(Number.isInteger(23)); //true
console.log(Number.isInteger(23.0)); //true
console.log(Number.isInteger(23 / 0)); //false
*/
/*
//Square root
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));

//Cubic root
console.log(8 ** (1 / 3));

//Max value return
console.log(Math.max(5, 18, 23, 1, 6)); //23
console.log(Math.max(5, 18, '23', 1, 6)); //23
console.log(Math.max(5, 18, '23px', 1, 6)); //NaN

//Min value return
console.log(Math.min(5, 18, 23, 1, 6)); //1
console.log(Math.min(5, 18, '23', 1, 6)); //1
console.log(Math.min(5, 18, '23px', 1, 6)); //NaN

//circle radius
console.log(Math.PI * Number.parseFloat('10px') ** 2); //PI*r**2

//Generate randoms
console.log(Math.trunc(Math.random() * 6) + 1);

//function which give us number between Min....Max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//Rounding integers
console.log(Math.trunc(23.3)); //23

console.log(Math.round(23.1)); //23
console.log(Math.round(23.9)); //24

console.log(Math.ceil(23.1)); //24
console.log(Math.ceil(23.9)); //24

console.log(Math.floor(23.1)); //23
console.log(Math.floor('23.9')); //23

console.log(Math.trunc(-23.3)); //-23
console.log(Math.floor(-23.1)); //-24
console.log(Math.ceil(-23.9)); //23

//rounding decimals
console.log((2.7).toFixed(0)); //2 (string)
console.log((2.7).toFixed(1)); //2.7 (String)
console.log((2.7).toFixed(3)); //2.700(String)
console.log((2.345).toFixed(2)); //2.35(String)
console.log(+(2.345).toFixed(2)); //2.35(Number)
*/
/*
function generateRandoms(length, min, max) {
  return Array.from({ length }, () => randomInt(min, max));
}

function countOccurrences(arr) {
  return arr.reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});
}

function displayResults(arr, occurrences) {
  const length = arr.length;
  const maxOccurrence = Math.max(...Object.values(occurrences));
  const mostCommonNumber = Object.keys(occurrences).find(
    key => occurrences[key] === maxOccurrence
  );

  for (const [key, value] of Object.entries(occurrences)) {
    console.log(
      `Number ${key} appears ${value} times, which is ${Math.trunc(
        (value / length) * 100
      )}% of all elements`
    );
  }

  console.log(
    `The most common Number: ${mostCommonNumber} with ${maxOccurrence} occurrences`
  );
}

const randoms = generateRandoms(100, 10, 20);
const occurrences = countOccurrences(randoms);
displayResults(randoms, occurrences);
*/

//#endregion

//#region ----- Lecture 172 Remainder operator -----
/*
console.log(5 % 2); //1 = 2 * 2 + 1 (reminder)
console.log(5 / 2); //2.5

console.log(8 % 3); // 2 = 2 * 3 + 2 (reminder)
console.log(8 / 3); //2.666666666665

console.log(6 % 2); //0
console.log(7 % 2); //1

const isEven = n => n % 2 === 0;
console.log(isEven(66)); //true
console.log(isEven(24325)); //false

const movementRows = [...document.querySelectorAll('.movements__row')].forEach(
  function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
  }
);

btnLogin.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = '#99999945';
    // if (i % 3 === 0) row.style.backgroundColor = '#555';
  });
});
*/
//#endregion

//#region ------ Lecture 172 Numeric separators -----
/*
//287,460,000,000
const diameter = 287_460_000_000;
console.log(diameter);

const price = 345_99;
console.log(price);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

const PI = 3.14_15;
console.log(PI);

console.log(Number('230000'));
console.log(Number('230_000'));
*/
//#endregion

//#region ----- Lecture 173 BigInt ----
/*
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 0);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 11);

const a = 234235255262623243242342342343242432432n;
console.log(a);
console.log(BigInt(234235255262623243242342342343242432432));

//Operations
console.log(10000n + 10000n);
console.log(12131312312312312312n * 983209839278288793289n);

const huge = 12131312312312312312n;
const num = 23;
//console.log(huge + num); //error
console.log(huge + BigInt(num));

//Expressions
console.log(10n < 20); // true
console.log(10n === 10); //false
console.log(10n == 10); //true
console.log(typeof 20n);

console.log(huge + ' is realy big!');

//Divisions
console.log(11n / 3n); //3n (cut decimals)
console.log(10 / 3); // 3.33333333
*/
//#endregion

//#region ------ Lecture 174 Creating dates -----

//create a date
/*
const now = new Date();
console.log(now);

console.log(new Date('Sat Apr 22 2023 16:58:35'));
console.log(new Date('December 24, 2015'));

console.log('-----------------');
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));

//working with dates
const future = new Date(2037, 10, 19, 15, 23, 10, 678);
console.log(future.getFullYear());
console.log(future.getMonth() + 1);
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.getMilliseconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(new Date(2_142_278_590_678));

console.log(Date.now());

future.setFullYear(2040);
console.log(future);
*/
//#endregion

//#region ------ Lecture 175 Operation with dates -----
/*
const future = new Date(2037, 10, 19, 15, 23, 10, 678);
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
const days1 = calcDaysPassed(new Date(2037, 4, 19), new Date(2037, 10, 19));
console.log(days1);
*/

//#endregion

//#region ------ Lecture 176 Internalization -----
//experimenting with API
/*
const now2 = new Date();
const options2 = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
  weekday: 'long',
};

const locale = navigator.language;
console.log(locale);

const date1 = new Intl.DateTimeFormat('uk', options2).format(now2);
console.log(date1);

const num = 3388330.23;

const optionsNum = {
  style: 'currency',
  unit: 'celsius',
  currency: 'uah',
  // useGrouping: false,
};

console.log('US: ', new Intl.NumberFormat('en-US', optionsNum).format(num));
console.log(
  'Gernamy: ',
  new Intl.NumberFormat('de-DE', optionsNum).format(num)
);
console.log('Syria: ', new Intl.NumberFormat('ar-SY', optionsNum).format(num));
*/
//#endregion

//#region ------ Lecture 177 Timers -----
/*
//setTimeout()
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) =>
    console.log(`Here is your pizza 🍕 with: ${ing1} and ${ing2}`),
  2000,
  ...ingredients
);
console.log('Waiting...');
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

//setTimeout

setInterval(function () {
  const now = new Date();
  console.log(
    `${now.getHours(2).toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  );
}, 1000);
*/
//#endregion

//#region ------ Lecture 178 Logout -----

//#endregion

#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
// Login
let userOption;
let pin;
let isValid = false;
const user1 = {
    name: "Roziisho",
    pin: 1234,
    balance: 5000,
    accountNumber: 112233,
};
const user2 = {
    name: "Ali Bari",
    pin: 1122,
    balance: 2500,
    accountNumber: 223344,
};
const wait = (seconds = 2000) => {
    return new Promise((res) => setTimeout(res, seconds));
};
const welcome = async function () {
    console.log(chalk.blue("CLI ATM MACHINE"));
    await wait();
    console.log(`Enter your 4 digit PIN\n`);
};
//Validates user pin
const handlePinValidation = async function (usrPin) {
    await wait();
    const handlePIN = new Promise((resolve, reject) => {
        if (usrPin === user1.pin) {
            resolve(`Welcome ${user1.name}\n`);
            isValid = true;
        }
        else {
            reject(chalk.red("Invalid PIN"));
            isValid = false;
        }
    });
    handlePIN
        .then((res) => {
        console.log(res);
    })
        .catch((err) => {
        isValid = false;
        return console.log(err);
    });
};
// Takes users Pin
const validatePin = async () => {
    const usrPin = await inquirer.prompt({
        name: "pin",
        type: "number",
        message: "Your Pin:",
    });
    pin = usrPin.pin;
    await handlePinValidation(pin);
};
const options = async function () {
    const promptOptions = await inquirer.prompt({
        name: "options",
        type: "list",
        message: "Options:",
        choices: [
            "(1) Withdraw",
            "(2) Deposit",
            "(3) Transfer",
            "(4) Check Balance",
        ],
    });
    userOption = promptOptions.options;
};
//checks user balance
const checkbalance = (amount) => {
    return new Promise((resolve, reject) => {
        if (amount <= 0 || amount > user1.balance) {
            isValid = false;
            reject(chalk.redBright("Insufficient Balance"));
        }
        else {
            setTimeout(() => {
                resolve("Sucessfull");
            }, 2000);
        }
    });
};
// handles withdrawals and checks balance returns promise
const handleWithdrawl = async function (amount) {
    // check balance
    await checkbalance(amount).then((res) => {
        user1.balance -= amount;
        console.log(`${chalk.yellow(res)} Withdraw Amount:${amount}\nYour Balance:${user1.balance - amount}`);
    });
};
const handleDeposit = async function (amount) {
    // check balance
    await checkbalance(amount).then((res) => {
        user1.balance += amount;
        console.log(`${chalk.yellow(res)} Deposited Amount:${amount}\nYour Balance:${user1.balance}`);
    });
};
const handleTransferAccounts = async function () {
    const transferTo = await inquirer.prompt({
        name: "username",
        type: "input",
        message: "Account Holders Name:",
    });
    const accountNumber = await inquirer.prompt({
        name: "Account",
        type: "input",
        message: "Transfer Account Number:",
    });
};
const handleTransfers = async function (amount) {
    // check balance
    wait(3000);
    await checkbalance(amount).then((res) => {
        user1.balance -= amount;
        console.log(`${chalk.yellow(res)} Transfer Amount:${amount}\nYour Balance:${user1.balance}`);
    });
};
// show users balance
const handleUserBalance = async function () {
    console.log(`${chalk.yellow(`Your Balance:${user1.balance}`)}\n`);
};
// handle input amounts validity
const checkAmoutIsValid = async (amount) => {
    if (Number(amount)) {
        return true;
    }
    else {
        isValid = false;
        throw new Error(chalk.red("Invalid Input"));
    }
};
// handles the inquirer Prompt options
const handleOptions = async function (option) {
    if (option === "(1) Withdraw") {
        const withdrawal = await inquirer.prompt({
            name: "amount",
            type: "number",
            message: "Amount:",
        });
        let usrAmount = withdrawal.amount;
        await checkAmoutIsValid(usrAmount);
        await handleWithdrawl(usrAmount);
    }
    if (option === "(2) Deposit") {
        const deposit = await inquirer.prompt({
            name: "amount",
            type: "number",
            message: "Amount:",
        });
        let usrAmount = deposit.amount;
        await checkAmoutIsValid(usrAmount);
        await handleDeposit(usrAmount);
    }
    if (option === "(3) Transfer") {
        await handleTransferAccounts();
        const transferAmount = await inquirer.prompt({
            name: "Amount",
            type: "input",
            message: "Transfer Amount",
        });
        await handleTransfers(transferAmount.Amount);
    }
    if (option === "(4) Check Balance") {
        await handleUserBalance();
    }
};
//Asks weather the user wants to make another transaction
const continueProcess = async () => {
    const prompt = await inquirer.prompt({
        name: "continue",
        type: "confirm",
        message: "Do you want to make another transaction?",
    });
    try {
        while (prompt.continue) {
            await render();
        }
        if (!prompt.continue) {
            isValid = false;
            console.log(chalk.yellow("Thank you for Using this ATM"));
        }
    }
    catch (error) {
        isValid = false;
        console.error(error);
    }
};
// Render ATM APP
const render = async () => {
    await welcome();
    try {
        await validatePin();
        if (isValid) {
            await options();
            await handleOptions(userOption);
            isValid = false;
            await continueProcess();
        }
    }
    catch (error) {
        isValid = false;
        console.error(error);
        return;
    }
};
console.clear();
render();
// pin
// options
// withdraw
// checkbalance
// deposit
// transfer
// pay bills

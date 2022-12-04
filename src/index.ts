#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import figlet from "figlet";
import gradient from "gradient-string";

// Login

let userOption: string = "";

let isValid: boolean = false;

interface User {
  name?: string;
  pin: number;
  balance: number;
  accountNumber: number;
}

const user1: User = {
  name: "John",
  pin: 1234,
  balance: 5000,
  accountNumber: 112233,
};

const user2: User = {
  name: "Ali Bari",
  pin: 1122,
  balance: 2500,
  accountNumber: 223344,
};

const wait = (seconds = 2000) => {
  return new Promise((res) => setTimeout(res, seconds));
};

const welcome = async function () {
  const spinner = createSpinner("loading ATM").start();

  await wait();

  spinner.success();
  figlet(`CLI-ATM !\n`, (err, data) => {
    console.log(gradient.pastel.multiline(data) + "\n");
  });
  await wait();

  console.log(`${chalk.yellow(`Enter your 4 digit PIN`)}\ntry demo pin: 1234`);
};

// Validates user pin
const handlePinValidation = async function (usrPin: number) {
  await wait();
  const handlePIN = new Promise((resolve, reject) => {
    if (Number(usrPin) === user1.pin) {
      resolve(`Welcome ${user1.name}\n`);
      isValid = true;
    } else {
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
      console.log(err);
      process.exit();
    });
};
// Takes users Pin
const takeUserPin = async () => {
  const usrPin = await inquirer.prompt([
    {
      name: "pin",
      type: "password",
      mask: "#",
      message: "Your Pin:",
      validate: (pin) => {
        if (Number(pin)) {
          return true;
        } else {
          console.log("Invalid Pin");
          isValid = false;
        }
      },
    },
  ]);

  let inputPin = usrPin.pin;

  await handlePinValidation(inputPin);
};

const options = async function () {
  const promptOptions = await inquirer.prompt({
    name: "options",
    type: "list",
    message: "Options:",
    choices: [
      "(1) Withdraw",
      "(2) Bill-Payment",
      "(3) Transfer",
      "(4) Balance Inquiry",
    ],
  });
  userOption = promptOptions.options;
};
//checks user balance
const checkbalance = async (amount: number) => {
  const spinner = createSpinner("checking balance").start();
  await wait();
  return new Promise((resolve, reject) => {
    if (amount <= 0 || amount > user1.balance) {
      spinner.error();
      isValid = false;
      reject(chalk.redBright("Insufficient Balance"));
    } else {
      setTimeout(() => {
        spinner.success();
        resolve(true);
      }, 2000);
    }
  });
};
// handles withdrawals and checks balance returns promise
const handleWithdrawl = async function (amount: number) {
  const spinner = createSpinner("Withdraw initaited...").start();

  await wait();
  // check balance
  await checkbalance(amount)
    .then((res) => {
      if (res) {
        user1.balance -= amount;
        spinner.success();
        console.log(
          `${chalk.yellow(
            "Sucessful"
          )} Withdraw Amount:${amount}\nYour Balance:${user1.balance}`
        );
      }
    })
    .catch((err) => {
      console.log(err);
      process.exit();
    });
};
const handleBills = async function () {
  console.log(`${chalk.yellow("Error")} Feature not available in your country`);
};

const handleTransferAccounts = async function () {
  const transferTo = await inquirer.prompt({
    name: "username",
    type: "input",
    message: "Account Holders Name:",
    validate: (input) => {
      if (Number(input)) {
        return "Invalid Name";
      } else {
        return true;
      }
    },
  });
  const accountNumber = await inquirer.prompt({
    name: "Account",
    type: "input",
    message: "Transfer Account Number:",
    validate: (input) => {
      if (Number(input)) {
        return true;
      } else {
        return "Invalid Amount";
      }
    },
  });
};
const handleTransfers = async function (amount: number) {
  // check balance

  const spinner = createSpinner("Transfer").start();
  wait(3000);
  await checkbalance(amount)
    .then((res) => {
      if (res) {
        user1.balance -= amount;
        spinner.success();

        console.log(
          `${chalk.yellow("Sucessful")}\nTransfer Amount:${chalk.yellow(
            amount
          )}\nYour Balance:${chalk.yellow(user1.balance)}`
        );
      }
    })
    .catch((err) => {
      console.log(err);
      process.exit();
    });
};

// handles the inquirer Prompt options
const handleOptions = async function (option: string) {
  if (option === "(1) Withdraw") {
    const withdrawal = await inquirer.prompt([
      {
        name: "amount",
        type: "number",
        message: "Amount:",
        validate: (input: any) => {
          if (Number(input)) {
            return true;
          } else {
            return "Invalid Amount";
          }
        },
      },
    ]);
    let usrAmount = withdrawal.amount;

    await handleWithdrawl(usrAmount);
  }
  if (option === "(2) Bill-Payment") {
    await handleBills();
  }
  if (option === "(3) Transfer") {
    await handleTransferAccounts();
    const transferAmount = await inquirer.prompt([
      {
        name: "Amount",
        type: "input",
        message: "Transfer Amount",
        validate: (input) => {
          if (Number(input)) {
            return true;
          } else {
            return "Invalid Amount";
          }
        },
      },
    ]);

    await handleTransfers(transferAmount.Amount);
  }

  if (option === "(4) Balance Inquiry") {
    console.log(
      `${chalk.yellow(`Your Balance: Rs.${chalk.yellow(user1.balance)}`)}\n`
    );
  }
};

//Asks weather the user wants to make another transaction

const continueProcess = async () => {
  const userWantstoContinue = await inquirer.prompt({
    name: "continue",
    type: "confirm",
    message: "Do you want to make another transaction?",
  });
  if (userWantstoContinue.continue && isValid) {
    await options();
    await handleOptions(userOption);
    await continueProcess();
  } else {
    process.exit();
  }
};
console.clear();
await welcome();
await takeUserPin();
await options();
await handleOptions(userOption);
continueProcess();

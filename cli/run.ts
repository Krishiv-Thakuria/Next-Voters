import chalk from "chalk";
import { log } from "console";
import inquirer from "inquirer";

log(chalk.blue("Welcome to Next Voters' CLI tooling!"));

inquirer
  .prompt([
    {
      type: "input",
      name: "documentLink",
      message: "What is the link of your document?"
    }
  ])
  .then((answers) => {
    log(answers.documentLink);
  });

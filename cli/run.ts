import chalk from "chalk";
import { log } from "console";
import inquirer from "inquirer";

log(chalk.blue("Welcome to Next Voters' CLI tooling!"));

try {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "documentLink",
            message: "What is the link of your document?",
            validate: (input) => {
                const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
                return urlRegex.test(input) || "Please enter a valid URL starting with http:// or https://";
            }
        },
    ]);

    const documentLink = answers.documentLink;
    log(chalk.green("Valid link inputted. Checking document type..."));

    const response = await fetch(documentLink);

    if (!response.ok) {
        throw new Error(`Failed to fetch document. Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/pdf")) {
        log(chalk.green("Retrieved PDF document!"));
    } else {
        throw new Error("The link did not return a PDF document.");
    }

} catch (error) {
    log(chalk.red("AN ERROR OCCURRED!! "), error.message);
}

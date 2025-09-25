import chalk from "chalk";
import { log } from "console";
import inquirer from "inquirer";
import { addEmbeddings, chunkDocument } from "@/lib/ai";

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
            },
        },
        {
            type: "input",
            name: "author",
            message: "What is the author name?",
            validate: (input) => input.trim() !== "" || "Author name cannot be empty",
        },
        {
            type: "input",
            name: "documentName",
            message: "What is the name of the document?",
            validate: (input) => input.trim() !== "" || "Document name cannot be empty",
        },
        {
            type: "input",
            name: "collectionName",
            message: "What is the name of the collection to store embeddings in?",
            validate: (input) => input.trim() !== "" || "Collection name cannot be empty",
        },
    ]);
    const { 
        documentLink, 
        author, 
        documentName,
        collectionName
    } = answers;

    log(chalk.green("Valid link inputted. Checking document type..."));

    const response = await fetch(documentLink);

    if (!response.ok) {
        throw new Error(`Failed to fetch document. Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/pdf")) {
        log(chalk.green("Retrieved PDF document! Continue to processing..."));

        const pdfBuffer = await response.arrayBuffer();
        const chunks = await chunkDocument(pdfBuffer);

        await addEmbeddings(
            chunks,
            author, 
            documentLink, 
            documentName,
            collectionName
        ); 

        log(chalk.blue("Embeddings added successfully!"));
    } else {
        throw new Error("The link did not return a PDF document.");
    }
} catch (error: any) {
    log(chalk.red("AN ERROR OCCURRED!!"), error.message);
}

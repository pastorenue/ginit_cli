#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const files = require('./lib/files');
const github = require('./lib/github');
const repo = require('./lib/repo')
// const inquirer = require('./lib/inquirer');


clear();

console.log(
    chalk.yellow(
        figlet.textSync('Ginit', {horizontalLayout: 'full'})
    )
);

if(files.directoryExists('.git')) {
    console.log(chalk.red('Already a git repository'));
    process.exit();
}

getGithubToken: async () => {
    // fetch token from configstore
    let token = github.getStoredGithubToken();
    if (token) {
        return token;
    }

    // No token found, use credential to access Github aacount
    token = await github.getPersonalAccessToken()

    return token;
}

const run = async () => {
    // const credentials = await inquirer.askGitCredentials();
    // console.log(credentials);
    let token = github.getStoredGithubToken();
    if (token) {
        token = await github.getPersonalAccessToken();
    }
    console.log(token);

    try {
        const token = await getGithubToken();
        github.githubAuth(token)

        // create Remote repo
        url = await repo.createRemoteRepo();
        
        // Create .gitignore file
        await repo.createGitIgnore()

        // Setup local repo
        await repo.setupRepo(url);

        console.log(chalk.green('All done!'))
    } catch (err) {
        if (err) {
            switch (err.status) {
                case 401:
                console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
                break;
                case 422:
                console.log(chalk.red('There is already a remote repository or token with the same name'));
                break;
                default:
                console.log(chalk.red(err));
            }
        }
    }
}
run();

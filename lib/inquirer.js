const inquirer = require('inquirer');
const files = require('./files');

module.exports = {
    askGitCredentials: () => {
        const questions = [
            {
                name: 'username',
                type: 'input',
                message: 'Enter your github username or email address: ',
                validate: (value) => {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your username or email address'
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter your password: ',
                validate: (value) => {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your password: ';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },

    getTwoFactorAuthenticationCode: () => {
        return inquirer.prompt({
            name: 'twofactorAuthenticationCode',
            type: 'input',
            message: 'Enter your two-factor authentication code: ',
            validate: (value) => {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your two factor authentication code.'
                }
            }
        });
    },

    askRepoDetails: () => {
        const argv = require('minimist')(process.argv.slice(2));

        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the repository: ',
                default: argv._[0] || files.getCurrentDirectoryBase(),
                validate: (value) => {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a name for the repository';
                    }
                }
            },
            {
                type: 'input',
                name: 'description',
                default: argv._[1] || null,
                message: 'Optionally enter a description of the repository:'
            },
            {
                type: 'list',
                name: 'visibility',
                message: 'Public or Private',
                choices: ['public', 'private'],
                default: 'public'
            }
        ];
        return inquirer.prompt(questions);
    },

    askIgnoreFiles: (filelist) => {
        const questions = [
            {
                type: 'checkbox',
                name: 'ignore',
                message: 'Select the files and/or folders you wish to ignore:',
                choices: filelist,
                default: ['node_modules', 'bower_components']
            }
        ];
        return inquirer.prompt(questions);
    }
}
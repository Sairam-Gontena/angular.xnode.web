#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import * as template from './utils/template';
import * as shell from 'shelljs';

const CHOICES = fs.readdirSync(path.join(__dirname, 'templates'));
const QUESTIONS = [
    {
        name: 'template',
        type: 'list',
        message: 'What template would you like to use?',
        choices: CHOICES
    },
    {
        name: 'name',
        type: 'input',
        message: 'Please input a new project name:'
    }];

export interface CliOptions {
    projectName: string
    templateName: string
    templatePath: string
    targetPath: string
}

const CURR_DIR = process.cwd();

// inquirer.prompt(QUESTIONS).then(answers => {
//     const projectChoice = answers['template'];
//     const projectName = answers['name'];
//     //@ts-ignore
//     const templatePath = path.join(__dirname, 'templates', projectChoice);
//     //@ts-ignore
//     const targetPath = path.join(CURR_DIR, projectName);

//     const options: CliOptions = {
//         //@ts-ignore
//         projectName,
//         //@ts-ignore
//         templateName: projectChoice,
//         templatePath,
//         targetPath: targetPath
//     }

//     if (!createProject(targetPath)) {
//         return;
//     }

//     //@ts-ignore
//     createDirectoryContents(templatePath, projectName);

//     postProcess(options);
// });

const getArgs = (): any => {
    const args: any = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach(arg => {
            // long arg
            if (arg.slice(0, 2) === '--') {
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2, longArg[0].length);
                const longArgValue = longArg.length > 1 ? longArg[1] : true;
                args[longArgFlag] = longArgValue;
            }
            // flags
            else if (arg[0] === '-') {
                const flags = arg.slice(1, arg.length).split('');
                flags.forEach(flag => {
                    args[flag] = true;
                });
            }
        });
    return args;
}


export const main = () => {
    const args = process.argv.slice(2, process.argv.length);
    console.log(args, 'args');

    const projectChoice = 'react-proj';
    const projectName = args[0] || 'NO_NAME';
    //@ts-ignore
    const templatePath = path.join(__dirname, 'templates', projectChoice);
    //@ts-ignore
    const targetPath = path.join(CURR_DIR, projectName);
    const options: CliOptions = {
        //@ts-ignore
        projectName,
        //@ts-ignore
        templateName: projectChoice,
        templatePath,
        targetPath
    }

    if (!createProject(targetPath)) {
        return;
    }
    createDirectoryContents(templatePath, projectName);
    copySchema(projectName)
    postProcess(options);
}

function createProject(projectPath: string) {
    if (fs.existsSync(projectPath)) {
        console.log(chalk.red(`Folder ${projectPath} exists. Delete or use another name.`));
        return false;
    }
    fs.mkdirSync(projectPath);

    return true;
}

const SKIP_FILES = ['node_modules', '.template.json'];

function createDirectoryContents(templatePath: string, projectName: string) {
    // read all files/folders (1 level) from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    // loop each file/folder
    filesToCreate.forEach(file => {
        const origFilePath = path.join(templatePath, file);

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        // skip files that should not be copied
        if (SKIP_FILES.indexOf(file) > -1) return;

        if (stats.isFile()) {
            // read file content and transform it using template engine
            let contents = fs.readFileSync(origFilePath, 'utf8');
            contents = template.render(contents, { projectName });
            // write file to destination folder
            const writePath = path.join(CURR_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            // create folder in destination folder
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            // copy files/folder inside current folder recursively
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file));
        }
    });
}

const copySchema = (projectName: string) => {
    console.log(CURR_DIR, 'CURR_DIR');
    console.log(__dirname, '__dir');

    let schemaFile = "schema.json"
    const schemaPath = path.join(CURR_DIR, schemaFile);
    if (fs.existsSync(schemaPath)) {
        let contents = fs.readFileSync(schemaPath, 'utf8');
        contents = template.render(contents, { projectName });
        // write file to destination folder
        const writePath = path.join(CURR_DIR, projectName, schemaFile);
        fs.writeFileSync(writePath, contents, 'utf8');
    } else {
        console.log('No file available');

    }
}

function postProcess(options: CliOptions) {
    const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
    if (isNode) {
        shell.cd(options.targetPath);
        const result = shell.exec('npm run generate-schema');
        if (result.code !== 0) {
            return false;
        }
    }

    return true;
}


main()
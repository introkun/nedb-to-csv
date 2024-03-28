import Datastore from '@seald-io/nedb'
import chalk from 'chalk'
import dotenv from 'dotenv'
import fs from 'fs'
import yargs from 'yargs'

dotenv.config()

const usage = chalk.magenta("Usage: mycli -i <nedb file>  -o <CSV file>")

// console.log(yargs.argv);
const argv = yargs(process.argv.slice(2))
    .usage(usage)
    .option("i", { alias: "in", describe: "Input Nedb file", type: "string", demandOption: true })
    .option("o", { alias: "out", describe: "Output CSV file", type: "string", demandOption: true })
    .help(true)
    .argv;

const dbName = process.argv[2];

function convertToCSV(arr) {
    const header = '"' + Object.keys(arr[0]).join('","') + '"\n';
    const rows = arr.map(obj => '"' + Object.values(obj).join('","') + '"\n');
    return header + rows.join('');
}

async function main() {
    const db = new Datastore({ filename: argv.in })
    try {
        await db.loadDatabaseAsync()
        // loading has succeeded
        console.log(chalk.green(`Database '${argv.in}' loaded successfully`))
    } catch (error) {
        // loading has failed
        console.error(chalk.red('Error loading database'))
    }

    const experiences = await db.findAsync({})
    const csv = convertToCSV(experiences);

    fs.writeFileSync(`${argv.out}`, csv, 'utf8');
}

main()

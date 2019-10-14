import tl = require('azure-pipelines-task-lib/task');
const fs = require('fs');
import { AssemblyVersioningTask } from './AssemblyVersioningTask';

async function run() {
    try {
        const searchFolder = <string>tl.getInput('searchfolder', true);
        const searchPattern = <string>tl.getInput('searchpattern', true);
        const versionNumber = <string>tl.getInput('versionnumber', true);

        let task = new AssemblyVersioningTask(tl, fs);
        task.run(searchFolder, searchPattern, versionNumber);
    }
    catch (err) {
        tl.debug('Aww, snap. Something went wrong...');
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
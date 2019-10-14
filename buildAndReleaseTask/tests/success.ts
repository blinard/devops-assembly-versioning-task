import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

const testingDirPath = path.join(__dirname, '/.testingdir');
tmr.setInput('searchfolder', testingDirPath);
tmr.setInput('searchpattern', '**/AssemblyInfo.cs');
tmr.setInput('versionnumber', '1.2.3.4');

let findMatchAnswers: any = {};
findMatchAnswers[testingDirPath] = {
    '**/AssemblyInfo.cs': [ path.join(testingDirPath, 'AssemblyInfo.cs') ]
};

const answers = <ma.TaskLibAnswers>{
    'findMatch': findMatchAnswers
}

tmr.setAnswers(answers);

tmr.run();
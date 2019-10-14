import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import mock = require('mock-fs');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('samplestring', 'bad');
tmr.setInput('searchpattern', '**/AssemblyInfo.cs');
tmr.setInput('versionnumber', '1.2.3.4');

tmr.run();

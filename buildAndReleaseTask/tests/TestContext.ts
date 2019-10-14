import * as sinon from 'sinon';
import tl = require('azure-pipelines-task-lib/task');

export class TestContext {

    private _debugMessages: string[] = [];
    public get debugMessages(): string[] {
        return this._debugMessages;
    }

    private _runResult: tl.TaskResult = tl.TaskResult.Failed;
    public get runResult(): tl.TaskResult {
        return this._runResult;
    }

    private _runResultMessage: string = '';
    public get runResultMessage(): string {
        return this._runResultMessage;
    }

    private _resultFileContents: { [key: string]: string } = {};
    public get resultFileContents(): { [key: string]: string } {
        return this._resultFileContents;
    }

    private _mockTaskLibrary: any = {
        'debug': sinon.stub().callsFake(m => this._debugMessages.push(m)),
        'getInput': sinon.stub().callsFake((key: string, isReq: boolean) => this._inputs[key]),
        'findMatch': sinon.stub().callsFake((srchFolder: string, srchPattern: string) => this._filesFound),
        'setResult': sinon.stub().callsFake((result: tl.TaskResult, message: string) => { this._runResult = result; this._runResultMessage = message; }),
        'writeFile': sinon.stub().callsFake((filePathName: string, contents: string, opts: {}) => { this._resultFileContents[filePathName] = contents }),
        'TaskResult': tl.TaskResult
    };

    public getMockTaskLibrary(): any {
        return this._mockTaskLibrary;
    }

    private _mockFileSystem: any = {
        'readFileSync': sinon.stub().callsFake((pathFileName: string) => this._filesContents[pathFileName])
    };

    public getMockFileSystem(): any {
        return this._mockFileSystem;
    }

    constructor(private _inputs: { [key: string]: string }, private _filesFound: string[], private _filesContents: { [key: string]: string }) { }
}
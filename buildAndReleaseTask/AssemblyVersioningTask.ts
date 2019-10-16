export class AssemblyVersioningTask {
    constructor(private _tl: any, private _fs: any) {}

    public run(searchFolder: string, searchPattern: string, versionNumber: string): void {
        try {
            const files = this._tl.findMatch(searchFolder, searchPattern);
            this._tl.debug('Files found:');
            this._tl.debug(JSON.stringify(files));
            if (!files || files.length === 0) {
                this._tl.setResult(this._tl.TaskResult.Succeeded, 'No files found. All done.');
                return;
            }
            
            const assemblyVersionPattern = /(AssemblyVersion\()(.*)(\))/gm;
            const assemblyFileVersionPattern = /(AssemblyFileVersion\()(.*)(\))/gm;
            const assemblyInformationalVersionPattern = /(AssemblyInformationalVersion\()(.*)(\))/gm;
            files.forEach((fp: any) => {
                const content = this._fs.readFileSync(fp);
                let contentStr = content.toString();
                //console.log(contentStr);
    
                contentStr = contentStr.replace(assemblyVersionPattern, "$1\"" + versionNumber + "\"$3");
                contentStr = contentStr.replace(assemblyFileVersionPattern, "$1\"" + versionNumber + "\"$3");
                contentStr = contentStr.replace(assemblyInformationalVersionPattern, "$1\"" + versionNumber + "\"$3");
                this._tl.writeFile(fp, contentStr, { encoding: 'utf8' });
                this._tl.debug('File written: ' + fp);
            });
    
            this._tl.setResult(this._tl.TaskResult.Succeeded, 'Success!');
        }
        catch(err) {
            this._tl.debut('Aww shoot, something went wrong...');
            this._tl.setResult(this._tl.TaskResult.Failed, err.message);
        }
    }
}
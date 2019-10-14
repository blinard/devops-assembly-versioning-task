import assert from 'assert';
import tl = require('azure-pipelines-task-lib/task');
import { should as Should, expect } from 'chai';
import 'mocha';
import { TestContext } from './TestContext';
import { AssemblyVersioningTask } from '../AssemblyVersioningTask';

const should = Should();

describe('DevOps Assembly Versioning Task', function () {
    let currentContext: TestContext | null = null;

    before( function() {
    });

    after(() => {
        if (currentContext) currentContext = null;
    });

    it('should succeed when making multiple modifications to a single file', function(done: MochaDone) {
        this.timeout(2000);

        const inputs = {
            'searchfolder': '.testing-dir/',
            'searchpattern': '**/AssemblyInfo.cs',
            'versionnumber': '1.2.3.4'
        };
        const filesFound = [ '/some/fake/path/.testing-dir/AssemblyInfo.cs' ];
        const filesContents = {
            '/some/fake/path/.testing-dir/AssemblyInfo.cs': `
                [assembly: AssemblyVersion("1.0.0.0")]
                [assembly: AssemblyFileVersion("1.0.0.0")]
                [assembly: AssemblyInformationalVersion("1.0.0.0")]
            `
        }

        currentContext = new TestContext(inputs, filesFound, filesContents);

        let subject = new AssemblyVersioningTask(currentContext.getMockTaskLibrary(), currentContext.getMockFileSystem());
        subject.run('.testing-dir/', '**/AssemblyInfo.cs', '1.2.3.4');
        
        assert.equal(currentContext.runResult === tl.TaskResult.Succeeded, true, 'should have succeeded');
        console.log('console.log(tr.stdout):')
        // console.log(tr.stdout);

        let aiContentString = currentContext.resultFileContents[filesFound[0]]
        assert.equal(aiContentString.indexOf('[assembly: AssemblyVersion("1.2.3.4")]') >= 0, true, "should modify AssemblyVersion");
        assert.equal(aiContentString.indexOf('[assembly: AssemblyFileVersion("1.2.3.4")]') >= 0, true, "should modify AssemblyFileVersion");
        assert.equal(aiContentString.indexOf('[assembly: AssemblyInformationalVersion("1.2.3.4")]') >= 0, true, "should modify AssemblyInformationalVersion");

        done();
    });

    it('should update version information even in a comment', (done: MochaDone) => {
        this.timeout(1000);

        const inputs = {
            'searchfolder': '.testing-dir/',
            'searchpattern': '**/AssemblyInfo.cs',
            'versionnumber': '1.2.3.4'
        };
        const filesFound = [ '/some/fake/path/.testing-dir/AssemblyInfo.cs' ];
        const filesContents = {
            '/some/fake/path/.testing-dir/AssemblyInfo.cs': `
                // [assembly: AssemblyVersion("1.0.0.0")]
                // [assembly: AssemblyFileVersion("1.0.0.0")]
                // [assembly: AssemblyInformationalVersion("1.0.0.0")]
            `
        }

        currentContext = new TestContext(inputs, filesFound, filesContents);

        let subject = new AssemblyVersioningTask(currentContext.getMockTaskLibrary(), currentContext.getMockFileSystem());
        subject.run('.testing-dir/', '**/AssemblyInfo.cs', '1.2.3.4');
        
        assert.equal(currentContext.runResult === tl.TaskResult.Succeeded, true, 'should have succeeded');
        console.log('console.log(tr.stdout):')
        // console.log(tr.stdout);

        let aiContentString = currentContext.resultFileContents[filesFound[0]]
        assert.equal(aiContentString.indexOf('// [assembly: AssemblyVersion("1.2.3.4")]') >= 0, true, "should modify AssemblyVersion in comments");
        assert.equal(aiContentString.indexOf('// [assembly: AssemblyFileVersion("1.2.3.4")]') >= 0, true, "should modify AssemblyFileVersion in comments");
        assert.equal(aiContentString.indexOf('// [assembly: AssemblyInformationalVersion("1.2.3.4")]') >= 0, true, "should modify AssemblyInformationalVersion comments");

        done();
    });

    it('should process all files when multiple files are found', (done: MochaDone) => {
        this.timeout(1000);

        const inputs = {
            'searchfolder': '.testing-dir/',
            'searchpattern': '**/AssemblyInfo.cs',
            'versionnumber': '1.2.3.4'
        };
        const filesFound = [ '/some/fake/path/.testing-dir/AssemblyInfo.cs', 'some/fake/path/.testing-dir/nestedfolder/AssemblyInfo.cs' ];
        const filesContents = {
            '/some/fake/path/.testing-dir/AssemblyInfo.cs': `
                [assembly: AssemblyVersion("1.0.0.0")]
            `,
            'some/fake/path/.testing-dir/nestedfolder/AssemblyInfo.cs': `
                [assembly: AssemblyFileVersion("1.0.0.0")]
            `
        }

        currentContext = new TestContext(inputs, filesFound, filesContents);

        let subject = new AssemblyVersioningTask(currentContext.getMockTaskLibrary(), currentContext.getMockFileSystem());
        subject.run('.testing-dir/', '**/AssemblyInfo.cs', '1.2.3.4');
        
        assert.equal(currentContext.runResult === tl.TaskResult.Succeeded, true, 'should have succeeded');
        console.log('console.log(tr.stdout):')
        // console.log(tr.stdout);

        let firstFileResultContentString = currentContext.resultFileContents[filesFound[0]]
        assert.equal(firstFileResultContentString.indexOf('[assembly: AssemblyVersion("1.2.3.4")]') >= 0, true, "should modify AssemblyVersion");

        let secondFileResultContentString = currentContext.resultFileContents[filesFound[1]];
        assert.equal(secondFileResultContentString.indexOf('[assembly: AssemblyFileVersion("1.2.3.4")]') >= 0, true, "should modify AssemblyFileVersion");

        done();
    });
});
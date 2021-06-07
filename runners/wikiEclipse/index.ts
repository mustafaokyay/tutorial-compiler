import { Playbook } from "../../engine/playbook";
import { WikiRunner } from "../../engine/wikiRunner";
import { RunCommand } from "../../engine/run_command";
import { RunResult } from "../../engine/run_result";
import * as path from "path";
import * as fs from "fs-extra";

export class WikiEclipse extends WikiRunner {

    init(playbook: Playbook): void {
        super.init(playbook);
    }

    async destroy(playbook: Playbook): Promise<void> {
        super.destroy(playbook);
    }

    runCreateFile(runCommand: RunCommand): RunResult{
        let fileName = path.basename(runCommand.command.parameters[0]);
        let filePath = path.join(this.getVariable(this.WORKSPACE_DIRECTORY), runCommand.command.parameters[0].replace(fileName, ""));
        filePath = path.relative(this.getWorkingDirectory(), filePath).replace(/\\/g, "/");
        let fileType = this.fileTypeMap.get(fileName.substr(fileName.indexOf(".")));
        let parentFolder = path.basename(filePath);
        let content = runCommand.command.parameters[1] 
            ? fs.readFileSync(path.join(this.playbookPath, runCommand.command.parameters[1]), { encoding: "utf-8" })
            : undefined;
        this.renderWiki(path.join(this.getRunnerDirectory(), "templates", "createFile.asciidoc"), {filePath : filePath ,fileName: fileName, content : content, fileType: fileType, parentFolder: parentFolder });
        return null;
    }
      
    runChangeFile(runCommand: RunCommand): RunResult{
        let workspacePath = this.getVariable(this.WORKSPACE_DIRECTORY).replace(/\\/g, "/");
        let fileName = path.basename(runCommand.command.parameters[0]);
        let filePath = path.join(workspacePath,runCommand.command.parameters[0].replace(fileName, "")); 
        let contentPath, contentFile, contentString;
        if(runCommand.command.parameters[1].fileConsole || runCommand.command.parameters[1].contentConsole){
            contentPath = runCommand.command.parameters[1].fileConsole;
            contentString = runCommand.command.parameters[1].contentConsole;
        }else{
            contentPath = runCommand.command.parameters[1].file;
            contentString = runCommand.command.parameters[1].content;
        }
        contentFile = contentPath 
            ? path.basename(contentPath)
            : undefined;
        contentPath = contentPath 
            ? path.join(this.getPlaybookPath(), contentPath.replace(contentFile, ""))
            : undefined;
        let placeholder = runCommand.command.parameters[1].placeholder;
        let lineNumber = runCommand.command.parameters[1].lineNumber;

        this.renderWiki(path.join(this.getRunnerDirectory(), "templates", "changeFile.asciidoc"), {filePath : filePath,
             contentPath: contentPath, contentString: contentString, placeholder: placeholder, lineNumber: lineNumber,
            contentFile: contentFile, fileName: fileName});
        return null;
    }
    

    runInstallCobiGen(runCommand: RunCommand): RunResult{
        this.renderWiki(path.join(this.getRunnerDirectory(), "templates", "installCobiGen.asciidoc"), {});
        return null;
    }

    supports(name: string, parameters: any[]): boolean {
        return this.getVariable(this.INSTALLED_TOOLS).includes("eclipse")
            ? super.supports(name, parameters)
            : false;
    }


    runCreateDevon4jProject(runCommand: RunCommand): RunResult {
        this.renderWiki(path.join(this.getRunnerDirectory(), "templates", "createDevon4jProject.asciidoc"), { name: runCommand.command.parameters[0]});
        return null;
    }
    runAdaptTemplatesCobiGen(runComannd: RunCommand): RunResult{
        this.renderWiki(path.join(this.getRunnerDirectory(), "templates", "adaptTemplates.asciidoc"), {});
        return null;
    }
}
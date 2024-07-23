/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import path = require('path');
import * as fs from 'fs/promises';
import * as os from 'os';
import * as vscode from 'vscode';
//import { recommendContinue } from './recommendationService';

export interface AiAssistantConfigurationRequest {
    metadata: {
        inferenceEndpoint: string;
        name: string;
        provider?: string;
    }

}

interface Model {
    title: string;
    model: string;
	apiBase: string;
    provider: string;
    completionOptions: any;
}

interface TabAutocompleteModel {
    title: string;
    model: string;
    provider: string;
}

export class AiAssistantConfigurator {
    constructor(private request: AiAssistantConfigurationRequest) {}

    public async openWizard() {
        if (isContinueInstalled()) {
            await this.configureAssistant();
        } else {
            return;//await recommendContinue();
        }
    }

    async configureAssistant() {
        const model = {
            title: this.request.metadata.name,
            model: this.request.metadata.name,
            completionOptions: {},
            apiBase: this.request.metadata.inferenceEndpoint,
            provider:this.request.metadata.provider,
        } as Model;
        const configFile = path.join(os.homedir(), '.continue/config.json');
        const config = await readConfig(configFile);
        if (!config) {
            return vscode.window.showErrorMessage('No ~/.continue/config.json found');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const models: Model[] = config.models === undefined?[]:config.models;
        // check if model object is already in the config json
        if (models.find((m) => model.apiBase === m.apiBase)) {
            // already configured
            return vscode.window.showWarningMessage(`${model.apiBase} is already configured`);
        }

        const tabAutocompleteModel: TabAutocompleteModel = {
            title: this.request.metadata.name,
            model: this.request.metadata.name,
            provider:this.request.metadata.provider
        };
        config.tabAutocompleteModel = tabAutocompleteModel;

        models.push(model);
        await writeConfig(configFile, config);
        return vscode.window.showInformationMessage(`${model.apiBase} added to ${configFile}`);
    }
}

export const CONTINUE_EXTENSION_ID = 'Continue.continue';

function isContinueInstalled(): boolean {
    const continueExt = vscode.extensions.getExtension(CONTINUE_EXTENSION_ID);
    return continueExt !== undefined;
}

async function readConfig(configFile: string): Promise<any> {
    try {
        await fs.access(configFile, fs.constants.R_OK);
    } catch (error) {
        throw new Error(`Config file ${configFile} not found.`);
    }
    const configContent = await fs.readFile(configFile, 'utf8');
    const configData = JSON.parse(configContent);
    return configData;
}

async function writeConfig(configFile: string, config: any): Promise<void> {
    try {
        //const insertSpaces = vscode.workspace.getConfiguration().get<boolean>('editor.insertSpaces');
        const tabSize = vscode.workspace.getConfiguration().get<number>('editor.tabSize');
        const configContent = JSON.stringify(config, null, tabSize);
        return fs.writeFile(configFile, configContent, 'utf8');
    } catch (error) {
        throw new Error(`Config file ${configFile} not found.`);
    }
}

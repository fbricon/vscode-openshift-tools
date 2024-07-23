/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { AiAssistantConfigurator, AiAssistantConfigurationRequest} from '../aiModelSupport/configureAssistant';
import { isKServeAware } from '../aiModelSupport/kserve';
import * as vscode from 'vscode';
import { vsCommand } from '../vscommand';
import DeployAiModelViewLoader from '../webview/deploy-ai-model/deployAiModelViewLoader';

/**
 * Wraps commands that are used for interacting with models.
 */
export class AiModel {
    @vsCommand('openshift.ai.model.deploy')
    static async deployNewAiModel() {
        if (!(await isKServeAware())) {
            return vscode.window.showErrorMessage('The KServe CRD is not installed on the current cluster!');
        }
        await DeployAiModelViewLoader.loadView();
    }

    @vsCommand('openshift.ai.configure.assistant')
    static async configureAiAssistant(request: AiAssistantConfigurationRequest) {
        await new AiAssistantConfigurator(request).openWizard();
    }

}

/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

export type InferenceModelInputBoxText = {

    name: string;
    error: boolean;
    helpText: string;
}

export type DeployInferenceModel = {
    modelName: string;
    indeferenceService: string;
    pvc: {
        name: string;
    }
}

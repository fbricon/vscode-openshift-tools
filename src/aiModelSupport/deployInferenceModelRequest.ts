/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
export interface DeployInferenceImageRequest {
    namespace: string,
    modelName: string,
    modelFormat: string,
    serviceName: string,
    runtime:string,
    pvc?: {
        name:string
        size?:string
    }
}

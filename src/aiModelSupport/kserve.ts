/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { CommandText } from '../base/command';
import { CliChannel } from '../cli';

/**
 * Returns true if the cluster has KServe's InferenceService and ServingRuntime CRDs, and false otherwise.
 *
 * @returns true if the cluster has KServe's InferenceService and ServingRuntime CRDs, and false otherwise
 */
export async function isKServeAware(): Promise<boolean> {
    try {
        const stdout = await CliChannel.getInstance().executeSyncTool(new CommandText('oc', 'api-versions'), { timeout: 5000 });
        return stdout.includes('serving.kserve.io/v1')
    } catch(error) {
        return false;
    }
}

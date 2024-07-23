/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

// import { IRecommendationService, RecommendationCore, UserChoice} from '@redhat-developer/vscode-extension-proposals';
//   import { TelemetryService } from '@redhat-developer/vscode-redhat-telemetry';
//   import { ExtensionContext } from 'vscode';
// import { CONTINUE_EXTENSION_ID } from './configureAssistant';

//   let recommendationService: IRecommendationService;

//   /**
//    * Initialize the recommendation service
//    *
//    * @param context the extension context
//    */
//   export async function initRecommendationService(context: ExtensionContext, telemetryService: TelemetryService) {
//     if (!recommendationService) {
//       recommendationService = RecommendationCore.getService(context, telemetryService);
//       const recommendations = [
//         recommendationService.create(
//           CONTINUE_EXTENSION_ID,
//           'Continue',
//           'Configure your AI-Assistant in VS Code',
//           false
//         ),
//       ];
//       return recommendationService.register(recommendations);
//     }
//   }

//   /**
//    * Show a recommendation message for the Continue extension.
//    *
//    * @throws Error if the recommendation service has not been initialized
//    */
//   export function recommendContinue(): Promise<UserChoice> {
//     if (!recommendationService) {
//       throw new Error('recommendation service has not been initialized');
//     }
//     return recommendationService.show(CONTINUE_EXTENSION_ID);
//   }

/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
import * as path from 'path';
import * as vscode from 'vscode';
import { OpenShiftExplorer } from '../../explorer';
//import { Oc } from '../../oc/ocWrapper';
import { ExtensionID } from '../../util/constants';
import { loadWebviewHtml, validateName, validatePath } from '../common-ext/utils';
import { getServices as getService } from '../../openshift/serviceHelpers';
import type { DeployInferenceModel } from '../common/inferenceModel';
import { validateModelName, validatePvC, validateService } from './ValidationFunctions';
import { Oc } from '../../oc/ocWrapper';
import { DeployInferenceImageRequest } from '../../aiModelSupport/deployInferenceModelRequest';

export default class DeployInferenceServiceViewLoader {
    private static panel: vscode.WebviewPanel;

    static get extensionPath(): string {
        return vscode.extensions.getExtension(ExtensionID).extensionPath;
    }

    static async loadView(): Promise<vscode.WebviewPanel> {
        const localResourceRoot = vscode.Uri.file(
            path.join(DeployInferenceServiceViewLoader.extensionPath, 'out', 'deploy-ai-model', 'app'),
        );

        if (DeployInferenceServiceViewLoader.panel) {
            DeployInferenceServiceViewLoader.panel.reveal();
            return DeployInferenceServiceViewLoader.panel;
        }

        DeployInferenceServiceViewLoader.panel = vscode.window.createWebviewPanel(
            'deployAiModelView',
            'Deploy Inference Model',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [localResourceRoot],
                retainContextWhenHidden: true,
            },
        );

        DeployInferenceServiceViewLoader.panel.iconPath = vscode.Uri.file(
            path.join(DeployInferenceServiceViewLoader.extensionPath, 'images/context/cluster-node.png'),
        );
        DeployInferenceServiceViewLoader.panel.webview.html = await loadWebviewHtml(
            'deploy-ai-model',
            DeployInferenceServiceViewLoader.panel,
        );

        const colorThemeDisposable = vscode.window.onDidChangeActiveColorTheme(async function (
            colorTheme: vscode.ColorTheme,
        ) {
            await DeployInferenceServiceViewLoader.panel.webview.postMessage({
                action: 'setTheme',
                themeValue: colorTheme.kind,
            });
        });

        DeployInferenceServiceViewLoader.panel.onDidDispose(() => {
            colorThemeDisposable.dispose();
            DeployInferenceServiceViewLoader.panel = undefined;
        });

        DeployInferenceServiceViewLoader.panel.webview.onDidReceiveMessage(
            DeployInferenceServiceViewLoader.messageListener,
        );
        return DeployInferenceServiceViewLoader.panel;
    }

    static async messageListener(message: { command: string; data: object }): Promise<void> {
        switch (message.command) {
            case 'ready':
                try {
                    // set theme
                    void DeployInferenceServiceViewLoader.panel.webview.postMessage({
                        action: 'setTheme',
                        themeValue: vscode.window.activeColorTheme.kind,
                    });
                    // send list of possible kinds of service to create
                    void DeployInferenceServiceViewLoader.panel.webview.postMessage({
                        action: 'setServiceKinds',
                        data: await getService(),
                    });
                } catch (e) {
                    void DeployInferenceServiceViewLoader.panel.webview.postMessage({
                        action: 'error',
                        data: `${e}`,
                    });
                    void vscode.window.showErrorMessage(`${e}`);
                }
                break;
            case 'getSpec': {
                try {
                    const services = await getService();
                    void DeployInferenceServiceViewLoader.panel.webview.postMessage({
                        action: 'setSpec',
                        data: {
                            services
                        },
                    });
                } catch (e) {
                    void DeployInferenceServiceViewLoader.panel.webview.postMessage({
                        action: 'error',
                        data: `${e}`,
                    });
                    void vscode.window.showErrorMessage(`${e}`);
                }
                break;
            }
            case 'deploy': {
                try {
                    const model: DeployInferenceModel = message.data as DeployInferenceModel;
                    // const port = {
                    //     name: route.port.name,
                    //     number: route.port.number,
                    //     protocol: route.port.protocal,
                    //     targetPort: route.port.targetPort
                    // }
                    await deployModel(model);//   Oc.Instance.createRoute(route.routeName, route.serviceName, route.hostname, route.path, port, route.isSecured);
                    void vscode.window.showInformationMessage(`Model ${model.modelName} successfully deployed.`);
                    DeployInferenceServiceViewLoader.panel.dispose();
                    OpenShiftExplorer.getInstance().refresh();
                } catch (err) {
                    void DeployInferenceServiceViewLoader.panel.webview.postMessage({
                        action: 'error',
                        data: `${err}`,
                    });
                    void vscode.window.showErrorMessage(err as string);
                }
                break;
            }
            case 'close': {
                DeployInferenceServiceViewLoader.panel.dispose();
                break;
            }
            case validateModelName: {
                const flag = (message.data as unknown as string).trim() === ''? 'Must not be empty':'';
                void DeployInferenceServiceViewLoader.panel.webview.postMessage({
                    action: validateModelName,
                    data: JSON.stringify({
                        error: flag ? true : false,
                        helpText: flag ? flag : '',
                        name: message.data
                    })
                });
                break;
            }
            case validateService: {
                const flag = validateName(message.data as unknown as string);
                void DeployInferenceServiceViewLoader.panel.webview.postMessage({
                    action: validateService,
                    data: JSON.stringify({
                        error: flag ? true : false,
                        helpText: flag ? flag : '',
                        name: message.data
                    })
                });
                break;
            }
            case validatePvC: {
                const flag = validateName(message.data as unknown as string);
                void DeployInferenceServiceViewLoader.panel.webview.postMessage({
                    action: validatePvC,
                    data: JSON.stringify({
                        error: flag ? true : false,
                        helpText: flag ? flag : '',
                        name: message.data
                    })
                });
                break;
            }
            case 'validatePath': {
                if (JSON.stringify(message.data).trim() === '') {
                    void DeployInferenceServiceViewLoader.panel.webview.postMessage({
                        action: 'validatePath',
                        data: JSON.stringify({
                            error: false,
                            helpText: '',
                            name: message.data
                        })
                    });
                    break;
                }
                const flag = validatePath(JSON.stringify(message.data));
                void DeployInferenceServiceViewLoader.panel.webview.postMessage({
                    action: 'validatePath',
                    data: JSON.stringify({
                        error: !flag ? false : true,
                        helpText: !flag ? '' : flag,
                        name: message.data
                    })
                });
                break;
            }
            default:
                void vscode.window.showErrorMessage(`Unrecognized message ${message.command}`);
        }
    }
}

async function deployModel(model: DeployInferenceModel): Promise<void> {
    const request = {
        modelName: model.modelName,
        modelFormat: 'gguf',
        serviceName: model.indeferenceService,
        runtime: 'llama-cpp-python',
        pvc: {
            name: model.pvc.name,
            size:'6Gi'
        },
        namespace: 'kserve-test'
    } as DeployInferenceImageRequest;
    return Oc.Instance.deployInferenceImage(request);
}

/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    Box,
    Container,
//    FormControl,
    PaletteMode,
    Stack,
    ThemeProvider,
    Typography,
    TextField,
    // FormHelperText,
    // MenuItem,
    // Select,
    // InputLabel,
    // Checkbox,
    // FormControlLabel,
    Button
} from '@mui/material';
import * as React from 'react';
import 'react-dom';
//import type { K8sResourceKind, Port } from '../../common/createServiceTypes';
import { LoadScreen } from '../../common/loading';
// import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { createVSCodeTheme } from '../../common/vscode-theme';
import { ErrorPage } from '../../common/errorPage';
import { validateModelName, validatePvC, validateService } from '../ValidationFunctions';
import { DeployInferenceModel, InferenceModelInputBoxText } from '../../common/inferenceModel'
/**
 * Component to select which type of service (which CRD) should be created.
 */
function SelectService(props: {
    modelNameObj: InferenceModelInputBoxText;
    setModelNameObj;
    serviceNameObj: InferenceModelInputBoxText;
    setServiceNameObj;
    pvcNameObj: InferenceModelInputBoxText;
    setPvcNameObj;
    // pathObj: RouteInputBoxText;
    // setPathNameObj;
    // serviceKinds: K8sResourceKind[];
    // selectedServiceKind: K8sResourceKind;
    // setSelectedServiceKind;
    // ports: Port[],
    // setPorts;
    // selectedPort: Port;
    // setSelectedPort;
}) {

    //const [isServiceKindTouched, setServiceKindTouched] = React.useState(false);
    //const [isPortTouched, setPortTouched] = React.useState(false);
    //const [isSecured, setSecured] = React.useState(false);

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
            }}
        >
            <Stack direction='column' spacing={2} marginTop={3}>
                <Box paddingBottom={1}>
                    <Typography variant='h5'>Deploy Inference Model</Typography>
                </Box>
                <TextField fullWidth
                    id='inferenceServiceName'
                    variant='outlined'
                    label='Service Name'
                    placeholder='granite'
                    required
                    value={props.serviceNameObj.name}
                    error={props.serviceNameObj.error}
                    helperText={props.serviceNameObj.helpText}
                    onChange={(e) => {
                        window.vscodeApi.postMessage({
                            command: validateService,
                            data: e.target.value
                        });
                        props.setServiceNameObj((prevState: InferenceModelInputBoxText) => ({ ...prevState, name: e.target.value }));
                    }} />
                <TextField fullWidth
                    id='inference-model-name'
                    variant='outlined'
                    label='Name'
                    placeholder='my-inference-model'
                    required
                    value={props.modelNameObj.name}
                    error={props.modelNameObj.error}
                    helperText={props.modelNameObj.helpText}
                    onChange={(e) => {
                        window.vscodeApi.postMessage({
                            command: validateModelName,
                            data: e.target.value
                        });
                        props.setModelNameObj((prevState: InferenceModelInputBoxText) => ({ ...prevState, name: e.target.value }));
                    }}
                />
                <TextField fullWidth
                    id='inference-model-pvc'
                    variant='outlined'
                    label='PVC Name'
                    placeholder='my-inference-model-pvc'
                    required
                    value={props.pvcNameObj.name}
                    error={props.pvcNameObj.error}
                    helperText={props.pvcNameObj.helpText}
                    onChange={(e) => {
                        window.vscodeApi.postMessage({
                            command: validatePvC,
                            data: e.target.value
                        });
                        props.setPvcNameObj((prevState: InferenceModelInputBoxText) => ({ ...prevState, name: e.target.value }));
                    }}
                />
                {/*
                <TextField fullWidth
                    id='path'
                    variant='outlined'
                    label='Path'
                    placeholder='/'
                    value={props.pathObj.name}
                    error={props.pathObj.error}
                    helperText={props.pathObj.helpText}
                    onChange={(e) => {
                        window.vscodeApi.postMessage({
                            command: 'validatePath',
                            data: e.target.value
                        });
                        props.setPathNameObj((prevState: RouteInputBoxText) => ({ ...prevState, name: e.target.value }));
                    }} />
                -->
                <!--
                <FormControl required>
                    <InputLabel id='serving-runtimes-label'>Serving Runtime</InputLabel>
                    <Select
                        id='serving-runtime'
                        labelId='serving-runtime-label'
                        label='Serving Runtime'
                        value={props.selectedServiceKind ? props.selectedServiceKind.metadata.name : ''}
                        onClick={(_e) => {
                            if (!isServiceKindTouched) {
                                setServiceKindTouched(true);
                            }
                        }}
                        onChange={(e) => {
                            const newSelection = props.serviceKinds.find(
                                (serviceKind: K8sResourceKind) => serviceKind.metadata.name === e.target.value,
                            );
                            props.setSelectedServiceKind((_) => newSelection);
                            props.setPorts((_) => newSelection.spec.ports);
                            props.setSelectedPort((_) => undefined);
                        }}
                        variant='outlined'
                        placeholder='Select a serving runtime'
                        error={isServiceKindTouched && props.selectedServiceKind === undefined}
                        required
                    >
                        {props.serviceKinds.map((serviceKind: K8sResourceKind) => (
                            <MenuItem key={serviceKind.metadata.name} value={serviceKind.metadata.name}>
                                {serviceKind.metadata.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Inference Serving Runtime</FormHelperText>
                </FormControl>
                -->
                <!--
                <FormControl required>
                    <InputLabel id='target-port-label'>Target Port</InputLabel>
                    <Select
                        id='target-port'
                        labelId='target-port-label'
                        label='Target Port'
                        value={props.selectedPort ? props.selectedPort.port : ''}
                        disabled={!props.selectedServiceKind}
                        onClick={(_e) => {
                            if (!isPortTouched) {
                                setPortTouched(true);
                            }
                        }}
                        onChange={(e) => {
                            const newSelection = props.ports.find(
                                (port: Port) => port.port === e.target.value,
                            );
                            props.setSelectedPort((_) => newSelection);
                        }}
                        variant='outlined'
                        placeholder='Select target port'
                        error={isServiceKindTouched && props.selectedServiceKind === undefined}
                        required
                    >
                        {props.ports.map((portObj: Port) => (
                            <MenuItem key={portObj.port} value={portObj.port}>
                                {portObj.port} <ArrowRightAltIcon /> {portObj.targetPort} ({portObj.protocol})
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Target Port for traffic</FormHelperText>
                </FormControl>
                <FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isSecured}
                                onClick={(_) => {
                                    setSecured((isSecured) => !isSecured);
                                }} />
                        }
                        label='Secure Route'
                    />
                    <FormHelperText>Routes can be secured using several TLS termination types for serving certificates.</FormHelperText>
                </FormControl>
                */}
                <Stack direction='row' spacing={2} marginTop={3}>
                    <Button
                        variant='contained'
                        onClick={() => {
                            window.vscodeApi.postMessage({
                                command: 'deploy',
                                data: {
                                    modelName: props.modelNameObj.name.trim(),
                                    indeferenceService: props.serviceNameObj.name.trim(),
                                    pvc: {
                                        name: props.pvcNameObj.name.trim()
                                    }
                                    // hostname: props.hostNameObj.name.trim(),
                                    // path: props.pathObj.name.trim(),
                                    // serviceName: props.selectedServiceKind.metadata.name.trim(),
                                    // port: {
                                    //     number: props.selectedPort.port,
                                    //     targetPort: props.selectedPort.targetPort,
                                    //     name: props.selectedPort.name,
                                    //     protocal: props.selectedPort.protocol
                                    // },
                                    // isSecured
                                } as DeployInferenceModel,
                            });
                        }}
                        disabled={props.modelNameObj.name.trim().length === 0 || props.modelNameObj.error /*|| props.hostNameObj.error || !props.selectedServiceKind || !props.selectedPort*/}
                    >
                        Create
                    </Button>
                    <Button
                        variant='contained'
                        onClick={() => {
                            window.vscodeApi.postMessage({
                                command: 'close'
                            });
                        }}>
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </form >
    );
}

type CreateServicePage = 'Loading' | 'PickServiceKind' | 'Error';

export function CreateService() {
    const [page, setPage] = React.useState<CreateServicePage>('Loading');

    const [themeKind, setThemeKind] = React.useState<PaletteMode>('light');
    const theme = React.useMemo(() => createVSCodeTheme(themeKind), [themeKind]);
    const [error, setError] = React.useState<string>(undefined);

    const [modelNameObj, setModelNameObj] = React.useState<InferenceModelInputBoxText>({
        name: '',
        error: false,
        helpText: 'The name of the model to deploy.'
    });

    const [serviceNameObj, setServiceNameObj] = React.useState<InferenceModelInputBoxText>({
        name: '',
        error: false,
        helpText: 'Inference Service name'
    });

    const [pvcNameObj, setPvcNameObj] = React.useState<InferenceModelInputBoxText>({
        name: '',
        error: false,
        helpText: 'Persistent Volume Claim name'
    });
/*
    const [pathObj, setPathObj] = React.useState<RouteInputBoxText>({
        name: '',
        error: false,
        helpText: 'Path that the router watches to route traffic to the service.'
    });

    const [serviceKinds, setServiceKinds] = React.useState<K8sResourceKind[]>(undefined);
    const [selectedServiceKind, setSelectedServiceKind] =
        React.useState<K8sResourceKind>(undefined);
    const [ports, setPorts] = React.useState<Port[]>([]);
    const [selectedPort, setSelectedPort] =
        React.useState<Port>(undefined);
*/
    function messageListener(event) {
        if (event?.data) {
            const message = event.data;
            switch (message.action) {
                case 'setTheme':
                    setThemeKind(event.data.themeValue === 1 ? 'light' : 'dark');
                    break;
                case 'setServiceKinds':
                    //setServiceKinds((_) => message.data);
                    setPage((_) => 'PickServiceKind');
                    break;
                case validateService: {
                    const serviceData = JSON.parse(message.data) as unknown as InferenceModelInputBoxText;
                    setServiceNameObj({
                        name: serviceData.name,
                        error: serviceData.error,
                        helpText: serviceData.helpText !== '' ? serviceData.helpText : serviceNameObj.helpText
                    });
                    break;
                }
                case validateModelName: {
                    const modelNameData: InferenceModelInputBoxText = JSON.parse(message.data) as unknown as InferenceModelInputBoxText;
                    setModelNameObj({
                        name: modelNameData.name,
                        error: modelNameData.error,
                        helpText: modelNameData.helpText !== '' ? modelNameData.helpText : modelNameObj.helpText
                    });
                    break;
                }
                case validatePvC: {
                    const pvcData: InferenceModelInputBoxText = JSON.parse(message.data) as unknown as InferenceModelInputBoxText;
                    setPvcNameObj({
                        name: pvcData.name,
                        error: pvcData.error,
                        helpText: pvcData.helpText !== '' ? pvcData.helpText : pvcNameObj.helpText
                    });
                    break;
                }
                // case 'validatePath': {
                //     const PathData: RouteInputBoxText = JSON.parse(message.data) as unknown as RouteInputBoxText;
                //     setPathObj({
                //         name: PathData.name,
                //         error: PathData.error,
                //         helpText: PathData.helpText
                //     });
                //     break;
                // }
                case 'error':
                    setError(() => message.data )
                    setPage(() => 'Error');
                    break;
                default:
                    break;
            }
        }
    }

    React.useEffect(() => {
        window.addEventListener('message', messageListener);
        return () => {
            window.removeEventListener('message', messageListener);
        };
    }, []);

    let pageElement;

    switch (page) {
        case 'Loading':
            return <LoadScreen title='Loading ...' />;
        case 'Error':
            pageElement = (<ErrorPage message={error} />);
            break;
        case 'PickServiceKind':
            pageElement = (
                <SelectService
                    modelNameObj={modelNameObj}
                    setModelNameObj={setModelNameObj}
                    serviceNameObj={serviceNameObj}
                    setServiceNameObj={setServiceNameObj}
                    pvcNameObj={pvcNameObj}
                    setPvcNameObj={setPvcNameObj}
                    // hostNameObj={hostNameObj}
                    // setHostNameObj={setHostNameObj}
                    // pathObj={pathObj}
                    // setPathNameObj={setPathObj}
                    // serviceKinds={serviceKinds}
                    // selectedServiceKind={selectedServiceKind}
                    // setSelectedServiceKind={setSelectedServiceKind}
                    // ports={ports}
                    // setPorts={setPorts}
                    // selectedPort={selectedPort}
                    // setSelectedPort={setSelectedPort}
                    />
            );
            break;
        default:
            <>Error</>;
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth='lg'>
                {pageElement}
                {error?.trim().length > 0 &&
                    <Stack direction='row' spacing={2} marginTop={3}>
                        <Button
                            variant='contained'
                            onClick={() => {
                                setError(() => undefined);
                                setPage((_) => 'PickServiceKind');
                            }}
                        >
                            Back
                        </Button>
                    </Stack>
                }
            </Container>
        </ThemeProvider>
    );
}

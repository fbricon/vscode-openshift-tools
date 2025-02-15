/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
import { BaseService } from '../services/base-service';
import { RepoStatus } from '../types';
import { ImportStrategy } from '../types/git';
import { detectBuildTypes } from './build-tool-type-detector';

type ImportStrategyType = {
  name: string;
  type: ImportStrategy;
  expectedRegexp: RegExp;
  priority: number;
  customDetection?: (gitService: BaseService) => Promise<any>;
};

const ImportStrategyList: ImportStrategyType[] = [
  {
    name: 'Devfile',
    type: ImportStrategy.DEVFILE,
    expectedRegexp: /^\.?devfile\.yaml$/,
    priority: 2,
  },
  {
    name: 'Dockerfile',
    type: ImportStrategy.DOCKERFILE,
    expectedRegexp: /^Dockerfile.*/,
    priority: 1,
  },
  {
    name: 'Builder Image',
    type: ImportStrategy.S2I,
    expectedRegexp: /^/,
    priority: 0,
    customDetection: detectBuildTypes,
  },
];

export type DetectedStrategy = {
  name: string;
  type: ImportStrategy;
  priority: number;
  detectedFiles: string[];
  detectedCustomData?: any;
};

export type DetectedServiceData = {
  loaded: boolean;
  loadError?: any;
  repositoryStatus: RepoStatus;
  strategies: DetectedStrategy[];
};

export const detectImportStrategies = async (
  repository: string,
  gitService: BaseService,
): Promise<DetectedServiceData> => {
  let detectedStrategies: DetectedStrategy[] = [];
  let loaded = false;
  let loadError = null;

  const repositoryStatus = gitService ? await gitService.isRepoReachable() : RepoStatus.Unreachable;
  let detectedFiles: string[] = [];
  let detectedCustomData: string[];

  if (repositoryStatus === RepoStatus.Reachable) {
    try {
      const { files } = await gitService.getRepoFileList();
      detectedStrategies = await Promise.all(
        ImportStrategyList.map<Promise<DetectedStrategy>>(async (strategy) => {
          detectedFiles = files.filter((f) => strategy.expectedRegexp.test(f));
          if (detectedFiles.length > 0 && strategy.customDetection) {
            detectedCustomData = await strategy.customDetection(gitService);
          }
          return {
            name: strategy.name,
            type: strategy.type,
            priority: strategy.priority,
            detectedFiles,
            detectedCustomData,
          };
        }),
      );
      loaded = true;
    } catch (err) {
      loaded = true;
      loadError = err.message;
    }
  } else {
    loaded = true;
  }

  detectedStrategies = detectedStrategies
    .filter((strategy) => !!strategy.detectedFiles.length || !!strategy.detectedCustomData?.length)
    .sort((t1, t2) => t2.priority - t1.priority);

  return {
    loaded,
    loadError,
    repositoryStatus,
    strategies: detectedStrategies,
  };
};



export type DeployArgs = {
  overrideSizeCheck: boolean;
  chunkedPublish: boolean;
  largePackagesModuleAddress: string;
  chunkSize: string;
  includedArtifacts: string;
  packageDir_deploy: string;
  outputDir_deploy: string;
  named_addresses: string;
  overrideStd_deploy: string;
  skipGitDeps_deploy: boolean;
  skipAttributeChecks_deploy: boolean;
  checkTestCode_deploy: boolean;
  optimize: string;
  bytecodeVersion: string;
  compilerVersion: string;
  languageVersion: string;
  senderAccount: string;
  privateKey_deploy: string;
  encoding: string;
  gasUnitPrice: string;
  maxGas: string;
  expirationSecs: string;
  assume_yes: boolean;
  assume_no: boolean;
  local: boolean;
  benmark: boolean;
};

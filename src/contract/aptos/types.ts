interface Settings {
  namedAddresses: string;
  optimizer: boolean;
  optimizerlevel: string;
  network: string;
}

export type TestArgs = {
  namedAddresses: string;
  filter: string;
  ignoreCompileWarnings: boolean;
  packageDir: string;
  outputDir: string;
  overrideStd: string;
  skipFetchLatestGitDeps: boolean;
  skipAttributeChecks: boolean;
  dev: boolean;
  checkTestCode: boolean;
  optimize: string;
  bytecodeVersion: string;
  compilerVersion: string;
  languageVersion: string;
  moveVersion: string;
  instructions: string;
  coverage: boolean;
  dump: boolean;
};

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

export type CompileArgs = {
  saveMetadata: boolean;
  fetchDepsOnly: boolean;
  artifacts: "none" | "sparse" | "all"|"";
  packageDir_compile: string;
  outputDir: string;
  named_addresses: string;
  overrideStd: string | null;
  devMode: boolean;
  skipGitDeps: boolean;
  skipAttributeChecks: boolean;
  checkTestCode: boolean;
  optimization: "none" | "default" | "extra" | "";
};

export type CompileSettings = Settings;
export type TesterSettings = Settings;


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
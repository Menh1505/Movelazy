export type StatusType = "success" | "error" | null;

export interface BaseStatus {
  type: StatusType;
  message: string;
}

export interface cliStatus extends BaseStatus {
  stdout: string;
  stderr: string;
}

export type cliStatus = BaseStatus;
export type TestStatus = BaseStatus;

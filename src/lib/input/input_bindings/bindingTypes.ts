export type KeyboardBind =
  | string
  | Function
  | {
      function: Function;
      args?: any[];
    };

export type ControllerBind =
  | KeyboardBind
  | { publisher: string; deltaSensitivity?: number }
  | { function: Function; args?: any[]; deltaSensitivity?: number};

/**
 * This function takes in a `FunctionArgsPair` (plus any additional properties) and
 * type checks it.
 */
export function makeFunction<T extends (...args: never[]) => void, Rest extends object = object>({
  function: func,
  args,
  ...rest
}: { function: T; args?: Parameters<T> } & Rest): FunctionArgsPair & Rest {
  return { function: func as unknown as (...args: unknown[]) => void, args, ...(rest as Rest) };
}

export type FunctionArgsPair = {
  function: (...args: unknown[]) => void;
  args?: unknown[];
};

export type KeyboardBind = string | (() => void) | FunctionArgsPair;

export type ControllerBind =
  | KeyboardBind
  | { publisher: string; deltaSensitivity?: number }
  | (FunctionArgsPair & { deltaSensitivity?: number });

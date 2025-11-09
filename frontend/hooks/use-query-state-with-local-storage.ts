import { useQueryState, UseQueryStateOptions } from "nuqs";
import { useCallback, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

// For now, we only use these on a few pages, and we don't want to persist it on another pages
// so we have a sync option to control that, defined as `sync` in the options
export const useQueryStateWithLocalStorage = <T>(
  key: string,
  options: UseQueryStateOptions<T> & {
    defaultValue: T;
    sync?: boolean;
  }
) => {
  // queryState is never null, it defaults to the defaultValue
  const [queryState, setQueryState] = useQueryState<T>(key.split("?")[1], options);

  // localStorageState defaults to null
  const [localStorageState, setLocalStorageState] = useLocalStorage<
    ReturnType<UseQueryStateOptions<T>["parse"]>
  >(key, queryState);

  useEffect(() => {
    // If queryState is the same as localStorageState, do nothing
    if (queryState === localStorageState) return;

    // If queryState is default (nothing there) and localStorageState is there, set localStorageState to queryState
    if (
      queryState === options.defaultValue &&
      localStorageState !== null &&
      localStorageState !== undefined &&
      options.sync
    ) {
      setQueryState(localStorageState);

      return;
    }
  }, [
    queryState,
    localStorageState,
    setLocalStorageState,
    setQueryState,
    options.defaultValue,
    options.sync,
  ]);

  type Value = NonNullable<ReturnType<typeof options.parse>>;

  const setState = useCallback(
    (value: Value | null) => {
      setLocalStorageState(value);

      return setQueryState(value);
    },
    [setLocalStorageState, setQueryState]
  );

  return [queryState, setState] as const;
};

import * as React from "react";
import queryString from "query-string";

function getSearch() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.search;
}

function setSearch(search: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.history.pushState(null, null, `/?${search}`);
}

/**
 * This hook will store the state in the URL and on refresh it will initialise the state based on the query params.
 */
function useUrlState<T extends Record<string, unknown>>(
  initialState: T
): [T, (partialState: Partial<T>) => void] {
  const searchParams = React.useMemo(
    () =>
      queryString.parse(getSearch(), {
        arrayFormat: "bracket",
        parseBooleans: true,
        parseNumbers: true
      }),
    []
  );

  const [state, setState] = React.useState<T>(() => {
    const allowedKeys = Object.keys(initialState);

    const entries = Object.entries(searchParams).filter(([key]) =>
      allowedKeys.includes(key)
    );

    const urlState = entries.reduce(
      (state, [key, value]) => ({
        ...state,
        [key]: value
      }),
      {}
    );

    return {
      ...initialState,
      ...urlState
    };
  });

  const setUrlState = React.useCallback(
    (partialState: Partial<T>) => {
      setSearch(
        queryString.stringify(
          {
            ...searchParams,
            ...partialState
          },
          { arrayFormat: "bracket" }
        )
      );

      setState(s => ({
        ...s,
        ...partialState
      }));
    },
    [searchParams]
  );

  return [state, setUrlState];
}

export default useUrlState;

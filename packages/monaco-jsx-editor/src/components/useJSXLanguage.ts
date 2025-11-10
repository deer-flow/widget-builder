import { useEffect, useRef, useState } from "react";

import { JSXLanguage, JSXLanguageOptions } from "../jsx";

export function useJSXLanguage(options: JSXLanguageOptions) {
  const [, setTick] = useState(() => 0); // Trigger re-render when options change
  const jsxLanguageRef = useRef<JSXLanguage | null>(null);

  if (!jsxLanguageRef.current) {
    jsxLanguageRef.current = new JSXLanguage(options);
  }

  console.log("useJSXLanguage: options changed", options);

  useEffect(() => {
    if (options.dataSchema) {
      jsxLanguageRef.current?.updateDataTypes(options.dataSchema);
      setTick((tick) => tick + 1);
    }
  }, [options.dataSchema]);

  return jsxLanguageRef.current;
}

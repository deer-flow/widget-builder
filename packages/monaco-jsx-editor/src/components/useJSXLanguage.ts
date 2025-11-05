import { useEffect, useRef } from "react";
import { JSXLanguage, JSXLanguageOptions } from "../jsx";

export function useJSXLanguage(options: JSXLanguageOptions) {
  const jsxLanguageRef = useRef<JSXLanguage | null>(null);

  if (!jsxLanguageRef.current) {
    jsxLanguageRef.current = new JSXLanguage(options);
  }

  console.log("useJSXLanguage: options changed", options);

  useEffect(() => {
    if (options.dataSchema) {
      jsxLanguageRef.current?.updateDataTypes(options.dataSchema);
    }
  }, [options.dataSchema]);

  return jsxLanguageRef.current;
}

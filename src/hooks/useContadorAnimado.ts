import { useState, useEffect, useRef } from "react";

export function useContadorAnimado(valor: number) {
  const [displayValue, setDisplayValue] = useState(valor);
  const prevValue = useRef(valor);

  useEffect(() => {
    if (prevValue.current !== valor) {
      prevValue.current = valor;
      setDisplayValue(valor);
    }
  }, [valor]);

  return displayValue;
}

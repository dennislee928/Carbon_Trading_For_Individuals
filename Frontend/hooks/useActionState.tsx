import { useState } from "react";

interface ActionState<T> {
  data?: T;
  error?: Error;
  loading: boolean;
}

export function useActionState<T>() {
  const [state, setState] = useState<ActionState<T>>({
    loading: false,
  });

  const execute = async (action: () => Promise<T>) => {
    setState({ loading: true });
    try {
      const data = await action();
      setState({ data, loading: false });
      return data;
    } catch (error) {
      setState({ error: error as Error, loading: false });
      throw error;
    }
  };

  return { ...state, execute };
}

import {
  create,
  type Mutate,
  type StateCreator,
  type StoreApi,
  type UseBoundStore,
} from "zustand";
import { devtools, persist } from "zustand/middleware";

type StoreWithDevtools<T> = UseBoundStore<
  Mutate<StoreApi<T>, [["zustand/devtools", never]]>
>;

interface CreateStoreOptions<T> {
  persistKeys?: (keyof T)[];
}

export function createStore<T extends object>(
  initializer: StateCreator<T, [["zustand/devtools", never]], []>,
  name = "ZustandStore",
  options: CreateStoreOptions<T> = {},
): StoreWithDevtools<T> {
  const { persistKeys } = options;

  if (persistKeys && persistKeys.length > 0) {
    return create<T>()(
      devtools(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (persist as any)(initializer, {
          name,
          partialize: (state: T) => {
            const partial: Partial<T> = {};
            for (const key of persistKeys) {
              partial[key] = state[key];
            }
            return partial;
          },
        }),
        { name },
      ),
    ) as StoreWithDevtools<T>;
  }

  return create<T>()(devtools(initializer, { name }));
}

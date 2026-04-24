import { ref, watch, type Ref } from 'vue';

/**
 * Returns a debounced version of the given ref.
 * The returned ref updates only after the specified delay has elapsed
 * without a new value being set.
 */
export function useDebouncedRef<T>(source: Ref<T>, delay = 300): Ref<T> {
  const debounced = ref<T>(source.value) as Ref<T>;
  let timer: ReturnType<typeof setTimeout>;

  watch(source, (newVal) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      debounced.value = newVal;
    }, delay);
  });

  return debounced;
}

/**
 * Debounces a function call, delaying execution until after the specified
 * delay has elapsed since the last call.
 */
export function useDebounce<T extends (...args: any[]) => any>(fn: T, delay = 300): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

import { ref, readonly } from "vue";

const isSidebarOpen = ref(false);

export const useSidebar = () => {
  const open = () => (isSidebarOpen.value = true);
  const close = () => (isSidebarOpen.value = false);
  const toggle = () => (isSidebarOpen.value = !isSidebarOpen.value);
  return {
    isSidebarOpen: readonly(isSidebarOpen),
    open,
    close,
    toggle,
  };
};

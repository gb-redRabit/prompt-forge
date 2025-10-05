export const useInfiniteScroll = (
  callback: () => void,
  options = { threshold: 300 }
) => {
  const isLoading = ref(false);
  let ticking = false;

  const handleScroll = () => {
    if (isLoading.value || ticking) return;

    ticking = true;

    requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      if (distanceFromBottom < options.threshold) {
        isLoading.value = true;
        callback();

        setTimeout(() => {
          isLoading.value = false;
        }, 300);
      }

      ticking = false;
    });
  };

  onMounted(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  return { isLoading };
};

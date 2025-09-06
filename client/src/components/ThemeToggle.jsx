export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement
    const isDark = root.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }
  return (
    <button
      type="button"
      onClick={toggle}
      className="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800"
      aria-label="Växla tema"
      title="Växla tema"
    >
      🌓
    </button>
  )
}

import Navbar from "./Navbar"

function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans">
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  )
}

export default PageLayout
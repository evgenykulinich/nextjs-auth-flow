export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full flex items-center justify-center px-5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      {children}
    </div>
  )
}

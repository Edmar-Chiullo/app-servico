import { AuthGuard } from "@/components/layout/AuthGuard"
import { AppLayout } from "@/components/layout/AppLayout"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  )
}

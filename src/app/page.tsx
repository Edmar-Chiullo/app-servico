"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import DashboardPage from "./(auth)/page"

export default function Home() {
  return (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  )
}

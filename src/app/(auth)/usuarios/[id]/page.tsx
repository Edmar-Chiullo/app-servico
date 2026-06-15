"use client"

import { useRouter, useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, Loading } from "@/components/ui"
import { UsuarioForm } from "../components/UsuarioForm"
import { toast } from "react-toastify"

export default function EditarUsuarioPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const queryClient = useQueryClient()

  const { data: usuario, isLoading } = useQuery({
    queryKey: ["usuario", id],
    queryFn: async () => {
      const res = await fetch(`/api/usuarios/${id}`)
      if (!res.ok) throw new Error("Usuário não encontrado")
      return res.json()
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(
          err.error?.fieldErrors
            ? Object.values(err.error.fieldErrors).flat()[0] as string
            : err.error || "Erro ao salvar"
        )
      }
      return res.json()
    },
    onSuccess: () => {
      toast.success("Usuário atualizado!")
      queryClient.invalidateQueries({ queryKey: ["usuario", id] })
      queryClient.invalidateQueries({ queryKey: ["usuarios"] })
      router.push("/usuarios")
    },
    onError: (err: any) => {
      toast.error(err.message)
    },
  })

  if (isLoading) return <Loading />
  if (!usuario) return null

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Editar Usuário</h1>
      <Card>
        <UsuarioForm
          initialData={{
            id: usuario.id,
            name: usuario.name || "",
            email: usuario.email || "",
            password: "",
            role: usuario.role,
            active: usuario.active,
          }}
          onSave={async (data) => saveMutation.mutateAsync(data)}
          loading={saveMutation.isPending}
        />
      </Card>
    </div>
  )
}

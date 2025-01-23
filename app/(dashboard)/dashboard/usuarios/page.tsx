'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { userService } from '@/lib/services/api'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
  telefono: string
}

interface RegisterUserData {
  name: string
  email: string
  password: string
  role: string
  telefono: string
}

const columns = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rol",
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewUser, setShowNewUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { data: session } = useSession()
  const router = useRouter()

  const [newUser, setNewUser] = useState<RegisterUserData>({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    telefono: ''
  })

  useEffect(() => {
    if (session?.user?.role !== 'OWNER') {
      router.push('/dashboard')
      return
    }

    const fetchUsers = async () => {
      try {
        const data = await userService.getAll()
        setUsers(data)
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
        toast.error('Error al cargar los usuarios')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [session, router])

  const handleCreateUser = async () => {
    try {
      const response = await userService.register(newUser)
      setUsers([...users, response])
      setShowNewUser(false)
      toast.success('Usuario creado exitosamente')
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        telefono: ''
      })
    } catch (error) {
      console.error('Error al crear usuario:', error)
      toast.error('Error al crear el usuario')
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      await userService.update(selectedUser.id, selectedUser)
      setUsers(users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      ))
      setSelectedUser(null)
      toast.success('Usuario actualizado exitosamente')
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      toast.error('Error al actualizar el usuario')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.delete(userId)
      setUsers(users.filter(user => user.id !== userId))
      toast.success('Usuario eliminado exitosamente')
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      toast.error('Error al eliminar el usuario')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Usuarios</h2>
          <Button onClick={() => setShowNewUser(true)} className="bg-primary hover:bg-primary-dark">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Todos los Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay usuarios para mostrar
              </div>
            ) : (
              <DataTable 
                columns={columns} 
                data={users} 
                onRowClick={setSelectedUser}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showNewUser} onOpenChange={setShowNewUser}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rol
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Usuario</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="OWNER">Propietario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono" className="text-right">
                Teléfono
              </Label>
              <Input
                id="telefono"
                value={newUser.telefono}
                onChange={(e) => setNewUser({...newUser, telefono: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewUser(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUser}>
              Crear Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedUser !== null} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Rol
                </Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuario</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="OWNER">Propietario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-telefono" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="edit-telefono"
                  value={selectedUser.telefono}
                  onChange={(e) => setSelectedUser({...selectedUser, telefono: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedUser) {
                  handleDeleteUser(selectedUser.id)
                  setSelectedUser(null)
                }
              }}
            >
              Eliminar
            </Button>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateUser}>
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 
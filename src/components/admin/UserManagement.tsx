import { useState, useEffect } from 'react'
import { supabase, supabaseAdmin } from '../../lib/supabaseClient'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Switch } from "../ui/switch"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"
import { useToast } from "../../hooks/use-toast"
import { createClient } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  full_name: string
  is_admin: boolean
  created_at: string
}

export default function UserManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<Partial<User>>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [page])

  async function fetchUsers() {
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    try {
      console.log('Fetching users...');

      // Get total count
      const { data: totalData } = await supabaseAdmin
        .from('users')
        .select('id', { count: 'exact' });

      // First get all users
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('*')
        .range(from, to)
        .order('created_at', { ascending: false });

      console.log('User data:', userData);

      if (userError) {
        console.error('User fetch error:', userError);
        throw userError;
      }

      if (userData) {
        // Get all admin roles
        const { data: adminData, error: adminError } = await supabaseAdmin
          .from('admin_roles')
          .select('*');

        console.log('Admin roles data:', adminData);

        if (adminError) {
          console.error('Admin roles fetch error:', adminError);
          throw adminError;
        }

        const transformedData = userData.map(user => {
          const isAdmin = adminData?.some(admin => 
            admin.user_id === user.id && admin.is_admin === true
          );
          console.log(`User ${user.email} (${user.id}) admin status:`, isAdmin);
          return {
            ...user,
            is_admin: isAdmin
          };
        });

        setUsers(transformedData);
        setTotalPages(Math.ceil((totalData?.length || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    }
  }

  async function createUser() {
    try {
      // Check if user exists first
      const { data: existingUser, error: checkError } = await supabaseAdmin.auth.admin.listUsers()
      const userExists = existingUser?.users.some(user => user.email === newUser.email)

      if (userExists) {
        toast({
          variant: "destructive",
          title: "Error creating user",
          description: "A user with this email already exists."
        })
        return
      }

      // Create new user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true
      })

      if (authError) throw authError

      // Create user profile
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert([{
          id: authData.user.id,
          email: newUser.email,
          full_name: newUser.full_name,
          created_at: new Date().toISOString()
        }])

      if (profileError) throw profileError

      // Set admin role if needed
      if (newUser.is_admin) {
        const { error: adminError } = await supabaseAdmin
          .from('admin_roles')
          .insert([{
            user_id: authData.user.id,
            is_admin: true
          }])

        if (adminError) throw adminError
      }

      toast({
        title: "Success",
        description: "User created successfully"
      })

      await fetchUsers()
      setNewUser({})
    } catch (error: any) {
      console.error('Error creating user:', error)
      toast({
        variant: "destructive",
        title: "Error creating user",
        description: error.message || "Failed to create user"
      })
    }
  }

  async function updateUser() {
    if (!editingUser) return;

    try {
      console.log('Starting update for user:', editingUser);

      // First update auth email (if it changed)
      const { data: currentUser } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('id', editingUser.id)
        .single();

      if (currentUser && currentUser.email !== editingUser.email) {
        console.log('Updating auth email...');
        const { error: authError } = await supabaseAdmin
          .auth.admin.updateUserById(editingUser.id, {
            email: editingUser.email,
            email_confirm: true
          });

        if (authError) {
          console.error('Auth update error:', authError);
          throw authError;
        }
      }

      // Then update the user profile
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .update({
          full_name: editingUser.full_name,
          email: editingUser.email
        })
        .eq('id', editingUser.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      // Handle admin role
      console.log('Checking existing admin role...');
      const { data: existingRoles, error: roleCheckError } = await supabaseAdmin
        .from('admin_roles')
        .select('*')
        .eq('user_id', editingUser.id);

      console.log('Existing roles:', existingRoles);

      if (roleCheckError) {
        console.error('Role check error:', roleCheckError);
        throw roleCheckError;
      }

      const hasExistingRole = existingRoles && existingRoles.length > 0;
      console.log('Has existing role:', hasExistingRole);
      console.log('Should be admin:', editingUser.is_admin);

      if (editingUser.is_admin && !hasExistingRole) {
        console.log('Adding admin role...');
        const { error: insertError } = await supabaseAdmin
          .from('admin_roles')
          .insert([
            {
              user_id: editingUser.id,
              is_admin: true,
              created_at: new Date().toISOString()  // Add created_at field
            }
          ]);

        if (insertError) {
          console.error('Error adding admin role:', insertError);
          throw insertError;
        }
      } else if (!editingUser.is_admin && hasExistingRole) {
        console.log('Removing admin role...');
        const { error: deleteError } = await supabaseAdmin
          .from('admin_roles')
          .delete()
          .eq('user_id', editingUser.id);

        if (deleteError) {
          console.error('Error removing admin role:', deleteError);
          throw deleteError;
        }
      }

      console.log('Update completed successfully');
      toast({
        title: "Success",
        description: "User updated successfully"
      });

      await fetchUsers();
      setEditingUser(null);
    } catch (error: any) {
      console.error('Update failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user"
      });
    }
  }

  async function deleteUser(userId: string) {
    try {
      console.log('Starting delete process for user:', userId);

      // Create a Supabase admin client
      const supabaseAdmin = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
      );

      // First, delete all related data using the database function
      const { error: cascadeError } = await supabaseAdmin.rpc('delete_user_cascade', {
        input_user_id: userId
      });

      if (cascadeError) {
        console.error('Cascade deletion error:', cascadeError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete user data"
        });
        return;
      }

      // Then delete from auth.users
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (authError) {
        console.error('Auth deletion error:', authError);
        toast({
          variant: "destructive",
          title: "Error",
          description: authError.message || "Failed to delete user authentication"
        });
        return;
      }

      toast({
        title: "Success",
        description: "User deleted successfully"
      });

      await fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete user"
      });
    }
  }

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long"
    }
    return null
  }

  async function signUpUser(email: string, password: string, fullName: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Error signing up:', authError);
      return;
    }

    // Create a corresponding user entry in the users table
    const { error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id, // Use the user ID from the authentication
          full_name: fullName,
          email: email, // Store the email for reference
          created_at: new Date().toISOString(),
        },
      ]);

    if (userError) {
      console.error('Error creating user profile:', userError);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold"></h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. The user will receive an email to set their password.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email || ''}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={newUser.full_name || ''}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="admin"
                  checked={newUser.is_admin || false}
                  onCheckedChange={(checked) => setNewUser({ ...newUser, is_admin: checked })}
                />
                <Label htmlFor="admin">Admin User</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.is_admin ? 'Admin' : 'User'}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEditingUser(user)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div>
                              <Label htmlFor="edit-email">Email</Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={editingUser?.email || ''}
                                onChange={(e) => setEditingUser(prev => ({
                                  ...prev!,
                                  email: e.target.value
                                }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-fullName">Full Name</Label>
                              <Input
                                id="edit-fullName"
                                value={editingUser?.full_name || ''}
                                onChange={(e) => setEditingUser(prev => ({
                                  ...prev!,
                                  full_name: e.target.value
                                }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
                              <Input
                                id="edit-password"
                                type="password"
                                value={editingUser?.password || ''}
                                onChange={(e) => {
                                  const newPassword = e.target.value
                                  setPasswordError(validatePassword(newPassword))
                                  setEditingUser(prev => ({
                                    ...prev!,
                                    password: newPassword
                                  }))
                                }}
                                placeholder="Enter new password"
                                className={passwordError ? "border-red-500" : ""}
                              />
                              {passwordError && (
                                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="edit-admin"
                                checked={editingUser?.is_admin || false}
                                onCheckedChange={(checked) => setEditingUser(prev => ({
                                  ...prev!,
                                  is_admin: checked
                                }))}
                              />
                              <Label htmlFor="edit-admin">Admin User</Label>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              onClick={updateUser} 
                              disabled={!!passwordError && !!editingUser?.password}
                            >
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => setPage(pageNumber)}
                      isActive={page === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}
    </div>
  )
}


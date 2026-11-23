'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { type User } from './data';
import { UserTable } from '@/components/admin/users/UserTable';
import { UserModal } from '@/components/admin/users/UserModal';
import { DeleteUserModal } from '@/components/admin/users/DeleteUserModal';
import { Toast } from '@/components/admin/ui/Toast';
import {
  createUserAccount,
  updateUserAccount,
  deleteUserCompletely,
} from './actions';

export default function UsersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [modalState, setModalState] = useState<{
    kind: 'add' | 'edit';
    item?: User;
  } | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Toast Notification State
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>('Admin');
  const [status, setStatus] = useState<User['status']>('Active');
  const [editId, setEditId] = useState<number | null>(null);
  const [oldEmail, setOldEmail] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error.message);
    } else if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, query]);

  const handleOpenAdd = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('Admin');
    setStatus('Active');
    setEditId(null);
    setOldEmail('');
    setModalState({ kind: 'add' });
  };

  const handleOpenEdit = (user: User) => {
    setEditId(user.id);
    setOldEmail(user.email);
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setRole(user.role);
    setStatus(user.status);
    setModalState({ kind: 'edit', item: user });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (modalState?.kind === 'add' && (!password || password.length < 6)) {
      alert(
        'Password is required and must be at least 6 characters for new users.'
      );
      return;
    }

    if (
      modalState?.kind === 'edit' &&
      password.trim().length > 0 &&
      password.trim().length < 6
    ) {
      alert('New password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    if (modalState?.kind === 'add') {
      const result = await createUserAccount({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        status,
      });

      if (!result.success) {
        alert(`Error adding user: ${result.error}`);
      } else if (result.user) {
        setUsers((prev) => [result.user as User, ...prev]);
        setModalState(null);
        setSuccessMessage(
          role === 'Admin'
            ? 'Admin user added with Dashboard access!'
            : 'User added & registered successfully!'
        );
      }
    } else if (modalState?.kind === 'edit' && editId !== null) {
      const result = await updateUserAccount({
        id: editId,
        oldEmail: oldEmail || email.trim(),
        name: name.trim(),
        email: email.trim(),
        password: password.trim() || undefined,
        role,
        status,
      });

      if (!result.success) {
        alert(`Error updating user: ${result.error}`);
      } else if (result.user) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editId ? (result.user as User) : u))
        );
        setModalState(null);
        setSuccessMessage('User updated successfully!');
      }
    }

    setIsSubmitting(false);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsSubmitting(true);
    const result = await deleteUserCompletely(
      userToDelete.id,
      userToDelete.email
    );

    if (!result.success) {
      alert(`Error deleting user: ${result.error}`);
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
      setSuccessMessage('User deleted successfully!');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="grid gap-3 relative">
      <UserTable
        users={filteredUsers}
        query={query}
        setQuery={setQuery}
        loading={loading}
        onOpenAdd={handleOpenAdd}
        onOpenEdit={handleOpenEdit}
        onDelete={(id) => {
          const target = users.find((u) => u.id === id);
          if (target) setUserToDelete(target);
        }}
      />

      {modalState && (
        <UserModal
          title={modalState.kind === 'add' ? 'Add New User' : 'Edit User'}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          role={role}
          setRole={setRole}
          status={status}
          setStatus={setStatus}
          isSubmitting={isSubmitting}
          onClose={() => setModalState(null)}
          onSubmit={handleSubmit}
          isEdit={modalState.kind === 'edit'}
        />
      )}

      {userToDelete && (
        <DeleteUserModal
          userName={userToDelete.name}
          isSubmitting={isSubmitting}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {successMessage && (
        <Toast
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
}
'use client'
import type { User } from '@/types'
import { BanToggle } from './BanToggle'

interface Props {
  users: User[]
  onUpdate: (uid: string, status: 'active' | 'banned') => void
}

const roleBadge: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  seller: 'bg-blue-100 text-blue-700',
  buyer: 'bg-green-100 text-green-700',
  moderator: 'bg-yellow-100 text-yellow-700',
  smoke: 'bg-gray-100 text-gray-600',
}

export function UserTable({ users, onUpdate }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="pb-3 font-semibold text-gray-700 pr-4">User</th>
            <th className="pb-3 font-semibold text-gray-700 pr-4">Email</th>
            <th className="pb-3 font-semibold text-gray-700 pr-4">Role</th>
            <th className="pb-3 font-semibold text-gray-700 pr-4">Status</th>
            <th className="pb-3 font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.uid}>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </div>
              </td>
              <td className="py-3 pr-4 text-gray-500">{user.email}</td>
              <td className="py-3 pr-4">
                <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${roleBadge[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                  {user.role}
                </span>
              </td>
              <td className="py-3 pr-4">
                <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                  user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="py-3">
                <BanToggle
                  uid={user.uid}
                  status={user.status}
                  role={user.role}
                  onUpdate={onUpdate}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <p className="text-center text-gray-400 py-8 text-sm">No users found.</p>
      )}
    </div>
  )
}

import { UserDetailModal } from "./components/user-detail-modal";
import { UsersTable } from "./components/users-table";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage accounts and permissions</p>
        </div>
      </div>

      <UsersTable />
      <UserDetailModal />
    </div>
  );
}

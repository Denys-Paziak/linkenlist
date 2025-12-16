import { User } from "lucide-react";
import { IUser } from "../../../../../types/User";

export function AccountInformation({ user }: { user?: IUser }) {
  return (
    <div className="bg-white rounded-xl border border-primary/30 p-6">
      <h2 className="text-xl font-bold text-[#222222] mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        Account Information
      </h2>
      <div className="space-y-4">
        {/* Username */}
        <div className="flex justify-between items-center py-2 border-b border-primary/20">
          <span className="text-[#222222]/70 font-medium">Username</span>
          <span className="text-[#222222] font-bold">{user?.username}</span>
        </div>

        {/* Email */}
        <div className="flex justify-between items-center py-2 border-b border-primary/20">
          <span className="text-[#222222]/70 font-medium">Email</span>
          <span className="text-[#222222] font-bold">{user?.privateEmail}</span>
        </div>

        <div className="text-sm text-[#222222]/60 italic">
          This e-mail is private and not visible to other users.
        </div>
      </div>
    </div>
  );
}

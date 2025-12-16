import { HasUnsavedChanges } from "./has-unsaved-changes";
import { LogoutButton } from "./logout-button";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <HasUnsavedChanges />
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

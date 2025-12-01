import { CreateButton } from "./components/create-button";
import { List } from "./components/list/list";

export default function DealsPage() {
  return (
    <main className="flex gap-6 flex-col ">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Deal Management</h1>
        <CreateButton />
      </div>
      <List />
    </main>
  );
}

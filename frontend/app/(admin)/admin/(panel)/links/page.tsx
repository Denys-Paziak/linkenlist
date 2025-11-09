import { CreateForm } from "./components/create-form/create-form";
import { List } from "./components/list/list";

export default function LinksPage() {
  return (
    <main className="flex gap-6 flex-col ">
      <h1 className="text-3xl font-bold text-gray-900">Link Management</h1>
      <CreateForm />
      <List />
    </main>
  );
}

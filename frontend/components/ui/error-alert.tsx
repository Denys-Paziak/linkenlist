export function ErrorAlert({ message }: { message: string }) {
  return (
    <div
      className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-2.5"
      role="alert"
    >
      {message}
    </div>
  );
}

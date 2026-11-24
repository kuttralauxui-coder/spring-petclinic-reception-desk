export function PanelLoading({ children }: { children: string }) {
  return (
    <div role="status" className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
      {children}
    </div>
  );
}

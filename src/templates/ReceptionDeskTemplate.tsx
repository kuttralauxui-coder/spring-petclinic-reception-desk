import type { ReactNode } from 'react';

type Props = {
  header: ReactNode;
  navigation: ReactNode;
  directory: ReactNode;
  ownerWorkspace: ReactNode;
  petWorkspace: ReactNode;
  feedback?: ReactNode;
};

export function ReceptionDeskTemplate({ header, navigation, directory, ownerWorkspace, petWorkspace, feedback }: Props) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-100 selection:text-teal-900">
      {header}
      {navigation}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {directory}
          {ownerWorkspace}
          {petWorkspace}
        </div>
      </main>
      {feedback}
    </div>
  );
}

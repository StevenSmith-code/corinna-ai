import React from 'react';

import Image from 'next/image';
import { redirect } from 'next/navigation';

import { currentUser } from '@clerk/nextjs';

type Props = {
  children: React.ReactNode;
};

async function Layout({ children }: Props) {
  const user = await currentUser();

  if (user) redirect("/");
  return (
    <div className="h-screen flex w-full justify-center">
      <div className="w-[600px] lg:w-full flex flex-col items-start p-6">
        <Image
          src="/images/logo.png"
          alt="Logo"
          sizes="100vw"
          style={{ width: "20%", height: "auto" }}
          width={0}
          height={0}
        />
        {children}
      </div>
    </div>
  );
}

export default Layout;

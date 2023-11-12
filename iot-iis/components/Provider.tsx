'use client';

import { SessionProvider } from "next-auth/react";

export const Provider = ({ children, session }) => (
  <SessionProvider session={session}>
    {children}
  </SessionProvider>
)

"use client";
import {QueryProvider} from "./query-provider";
import {SonnerProvider} from "./sonner-provider";
export function AppProvider({children}:{children:React.ReactNode}){return <QueryProvider>{children}<SonnerProvider/></QueryProvider>}

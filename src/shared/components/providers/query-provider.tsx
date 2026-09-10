"use client";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/src/shared/lib/query/query-client";
export function QueryProvider({children}:{children:React.ReactNode}){return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>}

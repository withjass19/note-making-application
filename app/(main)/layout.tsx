"use client"

import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Navigation } from "./_components/navigation";

const MainLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const {isAuthenticated, isLoading} = useConvexAuth();

    if (isLoading) {
        return(
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg"/>
            </div>
        )
    }

    if (!isAuthenticated) {
        return redirect("/");
    }

    return ( 
        <div className="flex h-[100vh] w-full dark:bg-[#1f1f1f]">
            {/* <Navigation /> */}
            <Navigation/>
            <main className="h-full flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
 
export default MainLayout;
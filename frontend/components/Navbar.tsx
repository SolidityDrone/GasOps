'use client'
import { Button } from "@/components/ui/button";
import { Fuel, Power } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    return (
        <>
            {/* Invisible spacer div to prevent content from going under the sticky navbar */}
            <div className="h-20" />

            {/* Sticky navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b-2 border-pink-500 bg-black/90 backdrop-blur-md shadow-lg shadow-pink-500/20">
                <div className="container mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/50 border-2 border-pink-400">
                                    <Fuel className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                    GasOps
                                </span>
                                <div className="text-xs text-green-400 font-mono uppercase tracking-wider animate-pulse">Hedge it</div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            {isHomePage ? (
                                <Link href="/markets">
                                    <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 text-white border-2 border-pink-400 font-bold uppercase tracking-wider shadow-lg shadow-pink-500/50 hover:shadow-pink-500/75 transition-all duration-300 px-6 py-2">
                                        <Power className="w-4 h-4 mr-2" />
                                        Launch App
                                    </Button>
                                </Link>
                            ) : (
                                <appkit-button />
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
} 
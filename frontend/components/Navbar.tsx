'use client'
import { Button } from "@/components/ui/button";
import { Fuel, Power } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface GasPrice {
    eth: string;
    base: string;
    arb: string;
}

export default function Navbar() {
    const pathname = usePathname();
    const isHomePage = pathname === "/";
    const [gasPrices, setGasPrices] = useState<GasPrice>({ eth: "", base: "", arb: "" });
    const [loading, setLoading] = useState(true);

    // Fetch latest gas prices from subgraphs
    const fetchGasPrices = useCallback(async () => {
        setLoading(true);
        const newGasPrices: GasPrice = { eth: "", base: "", arb: "" };

        // Fetch ETH gas price
        try {
            const ethResponse = await fetch('/api/gas-prices?chain=eth&latest=true');
            if (ethResponse.ok) {
                const ethData = await ethResponse.json();
                if (ethData.success && ethData.data && ethData.data.length > 0) {
                    const latestEth = ethData.data[0]; // Only one item when latest=true
                    const ethGwei = (latestEth.close / 1e9).toFixed(2);
                    newGasPrices.eth = `${ethGwei} Gwei`;
                } else {
                    newGasPrices.eth = "fail";
                }
            } else {
                newGasPrices.eth = "fail";
            }
        } catch (error) {
            newGasPrices.eth = "fail";
        }

        // Fetch Base gas price
        try {
            const baseResponse = await fetch('/api/gas-prices?chain=base&latest=true');
            if (baseResponse.ok) {
                const baseData = await baseResponse.json();
                if (baseData.success && baseData.data && baseData.data.length > 0) {
                    const latestBase = baseData.data[0]; // Only one item when latest=true
                    const baseGwei = (latestBase.close / 1e9).toFixed(2);
                    newGasPrices.base = `${baseGwei} Gwei`;
                } else {
                    newGasPrices.base = "fail";
                }
            } else {
                newGasPrices.base = "fail";
            }
        } catch (error) {
            newGasPrices.base = "fail";
        }

        // Fetch Arbitrum gas price
        try {
            const arbResponse = await fetch('/api/gas-prices?chain=arb&latest=true');
            if (arbResponse.ok) {
                const arbData = await arbResponse.json();
                if (arbData.success && arbData.data && arbData.data.length > 0) {
                    const latestArb = arbData.data[0]; // Only one item when latest=true
                    const arbGwei = (latestArb.close / 1e9).toFixed(2);
                    newGasPrices.arb = `${arbGwei} Gwei`;
                } else {
                    newGasPrices.arb = "fail";
                }
            } else {
                newGasPrices.arb = "fail";
            }
        } catch (error) {
            newGasPrices.arb = "fail";
        }

        setGasPrices(newGasPrices);
        setLoading(false);
    }, []);

    // Fetch gas prices on component mount only
    useEffect(() => {
        fetchGasPrices();
    }, [fetchGasPrices]);

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

                        {/* Gas Prices Display - Only show when not on home page */}
                        {!isHomePage && (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400 font-mono">ETH</div>
                                        <div className={`text-sm font-bold ${gasPrices.eth === "fail" ? "text-red-500" : "text-green-400"}`}>
                                            {loading ? "..." : gasPrices.eth}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400 font-mono">BASE</div>
                                        <div className={`text-sm font-bold ${gasPrices.base === "fail" ? "text-red-500" : "text-green-400"}`}>
                                            {loading ? "..." : gasPrices.base}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400 font-mono">ARB</div>
                                        <div className={`text-sm font-bold ${gasPrices.arb === "fail" ? "text-red-500" : "text-green-400"}`}>
                                            {loading ? "..." : gasPrices.arb}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center">
                            {isHomePage ? (
                                <Link href="/markets">
                                    <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 text-white border-2 border-pink-400 font-bold uppercase tracking-wider shadow-lg shadow-pink-500/50 hover:shadow-pink-500/75 transition-all duration-300 px-6 py-2">
                                        <Power className="w-4 h-4 mr-2" />
                                        Launch App
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    {/* Navigation Links - Centered */}
                                    <div className="flex items-center space-x-6 mr-8">
                                        <Link href="/markets">
                                            <Button
                                                variant={pathname === "/markets" ? "default" : "ghost"}
                                                className={`font-semibold uppercase tracking-wider transition-all duration-300 ${pathname === "/markets"
                                                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-2 border-pink-400 shadow-lg shadow-pink-500/50"
                                                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                                                    }`}
                                            >
                                                Markets
                                            </Button>
                                        </Link>
                                        <Link href="/dashboard">
                                            <Button
                                                variant={pathname === "/dashboard" ? "default" : "ghost"}
                                                className={`font-semibold uppercase tracking-wider transition-all duration-300 ${pathname === "/dashboard"
                                                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-2 border-pink-400 shadow-lg shadow-pink-500/50"
                                                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                                                    }`}
                                            >
                                                Dashboard
                                            </Button>
                                        </Link>
                                    </div>
                                    <appkit-button />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
} 
'use client';

import React, { useState, useEffect } from 'react';
import {
    useWaitForTransactionReceipt,
    useWriteContract,
    useAccount,
    useReadContract
} from 'wagmi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

// You'll need to add these contract addresses and ABIs
// const GasHedgerAddress = 'YOUR_CONTRACT_ADDRESS';
// const WETHAddress = 'YOUR_WETH_ADDRESS';

interface CreateOptionProps {
    // No props needed for this implementation
}

function CreateOption() {
    const [transacting, setTransacting] = useState(false);
    const account = useAccount();
    const [strike, setStrike] = useState('');
    const [premium, setPremium] = useState('');
    const [units, setUnits] = useState('');
    const [expirationDate, setExpirationDate] = useState(BigInt(0));
    const [deadlineDate, setDeadlineDate] = useState(BigInt(0));
    const [isCall, setIsCall] = useState(false);
    const [capPerUnit, setCapPerUnit] = useState('');
    const [lockedWETH, setLockedWETH] = useState(0);
    const [chainGasId, setChainGasId] = useState(0);
    const [timeframe, setTimeframe] = useState(0);

    const [step, setStep] = useState(0);
    const {
        data: hash,
        isPending,
        error,
        writeContract
    } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash });

    const convertToWei = (value: string) => {
        return BigInt(Math.floor(parseFloat(value) * 10 ** 18)); // WETH has 18 decimals
    };

    const isValidInput = (value: string) => {
        return parseFloat(value) >= 0.000001;
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const s_strike = formData.get('strike') as string;
        const s_premium = formData.get('premium') as string;
        const s_units = formData.get('units') as string;
        const s_expirationDate = formData.get('expirationDate') as string;
        const s_deadlineDate = formData.get('deadlineDate') as string;
        const s_capPerUnit = formData.get('capPerUnit') as string;
        const s_chainGasId = formData.get('chainGasId') as string;
        const s_timeframe = formData.get('timeframe') as string;

        const unixDead = BigInt(Math.floor(new Date(s_deadlineDate).getTime() / 1000));
        const unixExp = BigInt(Math.floor(new Date(s_expirationDate).getTime() / 1000));

        if (!isValidInput(s_strike) || !isValidInput(s_premium) || !isValidInput(s_capPerUnit)) {
            alert('Values must be at least 0.000001');
            return;
        }

        const isCallValue = formData.get('isCall') === 'on';

        setIsCall(isCallValue);
        setStrike(s_strike);
        setPremium(s_premium);
        setUnits(s_units);
        setExpirationDate(unixExp);
        setDeadlineDate(unixDead);
        setCapPerUnit(s_capPerUnit);
        setChainGasId(parseInt(s_chainGasId));
        setTimeframe(parseInt(s_timeframe));
        setStep(1);
        setTransacting(true);

        try {
            // First approve WETH spending
            await writeContract({
                address: '0x4200000000000000000000000000000000000006', // WETH address (you may need to change this)
                abi: [
                    {
                        "inputs": [
                            { "name": "spender", "type": "address" },
                            { "name": "amount", "type": "uint256" }
                        ],
                        "name": "approve",
                        "outputs": [{ "name": "", "type": "bool" }],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ],
                functionName: 'approve',
                args: ['YOUR_GASHEDGER_ADDRESS', BigInt(s_units) * convertToWei(s_capPerUnit)],
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (isConfirmed && step === 1) {
            const timeout = setTimeout(() => {
                setStep(2);
                try {
                    writeContract({
                        address: 'YOUR_GASHEDGER_ADDRESS', // Replace with actual address
                        abi: [
                            {
                                "inputs": [
                                    { "name": "isCallOption", "type": "bool" },
                                    { "name": "premium", "type": "uint256" },
                                    { "name": "strikePrice", "type": "uint256" },
                                    { "name": "buyDeadline", "type": "uint256" },
                                    { "name": "expirationDate", "type": "uint256" },
                                    { "name": "units", "type": "uint256" },
                                    { "name": "capPerUnit", "type": "uint256" },
                                    { "name": "chainGasId", "type": "uint64" },
                                    { "name": "timeframe", "type": "uint8" }
                                ],
                                "name": "createOption",
                                "outputs": [],
                                "stateMutability": "nonpayable",
                                "type": "function"
                            }
                        ],
                        functionName: 'createOption',
                        args: [
                            isCall,
                            convertToWei(premium),
                            convertToWei(strike),
                            deadlineDate,
                            expirationDate,
                            BigInt(units),
                            convertToWei(capPerUnit),
                            BigInt(chainGasId),
                            BigInt(timeframe)
                        ],
                    });
                } catch (err) {
                    console.error(err);
                }
            }, 3000);

            return () => clearTimeout(timeout);
        }
        if (isConfirmed && step === 2) {
            const timeout = setTimeout(() => {
                setTransacting(false);
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [isConfirmed, step, isCall, premium, strike, deadlineDate, expirationDate, units, capPerUnit, chainGasId, timeframe]);

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => {
                setTransacting(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [error]);

    useEffect(() => {
        const capValue = parseFloat(capPerUnit);
        const unitsValue = parseFloat(units);
        if (!isNaN(capValue) && !isNaN(unitsValue)) {
            setLockedWETH(capValue * unitsValue);
        } else {
            setLockedWETH(0);
        }
    }, [capPerUnit, units]);

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Neon Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
            linear-gradient(rgba(255, 0, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.5) 1px, transparent 1px)
          `,
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            {/* Neon Glowing Orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />

            <Navbar />

            {transacting && (
                <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center backdrop-blur-[1px] bg-gray-900 bg-opacity-30 z-50">
                    <div className="bg-black/90 border border-blue-400 items-center text-center text-sm rounded-lg p-6 h-36 w-80">
                        {!isConfirmed && !error ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                        ) : !error ? (
                            <div className="flex mb-2 items-center justify-center">
                                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        ) : (
                            <div className="flex mb-2 items-center justify-center">
                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {transacting && !isConfirming && !error && !isConfirmed && (
                            <div className="text-white">Waiting for user confirmation...</div>
                        )}
                        {isConfirming && !error && <div className="text-white">Waiting for confirmation...</div>}
                        {isConfirmed && <div className="text-white">Transaction confirmed.</div>}
                        {hash && (
                            <div className='mt-2'>
                                <a
                                    className='bg-blue-600 px-2 py-2 w-full rounded-lg text-xs text-white block'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    href={`https://basescan.org/tx/${hash}`}
                                >
                                    View on Basescan
                                </a>
                            </div>
                        )}
                        {error && (
                            <div className="text-red-400">Error: {(error as any).shortMessage || error.message}</div>
                        )}
                    </div>
                </div>
            )}

            <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-8rem)]">
                    {/* Left side - Slogan */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Create Your
                            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Gas Future
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Hedge against gas price volatility with custom options.
                            <br />
                            <span className="text-blue-400 font-semibold">Write options, earn premiums, manage risk.</span>
                        </p>
                        <div className="space-y-4 text-left">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-gray-300">Choose your gas price target</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <span className="text-gray-300">Set premium and expiration</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                                <span className="text-gray-300">Lock collateral and start earning</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="max-w-md mx-auto lg:mx-0">
                        <Card className="bg-black/90 border-2 border-blue-400 backdrop-blur-sm shadow-lg shadow-blue-400/30">
                            <CardContent className="p-4">

                                <form onSubmit={submit} className="space-y-3">
                                    {/* Chain Gas ID Selection */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-blue-400">Chain Gas ID</label>
                                        <select
                                            name="chainGasId"
                                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none text-sm"
                                            required
                                        >
                                            <option value="">Select Chain</option>
                                            <option value="0">Blob-ETH (0)</option>
                                            <option value="1">ETH Gas Average (1)</option>
                                            <option value="2">Base Gas Average (2)</option>
                                            <option value="3">Arbitrum Gas Average (3)</option>
                                        </select>
                                    </div>

                                    {/* Timeframe Selection */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-blue-400">Timeframe</label>
                                        <select
                                            name="timeframe"
                                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none text-sm"
                                            required
                                        >
                                            <option value="">Select Timeframe</option>
                                            <option value="0">1 Day (0)</option>
                                            <option value="1">7 Days (1)</option>
                                            <option value="2">30 Days (2)</option>
                                        </select>
                                    </div>

                                    {/* Call/Put Toggle */}
                                    <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                                        <span className="text-blue-400 text-xs font-medium">Call/Put</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isCall"
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {/* Strike Price */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-blue-400">Strike Price (Gwei)</label>
                                        <input
                                            name="strike"
                                            type="number"
                                            step="0.000001"
                                            min="0.000001"
                                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none text-sm"
                                            placeholder="Enter strike price"
                                            required
                                        />
                                    </div>

                                    {/* Premium Cost */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-blue-400">Premium Cost (Gwei)</label>
                                        <input
                                            name="premium"
                                            type="number"
                                            step="0.000001"
                                            min="0.000001"
                                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none text-sm"
                                            placeholder="Enter premium cost"
                                            required
                                        />
                                    </div>

                                    {/* Units and Cap Per Unit - Same Line */}
                                    <div className="grid grid-cols-10 gap-2">
                                        <div className="col-span-3 space-y-1">
                                            <label className="text-xs font-medium text-blue-400">Units</label>
                                            <input
                                                name="units"
                                                type="number"
                                                step="0.000001"
                                                min="0.000001"
                                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none text-sm"
                                                placeholder="Enter units"
                                                required
                                                onChange={(e) => setUnits(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-7 space-y-1">
                                            <label className="text-xs font-medium text-blue-400">Cap Per Unit (Gwei)</label>
                                            <input
                                                name="capPerUnit"
                                                type="number"
                                                step="0.000001"
                                                min="0.000001"
                                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none text-sm"
                                                placeholder="Enter cap per unit"
                                                required
                                                onChange={(e) => setCapPerUnit(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Expiration Date and Buy-in Deadline - Same Line */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-blue-400">Expiration Date</label>
                                            <input
                                                name="expirationDate"
                                                type="datetime-local"
                                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-blue-400">Buy-in Deadline</label>
                                            <input
                                                name="deadlineDate"
                                                type="datetime-local"
                                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none text-sm"
                                                placeholder="Enter buy-in deadline"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Locked WETH Display */}
                                    <div className="flex items-center justify-between p-2 bg-blue-900/20 border border-blue-400 rounded-lg">
                                        <span className="text-blue-400 text-xs font-medium">Locked WETH</span>
                                        <span className="text-white font-bold text-sm">{lockedWETH.toFixed(6)} WETH</span>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25 text-sm"
                                        disabled={transacting}
                                    >
                                        {transacting ? 'Creating Option...' : 'Create Option'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateOption; 
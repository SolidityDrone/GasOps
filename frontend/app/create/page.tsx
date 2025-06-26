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
import TransactionModal from '@/components/TransactionModal';
import { GasHedgerAddress, GasHedger_ABI } from '@/lib/abi/GasHedger_ABI';
import { FakeWETHAddress, ERC20_ABI } from '@/lib/abi/ERC20_ABI';
import { formatGwei } from 'viem';

interface TransactionStep {
    id: string
    title: string
    description: string
    status: 'pending' | 'loading' | 'success' | 'error'
    error?: string
    hash?: string
}

interface CreateOptionProps {
    // No props needed for this implementation
}

function CreateOption() {
    const [transacting, setTransacting] = useState(false);
    const { address } = useAccount();
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

    // Transaction modal state
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [transactionSteps, setTransactionSteps] = useState<TransactionStep[]>([]);
    const [currentTransaction, setCurrentTransaction] = useState<{
        isCall: boolean;
        premium: bigint;
        strikePrice: bigint;
        buyDeadline: bigint;
        expirationDate: bigint;
        units: bigint;
        capPerUnit: bigint;
        chainGasId: number;
        timeframe: number;
        totalCollateral: bigint;
    } | null>(null);

    const { writeContract: writeApprove, data: approveHash } = useWriteContract();
    const { writeContract: writeCreateOption, data: createOptionHash } = useWriteContract();

    const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });
    const { isLoading: isCreateOptionLoading, isSuccess: isCreateOptionSuccess } = useWaitForTransactionReceipt({ hash: createOptionHash });

    // Read allowance
    const { data: allowance } = useReadContract({
        address: FakeWETHAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: address ? [address, GasHedgerAddress] : undefined,
        query: {
            enabled: !!address,
        },
    });

    const convertToWei = (value: string) => {
        return BigInt(Math.floor(parseFloat(value) * 10 ** 9)); // Convert Gwei to Wei (9 decimals)
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

        console.log('=== DATE DEBUG ===');
        console.log('Raw expirationDate input:', s_expirationDate);
        console.log('Raw deadlineDate input:', s_deadlineDate);

        const unixDead = BigInt(Math.floor(new Date(s_deadlineDate).getTime() / 1000));
        const unixExp = BigInt(Math.floor(new Date(s_expirationDate).getTime() / 1000));

        console.log('Converted deadline (Unix):', unixDead.toString());
        console.log('Converted expiration (Unix):', unixExp.toString());
        console.log('Deadline date:', new Date(Number(unixDead) * 1000).toISOString());
        console.log('Expiration date:', new Date(Number(unixExp) * 1000).toISOString());
        console.log('==================');

        if (!isValidInput(s_strike) || !isValidInput(s_premium) || !isValidInput(s_capPerUnit)) {
            alert('Values must be at least 0.000001');
            return;
        }

        const isCallValue = formData.get('isCall') !== 'on';
        const totalCollateral = BigInt(s_units) * convertToWei(s_capPerUnit);

        setCurrentTransaction({
            isCall: isCallValue,
            premium: convertToWei(s_premium),
            strikePrice: convertToWei(s_strike),
            buyDeadline: unixDead,
            expirationDate: unixExp,
            units: BigInt(s_units),
            capPerUnit: convertToWei(s_capPerUnit),
            chainGasId: parseInt(s_chainGasId),
            timeframe: parseInt(s_timeframe),
            totalCollateral
        });

        // Check if allowance is sufficient
        const hasSufficientAllowance = allowance && allowance >= totalCollateral;

        const steps: TransactionStep[] = [];

        if (!hasSufficientAllowance) {
            steps.push({
                id: 'approve',
                title: 'Approve WETH Spending',
                description: `Approve ${formatGwei(totalCollateral)} WETH for option creation`,
                status: 'pending'
            });
        } else {
            steps.push({
                id: 'approve',
                title: 'Approve WETH Spending',
                description: `Approve ${formatGwei(totalCollateral)} WETH for option creation`,
                status: 'success'
            });
        }

        steps.push({
            id: 'createOption',
            title: 'Create Option',
            description: `Create ${isCallValue ? 'call' : 'put'} option with ${formatGwei(convertToWei(s_premium))} premium`,
            status: hasSufficientAllowance ? 'pending' : 'pending'
        });

        setTransactionSteps(steps);
        setIsTransactionModalOpen(true);
    };

    // Handle transaction step execution
    const handleExecuteStep = async (stepId: string) => {
        if (!currentTransaction) return;

        try {
            if (stepId === 'approve') {
                // Check if approval is actually needed
                const hasSufficientAllowance = allowance && allowance >= currentTransaction.totalCollateral;
                if (hasSufficientAllowance) {
                    // Skip approval and move to create option
                    setTransactionSteps(prev => prev.map(step =>
                        step.id === 'createOption' ? { ...step, status: 'pending' } : step
                    ));
                    return;
                }

                // Update step to loading
                setTransactionSteps(prev => prev.map(step =>
                    step.id === 'approve' ? { ...step, status: 'loading' } : step
                ));

                // Execute approve
                writeApprove({
                    address: FakeWETHAddress,
                    abi: ERC20_ABI,
                    functionName: 'approve',
                    args: [GasHedgerAddress, currentTransaction.totalCollateral]
                });
            } else if (stepId === 'createOption') {
                // Update step to loading
                setTransactionSteps(prev => prev.map(step =>
                    step.id === 'createOption' ? { ...step, status: 'loading' } : step
                ));

                // Log the raw args array
                console.log('=== RAW TRANSACTION ARGS ===');
                console.log('isCall:', currentTransaction.isCall);
                console.log('premium:', currentTransaction.premium.toString());
                console.log('strikePrice:', currentTransaction.strikePrice.toString());
                console.log('buyDeadline:', currentTransaction.buyDeadline.toString());
                console.log('expirationDate:', currentTransaction.expirationDate.toString());
                console.log('units:', currentTransaction.units.toString());
                console.log('capPerUnit:', currentTransaction.capPerUnit.toString());
                console.log('chainGasId:', BigInt(currentTransaction.chainGasId).toString());
                console.log('timeframe:', currentTransaction.timeframe);
                console.log('============================');

                // Execute create option
                writeCreateOption({
                    address: GasHedgerAddress,
                    abi: GasHedger_ABI,
                    functionName: 'createOption',
                    args: [
                        currentTransaction.isCall,
                        currentTransaction.premium,
                        currentTransaction.strikePrice,
                        currentTransaction.buyDeadline,
                        currentTransaction.expirationDate,
                        currentTransaction.units,
                        currentTransaction.capPerUnit,
                        BigInt(currentTransaction.chainGasId),
                        currentTransaction.timeframe
                    ]
                });
            }
        } catch (error) {
            console.error('Transaction failed:', error);
            setTransactionSteps(prev => prev.map(step =>
                step.id === stepId ? {
                    ...step,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Transaction failed'
                } : step
            ));
        }
    };

    // Handle transaction status updates
    useEffect(() => {
        if (isApproveLoading) {
            setTransactionSteps(prev => prev.map(step =>
                step.id === 'approve' ? { ...step, status: 'loading' } : step
            ));
        } else if (isApproveSuccess && approveHash) {
            setTransactionSteps(prev => prev.map(step =>
                step.id === 'approve' ? { ...step, status: 'success', hash: approveHash } : step
            ));
        }
    }, [isApproveLoading, isApproveSuccess, approveHash]);

    useEffect(() => {
        if (isCreateOptionLoading) {
            setTransactionSteps(prev => prev.map(step =>
                step.id === 'createOption' ? { ...step, status: 'loading' } : step
            ));
        } else if (isCreateOptionSuccess && createOptionHash) {
            setTransactionSteps(prev => prev.map(step =>
                step.id === 'createOption' ? { ...step, status: 'success', hash: createOptionHash } : step
            ));
            // Close modal after successful creation
            setTimeout(() => {
                setIsTransactionModalOpen(false);
                setCurrentTransaction(null);
            }, 3000);
        }
    }, [isCreateOptionLoading, isCreateOptionSuccess, createOptionHash]);

    useEffect(() => {
        const capValue = parseFloat(capPerUnit);
        const unitsValue = parseFloat(units);
        if (!isNaN(capValue) && !isNaN(unitsValue)) {
            // Convert from Gwei to ETH: (capPerUnit * units) / 1e9
            setLockedWETH((capValue * unitsValue) / 1e9);
        } else {
            setLockedWETH(0);
        }
    }, [capPerUnit, units]);

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            <Navbar />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-8rem)]">
                    {/* Left side - Slogan */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Create Your
                            <span className="block text-gray-400">
                                Gas Future
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Hedge against gas price volatility with custom options.
                            <br />
                            <span className="text-white font-semibold">Write options, earn premiums, manage risk.</span>
                        </p>
                        <div className="space-y-4 text-left">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <span className="text-gray-300">Choose your gas price target</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <span className="text-gray-300">Set premium and expiration</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <span className="text-gray-300">Lock collateral and start earning</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="max-w-md mx-auto lg:mx-0">
                        <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                            <CardContent className="p-4">

                                <form onSubmit={submit} className="space-y-3">
                                    {/* Chain Gas ID Selection */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-300">Chain Gas ID</label>
                                        <select
                                            name="chainGasId"
                                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-gray-400 focus:outline-none text-sm"
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
                                        <label className="text-xs font-medium text-gray-300">Timeframe</label>
                                        <select
                                            name="timeframe"
                                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-gray-400 focus:outline-none text-sm"
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
                                        <span className="text-gray-300 text-xs font-medium">Call (off) / Put (on)</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isCall"
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-600"></div>
                                        </label>
                                    </div>

                                    {/* Strike Price */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-300">Strike Price (Gwei)</label>
                                        <input
                                            name="strike"
                                            type="number"
                                            step="0.000001"
                                            min="0.000001"
                                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-gray-400 focus:outline-none text-sm"
                                            placeholder="Enter strike price"
                                            required
                                        />
                                    </div>

                                    {/* Premium Cost */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-300">Premium Cost (Gwei)</label>
                                        <input
                                            name="premium"
                                            type="number"
                                            step="0.000001"
                                            min="0.000001"
                                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-gray-400 focus:outline-none text-sm"
                                            placeholder="Enter premium cost"
                                            required
                                        />
                                    </div>

                                    {/* Units and Cap Per Unit - Same Line */}
                                    <div className="grid grid-cols-10 gap-2">
                                        <div className="col-span-3 space-y-1">
                                            <label className="text-xs font-medium text-gray-300">Units</label>
                                            <input
                                                name="units"
                                                type="number"
                                                step="0.000001"
                                                min="0.000001"
                                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-gray-400 focus:outline-none text-sm"
                                                placeholder="Enter units"
                                                required
                                                onChange={(e) => setUnits(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-7 space-y-1">
                                            <label className="text-xs font-medium text-gray-300">Cap Per Unit (Gwei)</label>
                                            <input
                                                name="capPerUnit"
                                                type="number"
                                                step="0.000001"
                                                min="0.000001"
                                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-gray-400 focus:outline-none text-sm"
                                                placeholder="Enter cap per unit"
                                                required
                                                onChange={(e) => setCapPerUnit(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Expiration Date and Buy-in Deadline - Same Line */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-300">Expiration Date</label>
                                            <input
                                                name="expirationDate"
                                                type="datetime-local"
                                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-gray-400 focus:outline-none text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-300">Buy-in Deadline</label>
                                            <input
                                                name="deadlineDate"
                                                type="datetime-local"
                                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-gray-400 focus:outline-none text-sm"
                                                placeholder="Enter buy-in deadline"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Locked WETH Display */}
                                    <div className="flex items-center justify-between p-2 bg-gray-800/50 border border-gray-700 rounded-lg">
                                        <span className="text-gray-300 text-xs font-medium">Locked ETH</span>
                                        <span className="text-white font-bold text-sm">{lockedWETH.toFixed(6)} ETH</span>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-white hover:bg-gray-100 text-black font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
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

            {/* Transaction Modal */}
            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                steps={transactionSteps}
                onExecuteStep={handleExecuteStep}
                title="Create Option"
                description="Create your gas option with collateral"
            />
        </div>
    );
}

export default CreateOption; 
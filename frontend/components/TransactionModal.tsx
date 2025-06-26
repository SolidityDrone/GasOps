'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'

interface TransactionStep {
    id: string
    title: string
    description: string
    status: 'pending' | 'loading' | 'success' | 'error'
    error?: string
    hash?: string
}

interface TransactionModalProps {
    isOpen: boolean
    onClose: () => void
    steps: TransactionStep[]
    onExecuteStep: (stepId: string) => Promise<void>
    title: string
    description?: string
}

export default function TransactionModal({
    isOpen,
    onClose,
    steps,
    onExecuteStep,
    title,
    description
}: TransactionModalProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [isExecuting, setIsExecuting] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setCurrentStepIndex(0)
        }
    }, [isOpen])

    // Auto-advance to next pending step when current step is completed
    useEffect(() => {
        if (isOpen && steps.length > 0) {
            // Find the first pending step
            const pendingStepIndex = steps.findIndex(step => step.status === 'pending')
            if (pendingStepIndex !== -1) {
                setCurrentStepIndex(pendingStepIndex)
            } else {
                // If no pending steps, show the last step
                setCurrentStepIndex(steps.length - 1)
            }
        }
    }, [isOpen, steps])

    const handleExecuteStep = async (stepId: string) => {
        setIsExecuting(true)
        try {
            await onExecuteStep(stepId)
            // Move to next step if current step was successful
            const currentStep = steps.find(step => step.id === stepId)
            if (currentStep?.status === 'success') {
                const nextIndex = steps.findIndex(step => step.id === stepId) + 1
                if (nextIndex < steps.length) {
                    setCurrentStepIndex(nextIndex)
                }
            }
        } catch (error) {
            console.error('Step execution failed:', error)
        } finally {
            setIsExecuting(false)
        }
    }

    const getStepIcon = (step: TransactionStep) => {
        switch (step.status) {
            case 'loading':
                return <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            case 'success':
                return <CheckCircle className="w-6 h-6 text-green-500" />
            case 'error':
                return <XCircle className="w-6 h-6 text-red-500" />
            default:
                return <div className="w-6 h-6 rounded-full border-2 border-gray-400" />
        }
    }

    const getStepStatusColor = (step: TransactionStep) => {
        switch (step.status) {
            case 'success':
                return 'border-green-500 bg-green-500/10'
            case 'error':
                return 'border-red-500 bg-red-500/10'
            case 'loading':
                return 'border-gray-400 bg-gray-400/10'
            default:
                return 'border-gray-600 bg-gray-600/10'
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="bg-gray-900/95 border border-gray-800 backdrop-blur-sm w-full max-w-md mx-4">
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
                        {description && (
                            <p className="text-gray-400 text-sm">{description}</p>
                        )}
                    </div>

                    {/* Steps */}
                    <div className="space-y-4 mb-6">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`p-4 rounded-lg border ${getStepStatusColor(step)} transition-all duration-300`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        {getStepIcon(step)}
                                        <div>
                                            <h3 className="text-white font-medium">{step.title}</h3>
                                            <p className="text-gray-400 text-sm">{step.description}</p>
                                        </div>
                                    </div>
                                    {step.hash && (
                                        <a
                                            href={`https://basescan.org/tx/${step.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 text-xs"
                                        >
                                            View
                                        </a>
                                    )}
                                </div>

                                {step.error && (
                                    <div className="flex items-center space-x-2 mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                        <span className="text-red-400 text-xs">{step.error}</span>
                                    </div>
                                )}

                                {step.status === 'pending' && steps.findIndex(s => s.status === 'pending') === index && (
                                    <Button
                                        onClick={() => handleExecuteStep(step.id)}
                                        disabled={isExecuting}
                                        className="w-full mt-3 bg-white hover:bg-gray-100 text-black"
                                    >
                                        {isExecuting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Executing...
                                            </>
                                        ) : (
                                            'Execute'
                                        )}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end space-x-3">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                            Close
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 
'use client'

import React, { useState, useEffect } from 'react'
import { useForm, SubmitHandler, FieldValues, UseFormRegister } from 'react-hook-form'
import { mockApi, FormConfig, FormField } from '@/utils/mockApi'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

const formTypes = ['userInfo', 'addressInfo', 'paymentInfo']

export function DynamicFormSystem() {
    const [formType, setFormType] = useState<string>(formTypes[0])
    const [formConfig, setFormConfig] = useState<FormConfig | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [submittedData, setSubmittedData] = useState<FieldValues[]>([])
    const [progress, setProgress] = useState<number>(0)

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FieldValues>()
    const { toast } = useToast()

    useEffect(() => {
        const fetchFormConfig = async () => {
            try {
                setLoading(true)
                setError(null)
                const config = await mockApi(formType)
                setFormConfig(config)
            } catch (err) {
                console.error('Error fetching form configuration:', err)
                setError('Failed to load form configuration')
            } finally {
                setLoading(false)
            }
        }

        fetchFormConfig()
    }, [formType])

    useEffect(() => {
        if (formConfig) {
            const subscription = watch((value) => {
                const filledFields = Object.values(value).filter(Boolean).length
                const totalFields = formConfig.fields.length
                setProgress((filledFields / totalFields) * 100)
            })
            return () => subscription.unsubscribe()
        }
    }, [formConfig, watch])

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setSubmittedData([...submittedData, data])
        reset()
        setProgress(0)
        toast({
            title: "Form Submitted",
            description: "Your form has been successfully submitted.",
            action: (
                <ToastAction altText="Close">Close</ToastAction>
            ),
        })
    }

    const handleEdit = (index: number) => {
        const dataToEdit = submittedData[index]
        reset(dataToEdit)
        setSubmittedData(submittedData.filter((_, i) => i !== index))
        toast({
            title: "Edit Mode",
            description: "You can now edit your submission.",
            action: (
                <ToastAction altText="Close">Close</ToastAction>
            ),
        })
    }

    const handleDelete = (index: number) => {
        setSubmittedData(submittedData.filter((_, i) => i !== index))
        toast({
            title: "Entry Deleted",
            description: "The selected entry has been deleted.",
            action: (
                <ToastAction altText="Close">Close</ToastAction>
            ),
        })
    }

    const renderField = (field: FormField, register: UseFormRegister<FieldValues>) => {
        switch (field.type) {
            case 'dropdown':
                return (
                    <Select onValueChange={(value) => register(field.name, { required: field.required }).onChange({ target: { value } })}>
                        <SelectTrigger id={field.name}>
                            <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            default:
                return (
                    <Input
                        id={field.name}
                        type={field.type}
                        {...register(field.name, { required: field.required })}
                    />
                )
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Dynamic Form System</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Label htmlFor="formType">Select Form Type</Label>
                        <Select onValueChange={(value) => setFormType(value)}>
                            <SelectTrigger id="formType">
                                <SelectValue placeholder="Select form type" />
                            </SelectTrigger>
                            <SelectContent>
                                {formTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {formConfig && (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {formConfig.fields.map((field: FormField) => (
                                <div key={field.name}>
                                    <Label htmlFor={field.name}>{field.label}</Label>
                                    {renderField(field, register)}
                                    {errors[field.name] && (
                                        <p className="text-red-500 text-sm mt-1">This field is required</p>
                                    )}
                                </div>
                            ))}
                            <Progress value={progress} className="w-full" />
                            <Button type="submit" className="w-full">Submit</Button>
                        </form>
                    )}
                </CardContent>
            </Card>
            {submittedData.length > 0 && (
                <Card className="w-full max-w-2xl mx-auto mt-8">
                    <CardHeader>
                        <CardTitle>Submitted Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Field</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submittedData.map((data, index) => (
                                    Object.entries(data).map(([key, value]) => (
                                        <TableRow key={`${index}-${key}`}>
                                            <TableCell>{key}</TableCell>
                                            <TableCell>{value as string}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(index)} className="mr-2">
                                                    Edit
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}


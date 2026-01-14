"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {Loader2, Upload, X} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CreateServiceRequest, serviceFormSchema, type ServiceFormValues} from "@/lib/types"
import { ScrollArea } from "./ui/scroll-area"
import {useMutation} from "@tanstack/react-query";
import {createService} from "@/lib/api/services";
import {StatusAlertDialog} from "@/components/status-alert-dialog";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

interface CreateServiceFormProps {
    onCancel: () => void
}

export function CreateServiceForm({ onCancel }: CreateServiceFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess,setIsSuccess] = useState(false)

    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceFormSchema),
        defaultValues: {
            name: "",
            description: "",
            duration: 60,
            bufferTime: 0,
            slotsPerTimeDuration: 1,
            price: 0,
            location: "",
            days: [],
            imageUrl: File
        },
    })

    const serviceMutation = useMutation({
        mutationFn: (req: CreateServiceRequest) => createService(req),
        onSuccess: () => {
            setIsSubmitting(false);
            setIsSuccess(true);
        },
        onError: () => {
            setIsSubmitting(false)
            setIsSuccess(false)
        }
    })

    const onSubmit = async (values: ServiceFormValues) => {
        setIsSubmitting(true)
        const createServiceRequest: CreateServiceRequest = {
            name: values.name,
            days: values.days,
            bufferTime: values.bufferTime,
            duration: values.duration,
            description: values.description,
            price: values.price,
            locations: values.location,
            organizationId: "1",
            slotsPerTimeDuration: values.slotsPerTimeDuration,
            imageUrl: ""
        }
        serviceMutation.mutate(createServiceRequest)
    }

    const handleImageChange = (file: File | undefined) => {
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                form.setError("imageUrl", { message: "Please upload a valid image file" })
                return
            }

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)

            form.setValue("imageUrl", file)
        }
    }

    const removeImage = () => {
        setImagePreview(null)
        form.setValue("imageUrl", new File([], ""))
    }

    return (
        <ScrollArea className={"h-[80vh] rounded-md border"}>
            <div className={"p-4 w-full h-full"}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Image Upload Section */}
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Service Image *</FormLabel>
                                    <FormControl>
                                        <div className="space-y-3">
                                            {imagePreview ? (
                                                <div className="relative w-full rounded-lg border-2 border-border overflow-hidden">
                                                    <img
                                                        src={imagePreview || "/placeholder.svg"}
                                                        alt="Preview"
                                                        className="w-full h-48 object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                                        <p className="text-sm text-muted-foreground">Click to upload image (Max 5MB)</p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(e.target.files?.[0])}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Service Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Service Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Hair Cutting, Massage Therapy"
                                            {...field}
                                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Description *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe your service in detail..."
                                            {...field}
                                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Duration and Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">Duration (minutes) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="60"
                                                {...field}
                                                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">Price *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="500"
                                                step="0.01"
                                                {...field}
                                                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Location and Buffer Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">Location *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., RNG Plaza"
                                                {...field}
                                                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bufferTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">Buffer Time (minutes)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="10"
                                                {...field}
                                                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Time between bookings for setup/cleanup
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Slots Per Time Duration */}
                        <FormField
                            control={form.control}
                            name="slotsPerTimeDuration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Slots Per Time Duration *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="3"
                                            {...field}
                                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-muted-foreground">
                                        Number of parallel bookings allowed per time slot
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Days of Week */}
                        <FormField
                            control={form.control}
                            name="days"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Available Days *</FormLabel>
                                    <FormDescription className="text-xs text-muted-foreground mb-3">
                                        Select the days this service is available
                                    </FormDescription>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {DAYS_OF_WEEK.map((day) => (
                                            <FormField
                                                key={day}
                                                control={form.control}
                                                name="days"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(day)}
                                                                onCheckedChange={(checked) => {
                                                                    const value = field.value || []
                                                                    if (checked) {
                                                                        field.onChange([...value, day])
                                                                    } else {
                                                                        field.onChange(value.filter((d) => d !== day))
                                                                    }
                                                                }}
                                                                className="border-border"
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-sm font-normal text-foreground cursor-pointer">{day}</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            {onCancel && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    className="border-border text-foreground bg-transparent"
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground ml-auto" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Create Service"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>

                <StatusAlertDialog isOpen={isSuccess} onClose={() => {onCancel()}} type={"success"} title={"Add Service"} message={"Service create successfully"}/>
            </div>
        </ScrollArea>
    )
}

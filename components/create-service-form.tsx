"use client"

import {useEffect, useState} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import {Loader2, Upload, X} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    CreateServiceRequest,
    serviceFormSchema,
    Service,
    type ServiceFormInput,
    type ServiceFormValues,
    UpdateServiceRequest
} from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import {useMutation} from "@tanstack/react-query";
import {createService, updateService} from "@/lib/api/services";
import {StatusAlertDialog} from "@/components/status-alert-dialog";
import {authClient} from "@/lib/auth-client";
import {getSignedImageUrl, uploadServiceImage} from "@/lib/api/files";
import {fetchMpesaCredentials, MpesaCredentials} from "@/lib/api/mpesa";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const isMpesaConfigured = (credentials: MpesaCredentials) =>
    Object.values(credentials).every((value) => value.trim().length > 0)

interface CreateServiceFormProps {
    onCancel: () => void
    onSaved?: () => void
    mode?: "create" | "edit"
    initialService?: Service | null
}

export function CreateServiceForm({ onCancel, onSaved, mode = "create", initialService = null }: Readonly<CreateServiceFormProps>) {
    const [imagePreview, setImagePreview] = useState<string | null>(() => {
        const initialImage = initialService?.imageUrl ?? null
        if (!initialImage) {
            return null
        }
        if (initialImage.startsWith("http://") || initialImage.startsWith("https://")) {
            return initialImage
        }
        return null
    })
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess,setIsSuccess] = useState(false)

    const [token,setToken] = useState<string | undefined>(undefined)
    const { data: session } = authClient.useSession()

    useEffect(() => {
        authClient.token().then((tokenPayload) => {
            setToken(tokenPayload.data?.token)
        })
    }, []);

    useEffect(() => {
        const initialImage = initialService?.imageUrl

        if (!initialImage || mode !== "edit") {
            return
        }

        if (initialImage.startsWith("http://") || initialImage.startsWith("https://")) {
            return
        }

        let isMounted = true
        getSignedImageUrl(initialImage)
            .then((url) => {
                if (isMounted) {
                    setImagePreview(url)
                }
            })
            .catch(() => {
                if (isMounted) {
                    setImagePreview(null)
                }
            })

        return () => {
            isMounted = false
        }
    }, [initialService?.imageUrl, mode])

    const form = useForm<ServiceFormInput, unknown, ServiceFormValues>({
        resolver: zodResolver(serviceFormSchema),
        defaultValues: {
            name: initialService?.name ?? "",
            description: initialService?.description ?? "",
            duration: initialService?.duration ?? 60,
            bufferTime: initialService?.bufferTime ?? 0,
            slotsPerTimeDuration: initialService?.slotsPerTimeDuration ?? 1,
            price: initialService?.price ?? 0,
            downPaymentRequired: initialService?.downPaymentRequired ?? false,
            downPaymentAmount: initialService?.downPaymentAmount ?? 0,
            paymentInstructions: initialService?.paymentInstructions ?? "",
            location: initialService?.location ?? "",
            days: initialService?.days ?? [],
            imageUrl: initialService ? new File([], "existing-image") : new File([], "")
        },
    })

    const downPaymentRequired = useWatch({ control: form.control, name: "downPaymentRequired" })
    const currentPrice = useWatch({ control: form.control, name: "price" })

    useEffect(() => {
        if (!downPaymentRequired) {
            form.setValue("downPaymentAmount", 0, { shouldValidate: true })
            form.clearErrors("downPaymentRequired")
        }
    }, [downPaymentRequired, form])

    const serviceMutation = useMutation({
        mutationFn: (req: CreateServiceRequest | UpdateServiceRequest) => {
            if (mode === "edit") {
                return updateService(req as UpdateServiceRequest, token ?? "")
            }
            return createService(req as CreateServiceRequest,token ?? "")
        },
        onSuccess: () => {
            setIsSubmitting(false);
            setIsSuccess(true);
            onSaved?.()
        },
        onError: () => {
            setIsSubmitting(false)
            setIsSuccess(false)
        }
    })

    const ensureOrganizationId = () => {
        if (!session?.user.organizationId) {
            setIsSubmitting(false)
            return null
        }
        return session.user.organizationId
    }

    const ensureMpesaReady = async () => {
        if (!token) {
            form.setError("downPaymentRequired", {
                type: "manual",
                message: "Unable to verify M-Pesa credentials. Please try again.",
            })
            return false
        }

        try {
            const credentials = await fetchMpesaCredentials(token)
            if (!isMpesaConfigured(credentials)) {
                form.setError("downPaymentRequired", {
                    type: "manual",
                    message: "Set M-Pesa credentials in Settings before enabling down payment.",
                })
                return false
            }
        } catch {
            form.setError("downPaymentRequired", {
                type: "manual",
                message: "Failed to verify M-Pesa credentials. Please try again.",
            })
            return false
        }

        return true
    }

    const resolveImageUrl = async (organizationId: string) => {
        let imageUrl = mode === "edit" ? (initialService?.imageUrl ?? "") : ""

        try {
            if (selectedImageFile) {
                if (!token) {
                    setIsSubmitting(false)
                    return null
                }
                imageUrl = await uploadServiceImage(organizationId, selectedImageFile, token)
            } else if (mode === "create") {
                form.setError("imageUrl", { message: "Please upload a service image" })
                setIsSubmitting(false)
                return null
            } else if (mode === "edit" && imagePreview === null) {
                imageUrl = ""
            }
        } catch {
            form.setError("imageUrl", { message: "Failed to upload image" })
            setIsSubmitting(false)
            return null
        }

        return imageUrl
    }

    const onSubmit = async (values: ServiceFormValues) => {
        const organizationId = ensureOrganizationId()
        if (!organizationId) {
            return
        }

        if (values.downPaymentRequired) {
            const isReady = await ensureMpesaReady()
            if (!isReady) {
                return
            }
        }

        setIsSubmitting(true)

        const imageUrl = await resolveImageUrl(organizationId)
        if (imageUrl === null) {
            return
        }

        const basePayload: CreateServiceRequest = {
            name: values.name,
            days: values.days,
            bufferTime: values.bufferTime,
            duration: values.duration,
            description: values.description,
            price: values.price,
            downPaymentRequired: values.downPaymentRequired ?? false,
            downPaymentAmount: values.downPaymentRequired ? (values.downPaymentAmount ?? 0) : 0,
            paymentInstructions: (values.paymentInstructions ?? "").trim(),
            locations: values.location,
            organizationId,
            slotsPerTimeDuration: values.slotsPerTimeDuration,
            imageUrl
        }

        if (mode === "edit" && initialService) {
            const updateServiceRequest: UpdateServiceRequest = {
                ...basePayload,
                serviceId: initialService.id,
            }
            serviceMutation.mutate(updateServiceRequest)
            return
        }

        serviceMutation.mutate(basePayload)
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

            setSelectedImageFile(file)
            form.setValue("imageUrl", file)
        }
    }

    const removeImage = () => {
        setImagePreview(null)
        setSelectedImageFile(null)
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
                            render={() => (
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
                                            maxLength={1000}
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
                                            {(() => {
                                                const { value, onChange, ...fieldRest } = field
                                                const normalizedValue: string | number =
                                                    typeof value === "number" || typeof value === "string" ? value : ""
                                                return (
                                                    <Input
                                                        type="number"
                                                        placeholder="60"
                                                        value={normalizedValue}
                                                        onChange={(event) => {
                                                            const nextValue = event.target.value
                                                            onChange(nextValue === "" ? undefined : Number(nextValue))
                                                        }}
                                                        {...fieldRest}
                                                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                                                    />
                                                )
                                            })()}
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
                                            {(() => {
                                                const { value, onChange, ...fieldRest } = field
                                                const normalizedValue: string | number =
                                                    typeof value === "number" || typeof value === "string" ? value : ""
                                                return (
                                                    <Input
                                                        type="number"
                                                        placeholder="500"
                                                        step="0.01"
                                                        value={normalizedValue}
                                                        onChange={(event) => {
                                                            const nextValue = event.target.value
                                                            onChange(nextValue === "" ? undefined : Number(nextValue))
                                                        }}
                                                        {...fieldRest}
                                                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                                                    />
                                                )
                                            })()}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Down Payment */}                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="downPaymentRequired"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-md border border-border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-foreground">Require Down Payment</FormLabel>
                                            <FormDescription className="text-xs text-muted-foreground">
                                                Enable to collect a partial payment before confirmation.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(Boolean(checked))
                                                    form.clearErrors("downPaymentRequired")
                                                }}
                                                className="border-border"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="downPaymentAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">Down Payment Amount</FormLabel>
                                        <FormControl>
                                            {(() => {
                                                const { value, onChange, ...fieldRest } = field
                                                const normalizedValue: string | number =
                                                    typeof value === "number" || typeof value === "string" ? value : ""
                                                return (
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        min="0"
                                                        max={Math.max(0, (Number(currentPrice) || 0) * 0.5)}
                                                        step="0.01"
                                                        disabled={!downPaymentRequired}
                                                        value={normalizedValue}
                                                        onChange={(event) => {
                                                            const nextValue = event.target.value
                                                            onChange(nextValue === "" ? undefined : Number(nextValue))
                                                        }}
                                                        {...fieldRest}
                                                        className="bg-input border-border text-foreground placeholder:text-muted-foreground disabled:opacity-60"
                                                    />
                                                )
                                            })()}
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Maximum allowed: Ksh {((Number(currentPrice) || 0) * 0.5).toLocaleString()}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="paymentInstructions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Down Payment Instructions</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            maxLength={1000}
                                            placeholder="Provide payment method and steps for making the down payment..."
                                            disabled={!downPaymentRequired}
                                            {...field}
                                            className="bg-input border-border text-foreground placeholder:text-muted-foreground disabled:opacity-60"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-muted-foreground">
                                        Include account details, reference format, and confirmation steps.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Location and Buffer Time */}
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">Location *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                maxLength={200}
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
                                            {(() => {
                                                const { value, onChange, ...fieldRest } = field
                                                const normalizedValue: string | number =
                                                    typeof value === "number" || typeof value === "string" ? value : ""
                                                return (
                                                    <Input
                                                        type="number"
                                                        placeholder="10"
                                                        value={normalizedValue}
                                                        onChange={(event) => {
                                                            const nextValue = event.target.value
                                                            onChange(nextValue === "" ? undefined : Number(nextValue))
                                                        }}
                                                        {...fieldRest}
                                                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                                                    />
                                                )
                                            })()}
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Time between bookings for setup/cleanup
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        {/* Slots Per Time Duration */}
                        <FormField
                            control={form.control}
                            name="slotsPerTimeDuration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Slots Per Time Duration *</FormLabel>
                                        <FormControl>
                                            {(() => {
                                                const { value, onChange, ...fieldRest } = field
                                                const normalizedValue: string | number =
                                                    typeof value === "number" || typeof value === "string" ? value : ""
                                                return (
                                                    <Input
                                                        type="number"
                                                        placeholder="3"
                                                        value={normalizedValue}
                                                        onChange={(event) => {
                                                            const nextValue = event.target.value
                                                            onChange(nextValue === "" ? undefined : Number(nextValue))
                                                        }}
                                                        {...fieldRest}
                                                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                                                    />
                                                )
                                            })()}
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
                                    mode === "edit" ? "Update" : "Create Service"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>

                <StatusAlertDialog
                    isOpen={isSuccess}
                    onClose={() => {onCancel()}}
                    type={"success"}
                    title={mode === "edit" ? "Update Service" : "Add Service"}
                    message={mode === "edit" ? "Service updated successfully" : "Service create successfully"}
                />
            </div>
        </ScrollArea>
    )
}

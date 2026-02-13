"use client"

import React, {useState} from 'react'
import {Input} from "@/components/ui/input";
import {ChevronLeft, ChevronRight, Search} from "lucide-react";
import {ServiceCard} from "@/components/service-card";
import {ServiceCardSkeleton} from "@/components/service-card-skeleton";
import {PaginatedResponse, Service} from "@/lib/types";
import {Button} from "@/components/ui/button";
import {useQuery} from "@tanstack/react-query";
import {getOrganizationServices} from "@/lib/api/services";
import {Navbar} from "@/components/nav-bar";
import FetchError from "@/components/fetch-error";


const ServicesPage = ({ organizationId = "1" }: { organizationId: string }) => {

    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<PaginatedResponse<Service>>({
        queryKey: ["services", organizationId],
        queryFn: () => getOrganizationServices(organizationId),
        enabled: !!organizationId,
    })
    
    const handlePreviousPage = () => {
        if (data){
            setCurrentPage(prev => Math.max(prev - 1, 1))
        }
    }
    
    const handleNextPage = () => {
        if (data){
            setCurrentPage(prev => Math.min(prev + 1, data.totalPages))
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar/>
            <main className="container mx-auto px-4 py-12">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-balance">Browse Services</h1>
                        <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
                            Discover and book from our wide range of professional services. Find the perfect match for your needs.
                        </p>
                    </div>

                    {isError ? (
                        <FetchError message={error?.message ?? "Failed to fetch services"}/>
                    ) : (
                        <>
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search services or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {isLoading ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {[...Array(8)].map((_, i) => (
                                        <ServiceCardSkeleton key={i} />
                                    ))}
                                </div>
                            ): (
                                data && data.content.length > 0 ? (
                                    <>
                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                            {data.content.map((service) => (
                                                <ServiceCard key={service.id} service={service} />
                                            ))}
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
                                            <p className="text-sm text-muted-foreground">
                                                Showing {data.content.length * data.page} to {Math.min((data.page * data.size), data.size)} of{" "}
                                                {data.totalElements} services
                                            </p>

                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>

                                                <div className="flex items-center gap-2">
                                                    {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
                                                        <Button
                                                            key={page}
                                                            variant={page === currentPage ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setCurrentPage(page)}
                                                            className="min-w-10"
                                                        >
                                                            {page}
                                                        </Button>
                                                    ))}
                                                </div>

                                                <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage === data.totalPages}>
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>

                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No services found</h3>
                                        <p className="text-muted-foreground">Try adjusting your search to find what you're looking for.</p>
                                    </div>
                                )
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
export default ServicesPage

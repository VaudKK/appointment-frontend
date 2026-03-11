import StoreServicesPage from "@/components/store-services-page";

interface StoreServicesRouteProps {
    params: Promise<{ slug: string }>;
}

export default async function ServicesByStorePage({ params }: StoreServicesRouteProps) {
    const { slug } = await params;
    return <StoreServicesPage slug={slug} />;
}

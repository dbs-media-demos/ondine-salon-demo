import { notFound } from "next/navigation";
import { services } from "@/content/services";
import { ServiceDetailView, serviceMetadata } from "@/views/ServiceDetailView";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug.en }));
}

const find = (slug: string) => services.find((s) => s.slug.en === slug);

export async function generateMetadata({ params }: PageProps<"/en/services/[slug]">) {
  const s = find((await params).slug);
  return s ? serviceMetadata("en", s) : {};
}

export default async function Page({ params }: PageProps<"/en/services/[slug]">) {
  const s = find((await params).slug);
  if (!s) notFound();
  return <ServiceDetailView locale="en" service={s} />;
}

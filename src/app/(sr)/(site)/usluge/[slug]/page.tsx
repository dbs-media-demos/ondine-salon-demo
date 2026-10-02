import { notFound } from "next/navigation";
import { services } from "@/content/services";
import { ServiceDetailView, serviceMetadata } from "@/views/ServiceDetailView";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug.sr }));
}

const find = (slug: string) => services.find((s) => s.slug.sr === slug);

export async function generateMetadata({ params }: PageProps<"/usluge/[slug]">) {
  const s = find((await params).slug);
  return s ? serviceMetadata("sr", s) : {};
}

export default async function Page({ params }: PageProps<"/usluge/[slug]">) {
  const s = find((await params).slug);
  if (!s) notFound();
  return <ServiceDetailView locale="sr" service={s} />;
}

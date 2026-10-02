import { TeamView, teamMetadata } from "@/views/TeamView";

export const metadata = teamMetadata("en");

export default function Page() {
  return <TeamView locale="en" />;
}

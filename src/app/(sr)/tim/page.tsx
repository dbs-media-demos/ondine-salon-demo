import { TeamView, teamMetadata } from "@/views/TeamView";

export const metadata = teamMetadata("sr");

export default function Page() {
  return <TeamView locale="sr" />;
}

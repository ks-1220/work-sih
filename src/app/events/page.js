import WithNavbar from "../../components/layout/WithNavbar";
import EventsExplorer from "../../components/events/EventsExplorer";

export const metadata = { title: "Fitness events across India | SaathiSync" };

export default function EventsPage() {
  return (
    <WithNavbar>
      <EventsExplorer />
    </WithNavbar>
  );
}

import WithNavbar from "../../components/layout/WithNavbar";
import Wellness from "../../components/wellness/wellness";
import WellnessHub from "../../components/wellness/WellnessHub";

// work-sih's Wellness (senior checks) leads — it is what the sidebar
// Wellness button is expected to open. Our hub sections (Ayurveda,
// clinics, mental health) follow underneath without a second hero.
export default function WellnessPage() {
  return (
    <WithNavbar>
      <Wellness />
      <WellnessHub showHero={false} />
    </WithNavbar>
  );
}

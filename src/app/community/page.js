import WithNavbar from "../../components/layout/WithNavbar";
import CommunityHub from "../../components/community/CommunityHub";

export const metadata = { title: "Community hub | SaathiSync" };

export default function CommunityPage() {
  return (
    <WithNavbar>
      <CommunityHub />
    </WithNavbar>
  );
}

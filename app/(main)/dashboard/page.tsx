// /dashboard — redirects to /dashboard/campaigns (the creator campaigns view)
import { redirect } from "next/navigation";

export default function DashboardPage() {
    redirect("/dashboard/campaigns");
}

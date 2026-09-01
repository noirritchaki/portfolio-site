import type { Metadata } from "next";
import Zine from "@/components/Zine";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: `Life Zine — ${profile.name}`,
};

export default function ZinePage() {
  return <Zine />;
}

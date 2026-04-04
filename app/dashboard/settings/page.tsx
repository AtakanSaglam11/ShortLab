import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SettingsForm from "@/components/dashboard/SettingsForm";

export const metadata: Metadata = {
  title: "Paramètres",
  description: "Gérez les paramètres de votre compte ShortLab.",
};

async function getUserData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("credits, plan")
    .eq("id", user.id)
    .single();

  return {
    email: user.email ?? "",
    plan: data?.plan ?? "free",
    credits: data?.credits ?? 0,
    createdAt: user.created_at,
  };
}

export default async function SettingsPage() {
  const userData = await getUserData();

  if (!userData) {
    return (
      <div className="flex flex-col">
        <header className="border-b border-white/10 px-4 py-4 sm:px-6">
          <h1 className="text-lg font-bold text-white">Paramètres</h1>
        </header>
        <div className="flex flex-1 items-center justify-center py-20 text-gray-500">
          Impossible de charger les données du compte.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6">
        <h1 className="text-lg font-bold text-white">Paramètres</h1>
        <p className="text-sm text-gray-500">Gérez votre compte et vos préférences.</p>
      </header>

      <div className="flex-1 px-4 py-6 sm:px-6 md:px-10">
        <SettingsForm initialData={userData} />
      </div>
    </div>
  );
}

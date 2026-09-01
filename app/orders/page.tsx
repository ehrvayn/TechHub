import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import MyPurchases from "@/components/MyPurchases";

export default async function OrderPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar showBackButton />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:px-8">
        <MyPurchases />
      </main>
    </div>
  );
}

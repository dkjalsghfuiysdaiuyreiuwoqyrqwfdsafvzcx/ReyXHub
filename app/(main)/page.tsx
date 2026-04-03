import FeatureCard from "@/components/card/FeatureCard";
import PricingCard from "@/components/card/PricingCard";
import { getSession, logoutEmail } from "@/lib/actions/auth-actions";
import { ArrowDown } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {


  return (
    <div className="py-10">
      <section id="home" className="mt-10 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold [font-family:var(--font-satoshi)]">
          ReyX Hub
        </h1>

        <p className="mt-6 max-w-3xl text-sm sm:text-base">
          We design and develop high-quality scripts that are carefully optimized
          for efficiency, low memory consumption, and consistent performance.
          Each script is built with a focus on stability and smooth execution,
          ensuring a seamless experience even during extended use.
        </p>

        <ArrowDown className="mt-4 size-8 sm:size-10" />
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <FeatureCard
          src="https://avatar.vercel.sh/shadcn1"
          imgalt="Auto Farm Image"
          title="Auto Farm"
          description="Earn bucks and potions while AFK."
          buttontext="Buy Now"
        />
        <FeatureCard
          src="https://avatar.vercel.sh/shadcn1"
          imgalt="Auto Farm Image"
          title="Auto Farm"
          description="Earn bucks and potions while AFK."
          buttontext="Buy Now"
        />
        <FeatureCard
          src="https://avatar.vercel.sh/shadcn1"
          imgalt="Auto Farm Image"
          title="Auto Farm"
          description="Earn bucks and potions while AFK."
          buttontext="Buy Now"
        />
      </section>

      <section id="pricing" className="mt-10 flex flex-col items-center text-center">
        <ArrowDown className="m-4 size-8 sm:size-10" />
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold [font-family:var(--font-satoshi)]">
          Pricing
        </h1>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <PricingCard
          title="Free"
          price="FREE"
          description="Perfect for beginners"
          features={[
            "1 Account",
            "Basic Support",
            "Limited Features",
            "Watch Ads to get key"
          ]}
          buttonText="Get Free Key"
        />
        <PricingCard
          title="Premium"
          price="$5 "
          description="Perfect for beginners"
          features={[
            "100 Accounts",
            "Premium Support",
            "Premium Features",
            "No Ads",
          ]}
          buttonText="Get Premium Key"
        />
      </section>


      <section id="other-games" className="mt-10 flex flex-col items-center text-center">
        <ArrowDown className="m-4 size-8 sm:size-10" />
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold [font-family:var(--font-satoshi)]">
          Other Games
        </h1>
        <p className="mt-6 max-w-3xl text-sm sm:text-base">
          Our roadmap includes expanding script development across multiple Roblox genres—from Grow a Garden to Blade Ball, and from farming simulations to FPS games. More innovations are coming soon.
        </p>
      </section>


    </div>
  );
}
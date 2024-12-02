"use client";
import { CheckIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { UpdatePlan, UserPlanDetails } from "../server/Server_Actions";
import Alert from "@/components/Alert";
import Spinner from "@/components/Spinner";
interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: string;
  featured?: boolean | null;
}

export default function PricingPage() {
  const [PlanDetails, setPlanDetails] = useState<null | string>(null);
  const [AlertMessage, setAlertMessage] = useState<null | string>(null);
  const [Loading, setLoading] = useState<boolean>(false);
  const [plans, setplans] = useState<Plan[]>([
    {
      name: "Free",
      price: "₹0",
      description: "Perfect for getting started",
      features: [
        "5 video compressions per month",
        "Up to 10MB video size",
        "Email support",
      ],
      buttonText: "Get Started",
      buttonVariant: "secondary",
      featured: null,
    },
    {
      name: "Premium",
      price: "₹100",
      description: "For growing content creators",
      features: [
        "20 video compressions per month",
        "Up to 50MB video size",
        "Priority email support",
      ],
      buttonText: "Subscribe Now",
      buttonVariant: "primary",
    },
    {
      name: "Premium Plus",
      price: "₹500",
      description: "For professional content creators",
      features: [
        "50 video compressions per month",
        "Up to 100MB video size",
        "Premium compression quality",
        "Priority support 24/7",
      ],
      buttonText: "Subscribe Now",
      buttonVariant: "primary",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited video compressions",
        "Custom video size limits",
        "Dedicated account manager",
        "Custom API access",
        "SLA support",
        "Custom integration",
      ],
      buttonText: "Contact Us",
      buttonVariant: "primary",
    },
  ]);

  async function HandleClick(Planname: string) {
    setLoading(true);
    if (Planname.toLowerCase() === "enterprise") {
      window.location.href =
        "mailto:pritamstech@hotmail.com?subject=ClipCompress%20Enterprise%20Plan%20Enquiry";
      return;
    }
    const { UserLoggedIn } = await UserPlanDetails();
    if (!UserLoggedIn) {
      redirect("/sign-in");
    } else {
      try {
        const res = await UpdatePlan(Planname);
        if (res.success) {
          window.location.href = "/Premium";
        } else {
          setAlertMessage(res.message);
        }
      } catch (error) {
        console.log(error);

        setAlertMessage("Internal Server Error");
        setLoading(false);
      }
    }
  }
  useEffect(() => {
    setLoading(true);
    UserPlanDetails().then((res) => {
      if (res) {
        setPlanDetails(res.planDetails);
        console.log(res);
      }
    });
  }, []);
  useEffect(() => {
    const myPlans = [...plans];
    for (let index = 0; index < myPlans.length; index++) {
      const Plan = myPlans[index];
      if (Plan.name.toLowerCase() === PlanDetails) {
        Plan.featured = true;
      } else {
        Plan.featured = null;
      }
    }
    setplans([...myPlans]);
    setLoading(false);
  }, [PlanDetails]);

  return (
    <>
      {AlertMessage && <Alert message={AlertMessage as string} />}
      <div className="bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-yellow-400">
              Pricing
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Choose the perfect plan for your needs
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Whether you&apos;re just starting out or running a large
              organization, we have a plan that&apos;s right for you.
            </p>
          </div>
          {Loading ? (
            <Spinner />
          ) : (
            <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-5 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`hover:scale-105 cursor-pointer transition-all duration-300 flex flex-col justify-between rounded-3xl bg-zinc-900 p-8 ring-1 ring-zinc-800 xl:p-10 ${
                    plan.featured ? "ring-2 ring-yellow-700 scale-105" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-x-4">
                      <h3
                        className={`text-lg font-semibold leading-8 ${
                          plan.featured ? "text-yellow-400" : "text-white"
                        }`}
                      >
                        {plan.name}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-300">
                      {plan.description}
                    </p>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-white">
                        {plan.price}
                      </span>
                      {plan.name !== "Enterprise" && (
                        <span className="text-sm font-semibold leading-6 text-gray-300">
                          /month
                        </span>
                      )}
                    </p>
                    <ul
                      role="list"
                      className="mt-8 space-y-3 text-sm leading-6 text-gray-300"
                    >
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon
                            className={`h-6 w-5 flex-none ${
                              plan.featured
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    disabled={PlanDetails === plan.name.toLowerCase()}
                    onClick={() => HandleClick(plan.name)}
                    className={`disabled:cursor-not-allowed disabled:bg-yellow-300 disabled:text-gray-400 mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      plan.buttonVariant === "primary"
                        ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300 focus-visible:outline-yellow-400"
                        : "text-yellow-400 ring-1 ring-inset ring-yellow-400/20 hover:ring-yellow-400/30"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

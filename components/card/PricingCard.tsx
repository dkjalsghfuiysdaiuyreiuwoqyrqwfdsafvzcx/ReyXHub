import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
};

export default function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  popular,
}: PricingCardProps) {
  return (
    <Card
      className={`relative mx-auto w-full max-w-md p-6 flex flex-col justify-between min-h-[500px] cursor-pointer transition-all hover:scale-105 ${
        popular ? "border-primary shadow-xl" : ""
      }`}
    >
      {/* Badge */}
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge>Most Popular</Badge>
        </div>
      )}

      {/* Header */}
      <CardHeader className="text-center space-y-4">
        <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        <hr />
        <div className="text-5xl font-bold">
          {price}
          <span className="text-sm font-normal text-muted-foreground">
            /mo
          </span>
        </div>

        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardHeader>

      {/* Features */}
      <CardContent className="flex-1 mt-6">
        <ul className="space-y-4 text-base">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className="text-green-500 text-lg">✔</span>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>

      {/* Footer */}
      <Button variant={"default"} className="w-full h-12 text-base">
          {buttonText}
        </Button>
    </Card>
  );
}
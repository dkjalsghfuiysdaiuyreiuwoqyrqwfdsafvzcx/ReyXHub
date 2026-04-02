import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";


type FeatureCardProps = {
    src: string,
    imgalt: string,
    title: string,
    description: string,
    buttontext: string
}
export default function FeatureCard({
    src,
    imgalt,
    title,
    description,
    buttontext
}: FeatureCardProps) {
    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0 hover:scale-110 transition-all cursor-pointer">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
                src={`${src ?? "https://avatar.vercel.sh/shadcn1"}`}
                alt={`${imgalt}`}
                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
                <CardAction>
                    <Badge variant="secondary">Featured</Badge>
                </CardAction>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button className="w-full">{buttontext}</Button>
            </CardFooter>
        </Card>
    )
}
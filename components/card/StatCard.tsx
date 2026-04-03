import { Button } from "../ui/button";

type StatCardProps = {
    title: string,
    firstNum: number,
    secondNum: number,
    buttonName: string
}
export default function StatCard({title, firstNum, secondNum, buttonName} : StatCardProps) {

    return (
        <div className="border border-slate-200 rounded-md p-4">
            <h1 className="font-bold">{title}</h1>
            <div className="flex items-center justify-center gap-4 my-10">
                <p className="text-5xl">{firstNum}</p>
                <p>/</p>
                <p className="text-5xl">{secondNum}</p>
            </div>
            <div className="flex justify-end">
                <Button className={'p-4'}>{buttonName}</Button>
            </div>
        </div>
    )
}
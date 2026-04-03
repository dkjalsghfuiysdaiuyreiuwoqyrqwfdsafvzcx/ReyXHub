

type DBTitleProps = {
    title: string,
    description: string
}
export default function DBTitle({title, description} : DBTitleProps) {
    return (
        <div>
            <h1 className="font-bold text-xl">{title}</h1>
            <h1>{description}</h1>
        </div>
    )
}
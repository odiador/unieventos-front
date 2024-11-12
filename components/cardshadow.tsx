const CardShadow = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={`h-full flex-1 relative bg-[#292e34] gap-3 flex flex-col min-w-80 w-full py-8 px-5 rounded-md border-2 border-white/5 ${className}`}>
            <div className="shadow" />
            {children}
        </div>
    )
}
export default CardShadow;
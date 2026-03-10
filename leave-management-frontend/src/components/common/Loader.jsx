
const Loader = ({ fullPage = false, size = 'md', text = '' }) => {
    const sizes = {
        sm: 'h-5 w-5 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-3',
    }

    const spinner = (
        <div className="flex flex-col items-center gap-3">
            <div
                className={`${sizes[size]} rounded-full border-brand-200 border-t-brand-600 animate-spin`}
            />
            {text && <p className="text-sm text-surface-500 animate-pulse-soft">{text}</p>}
        </div>
    )

    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-surface-50/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {spinner}
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center py-16">
            {spinner}
        </div>
    )
}

export default Loader
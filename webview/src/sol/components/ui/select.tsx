interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
}

export const Select = ({ children, className, ...props }: SelectProps) => {
    return (
        <select
            className={`w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-text 
                focus:outline-none focus:ring-2 focus:ring-primary/50 ${className || ''}`}
            {...props}
        >
            {children}
        </select>
    );
};

// Importing React, a utility function 'cn', and class-variance-authority (CVA) for managing dynamic CSS classes
import * as React from "react"
import { cn } from "../../lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

/* Class-variance-authority (CVA) is a JavaScript/TypeScript library that helps you create and manage dynamic CSS classes in a clear, structured, and maintainable way.

📌 What issues does it solve?

✅ Organize class reuse instead of manual assembly. 
✅ Easily combine Tailwind CSS with variants. 
✅ Easily handle states like disabled, active, hover, etc. 
✅ Eliminate conflicting classes in Tailwind (when used with tailwind-merge).*/

// Defining alertVariants using CVA to manage dynamic CSS classes for the Alert component
const alertVariants = cva(
    "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
    {
        variants: {
            variant: {
                default: "bg-background text-foreground",
                destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

// Defining an Alert component using React.forwardRef to pass refs to the underlying div element
const Alert = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
))
// Setting a display name for the Alert component
Alert.displayName = "Alert"

// Defining an AlertTitle component using React.forwardRef to pass refs to the underlying h5 element
const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
    ),
)
// Setting a display name for the AlertTitle component
AlertTitle.displayName = "AlertTitle"

// Defining an AlertDescription component using React.forwardRef to pass refs to the underlying div element
const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
    ),
)
// Setting a display name for the AlertDescription component
AlertDescription.displayName = "AlertDescription"

// Exporting all the defined components for use in other parts of the application
export { Alert, AlertTitle, AlertDescription }

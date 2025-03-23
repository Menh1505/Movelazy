// Importing React and a utility function 'cn' from a local utils file
import * as React from "react"
import { cn } from "../../lib/utils"

// Defining a Card component using React.forwardRef to pass refs to the underlying div element
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
// Setting a display name for the Card component
Card.displayName = "Card"

// Defining a CardHeader component using React.forwardRef to pass refs to the underlying div element
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
    ),
)
// Setting a display name for the CardHeader component
CardHeader.displayName = "CardHeader"

// Defining a CardTitle component using React.forwardRef to pass refs to the underlying h3 element
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
    ),
)
// Setting a display name for the CardTitle component
CardTitle.displayName = "CardTitle"

// Defining a CardDescription component using React.forwardRef to pass refs to the underlying p element
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
    ),
)
// Setting a display name for the CardDescription component
CardDescription.displayName = "CardDescription"

// Defining a CardContent component using React.forwardRef to pass refs to the underlying div element
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
// Setting a display name for the CardContent component
CardContent.displayName = "CardContent"

// Defining a CardFooter component using React.forwardRef to pass refs to the underlying div element
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
    ),
)
// Setting a display name for the CardFooter component
CardFooter.displayName = "CardFooter"

// Exporting all the defined components for use in other parts of the application
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

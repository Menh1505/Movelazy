"use client"

// Importing React and TabsPrimitive from @radix-ui/react-tabs
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
// Importing the utility function 'cn' from a local utils file
import { cn } from "../../lib/utils"

// Defining the Tabs component as TabsPrimitive.Root
const Tabs = TabsPrimitive.Root

// Defining a TabsList component using React.forwardRef to pass refs to the underlying TabsPrimitive.List element
const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className,
        )}
        {...props}
    />
))
// Setting a display name for the TabsList component
TabsList.displayName = TabsPrimitive.List.displayName

// Defining a TabsTrigger component using React.forwardRef to pass refs to the underlying TabsPrimitive.Trigger element
const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
            className,
        )}
        {...props}
    />
))
// Setting a display name for the TabsTrigger component
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

// Defining a TabsContent component using React.forwardRef to pass refs to the underlying TabsPrimitive.Content element
const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className,
        )}
        {...props}
    />
))
// Setting a display name for the TabsContent component
TabsContent.displayName = TabsPrimitive.Content.displayName

// Exporting all the defined components for use in other parts of the application
export { Tabs, TabsList, TabsTrigger, TabsContent }

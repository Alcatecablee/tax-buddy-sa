import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={Infinity} swipeDirection="right">
      {toasts.map(function ({ id, title, description, action, duration, ...props }) {
        console.log("🍞 Rendering persistent toast:", id, "with duration:", duration)
        return (
          <Toast 
            key={id} 
            duration={Infinity} // Never auto-dismiss
            {...props}
            onOpenChange={(open) => {
              console.log("🍞 Toaster Toast onOpenChange:", id, open)
              // Only close when manually dismissed via close button
              if (!open && props.onOpenChange) {
                console.log("🍞 Manual close via close button for:", id)
                props.onOpenChange?.(open)
              }
            }}
          >
            <div className="grid gap-1 pr-8">
              {title && <ToastTitle className="text-base font-semibold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-sm leading-relaxed">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="absolute right-2 top-2 rounded-md p-2 text-foreground/70 opacity-100 transition-opacity hover:text-foreground hover:bg-muted/50 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 bg-background/80 border border-border/40 shadow-sm" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

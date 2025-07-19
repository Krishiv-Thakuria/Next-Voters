import * as React from 'react';
import { cn } from '@/lib/utils';

const PromptInput = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative flex flex-col w-full overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring',
        className
      )}
      {...props}
    />
  )
);
PromptInput.displayName = 'PromptInput';

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'min-h-[80px] w-full resize-none border-0 bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
PromptInputTextarea.displayName = 'PromptInputTextarea';

const PromptInputActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('sticky bottom-0 flex items-center justify-end gap-2 bg-background p-2',
      className)}
    {...props}
  />
));
PromptInputActions.displayName = 'PromptInputActions';

const PromptSuggestion = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground',
      className
    )}
    {...props}
  />
));
PromptSuggestion.displayName = 'PromptSuggestion';

export { PromptInput, PromptInputTextarea, PromptInputActions, PromptSuggestion };

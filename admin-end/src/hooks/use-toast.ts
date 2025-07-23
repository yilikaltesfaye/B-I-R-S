import { toast as sonnerToast } from "sonner";

type ToastOptions = {
	title?: string;
	description?: string;
	action?: React.ReactNode;
	duration?: number;
	onOpenChange?: (open: boolean) => void;
};

function useToast() {
	return {
		toast: (options: ToastOptions) => {
			sonnerToast(options.title ?? "", {
				description: options.description,
				action: options.action,
				duration: options.duration,
			});
		},
		dismiss: sonnerToast.dismiss,
	};
}

export { useToast };

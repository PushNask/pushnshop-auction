import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingOverlayProps {
  children: React.ReactNode;
  loading: boolean;
  blur?: boolean;
}

export function LoadingOverlay({ children, loading, blur = true }: LoadingOverlayProps) {
  if (!loading) return <>{children}</>;

  return (
    <div className="relative">
      <div className={`absolute inset-0 ${blur ? 'backdrop-blur-sm' : ''} bg-background/50 flex items-center justify-center z-50`}>
        <LoadingSpinner size="large" />
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
}
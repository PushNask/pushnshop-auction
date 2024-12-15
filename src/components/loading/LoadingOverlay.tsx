import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  loading: boolean;
  children?: React.ReactNode;
}

export const LoadingOverlay = ({ loading, children }: LoadingOverlayProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function WallPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to home page (which is now the Lamentation Wall)
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-stone-600">Redirecting...</p>
      </div>
    </div>
  );
}

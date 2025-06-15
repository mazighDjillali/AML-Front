    'use client';

    import { usePathname } from 'next/navigation';

    export default function PathnameDisplay() {
      const pathname = usePathname();

      return <p>Current Path: {pathname}</p>;
    }
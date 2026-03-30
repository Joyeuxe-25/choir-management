import Link from 'next/link';
import Button from '@/components/shared/Button';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '10rem' }}>
      <h1>404 – Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/dashboard">
        <Button variant="primary">Go to Dashboard</Button>
      </Link>
    </div>
  );
}
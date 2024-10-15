import { checkRole } from '@/api/utils/auth';
 
export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const role = checkRole();
  return <>{role === 'admin' ? admin : user}</>
}
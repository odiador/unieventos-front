"use client";
import { checkRole } from '@/api/utils/auth';
import { IconLoader } from '@tabler/icons-react';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const [role, setRole] = useState("none");
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    checkRole(getCookie("jwt")).then(v => {
      setLoading(false);
      if (v) {
        const data = v.data;
        console.log(JSON.stringify(data));
        if (v.status === 200) {
          setRole(v.data.response)
        } else {
          setRole(v.data.message as string);

        }
      }
    })
  }, []);
  return <div className='flex items-center justify-center h-full'>
    {role == "CLIENT" && user}
    {role == "ADMINISTRATOR" && admin}
    {loading && <IconLoader className="animate-spin text-white" />}
  </div>
}
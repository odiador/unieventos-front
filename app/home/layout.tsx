"use client";
import { useAuthContext } from '@/api/utils/auth';
import { IconLoader } from '@tabler/icons-react';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

export default function Layout({
  user,
  admin
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const { account, loggedIn, updateRole } = useAuthContext();
  const overlay = useAnimation();
  useEffect(() => {
    if (loggedIn()) {
      updateRole().then(() => {
        overlay.start("hidden");
      })
    } else {
      overlay.start("hidden");
    }
  }, []);
  return <div className='relative flex items-center justify-center h-full'>
    {account && account.role == "ADMINISTRATOR" && admin}
    {!(account && account.role == "ADMINISTRATOR") && user}
    <motion.div
      variants={{
        hidden: { opacity: 0, pointerEvents: "none" },
        visible: {
          opacity: 1,
        }
      }}
      transition={{ duration: 0.2 }}
      initial="visible"
      animate={overlay}
      className='flex items-center absolute z-[10] justify-center w-full h-full left-0 top-0 bg-black/50 '>
      <IconLoader className="animate-spin text-white" />
    </motion.div>
  </div>
}
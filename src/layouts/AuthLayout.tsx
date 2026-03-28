import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Branding Left Panel (Hidden on Small Screens) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-zinc-950 p-12 text-zinc-100 dark:bg-zinc-900 border-r border-zinc-800 relative overflow-hidden">
				{/* Background Decoration */}
				<div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent opacity-50" />
				<div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px]" />
				
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">Amego AI</h2>
          <p className="mt-4 text-zinc-400 text-lg max-w-md">The next-generation platform for intelligence, organization, and collaboration.</p>
        </div>

        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm font-medium">Trusted by 10k+ innovators</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <span className="text-sm font-medium">99.9% uptime and reliability</span>
          </div>
        </div>
      </div>

      {/* Auth Form Right Panel */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;

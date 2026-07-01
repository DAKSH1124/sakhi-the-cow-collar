import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Activity, Bell, LayoutDashboard, Settings, Map, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border/40 bg-muted/20 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <Link className="flex items-center gap-2" href="/">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              S
            </div>
            <span className="font-bold text-xl tracking-tight">Sakhi</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Overview
            </Button>
          </Link>
          <Link href="/dashboard/cows">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <Activity className="mr-3 h-5 w-5" />
              Cattle Directory
            </Button>
          </Link>
          <Link href="/dashboard/map">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <Map className="mr-3 h-5 w-5" />
              Live Map
            </Button>
          </Link>
          <Link href="/dashboard/alerts">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <Bell className="mr-3 h-5 w-5" />
              Alerts
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Button>
          </Link>
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-border/40">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">
                {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium truncate">{session.user?.name || "Farmer"}</span>
              <span className="text-xs text-muted-foreground truncate">{session.user?.email}</span>
            </div>
          </div>
          <Link href="/api/auth/signout">
            <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <LogOut className="mr-3 h-4 w-4" />
              Log Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header (optional, usually skipped for brevity but good practice) */}
        <div className="h-16 border-b border-border/40 flex items-center px-4 md:hidden">
          <Link className="flex items-center gap-2" href="/">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              S
            </div>
            <span className="font-bold text-xl tracking-tight">Sakhi</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}

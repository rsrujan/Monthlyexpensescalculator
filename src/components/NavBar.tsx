
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export function NavBar() {
  const { authState, signOut } = useAuth();
  const { user, isAdmin } = authState;

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="font-semibold text-xl">
          Expense Tracker
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <>
              {isAdmin && (
                <Button variant="outline" asChild>
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
              
              <Button variant="ghost" asChild>
                <Link to="/profile">Profile</Link>
              </Button>
              
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const { authState, signOut, updateProfile } = useAuth();
  const [email, setEmail] = useState(authState.user?.email || "");
  const [loading, setLoading] = useState(false);
  
  if (!authState.user) {
    return <Navigate to="/login" />;
  }
  
  const handleUpdateProfile = async () => {
    setLoading(true);
    await updateProfile({ email });
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto bg-card rounded-lg border p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Role</label>
            <p className="text-sm bg-muted p-2 rounded mt-1">
              {authState.isAdmin ? "Admin" : "User"}
            </p>
          </div>
          
          <div className="pt-4 flex flex-col space-y-2">
            <Button onClick={handleUpdateProfile} disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
            
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

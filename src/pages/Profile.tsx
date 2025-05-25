import React, { useState } from "react";
import { useUserProfile } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export const Profile = () => {
  const { user, updateUser, deleteUser } = useUserProfile();
  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState(user?.age || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      await updateUser({ name, age, email, phone });
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteUser();
        // Redirect to login or home page after deletion
      } catch (err) {
        setError("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Age:</strong> {user?.age}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phone}</p>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete Account</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 
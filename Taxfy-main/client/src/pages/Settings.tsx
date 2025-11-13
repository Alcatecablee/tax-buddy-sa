import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Building,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { apiService } from "@/services/api";

interface UserSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  dataRetention: number; // days
  autoBackup: boolean;
  twoFactorAuth: boolean;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  taxNumber?: string;
  employerName?: string;
}

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    taxNumber: "",
    employerName: "",
  });

  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    dataRetention: 365,
    autoBackup: true,
    twoFactorAuth: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    fetchUserSettings();
  }, [user?.id]);

  const fetchUserSettings = async () => {
    if (!user?.id) return;

    try {
      const data = await apiService.getUserSettings(user.id);
      setSettings(data.settings);
      setProfile(data.profile);
    } catch (err) {
      console.warn("Could not fetch settings, using defaults:", err);
    }
  };

  const saveProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      await apiService.updateUserProfile(user.id, profile);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      await apiService.updateUserSettings(user.id, settings);
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwords.new.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      await apiService.changePassword(
        user?.id || "",
        passwords.current,
        passwords.new,
      );
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });

      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast({
        title: "Error",
        description:
          "Failed to change password. Please check your current password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      await apiService.exportUserData(user?.id || "");
      toast({
        title: "Export Started",
        description: "Your data export will be emailed to you shortly.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      await apiService.deleteUserAccount(user?.id || "");
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
      await signOut();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Account Settings - Taxfy</title>
        <meta
          name="description"
          content="Manage your account settings, profile, and preferences."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <div className="flex justify-center mb-4">
                <img
                  src="/assets/logo-ta.png"
                  alt="Taxfy Logo"
                  className="h-12 w-12 object-contain animate-bounce-subtle"
                />
              </div>
              <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
                <SettingsIcon className="w-8 h-8 text-primary" />
                Account Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your account information and preferences
              </p>
            </div>
            <Link to="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Profile Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+27 xx xxx xxxx"
                />
              </div>
              <div>
                <Label htmlFor="taxNumber">Tax Number</Label>
                <Input
                  id="taxNumber"
                  value={profile.taxNumber}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      taxNumber: e.target.value,
                    }))
                  }
                  placeholder="Tax reference number"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={profile.postalCode}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="employerName">Employer Name</Label>
              <Input
                id="employerName"
                value={profile.employerName}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    employerName: e.target.value,
                  }))
                }
                placeholder="Current employer"
              />
            </div>

            <Button onClick={saveProfile} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords((prev) => ({
                      ...prev,
                      current: e.target.value,
                    }))
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, new: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, confirm: e.target.value }))
                }
              />
            </div>

            <Button onClick={changePassword} disabled={loading}>
              <Shield className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about your tax calculations and reports
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    emailNotifications: checked,
                  }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get text messages for important updates
                </p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    smsNotifications: checked,
                  }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive tips, updates, and promotional content
                </p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, marketingEmails: checked }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Backup</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically backup your data and documents
                </p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, autoBackup: checked }))
                }
              />
            </div>

            <Button onClick={saveSettings} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Export Your Data</h4>
                <p className="text-sm text-muted-foreground">
                  Download a copy of all your data and documents
                </p>
              </div>
              <Button variant="outline" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h4 className="font-medium text-red-900">Delete Account</h4>
                <p className="text-sm text-red-700">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" onClick={deleteAccount}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Settings;

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface UploadCredits {
  total: number;
  used: number;
  remaining: number;
  resetDate?: string;
  plan: string;
}

export interface ReferralStats {
  completedReferrals: number;
  pendingReferrals: number;
  totalEarned: number;
}

export function useUploadCredits() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<UploadCredits>({
    total: 10,
    used: 0,
    remaining: 10,
    plan: "free",
  });
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    completedReferrals: 0,
    pendingReferrals: 0,
    totalEarned: 0,
  });

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Real API implementation
        const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
        // Fetch real credits from API
        const creditsResponse = await fetch(
          `${API_BASE_URL}/users/${user.id}/credits`,
          {
            headers: {
              "X-User-ID": user.id,
            },
          },
        );

        if (creditsResponse.ok) {
          const creditsData = await creditsResponse.json();
          setCredits(creditsData);
        } else {
          // Fallback to default values if API fails
          setCredits({
            total: 10,
            used: 0,
            remaining: 10,
            resetDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            plan: "free",
          });
        }

        // Generate referral code based on user ID
        const referralCode = `REF${user.id?.slice(-6).toUpperCase() || "GUEST"}`;

        // Fetch real referral stats from API
        const referralResponse = await fetch(
          `${API_BASE_URL}/users/${user.id}/referrals`,
          {
            headers: {
              "X-User-ID": user.id,
            },
          },
        );

        if (referralResponse.ok) {
          const referralData = await referralResponse.json();
          setReferralStats(referralData);
        } else {
          // Fallback to default values if API fails
          setReferralStats({
            completedReferrals: 0,
            pendingReferrals: 0,
            totalEarned: 0,
          });
        }

        setReferralCode(referralCode);
      } catch (error) {
        console.error("Error fetching upload credits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [user]);

  const addCredits = (amount: number) => {
    setCredits((prev) => ({
      ...prev,
      total: prev.total + amount,
      remaining: prev.remaining + amount,
    }));
  };

  const useCredit = () => {
    setCredits((prev) => ({
      ...prev,
      used: prev.used + 1,
      remaining: Math.max(0, prev.remaining - 1),
    }));
  };

  const getReferralLink = () => {
    return `${window.location.origin}?ref=${referralCode}`;
  };

  const shareReferralCode = () => {
    const link = getReferralLink();
    if (navigator.share) {
      navigator.share({
        title: "Join me on Taxfy!",
        text: `Check out Taxfy - a free tax calculator! Use my referral code: ${referralCode}`,
        url: link,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(link);
    }
  };

  const hasCredits = credits.remaining > 0;

  return {
    credits,
    loading,
    addCredits,
    useCredit,
    hasCredits,
    referralCode,
    referralStats,
    getReferralLink,
    shareReferralCode,
    isLoading: loading,
  };
}

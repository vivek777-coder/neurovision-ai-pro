import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Shield, Bell, Palette, Brain, Camera, Pencil, Check, X, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

const DEFAULT_PROFILE: ProfileData = {
  name: "Alex Johnson",
  email: "alex@neurovision.ai",
  role: "AI Research Engineer",
  avatar: null,
};

function loadProfile(): ProfileData {
  try {
    const stored = localStorage.getItem("nv_profile");
    if (stored) return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_PROFILE;
}

function saveProfile(data: ProfileData) {
  localStorage.setItem("nv_profile", JSON.stringify(data));
}

export default function Profile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>(loadProfile);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingName) nameInputRef.current?.focus();
  }, [editingName]);

  const startEditing = () => {
    setDraftName(profile.name);
    setNameError("");
    setEditingName(true);
  };

  const cancelEditing = () => {
    setEditingName(false);
    setNameError("");
  };

  const handleSaveName = async () => {
    const trimmed = draftName.trim();
    if (!trimmed) {
      setNameError("Name cannot be empty");
      return;
    }
    if (trimmed.length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }

    setSaving(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const updated = { ...profile, name: trimmed };
    setProfile(updated);
    saveProfile(updated);
    setEditingName(false);
    setSaving(false);
    toast({ title: "Profile updated", description: "Your name has been updated successfully." });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Image must be under 5 MB.", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const avatar = ev.target?.result as string;
      const updated = { ...profile, avatar };
      setProfile(updated);
      saveProfile(updated);
      toast({ title: "Avatar updated", description: "Your profile picture has been changed." });
    };
    reader.readAsDataURL(file);
  };

  const infoCards = [
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Shield, label: "Role", value: "Administrator" },
    { icon: Bell, label: "Notifications", value: "Enabled" },
    { icon: Palette, label: "Theme", value: "System Default" },
    { icon: Brain, label: "API Usage", value: "12,847 / 50,000" },
    { icon: Shield, label: "2FA", value: "Enabled" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-8"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden gradient-primary flex items-center justify-center">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-primary-foreground" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-foreground/0 group-hover:bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
            >
              <Camera className="h-6 w-6 text-primary-foreground drop-shadow" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name + Role */}
          <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
            <AnimatePresence mode="wait">
              {editingName ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      ref={nameInputRef}
                      value={draftName}
                      onChange={(e) => {
                        setDraftName(e.target.value);
                        if (nameError) setNameError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") cancelEditing();
                      }}
                      className="text-xl font-bold bg-transparent border-b-2 border-primary/60 focus:border-primary outline-none px-1 py-0.5 w-full max-w-xs"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleSaveName}
                      disabled={saving}
                      className="rounded-full h-8 w-8 text-success hover:bg-success/10"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="rounded-full h-8 w-8 text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <AnimatePresence>
                    {nameError && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-destructive"
                      >
                        {nameError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="display"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="flex items-center gap-2 justify-center sm:justify-start"
                >
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={startEditing}
                    className="rounded-full h-7 w-7 text-muted-foreground hover:text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-sm text-muted-foreground">{profile.role}</p>
            <Badge className="gradient-primary border-0">Pro Plan</Badge>
          </div>
        </div>
      </motion.div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoCards.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5 flex items-center gap-4 hover:glow-primary transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-muted">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium truncate">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-xl p-6 border-destructive/20"
      >
        <h3 className="font-semibold text-sm mb-1">Danger Zone</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Irreversible and destructive actions
        </p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10">
            Delete Account
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg">
            Export Data
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, IdCard, Lock, ShieldCheck, 
  Camera, Eye, EyeOff, Save, Key, CheckCircle2 
} from 'lucide-react';
import { useRef } from 'react';
import ConfirmationModal from '../layout/ConfirmationModal';
import { toast } from 'sonner';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Mock initial data
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    createdAt: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/student/profile');
        if (response.ok) {
          const data = await response.json();
          setProfileData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            studentId: data.student_id || '', // Assuming student_id exists
            email: data.email || '',
            phone: data.mobile || '',
            address: data.address || '',
            status: data.status || 'active',
            createdAt: data.created_at || ''
          });
          if (data.avatar_url) {
            setProfileImage(data.avatar_url);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);


  const getStrengthScore = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = getStrengthScore(password);
  
  const getStrengthInfo = (score: number) => {
    switch (score) {
      case 0: return { label: "", color: "bg-white/10", textColor: "text-white/10", width: "w-0" };
      case 1: return { label: "Weak", color: "bg-red-500", textColor: "text-red-500", width: "w-1/4" };
      case 2: return { label: "Fair", color: "bg-orange-500", textColor: "text-orange-500", width: "w-2/4" };
      case 3: return { label: "Good", color: "bg-yellow-400", textColor: "text-yellow-400", width: "w-3/4" };
      case 4: return { label: "Strong", color: "bg-green-500", textColor: "text-green-500", width: "w-full" };
      default: return { label: "", color: "bg-white/10", textColor: "text-white/10", width: "w-0" };
    }
  };

  const strengthInfo = getStrengthInfo(strengthScore);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdatePassword = async () => {
    setPasswordError(null);
    if (!currentPassword || !password || password !== confirmPassword) {
      console.log('Validation failed');
      return;
    }

    try {
      const response = await fetch('/api/student/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword: password }),
      });

      if (response.ok) {
        toast.success("Password updated successfully");
        setIsModalOpen(false);
        // Reset fields
        setCurrentPassword('');
        setPassword('');
        setConfirmPassword('');
        setPasswordError(null);
      } else {
        const errorData = await response.json();
        console.error('Failed to update password:', errorData.error);
        if (errorData.error === 'Incorrect current password') {
          setPasswordError('The current password provided is incorrect.');
        } else {
          setPasswordError(errorData.error || 'Failed to update password.');
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('An unexpected error occurred. Please try again.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setImageFile(file);
    }
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('firstName', profileData.firstName);
      formData.append('lastName', profileData.lastName);
      formData.append('phone', profileData.phone);
      formData.append('address', profileData.address);
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setIsEditing(false);
        if (result.avatarUrl) {
          setProfileImage(result.avatarUrl);
        }
        
        // Dispatch custom event for real-time update in navbar
        window.dispatchEvent(new CustomEvent('profile-updated', {
          detail: {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            avatarUrl: result.avatarUrl || profileImage
          }
        }));

        toast.success('Profile updated successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to update profile:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error updating profile', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleUpdateProfile();
    } else {
      setIsEditing(true);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      <div className="flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Student Profile</h1>
            <p className="text-gray-400 mt-1">Manage your identity and account security.</p>
          </div>
          <button 
            onClick={handleEditToggle}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              isEditing 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-[0_4px_15px_rgba(147,51,234,0.3)]'
            }`}
          >
            {isEditing ? <>{isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Profile</>}</> : <><User className="w-4 h-4" /> Edit Profile</>}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="xl:col-span-4 flex flex-col gap-8">
            <div className="relative overflow-hidden group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-600/10 via-transparent to-indigo-600/10 opacity-50" />
              
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-purple-500 to-indigo-600 shadow-2xl relative">
                    <div className="w-full h-full rounded-full bg-[#1a1d25] flex items-center justify-center overflow-hidden border-4 border-[#1a1d25]">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-4xl font-bold text-white">AM</div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-[#2a2d35] border border-white/10 rounded-full flex items-center justify-center text-white hover:text-purple-400 hover:border-purple-400/50 transition-all shadow-xl z-20"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">{profileData.firstName} {profileData.lastName}</h2>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold tracking-wider uppercase mb-6">
                  EngageX Member
                </span>

                <div className="w-full space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm text-gray-400 px-2">
                    <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                    <span className="text-white font-medium">{profileData.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400 px-2">
                    <span className="flex items-center gap-2"><IdCard className="w-4 h-4" /> Student ID</span>
                    <span className="text-white font-medium">{profileData.studentId}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400 px-2">
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Status</span>
                    <span className={`font-bold tracking-tight ${profileData.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {profileData.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Sidebar (Registration Theme) */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-6 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-purple-500 rounded-full" />
                Member Benefits
              </h3>
              <div className="space-y-4">
                {[
                  'Access to Campus Clubs',
                  'Priority Event Registration',
                  'Member Rewards Program',
                  'Personal Event Planner'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-400 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Edit Info & Security */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            
            {/* Personal Details Section */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">First Name</label>
                  <div className={`group flex h-[50px] items-center gap-3 rounded-xl border px-4 transition-all duration-300 ${isEditing ? 'border-purple-500/50 bg-black/40 shadow-[0_0_15px_rgba(142,45,226,0.1)]' : 'border-white/10 bg-black/20'}`}>
                    <User className="h-4 w-4 text-gray-500 group-focus-within:text-purple-400" />
                    <input 
                      type="text" 
                      value={profileData.firstName}
                      onChange={(e) => isEditing && setProfileData({...profileData, firstName: e.target.value})}
                      disabled={!isEditing}
                      className="h-full w-full bg-transparent text-sm text-white outline-none disabled:opacity-70" 
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Last Name</label>
                  <div className={`group flex h-[50px] items-center gap-3 rounded-xl border px-4 transition-all duration-300 ${isEditing ? 'border-purple-500/50 bg-black/40 shadow-[0_0_15px_rgba(142,45,226,0.1)]' : 'border-white/10 bg-black/20'}`}>
                    <User className="h-4 w-4 text-gray-500 group-focus-within:text-purple-400" />
                    <input 
                      type="text" 
                      value={profileData.lastName}
                      onChange={(e) => isEditing && setProfileData({...profileData, lastName: e.target.value})}
                      disabled={!isEditing}
                      className="h-full w-full bg-transparent text-sm text-white outline-none disabled:opacity-70" 
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Email Address</label>
                  <div className="group flex h-[50px] items-center gap-3 rounded-xl border border-gray-600/50 bg-gray-800/30 px-4 opacity-60 cursor-not-allowed">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <input 
                      type="email" 
                      value={profileData.email}
                      disabled={true}
                      className="h-full w-full bg-transparent text-sm text-gray-400 outline-none cursor-not-allowed" 
                    />
                  </div>
                  <p className="text-xs text-gray-500 ml-1">Email address cannot be changed</p>
                </div>

                {/* Mobile Number */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Mobile Number</label>
                  <div className={`group flex h-[50px] items-center gap-3 rounded-xl border px-4 transition-all duration-300 ${isEditing ? 'border-purple-500/50 bg-black/40 shadow-[0_0_15px_rgba(142,45,226,0.1)]' : 'border-white/10 bg-black/20'}`}>
                    <Phone className="h-4 w-4 text-gray-500 group-focus-within:text-purple-400" />
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => isEditing && setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="h-full w-full bg-transparent text-sm text-white outline-none disabled:opacity-70" 
                    />
                  </div>
                </div>

                {/* Home Address */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Home Address</label>
                  <div className={`group flex h-[50px] items-center gap-3 rounded-xl border px-4 transition-all duration-300 ${isEditing ? 'border-purple-500/50 bg-black/40 shadow-[0_0_15px_rgba(142,45,226,0.1)]' : 'border-white/10 bg-black/20'}`}>
                    <MapPin className="h-4 w-4 text-gray-500 group-focus-within:text-purple-400" />
                    <input 
                      type="text" 
                      value={profileData.address}
                      onChange={(e) => isEditing && setProfileData({...profileData, address: e.target.value})}
                      disabled={!isEditing}
                      className="h-full w-full bg-transparent text-sm text-white outline-none disabled:opacity-70" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section with Modal Trigger */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl group hover:border-purple-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-purple-400" />
                    Security Settings
                  </h3>
                  <p className="text-sm text-gray-400">Manage your account password and security preferences.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 text-white rounded-xl text-sm font-bold transition-all group/btn shadow-lg"
                >
                  <Key className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                  Change Password
                </button>
              </div>
            </div>

            {/* Account Management Actions */}
            <div className="flex items-center justify-between p-2">
              <button 
                onClick={() => setShowDeactivateModal(true)}
                className={`text-sm font-bold transition-colors uppercase tracking-widest ${
                  profileData.status === 'active' 
                  ? 'text-red-500/70 hover:text-red-400' 
                  : 'text-emerald-500/70 hover:text-emerald-400'
                }`}
              >
                {profileData.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
              </button>
              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium tracking-wide">
                <span>Account Created: {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'March 14, 2026'}</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0f0c29]/90 p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-600/20 via-transparent to-indigo-600/20" />
            
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-6">
                  <ShieldCheck className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Secure Your Account</h3>
                <p className="text-gray-400 text-sm">Update your password to keep your EngageX account safe.</p>
              </div>

              <div className="flex flex-col gap-6">
                {/* Current Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Current Password</label>
                  <div className={`group flex h-[50px] items-center gap-3 rounded-xl border px-4 transition-all duration-300 focus-within:border-purple-500/50 focus-within:bg-black/40 ${passwordError ? 'border-red-500/50 bg-black/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 bg-black/20'}`}>
                    <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-purple-400" />
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      value={currentPassword}
                      onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(null); }}
                      placeholder="Enter your current password"
                      className="h-full flex-1 bg-transparent text-sm text-white outline-none" 
                    />
                    <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="text-gray-500 hover:text-white transition-colors">
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <span className="ml-1 text-[11px] text-red-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      {passwordError}
                    </span>
                  )}
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">New Password</label>
                  <div className="group flex h-[50px] items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 transition-all duration-300 focus-within:border-purple-500/50 focus-within:bg-black/40">
                    <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-purple-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="h-full flex-1 bg-transparent text-sm text-white outline-none" 
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength Bar */}
                  {password && (
                    <div className="mt-2 space-y-2">
                      <div className="flex h-1 gap-1 overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full rounded-full transition-all duration-500 ${strengthInfo.width} ${strengthInfo.color}`} />
                      </div>
                      <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest leading-none">
                        <span className="text-gray-500">Strength level</span>
                        <span className={strengthInfo.textColor}>{strengthInfo.label}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Confirm New Password</label>
                  <div className={`group flex h-[50px] items-center gap-3 rounded-xl border px-4 transition-all duration-300 bg-black/20 focus-within:bg-black/40 ${confirmPassword && password !== confirmPassword ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 focus-within:border-purple-500/50'}`}>
                    <ShieldCheck className="h-4 w-4 text-gray-500 group-focus-within:text-purple-400" />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type your password"
                      className="h-full flex-1 bg-transparent text-sm text-white outline-none" 
                    />
                    <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-500 hover:text-white transition-colors">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <span className="ml-1 text-[11px] text-red-400 font-medium">Passwords do not match</span>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdatePassword}
                  disabled={!currentPassword || !password || password !== confirmPassword || strengthScore < 1}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-purple-900/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={async () => {
          try {
            const newStatus = profileData.status === 'active' ? 'inactive' : 'active';
            const response = await fetch('/api/student/profile', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: newStatus }),
            });
            
            if (response.ok) {
              setProfileData(prev => ({ ...prev, status: newStatus }));
              toast.success(`Account ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
              setShowDeactivateModal(false);
            } else {
              toast.error('Failed to update account status');
            }
          } catch (error) {
            console.error('Error updating status:', error);
            toast.error('An unexpected error occurred');
          }
        }}
        title={profileData.status === 'active' ? "Deactivate Account" : "Activate Account"}
        message={
          profileData.status === 'active' 
          ? "This action will temporarily disable your access to all EngageX clubs and events. You can reactivate it later. Are you sure you want to proceed?" 
          : "This will reactivate your account and restore access to EngageX features. Proceed?"
        }
        confirmText={profileData.status === 'active' ? "Deactivate My Account" : "Activate My Account"}
        type={profileData.status === 'active' ? "danger" : "info"}
      />
    </div>
  );
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/** Local persistence (mock API) */
const STORAGE_KEY = "gv.profile.v1";

const loadProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Empty defaults
  return {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    birthday: "",
    bio: "",
    location: "",
    website: "",
    marketingOptIn: false,
    avatarDataUrl: "",
  };
};

const saveProfile = (p) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
};

export default function Profile() {
  const initial = useMemo(loadProfile, []);
  const [profile, setProfile] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" }); // optional UX

  const fileRef = useRef(null);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setProfile(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const pickImage = () => fileRef.current?.click();

  const onImageSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMsg({ type: "error", text: "Please select an image file." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setProfile((p) => ({ ...p, avatarDataUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  /** Minimal validation: email format only if provided; passwords must match if provided */
  const validate = () => {
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) {
      return "Please enter a valid email address.";
    }
    if (pwd.next || pwd.confirm) {
      if (pwd.next.length < 8) return "New password must be at least 8 characters.";
      if (pwd.next !== pwd.confirm) return "New passwords do not match.";
    }
    return "";
  };

  const onSave = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setMsg({ type: "error", text: err });
      return;
    }
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 300)); // small UX delay
      saveProfile(profile);
      setMsg({ type: "ok", text: "Profile saved." });
      setEditing(false);
      setPwd({ current: "", next: "", confirm: "" });
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setProfile(loadProfile());
    setEditing(false);
    setPwd({ current: "", next: "", confirm: "" });
    setMsg({ type: "", text: "" });
  };

  return (
    <main className="max-w-4xl mx-auto px-5 py-8 text-gray-100">
      {/* Header bar (indigo like the Edit button) */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-indigo-600 px-4 py-3 text-white">
        <Link
          to="/"
          className="rounded-md bg-indigo-500/40 hover:bg-indigo-500/60 px-3 py-1.5 text-sm font-medium"
        >
          ← Back to Store
        </Link>
        <div className="text-lg font-semibold">Profile</div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="rounded-md bg-white/15 hover:bg-white/25 px-3 py-1.5 text-sm font-medium"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="rounded-md bg-white/15 hover:bg-white/25 px-3 py-1.5 text-sm font-medium"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="rounded-md bg-white text-indigo-700 hover:bg-gray-100 px-3 py-1.5 text-sm font-semibold disabled:opacity-60"
              type="submit"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {msg.text && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            msg.type === "error"
              ? "border-red-500/40 bg-red-500/10 text-red-200"
              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Card */}
      <section className="rounded-2xl bg-gray-800/70 p-6 shadow">
        {/* Avatar + username */}
        <div className="mb-6 flex items-center gap-5">
          <div className="relative">
            <img
              src={
                profile.avatarDataUrl ||
                "https://api.dicebear.com/9.x/thumbs/svg?seed=GameVaultUser"
              }
              alt="Avatar"
              className="h-24 w-24 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
            {editing && (
              <button
                onClick={pickImage}
                type="button"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-gray-900/90 px-3 py-1 text-xs ring-1 ring-white/20 hover:bg-gray-900"
              >
                Change
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageSelected}
            />
          </div>

          <div>
            <div className="text-xl font-semibold">
              @{profile.username || <span className="opacity-50">username</span>}
            </div>
            <div className="text-sm text-gray-400">
              {profile.email || <span className="opacity-50">email@example.com</span>}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSave}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="First name"
              name="firstName"
              value={profile.firstName}
              onChange={onChange}
              disabled={!editing}
              placeholder="First name"
            />
            <Field
              label="Last name"
              name="lastName"
              value={profile.lastName}
              onChange={onChange}
              disabled={!editing}
              placeholder="Last name"
            />
            <Field
              label="Username"
              name="username"
              value={profile.username}
              onChange={onChange}
              disabled={!editing}
              prefix="@"
              placeholder="yourhandle"
            />
            <Field
              label="Email address"
              name="email"
              type="email"
              value={profile.email}
              onChange={onChange}
              disabled={!editing}
              placeholder="you@example.com"
            />
            <Field
              label="Birthday"
              name="birthday"
              type="date"
              value={profile.birthday}
              onChange={onChange}
              disabled={!editing}
            />
            <Field
              label="Location"
              name="location"
              value={profile.location}
              onChange={onChange}
              disabled={!editing}
              placeholder="City, State"
            />

            <div className="md:col-span-2">
              <Label>Bio</Label>
              <textarea
                name="bio"
                rows={3}
                value={profile.bio}
                onChange={onChange}
                disabled={!editing}
                className="mt-1 w-full rounded-lg border border-white/10 bg-gray-900/60 p-3 outline-none ring-indigo-500/50 focus:ring-2 disabled:opacity-60"
                placeholder="Tell us about yourself…"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <input
              id="marketingOptIn"
              name="marketingOptIn"
              type="checkbox"
              checked={!!profile.marketingOptIn}
              onChange={onChange}
              disabled={!editing}
              className="h-4 w-4 cursor-pointer accent-indigo-600 disabled:opacity-60"
            />
            <label htmlFor="marketingOptIn" className="text-sm text-gray-300">
              Email me discounts and updates about new releases
            </label>
          </div>

          {/* Optional password inputs (client-side only; no explanatory note) */}
          <div className="mt-10 rounded-xl border border-white/10 p-5">
            <h2 className="mb-4 text-lg font-semibold">Security</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Current password"
                type="password"
                name="current"
                value={pwd.current}
                onChange={(e) => setPwd((x) => ({ ...x, current: e.target.value }))}
                disabled={!editing}
                autoComplete="current-password"
                placeholder="Current password"
              />
              <Field
                label="New password"
                type="password"
                name="next"
                value={pwd.next}
                onChange={(e) => setPwd((x) => ({ ...x, next: e.target.value }))}
                disabled={!editing}
                autoComplete="new-password"
                placeholder="New password"
              />
              <Field
                label="Confirm new password"
                type="password"
                name="confirm"
                value={pwd.confirm}
                onChange={(e) => setPwd((x) => ({ ...x, confirm: e.target.value }))}
                disabled={!editing}
                autoComplete="new-password"
                placeholder="Confirm password"
              />
            </div>
          </div>

          {editing && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg bg-gray-700 hover:bg-gray-600 px-4 py-2 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 font-medium disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}

/* ---------- small presentational helpers ---------- */
function Label({ children }) {
  return <label className="text-sm text-gray-300">{children}</label>;
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
  prefix = "",
  placeholder = "",
  autoComplete,
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1 flex items-stretch overflow-hidden rounded-lg border border-white/10 bg-gray-900/60 focus-within:ring-2 focus-within:ring-indigo-500/50">
        {prefix && (
          <span className="select-none px-3 py-2 text-gray-400 bg-gray-900/60 border-r border-white/10">
            {prefix}
          </span>
        )}
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className="w-full bg-transparent px-3 py-2 outline-none disabled:opacity-60"
        />
      </div>
    </div>
  );
}
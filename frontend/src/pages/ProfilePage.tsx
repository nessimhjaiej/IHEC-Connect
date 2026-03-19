import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/useAuth";
import { useUpdateProfile } from "../hooks/useProfile";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function ProfilePage() {
  const { data: user } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setBio(user.bio ?? "");
    }
  }, [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateProfile.mutateAsync({ full_name: fullName, bio });
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Your profile</h1>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <Input label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Bio</span>
          <textarea
            className="min-h-32 rounded-lg border border-slate-200 bg-white px-3 py-2"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />
        </label>
        <Button disabled={updateProfile.isPending} type="submit">
          {updateProfile.isPending ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
}

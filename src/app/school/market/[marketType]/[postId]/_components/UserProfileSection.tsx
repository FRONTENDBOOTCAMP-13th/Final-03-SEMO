"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/data/actions/file";

interface UserProfileSectionProps {
  user: {
    id?: number;
    name: string;
    image?: string;
  };
  location?: string;
}

export default function UserProfileSection({ user, location }: UserProfileSectionProps) {
  const router = useRouter();

  // 프로필 클릭 핸들러
  const handleProfileClick = () => {
    if (user?.id) {
      router.push(`/school/user/${user.id}`);
    }
  };

  return (
    <div className="flex items-center gap-3 my-2">
      <button onClick={handleProfileClick} className="flex-shrink-0">
        <Image
          src={getImageUrl(user.image)}
          alt={`${user.name} 프로필`}
          width={56}
          height={56}
          className="w-14 h-14 object-cover rounded-full"
        />
      </button>
      <div>
        <button onClick={handleProfileClick} className="text-left ">
          <p className="text-16 font-medium">{user.name}</p>
        </button>
        <p className="text-14 text-uni-gray-300">{location}</p>
      </div>
    </div>
  );
}

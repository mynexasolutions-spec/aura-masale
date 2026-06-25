import { getAnnouncement } from '@/actions/admin/announcements'

export async function AnnouncementBar() {
  const announcement = await getAnnouncement()

  if (!announcement || !announcement.is_active || !announcement.message) {
    return null
  }

  return (
    <div className="bg-primary text-white text-xs sm:text-sm font-medium py-2 px-4 text-center">
      <p>{announcement.message}</p>
    </div>
  )
}

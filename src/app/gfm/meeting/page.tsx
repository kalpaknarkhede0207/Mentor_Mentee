import { redirect } from 'next/navigation';

export default function MeetingRootPage() {
  redirect('/gfm/meeting/latest');
}

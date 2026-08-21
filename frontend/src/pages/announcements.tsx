import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Announcement = {
  id: number;
  title: string;
  description: string;
  category: 'Academic' | 'Examination' | 'Event' | 'General';
  priority: 'High' | 'Medium' | 'Low';
  date: string;
  publishedBy: string;
};

const announcements: Announcement[] = [
  {
    id: 1,
    title: 'End Semester Examination Schedule',
    description:
      'The end semester examination schedule for ECE Batch 2023 has been published. Students are requested to check the schedule and prepare accordingly.',
    category: 'Examination',
    priority: 'High',
    date: '20 May 2025',
    publishedBy: 'Academic Office',
  },
  {
    id: 2,
    title: 'Industrial Visit to BSNL Jaipur',
    description:
      'An industrial visit to BSNL Jaipur has been organized for ECE Batch 2023. Students interested in participating should complete their registration before the deadline.',
    category: 'Event',
    priority: 'Medium',
    date: '18 May 2025',
    publishedBy: 'ECE Department',
  },
  {
    id: 3,
    title: 'Project Submission Guidelines',
    description:
      'Students are required to submit their project reports according to the prescribed format. Make sure all required documents are included.',
    category: 'Academic',
    priority: 'High',
    date: '15 May 2025',
    publishedBy: 'Project Coordinator',
  },
  {
    id: 4,
    title: 'Mentorship Program Registration',
    description:
      'Registration for the student mentorship program is now open. Students can register through the department portal.',
    category: 'General',
    priority: 'Medium',
    date: '10 May 2025',
    publishedBy: 'Student Affairs',
  },
  {
    id: 5,
    title: 'Department Seminar on VLSI',
    description:
      'A technical seminar on VLSI design and current industry trends will be conducted for ECE students.',
    category: 'Event',
    priority: 'Low',
    date: '08 May 2025',
    publishedBy: 'ECE Department',
  },
];

function downloadAnnouncements(list: Announcement[]) {
  const headers = [
    'Title',
    'Description',
    'Category',
    'Priority',
    'Date',
    'Published By',
  ];

  const rows = list.map((announcement) => [
    announcement.title,
    announcement.description,
    announcement.category,
    announcement.priority,
    announcement.date,
    announcement.publishedBy,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(','),
    )
    .join('\n');

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'ece-batch-2023-announcements.csv';

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function Announcements() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const filteredAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return announcements.filter((announcement) => {
      const matchesSearch =
        !query ||
        announcement.title.toLowerCase().includes(query) ||
        announcement.description.toLowerCase().includes(query) ||
        announcement.publishedBy.toLowerCase().includes(query);

      const matchesCategory =
        category === 'All' || announcement.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800">

      {/* Header */}
      <header className="bg-white border-b border-gray-200">

        <div className="px-4 sm:px-6 lg:px-8 py-5">

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-4 transition"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>
              <p className="text-xs font-medium text-blue-600 mb-1">
                ECE BATCH 2023
              </p>

              <h1 className="text-2xl font-bold text-gray-900">
                Announcements
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Share important academic and departmental updates with students.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                downloadAnnouncements(filteredAnnouncements)
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              ↓ Download
            </button>

          </div>

        </div>

      </header>


      {/* Main */}
      <main className="p-4 sm:p-6 lg:p-8">

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500">
              Total Announcements
            </p>

            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {announcements.length}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Published updates
            </p>
          </div>


          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500">
              High Priority
            </p>

            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {
                announcements.filter(
                  (announcement) =>
                    announcement.priority === 'High',
                ).length
              }
            </p>

            <p className="text-xs text-red-500 mt-1">
              Requires attention
            </p>
          </div>


          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500">
              Latest Update
            </p>

            <p className="text-lg font-semibold text-gray-900 mt-2">
              20 May 2025
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Examination schedule
            </p>
          </div>

        </div>


        {/* Search + Filter */}
        <section className="bg-white border border-gray-200 rounded-xl mb-6">

          <div className="p-4 sm:p-5">

            <div className="flex flex-col md:flex-row gap-3">

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements..."
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">
                  All Categories
                </option>

                <option value="Academic">
                  Academic
                </option>

                <option value="Examination">
                  Examination
                </option>

                <option value="Event">
                  Event
                </option>

                <option value="General">
                  General
                </option>
              </select>

            </div>

          </div>

        </section>


        {/* Announcement List */}
        <section className="space-y-4">

          {filteredAnnouncements.map((announcement) => (

            <article
              key={announcement.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition"
            >

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                <div className="flex gap-4">

                  {/* Icon */}
                  <div
                    className={
                      announcement.category === 'Examination'
                        ? 'w-11 h-11 shrink-0 rounded-lg bg-red-50 text-red-500 flex items-center justify-center'
                        : announcement.category === 'Event'
                        ? 'w-11 h-11 shrink-0 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center'
                        : announcement.category === 'Academic'
                        ? 'w-11 h-11 shrink-0 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center'
                        : 'w-11 h-11 shrink-0 rounded-lg bg-green-50 text-green-500 flex items-center justify-center'
                    }
                  >
                    {announcement.category === 'Examination'
                      ? '!'
                      : announcement.category === 'Event'
                      ? '◆'
                      : announcement.category === 'Academic'
                      ? '▣'
                      : '●'}
                  </div>


                  {/* Content */}
                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="font-semibold text-gray-900">
                        {announcement.title}
                      </h2>

                      <span
                        className={
                          announcement.priority === 'High'
                            ? 'bg-red-50 text-red-600 px-2 py-1 rounded text-[10px]'
                            : announcement.priority === 'Medium'
                            ? 'bg-orange-50 text-orange-600 px-2 py-1 rounded text-[10px]'
                            : 'bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px]'
                        }
                      >
                        {announcement.priority}
                      </span>

                    </div>


                    <p className="text-sm text-gray-500 mt-2 leading-6">
                      {announcement.description}
                    </p>


                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-gray-400">

                      <span>
                        {announcement.category}
                      </span>

                      <span>
                        Published: {announcement.date}
                      </span>

                      <span>
                        By: {announcement.publishedBy}
                      </span>

                    </div>

                  </div>

                </div>


                {/* View Button */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedAnnouncement(announcement)
                  }
                  className="self-start rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  View
                </button>

              </div>

            </article>

          ))}


          {filteredAnnouncements.length === 0 && (

            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">

              <p className="font-medium text-gray-700">
                No announcements found.
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Try changing your search or category filter.
              </p>

            </div>

          )}

        </section>

      </main>


      {/* Announcement Modal */}
      {selectedAnnouncement && (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-200">

              <div>

                <p className="text-xs font-medium text-blue-600">
                  {selectedAnnouncement.category}
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-1">
                  {selectedAnnouncement.title}
                </h2>

              </div>


              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="text-gray-400 hover:text-gray-700 text-xl"
                aria-label="Close"
              >
                ×
              </button>

            </div>


            {/* Modal Content */}
            <div className="p-5">

              <div className="flex flex-wrap gap-2 mb-5">

                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs">
                  {selectedAnnouncement.date}
                </span>

                <span
                  className={
                    selectedAnnouncement.priority === 'High'
                      ? 'bg-red-50 text-red-600 px-3 py-1 rounded-md text-xs'
                      : selectedAnnouncement.priority === 'Medium'
                      ? 'bg-orange-50 text-orange-600 px-3 py-1 rounded-md text-xs'
                      : 'bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs'
                  }
                >
                  {selectedAnnouncement.priority} Priority
                </span>

              </div>


              <p className="text-sm text-gray-600 leading-7">
                {selectedAnnouncement.description}
              </p>


              <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 p-4">

                <p className="text-xs text-gray-400">
                  Published By
                </p>

                <p className="text-sm font-medium text-gray-800 mt-1">
                  {selectedAnnouncement.publishedBy}
                </p>

              </div>


              <div className="flex justify-end mt-6">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedAnnouncement(null)
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Announcements;
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
type Student = {
  _id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  cgpa: number;
  semester: number;
  attendance: number;
  status: 'Active' | 'At Risk';
  remarks: string;
};

function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

  useEffect(() => {

  const fetchStudents = async () => {

    try {

      const token = sessionStorage.getItem('token');

      if (!token) {
        window.location.href = '/';
        return;
      }

      const response = await fetch(
        'http://localhost:5000/api/students',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();

      setStudents(data.students || []);

    } catch (error) {

      console.error(error);

      setError(
        'Unable to load dashboard data.'
      );

    } finally {

      setLoading(false);

    }

  };

  fetchStudents();

}, []);
const totalStudents = students.length;

const averageCgpa =
  totalStudents > 0
    ? (
        students.reduce(
          (sum, student) =>
            sum + Number(student.cgpa || 0),
          0
        ) / totalStudents
      ).toFixed(2)
    : '0.00';

const averageAttendance =
  totalStudents > 0
    ? (
        students.reduce(
          (sum, student) =>
            sum + Number(student.attendance || 0),
          0
        ) / totalStudents
      ).toFixed(1)
    : '0.0';

const studentsAtRisk = students.filter(
  (student) => student.status === 'At Risk'
).length;
const cgpaDistribution = useMemo(() => {

  return {
    excellent: students.filter(
      (student) => student.cgpa >= 9
    ).length,

    good: students.filter(
      (student) =>
        student.cgpa >= 8 &&
        student.cgpa < 9
    ).length,

    average: students.filter(
      (student) =>
        student.cgpa >= 7 &&
        student.cgpa < 8
    ).length,

    belowAverage: students.filter(
      (student) =>
        student.cgpa >= 6 &&
        student.cgpa < 7
    ).length,

    poor: students.filter(
      (student) => student.cgpa < 6
    ).length,
  };

}, [students]);
const attendanceDistribution = useMemo(() => {

  return {
    excellent: students.filter(
      (student) => student.attendance >= 90
    ).length,

    good: students.filter(
      (student) =>
        student.attendance >= 75 &&
        student.attendance < 90
    ).length,

    low: students.filter(
      (student) => student.attendance < 75
    ).length,
  };

}, [students]);
const recentStudents = useMemo(() => {

  return [...students]
    .slice(-5)
    .reverse();

}, [students]);
  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 flex">

      {/* ================= SIDEBAR ================= */}
      <aside className="hidden lg:flex w-56 bg-[#0d1b2f] text-white flex-col">

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
          <div className="text-2xl">🎓</div>

          <div className="leading-tight">
            <h1 className="font-semibold text-sm">
              Student Management
            </h1>
            <p className="font-semibold text-sm">
              System
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 text-sm">

          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-blue-600"
          >
            <span>⌂</span>
            Dashboard
          </a>

         <Link
  to="/students"
  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/10"
>
  <span>♙</span>
  Students
</Link>


        <Link
  to="/announcements"
  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/10"
>
  <span>▣</span>
  Announcements
</Link>

        <Link
  to="/reports"
  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/10"
>
  <span>▥</span>
  Reports
</Link>

        <Link
  to="/settings"
  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/10"
>
  <span>⚙</span>
  Settings
</Link>

        </nav>

        {/* Batch Card */}
        <div className="mt-auto p-3">

          <div className="bg-[#162944] border border-white/10 rounded-lg p-4">

            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center mb-3">
              🎓
            </div>

            <p className="font-semibold text-sm">
              ECE Batch 2023
            </p>

            <p className="text-xs text-gray-300 mt-1">
              Department of ECE
            </p>

            <p className="text-xs text-gray-300 mt-1">
              Malaviya National Institute
            </p>

            <p className="text-xs text-gray-300">
              of Technology Jaipur
            </p>

          </div>

        </div>

      </aside>


      {/* ================= MAIN AREA ================= */}
      <main className="flex-1 min-w-0">

        {/* ================= TOP BAR ================= */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">

          <div className="flex items-center gap-4">

            <button className="text-xl text-gray-600">
              ☰
            </button>

          </div>

          <div className="flex items-center gap-4">

            {/* Search */}
            <div className="hidden sm:flex items-center border border-gray-200 rounded-md px-3 py-2 w-48">

              <span className="text-gray-400 mr-2">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search students..."
                className="outline-none text-xs w-full"
              />

            </div>

            {/* Notification */}
            <div className="relative">
              <span className="text-lg">
                ♧
              </span>

              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                NV
              </div>

              <div className="hidden sm:block leading-tight">
                <p className="text-xs font-medium">
                  Naitik Vadher
                </p>

                <p className="text-[10px] text-gray-400">
                  Admin
                </p>
              </div>

              <span className="text-gray-400">
               ⌄
              </span>

            </div>

          </div>

        </header>


        {/* ================= CONTENT ================= */}
        <div className="p-4 sm:p-6 lg:p-8">

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Welcome back, Naitik 👋
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Here's what's happening with ECE Batch 2023 today.
              </p>
            </div>

            <button className="border border-gray-200 bg-white rounded-md px-4 py-2 text-xs text-gray-600">
              ECE Batch 2023
              <span className="ml-8">⌄</span>
            </button>

          </div>


          {/* ================= STAT CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

            {/* Students */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-xs text-gray-500">
                    Total Students
                  </p>

                 <h3 className="text-2xl font-semibold mt-2">
  {totalStudents}
</h3>

                  <p className="text-[10px] text-gray-400 mt-1">
                    ECE Batch 2023
                  </p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  👥
                </div>

              </div>

            </div>


            {/* Attendance */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-xs text-gray-500">
  Average Attendance
</p>

<h3 className="text-2xl font-semibold mt-2">
  {averageAttendance}%
</h3>

<p className="text-[10px] text-gray-400 mt-1">
  Current batch average
</p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                  ▣
                </div>

              </div>

            </div>


            {/* CGPA */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-xs text-gray-500">
                    Average CGPA
                  </p>

                <h3 className="text-2xl font-semibold mt-2">
  {averageCgpa}
</h3>

                  
                </div>

                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  ↗
                </div>

              </div>

            </div>


            {/* Backlogs */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-xs text-gray-500">
  Students At Risk
</p>

<h3 className="text-2xl font-semibold mt-2">
  {studentsAtRisk}
</h3>

<p className="text-[10px] text-red-500 mt-1">
  Needs attention
</p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                  !
                </div>

              </div>

            </div>

          </div>


          {/* ================= CHART SECTION ================= */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">

            {/* CGPA Distribution */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">

              <h3 className="font-semibold text-sm mb-5">
                CGPA Distribution
              </h3>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">

                {/* Donut */}
                <div className="relative w-36 h-36">

                  <div
                    className="w-full h-full rounded-full"
                    style={{
  background:
    totalStudents === 0
      ? '#e5e7eb'
      : `conic-gradient(
          #3b82f6 0deg ${
            (cgpaDistribution.excellent /
              totalStudents) * 360
          }deg,

          #4ade80 ${
            (cgpaDistribution.excellent /
              totalStudents) * 360
          }deg ${
            ((cgpaDistribution.excellent +
              cgpaDistribution.good) /
              totalStudents) * 360
          }deg,

          #facc15 ${
            ((cgpaDistribution.excellent +
              cgpaDistribution.good) /
              totalStudents) * 360
          }deg ${
            ((cgpaDistribution.excellent +
              cgpaDistribution.good +
              cgpaDistribution.average) /
              totalStudents) * 360
          }deg,

          #fb923c ${
            ((cgpaDistribution.excellent +
              cgpaDistribution.good +
              cgpaDistribution.average) /
              totalStudents) * 360
          }deg ${
            ((cgpaDistribution.excellent +
              cgpaDistribution.good +
              cgpaDistribution.average +
              cgpaDistribution.belowAverage) /
              totalStudents) * 360
          }deg,

          #f87171 ${
            ((cgpaDistribution.excellent +
              cgpaDistribution.good +
              cgpaDistribution.average +
              cgpaDistribution.belowAverage) /
              totalStudents) * 360
          }deg 360deg
        )`,
}}
                  />

                  <div className="absolute inset-7 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-500">
                      {totalStudents}
                    </span>
                  </div>

                </div>


                {/* Legend */}
                <div className="space-y-3 text-xs">

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                   9.0 – 10.0 ({cgpaDistribution.excellent})
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    8.0 – 8.9 ({cgpaDistribution.good})
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                   7.0 – 7.9 ({cgpaDistribution.average})
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                    6.0 – 6.9 ({cgpaDistribution.belowAverage})
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                   Below 6.0 ({cgpaDistribution.poor})
                  </div>

                </div>

              </div>

              <p className="text-[10px] text-gray-400 mt-4">
                Total: {totalStudents} Students
              </p>

            </div>

          </div>


          {/* ================= BOTTOM SECTION ================= */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

            {/* Recent Students */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

              <div className="flex justify-between items-center p-4 border-b">

                <h3 className="font-semibold text-sm">
                  Recent Students
                </h3>

                <a
                  href="#"
                  className="text-[10px] text-blue-600"
                >
                  View All
                </a>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full text-xs">

                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">
                        Name
                      </th>

                      <th className="text-left px-4 py-3 font-medium">
                        Roll Number
                      </th>

                      <th className="text-left px-4 py-3 font-medium">
                        CGPA
                      </th>

                      <th className="text-left px-4 py-3 font-medium">
                        Attendance
                      </th>

                      <th className="text-left px-4 py-3 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                   {recentStudents.map((student) => (

  <tr
    key={student._id}
    className="border-t border-gray-100"
  >

    <td className="px-4 py-3 whitespace-nowrap">
      {student.name}
    </td>

    <td className="px-4 py-3 text-gray-500">
      {student.rollNumber}
    </td>

    <td className="px-4 py-3">
      {student.cgpa}
    </td>

    <td className="px-4 py-3">
      {student.attendance}%
    </td>

    <td className="px-4 py-3">

      <span
        className={
          student.status === 'Active'
            ? 'bg-green-50 text-green-600 px-2 py-1 rounded text-[9px]'
            : 'bg-orange-50 text-orange-600 px-2 py-1 rounded text-[9px]'
        }
      >
        {student.status}
      </span>

    </td>

  </tr>

))}
{recentStudents.length === 0 && (

  <tr>

    <td
      colSpan={5}
      className="
        text-center
        py-8
        text-gray-400
      "
    >
      No students available.
    </td>

  </tr>

)}

                  </tbody>

                </table>

              </div>

            </div>


            {/* Recent Announcements */}
            <div className="bg-white border border-gray-200 rounded-lg">

              <div className="flex justify-between items-center p-4 border-b">

                <h3 className="font-semibold text-sm">
                  Recent Announcements
                </h3>

                <a
                  href="#"
                  className="text-[10px] text-blue-600"
                >
                  View All
                </a>

              </div>

              <div className="divide-y">

                <div className="p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                    ▣
                  </div>

                  <div>
                    <p className="text-xs font-medium">
                      End Semester Examination Schedule
                    </p>

                    <p className="text-[9px] text-gray-400 mt-1">
                      Published on May 20, 2025
                    </p>
                  </div>
                </div>


                <div className="p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 text-green-500 flex items-center justify-center">
                    ▣
                  </div>

                  <div>
                    <p className="text-xs font-medium">
                      Industrial Visit to BSNL Jaipur
                    </p>

                    <p className="text-[9px] text-gray-400 mt-1">
                      Published on May 18, 2025
                    </p>
                  </div>
                </div>


                <div className="p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center">
                    ▤
                  </div>

                  <div>
                    <p className="text-xs font-medium">
                      Project Submission Guidelines
                    </p>

                    <p className="text-[9px] text-gray-400 mt-1">
                      Published on May 15, 2025
                    </p>
                  </div>
                </div>


                <div className="p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                    👥
                  </div>

                  <div>
                    <p className="text-xs font-medium">
                      Mentorship Program Registration
                    </p>

                    <p className="text-[9px] text-gray-400 mt-1">
                      Published on May 10, 2025
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;
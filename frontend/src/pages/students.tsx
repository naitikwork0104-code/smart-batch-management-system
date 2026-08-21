import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  link.remove();

  URL.revokeObjectURL(url);
}

function escapeCsv(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function downloadStudent(student: Student) {
  const rows = [
    ['Student Information'],
    ['Name', student.name],
    ['Roll Number', student.rollNumber],
    ['Email', student.email],
    ['Phone', student.phone],
    ['CGPA', student.cgpa],
    ['Semester', student.semester],
    ['Overall Attendance', `${student.attendance}%`],
    ['Status', student.status],
    ['Remarks', student.remarks],
  ];

  const csv = rows
    .map((row) =>
      row
        .map((cell) => escapeCsv(cell ?? ''))
        .join(',')
    )
    .join('\n');

  downloadFile(
    `${student.rollNumber}-${student.name.replace(/\s+/g, '-')}.csv`,
    csv
  );
}

function downloadAllStudents(list: Student[]) {
  const rows = [
    [
      'Name',
      'Roll Number',
      'Email',
      'Phone',
      'CGPA',
      'Semester',
      'Overall Attendance',
      'Status',
      'Remarks',
    ],

    ...list.map((student) => [
      student.name,
      student.rollNumber,
      student.email,
      student.phone,
      student.cgpa,
      student.semester,
      `${student.attendance}%`,
      student.status,
      student.remarks,
    ]),
  ];

  const csv = rows
    .map((row) =>
      row
        .map((cell) => escapeCsv(cell))
        .join(',')
    )
    .join('\n');

  downloadFile(
    'ece-batch-2023-students.csv',
    csv
  );
}

function Students() {

  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);

  const [search, setSearch] = useState('');

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

const [formData, setFormData] = useState({
  name: '',
  rollNumber: '',
  email: '',
  phone: '',
  cgpa: '',
  semester: '',
  attendance: '',
  status: 'Active',
  remarks: '',
});

const [saving, setSaving] = useState(false);
const handleAddStudent = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  try {
    setSaving(true);

    const token = sessionStorage.getItem('token');

    const response = await fetch(
      'http://localhost:5000/api/students',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          ...formData,
          cgpa: Number(formData.cgpa),
          semester: Number(formData.semester),
          attendance: Number(formData.attendance),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to create student'
      );
    }

    // Add newly created student to the table
    setStudents((prev) => [
      ...prev,
      data.student,
    ]);

    // Close form
    setShowAddForm(false);

    // Reset form
    setFormData({
      name: '',
      rollNumber: '',
      email: '',
      phone: '',
      cgpa: '',
      semester: '',
      attendance: '',
      status: 'Active',
      remarks: '',
    });

  } catch (error) {

    console.error(
      'Failed to add student:',
      error
    );

    setError(
      error instanceof Error
        ? error.message
        : 'Failed to add student'
    );

  } finally {

    setSaving(false);

  }
};

  // Fetch students from backend
  useEffect(() => {

    const fetchStudents = async () => {

      try {

        const token = sessionStorage.getItem('token');

        if (!token) {
          navigate('/');
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

        const data = await response.json();

        if (!response.ok) {

          if (response.status === 401) {
            sessionStorage.removeItem('token');
            navigate('/');
            return;
          }

          throw new Error(
            data.message || 'Failed to fetch students'
          );
        }

        setStudents(data.students || []);

      } catch (error) {

        console.error(
          'Failed to fetch students:',
          error
        );

        setError(
          'Unable to load student data.'
        );

      } finally {

        setLoading(false);

      }
    };

    fetchStudents();

  }, [navigate]);


  // Search
  const filteredStudents = useMemo(() => {

    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter(
      (student) =>
        student.name
          .toLowerCase()
          .includes(query) ||

        student.rollNumber
          .toLowerCase()
          .includes(query) ||

        student.email
          .toLowerCase()
          .includes(query)
    );

  }, [search, students]);


  // Statistics
  const averageCgpa =
    students.length > 0
      ? (
          students.reduce(
            (sum, student) =>
              sum + student.cgpa,
            0
          ) / students.length
        ).toFixed(2)
      : '0.00';


  const averageAttendance =
    students.length > 0
      ? (
          students.reduce(
            (sum, student) =>
              sum + student.attendance,
            0
          ) / students.length
        ).toFixed(1)
      : '0.0';


  const studentsAtRisk =
    students.filter(
      (student) =>
        student.status === 'At Risk'
    ).length;


  return (

    <div className="min-h-screen bg-[#f8fafc] text-gray-800">

      {/* Header */}

      <header className="bg-white border-b border-gray-200">

        <div className="px-4 sm:px-6 lg:px-8 py-5">

          {/* Back */}

          <button
            type="button"
            onClick={() =>
              navigate('/dashboard')
            }
            className="
              flex
              items-center
              gap-2
              text-sm
              text-gray-500
              hover:text-blue-600
              mb-4
              transition
            "
          >
            ← Back to Dashboard
          </button>


          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-4
            "
          >

            <div>

              <p className="text-xs font-medium text-blue-600 mb-1">
                ECE BATCH 2023
              </p>

              <h1 className="text-2xl font-bold text-gray-900">
                Students
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage student profiles, academic performance and attendance.
              </p>

            </div>


            {/* Download All */}
<div className="flex gap-3">

  <button
    type="button"
    onClick={() => setShowAddForm(true)}
    className="
      rounded-lg
      bg-blue-600
      px-4
      py-2.5
      text-sm
      font-medium
      text-white
      hover:bg-blue-700
      transition
    "
  >
    + Add Student
  </button>

  <button
    type="button"
    onClick={() => downloadAllStudents(students)}
    disabled={students.length === 0}
    className="
      rounded-lg
      bg-gray-800
      px-4
      py-2.5
      text-sm
      font-medium
      text-white
      hover:bg-gray-900
      disabled:bg-gray-300
      disabled:cursor-not-allowed
      transition
    "
  >
    Download All
  </button>

</div>

          </div>

        </div>

      </header>


      {/* Main */}

      <main className="p-4 sm:p-6 lg:p-8">


        {/* Error */}

        {error && (

          <div
            className="
              mb-6
              rounded-lg
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
            "
          >
            {error}
          </div>

        )}


        {/* Summary */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-4
            mb-6
          "
        >

          {/* Total */}

          <div className="bg-white border border-gray-200 rounded-xl p-5">

            <p className="text-xs text-gray-500">
              Total Students
            </p>

            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {students.length}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              ECE Batch 2023
            </p>

          </div>


          {/* CGPA */}

          <div className="bg-white border border-gray-200 rounded-xl p-5">

            <p className="text-xs text-gray-500">
              Average CGPA
            </p>

            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {averageCgpa}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Current batch average
            </p>

          </div>


          {/* Attendance */}

          <div className="bg-white border border-gray-200 rounded-xl p-5">

            <p className="text-xs text-gray-500">
              Average Attendance
            </p>

            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {averageAttendance}%
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Current batch average
            </p>

          </div>


          {/* At Risk */}

          <div className="bg-white border border-gray-200 rounded-xl p-5">

            <p className="text-xs text-gray-500">
              Students At Risk
            </p>

            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {studentsAtRisk}
            </p>

            <p className="text-xs text-red-500 mt-1">
              Needs attention
            </p>

          </div>

        </div>


        {/* Student Table */}

        <section
          className="
            bg-white
            border
            border-gray-200
            rounded-xl
            overflow-hidden
          "
        >

          {/* Search */}

          <div
            className="
              p-4
              sm:p-5
              border-b
              border-gray-200
            "
          >

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-3
              "
            >

              <div>

                <h2 className="font-semibold text-gray-900">
                  Student Records
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {filteredStudents.length} students shown
                </p>

              </div>


              <div className="relative w-full sm:w-72">

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search name, roll number..."
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    py-2.5
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

              </div>

            </div>

          </div>


          {/* Loading */}

          {loading && (

            <div className="py-16 text-center">

              <p className="text-sm text-gray-500">
                Loading students...
              </p>

            </div>

          )}


          {/* Table */}

          {!loading && (

            <div className="overflow-x-auto">

              <table
                className="
                  w-full
                  min-w-[900px]
                  text-sm
                "
              >

                <thead
                  className="
                    bg-gray-50
                    text-gray-500
                  "
                >

                  <tr>

                    <th className="text-left px-5 py-3 font-medium">
                      Student
                    </th>

                    <th className="text-left px-5 py-3 font-medium">
                      Contact
                    </th>

                    <th className="text-left px-5 py-3 font-medium">
                      CGPA
                    </th>

                    <th className="text-left px-5 py-3 font-medium">
                      Attendance
                    </th>

                    <th className="text-left px-5 py-3 font-medium">
                      Status
                    </th>

                    <th className="text-right px-5 py-3 font-medium">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredStudents.map(
                    (student) => (

                      <tr
                        key={student._id}
                        className="
                          border-t
                          border-gray-100
                          hover:bg-gray-50
                          transition
                        "
                      >

                        {/* Student */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div
                              className="
                                w-9
                                h-9
                                rounded-full
                                bg-blue-50
                                text-blue-600
                                flex
                                items-center
                                justify-center
                                text-xs
                                font-semibold
                              "
                            >
                              {student.name
                                .split(' ')
                                .map(
                                  (part) =>
                                    part[0]
                                )
                                .join('')
                                .slice(0, 2)}
                            </div>


                            <div>

                              <p className="font-medium text-gray-900">
                                {student.name}
                              </p>

                              <p className="text-xs text-gray-500">
                                {student.rollNumber}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* Contact */}

                        <td className="px-5 py-4">

                          <p className="text-gray-700">
                            {student.email}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {student.phone}
                          </p>

                        </td>


                        {/* CGPA */}

                        <td className="px-5 py-4 font-medium">

                          {student.cgpa}

                        </td>


                        {/* Attendance */}

                        <td className="px-5 py-4">

                          <span
                            className={
                              student.attendance >= 75
                                ? 'text-green-600 font-medium'
                                : 'text-red-500 font-medium'
                            }
                          >
                            {student.attendance}%
                          </span>

                        </td>


                        {/* Status */}

                        <td className="px-5 py-4">

                          <span
                            className={
                              student.status === 'Active'
                                ? 'bg-green-50 text-green-600 px-2.5 py-1 rounded-md text-xs'
                                : 'bg-orange-50 text-orange-600 px-2.5 py-1 rounded-md text-xs'
                            }
                          >
                            {student.status}
                          </span>

                        </td>


                        {/* Actions */}

                        <td className="px-5 py-4 text-right">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedStudent(
                                  student
                                )
                              }
                              className="
                                rounded-md
                                border
                                border-gray-200
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                text-gray-700
                                hover:bg-gray-50
                              "
                            >
                              View
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                downloadStudent(
                                  student
                                )
                              }
                              className="
                                rounded-md
                                border
                                border-blue-100
                                bg-blue-50
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                text-blue-600
                                hover:bg-blue-100
                              "
                            >
                              Download
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}


                  {/* No students */}

                  {filteredStudents.length === 0 && (

                    <tr>

                      <td
                        colSpan={6}
                        className="
                          px-5
                          py-12
                          text-center
                          text-sm
                          text-gray-500
                        "
                      >
                        No students found.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>


      {/* Student Detail Modal */}

      {showAddForm && (

  <div className="
    fixed
    inset-0
    z-50
    bg-black/40
    flex
    items-center
    justify-center
    p-4
  ">

    <div className="
      w-full
      max-w-2xl
      max-h-[90vh]
      overflow-y-auto
      rounded-2xl
      bg-white
      shadow-xl
    ">

      {/* Header */}

      <div className="
        flex
        items-center
        justify-between
        p-5
        border-b
        border-gray-200
      ">

        <div>

          <h2 className="text-xl font-bold text-gray-900">
            Add Student
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Add a new student to ECE Batch 2023.
          </p>

        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(false)}
          className="
            text-gray-400
            hover:text-gray-700
            text-xl
          "
        >
          ×
        </button>

      </div>


      {/* Form */}

      <form
        onSubmit={handleAddStudent}
        className="p-5 space-y-5"
      >

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-4
        ">

          {/* Name */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              Full Name
            </label>

            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="Enter student name"
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2.5
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>


          {/* Roll Number */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              Roll Number
            </label>

            <input
              type="text"
              required
              value={formData.rollNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rollNumber: e.target.value,
                })
              }
              placeholder="23ECE002"
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2.5
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>


          {/* Email */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              Email
            </label>

            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              placeholder="student@example.com"
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2.5
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>


          {/* Phone */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              Phone
            </label>

            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              placeholder="9876543210"
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2.5
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>


          {/* CGPA */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              CGPA
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              required
              value={formData.cgpa}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cgpa: e.target.value,
                })
              }
              placeholder="8.50"
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2.5
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>


          {/* Semester */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              Semester
            </label>

            <input
              type="number"
              min="1"
              max="8"
              required
              value={formData.semester}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  semester: e.target.value,
                })
              }
              placeholder="6"
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2.5
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>


          {/* Attendance */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              Attendance %
            </label>

            <input
              type="number"
              min="0"
              max="100"
              required
              value={formData.attendance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  attendance: e.target.value,
                })
              }
              placeholder="85"
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2.5
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>


          {/* Status */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            ">
              Status
            </label>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value,
                })
              }
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2.5
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            >

              <option value="Active">
                Active
              </option>

              <option value="At Risk">
                At Risk
              </option>

            </select>

          </div>

        </div>


        {/* Remarks */}

        <div>

          <label className="
            block
            text-sm
            font-medium
            text-gray-700
            mb-2
          ">
            Remarks
          </label>

          <textarea
            rows={3}
            value={formData.remarks}
            onChange={(e) =>
              setFormData({
                ...formData,
                remarks: e.target.value,
              })
            }
            placeholder="Add remarks..."
            className="
              w-full
              border
              border-gray-300
              rounded-lg
              px-3
              py-2.5
              outline-none
              resize-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />

        </div>


        {/* Buttons */}

        <div className="
          flex
          justify-end
          gap-3
          pt-2
        ">

          <button
            type="button"
            onClick={() =>
              setShowAddForm(false)
            }
            className="
              rounded-lg
              border
              border-gray-300
              px-4
              py-2.5
              text-sm
              font-medium
              text-gray-700
              hover:bg-gray-50
            "
          >
            Cancel
          </button>


          <button
            type="submit"
            disabled={saving}
            className="
              rounded-lg
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              hover:bg-blue-700
              disabled:bg-blue-300
              disabled:cursor-not-allowed
            "
          >
            {saving
              ? 'Saving...'
              : 'Add Student'}
          </button>

        </div>

      </form>

    </div>

  </div>


      )}

    </div>
  );
}

export default Students;
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


/* ================= DOWNLOAD REPORT ================= */

function downloadReport(students: Student[]) {

  const headers = [
    'Name',
    'Roll Number',
    'CGPA',
    'Attendance',
    'Semester',
    'Status',
    'Remarks',
  ];

  const rows = students.map((student) => [
    student.name,
    student.rollNumber,
    student.cgpa,
    `${student.attendance}%`,
    student.semester,
    student.status,
    student.remarks || '',
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map(
          (value) =>
            `"${String(value).replace(/"/g, '""')}"`
        )
        .join(',')
    )
    .join('\n');

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download =
    'ece-batch-2023-academic-report.csv';

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);
}


/* ================= REPORT ================= */

function Report() {

  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  const [students, setStudents] =
    useState<Student[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');


  /* ================= FETCH STUDENTS ================= */

  useEffect(() => {

    const fetchStudents = async () => {

      try {

        const token =
          sessionStorage.getItem('token');

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


        if (!response.ok) {

          throw new Error(
            `Failed to fetch students: ${response.status}`
          );

        }


        const data =
          await response.json();


        setStudents(
          data.students || []
        );

      } catch (error) {

        console.error(
          'Failed to fetch students:',
          error
        );

        setError(
          'Unable to load student reports.'
        );

      } finally {

        setLoading(false);

      }

    };


    fetchStudents();

  }, [navigate]);


  /* ================= SEARCH ================= */

  const filteredStudents = useMemo(() => {

    const query =
      search.trim().toLowerCase();


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
          .includes(query)
    );

  }, [search, students]);


  /* ================= STATISTICS ================= */

  const totalStudents =
    students.length;


  const averageCgpa =
    totalStudents > 0
      ? (
          students.reduce(
            (sum, student) =>
              sum +
              Number(student.cgpa || 0),
            0
          ) / totalStudents
        ).toFixed(2)
      : '0.00';


  const averageAttendance =
    totalStudents > 0
      ? (
          students.reduce(
            (sum, student) =>
              sum +
              Number(
                student.attendance || 0
              ),
            0
          ) / totalStudents
        ).toFixed(1)
      : '0.0';


  const studentsAtRisk =
    students.filter(
      (student) =>
        student.status === 'At Risk'
    ).length;


  /*
   * Since we don't have subject marks
   * in MongoDB yet, pass percentage is
   * calculated using CGPA >= 6.
   */

  const passPercentage =
    totalStudents > 0
      ? (
          (students.filter(
            (student) =>
              Number(student.cgpa) >= 6
          ).length /
            totalStudents) *
          100
        ).toFixed(1)
      : '0.0';


  /* ================= CGPA DISTRIBUTION ================= */

  const cgpaDistribution = useMemo(() => {

    return {

      excellent: students.filter(
        (student) =>
          student.cgpa >= 9
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
        (student) =>
          student.cgpa < 6
      ).length,

    };

  }, [students]);


  /* ================= ATTENDANCE ================= */

  const attendanceDistribution =
    useMemo(() => {

      return {

        excellent: students.filter(
          (student) =>
            student.attendance >= 90
        ).length,

        good: students.filter(
          (student) =>
            student.attendance >= 75 &&
            student.attendance < 90
        ).length,

        low: students.filter(
          (student) =>
            student.attendance < 75
        ).length,

      };

    }, [students]);


  return (

    <div className="
      min-h-screen
      bg-[#f8fafc]
      text-gray-800
    ">


      {/* ================= HEADER ================= */}

      <header className="
        bg-white
        border-b
        border-gray-200
      ">

        <div className="
          px-4
          sm:px-6
          lg:px-8
          py-5
        ">


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


          <div className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-4
          ">


            <div>

              <p className="
                text-xs
                font-medium
                text-blue-600
                mb-1
              ">
                ECE BATCH 2023
              </p>


              <h1 className="
                text-2xl
                font-bold
                text-gray-900
              ">
                Academic Reports
              </h1>


              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                Monitor academic performance,
                attendance and student progress.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                downloadReport(
                  filteredStudents
                )
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
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
              ↓ Download Report
            </button>


          </div>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="
        p-4
        sm:p-6
        lg:p-8
      ">


        {/* ================= STATUS ================= */}

        {loading && (

          <div className="
            mb-6
            rounded-lg
            bg-blue-50
            border
            border-blue-100
            px-4
            py-3
            text-sm
            text-blue-600
          ">
            Loading student reports...
          </div>

        )}


        {error && (

          <div className="
            mb-6
            rounded-lg
            bg-red-50
            border
            border-red-100
            px-4
            py-3
            text-sm
            text-red-600
          ">
            {error}
          </div>

        )}


        {/* ================= OVERVIEW ================= */}

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
          mb-6
        ">


          {/* Average CGPA */}

          <div className="
            bg-white
            border
            border-gray-200
            rounded-xl
            p-5
          ">

            <p className="
              text-xs
              text-gray-500
            ">
              Average CGPA
            </p>


            <p className="
              text-2xl
              font-semibold
              text-gray-900
              mt-2
            ">
              {averageCgpa}
            </p>


            <p className="
              text-xs
              text-gray-500
              mt-1
            ">
              Current batch average
            </p>

          </div>


          {/* Average Attendance */}

          <div className="
            bg-white
            border
            border-gray-200
            rounded-xl
            p-5
          ">

            <p className="
              text-xs
              text-gray-500
            ">
              Average Attendance
            </p>


            <p className="
              text-2xl
              font-semibold
              text-gray-900
              mt-2
            ">
              {averageAttendance}%
            </p>


            <p className="
              text-xs
              text-gray-500
              mt-1
            ">
              Current batch average
            </p>

          </div>


          {/* Pass Percentage */}

          <div className="
            bg-white
            border
            border-gray-200
            rounded-xl
            p-5
          ">

            <p className="
              text-xs
              text-gray-500
            ">
              Pass Percentage
            </p>


            <p className="
              text-2xl
              font-semibold
              text-gray-900
              mt-2
            ">
              {passPercentage}%
            </p>


            <p className="
              text-xs
              text-gray-500
              mt-1
            ">
              Based on CGPA ≥ 6
            </p>

          </div>


          {/* At Risk */}

          <div className="
            bg-white
            border
            border-gray-200
            rounded-xl
            p-5
          ">

            <p className="
              text-xs
              text-gray-500
            ">
              Students At Risk
            </p>


            <p className="
              text-2xl
              font-semibold
              text-gray-900
              mt-2
            ">
              {studentsAtRisk}
            </p>


            <p className="
              text-xs
              text-red-500
              mt-1
            ">
              Academic intervention required
            </p>

          </div>


        </div>


        {/* ================= PERFORMANCE ================= */}

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-5
          mb-6
        ">


          {/* CGPA DISTRIBUTION */}

          <section className="
            bg-white
            border
            border-gray-200
            rounded-xl
            p-5
          ">

            <h2 className="
              font-semibold
              text-gray-900
            ">
              CGPA Distribution
            </h2>


            <p className="
              text-xs
              text-gray-500
              mt-1
            ">
              Student performance across CGPA ranges
            </p>


            <div className="
              mt-6
              space-y-4
            ">


              {/* 9 - 10 */}

              <div>

                <div className="
                  flex
                  justify-between
                  text-xs
                  mb-1
                ">

                  <span className="
                    text-gray-600
                  ">
                    9.0 – 10.0
                  </span>

                  <span className="
                    font-medium
                    text-gray-800
                  ">
                    {cgpaDistribution.excellent}
                  </span>

                </div>


                <div className="
                  h-2
                  bg-gray-100
                  rounded-full
                  overflow-hidden
                ">

                  <div
                    className="
                      h-full
                      bg-blue-500
                      rounded-full
                    "
                    style={{
                      width:
                        totalStudents > 0
                          ? `${
                              (cgpaDistribution.excellent /
                                totalStudents) *
                              100
                            }%`
                          : '0%',
                    }}
                  />

                </div>

              </div>


              {/* 8 - 8.9 */}

              <div>

                <div className="
                  flex
                  justify-between
                  text-xs
                  mb-1
                ">

                  <span className="
                    text-gray-600
                  ">
                    8.0 – 8.9
                  </span>

                  <span className="
                    font-medium
                    text-gray-800
                  ">
                    {cgpaDistribution.good}
                  </span>

                </div>


                <div className="
                  h-2
                  bg-gray-100
                  rounded-full
                  overflow-hidden
                ">

                  <div
                    className="
                      h-full
                      bg-green-400
                      rounded-full
                    "
                    style={{
                      width:
                        totalStudents > 0
                          ? `${
                              (cgpaDistribution.good /
                                totalStudents) *
                              100
                            }%`
                          : '0%',
                    }}
                  />

                </div>

              </div>


              {/* 7 - 7.9 */}

              <div>

                <div className="
                  flex
                  justify-between
                  text-xs
                  mb-1
                ">

                  <span className="
                    text-gray-600
                  ">
                    7.0 – 7.9
                  </span>

                  <span className="
                    font-medium
                    text-gray-800
                  ">
                    {cgpaDistribution.average}
                  </span>

                </div>


                <div className="
                  h-2
                  bg-gray-100
                  rounded-full
                  overflow-hidden
                ">

                  <div
                    className="
                      h-full
                      bg-yellow-400
                      rounded-full
                    "
                    style={{
                      width:
                        totalStudents > 0
                          ? `${
                              (cgpaDistribution.average /
                                totalStudents) *
                              100
                            }%`
                          : '0%',
                    }}
                  />

                </div>

              </div>


              {/* 6 - 6.9 */}

              <div>

                <div className="
                  flex
                  justify-between
                  text-xs
                  mb-1
                ">

                  <span className="
                    text-gray-600
                  ">
                    6.0 – 6.9
                  </span>

                  <span className="
                    font-medium
                    text-gray-800
                  ">
                    {cgpaDistribution.belowAverage}
                  </span>

                </div>


                <div className="
                  h-2
                  bg-gray-100
                  rounded-full
                  overflow-hidden
                ">

                  <div
                    className="
                      h-full
                      bg-orange-400
                      rounded-full
                    "
                    style={{
                      width:
                        totalStudents > 0
                          ? `${
                              (cgpaDistribution.belowAverage /
                                totalStudents) *
                              100
                            }%`
                          : '0%',
                    }}
                  />

                </div>

              </div>


              {/* Below 6 */}

              <div>

                <div className="
                  flex
                  justify-between
                  text-xs
                  mb-1
                ">

                  <span className="
                    text-gray-600
                  ">
                    Below 6.0
                  </span>

                  <span className="
                    font-medium
                    text-gray-800
                  ">
                    {cgpaDistribution.poor}
                  </span>

                </div>


                <div className="
                  h-2
                  bg-gray-100
                  rounded-full
                  overflow-hidden
                ">

                  <div
                    className="
                      h-full
                      bg-red-400
                      rounded-full
                    "
                    style={{
                      width:
                        totalStudents > 0
                          ? `${
                              (cgpaDistribution.poor /
                                totalStudents) *
                              100
                            }%`
                          : '0%',
                    }}
                  />

                </div>

              </div>


            </div>

          </section>


          {/* ATTENDANCE DISTRIBUTION */}

          <section className="
            bg-white
            border
            border-gray-200
            rounded-xl
            p-5
          ">

            <h2 className="
              font-semibold
              text-gray-900
            ">
              Attendance Distribution
            </h2>


            <p className="
              text-xs
              text-gray-500
              mt-1
            ">
              Students grouped by attendance percentage
            </p>


            <div className="
              mt-6
              space-y-6
            ">


              {/* 90+ */}

              <div>

                <div className="
                  flex
                  justify-between
                  text-xs
                  mb-2
                ">

                  <span>
                    90% and above
                  </span>

                  <span className="
                    font-medium
                  ">
                    {attendanceDistribution.excellent}
                  </span>

                </div>


                <div className="
                  h-3
                  bg-gray-100
                  rounded-full
                  overflow-hidden
                ">

                  <div
                    className="
                      h-full
                      bg-green-500
                      rounded-full
                    "
                    style={{
                      width:
                        totalStudents > 0
                          ? `${
                              (attendanceDistribution.excellent /
                                totalStudents) *
                              100
                            }%`
                          : '0%',
                    }}
                  />

                </div>

              </div>


              {/* 75 - 89 */}

              <div>

                <div className="
                  flex
                  justify-between
                  text-xs
                  mb-2
                ">

                  <span>
                    75% – 89%
                  </span>

                  <span className="
                    font-medium
                  ">
                    {attendanceDistribution.good}
                  </span>

                </div>


                <div className="
                  h-3
                  bg-gray-100
                  rounded-full
                  overflow-hidden
                ">

                  <div
                    className="
                      h-full
                      bg-blue-500
                      rounded-full
                    "
                    style={{
                      width:
                        totalStudents > 0
                          ? `${
                              (attendanceDistribution.good /
                                totalStudents) *
                              100
                            }%`
                          : '0%',
                    }}
                  />

                </div>

              </div>


              {/* Below 75 */}

              <div>

                <div className="
                  flex
                  justify-between
                  text-xs
                  mb-2
                ">

                  <span>
                    Below 75%
                  </span>

                  <span className="
                    font-medium
                  ">
                    {attendanceDistribution.low}
                  </span>

                </div>


                <div className="
                  h-3
                  bg-gray-100
                  rounded-full
                  overflow-hidden
                ">

                  <div
                    className="
                      h-full
                      bg-red-500
                      rounded-full
                    "
                    style={{
                      width:
                        totalStudents > 0
                          ? `${
                              (attendanceDistribution.low /
                                totalStudents) *
                              100
                            }%`
                          : '0%',
                    }}
                  />

                </div>

              </div>


            </div>


            <div className="
              mt-8
              bg-blue-50
              rounded-lg
              p-4
            ">

              <p className="
                text-xs
                text-gray-500
              ">
                Average Attendance
              </p>


              <p className="
                text-2xl
                font-semibold
                mt-1
              ">
                {averageAttendance}%
              </p>


              <p className="
                text-[10px]
                text-gray-400
                mt-1
              ">
                Calculated from student records
              </p>

            </div>

          </section>


        </div>


        {/* ================= STUDENT TABLE ================= */}

        <section className="
          bg-white
          border
          border-gray-200
          rounded-xl
          overflow-hidden
        ">


          {/* Table Header */}

          <div className="
            p-4
            sm:p-5
            border-b
            border-gray-200
          ">

            <div className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-3
            ">


              <div>

                <h2 className="
                  font-semibold
                  text-gray-900
                ">
                  Student Performance Report
                </h2>


                <p className="
                  text-xs
                  text-gray-500
                  mt-1
                ">
                  {filteredStudents.length} students shown
                </p>

              </div>


              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search student..."
                className="
                  w-full
                  sm:w-64
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


          {/* Table */}

          <div className="
            overflow-x-auto
          ">

            <table className="
              w-full
              min-w-[700px]
              text-sm
            ">


              <thead className="
                bg-gray-50
                text-gray-500
              ">

                <tr>

                  <th className="
                    text-left
                    px-5
                    py-3
                    font-medium
                  ">
                    Student
                  </th>


                  <th className="
                    text-left
                    px-5
                    py-3
                    font-medium
                  ">
                    CGPA
                  </th>


                  <th className="
                    text-left
                    px-5
                    py-3
                    font-medium
                  ">
                    Attendance
                  </th>


                  <th className="
                    text-left
                    px-5
                    py-3
                    font-medium
                  ">
                    Semester
                  </th>


                  <th className="
                    text-left
                    px-5
                    py-3
                    font-medium
                  ">
                    Performance
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

                      <td className="
                        px-5
                        py-4
                      ">

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">


                          <div className="
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
                          ">

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

                            <p className="
                              font-medium
                              text-gray-900
                            ">
                              {student.name}
                            </p>


                            <p className="
                              text-xs
                              text-gray-500
                            ">
                              {student.rollNumber}
                            </p>

                          </div>


                        </div>

                      </td>


                      {/* CGPA */}

                      <td className="
                        px-5
                        py-4
                        font-medium
                      ">
                        {student.cgpa}
                      </td>


                      {/* Attendance */}

                      <td className="
                        px-5
                        py-4
                      ">

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


                      {/* Semester */}

                      <td className="
                        px-5
                        py-4
                      ">
                        {student.semester}
                      </td>


                      {/* Status */}

                      <td className="
                        px-5
                        py-4
                      ">

                        <span
                          className={
                            student.status ===
                            'Active'
                              ? `
                                bg-green-50
                                text-green-600
                                px-2.5
                                py-1
                                rounded-md
                                text-xs
                              `
                              : `
                                bg-red-50
                                text-red-600
                                px-2.5
                                py-1
                                rounded-md
                                text-xs
                              `
                          }
                        >
                          {student.status}
                        </span>

                      </td>


                    </tr>

                  )
                )}


                {filteredStudents.length === 0 && (

                  <tr>

                    <td
                      colSpan={5}
                      className="
                        px-5
                        py-12
                        text-center
                        text-sm
                        text-gray-500
                      "
                    >
                      {loading
                        ? 'Loading students...'
                        : 'No students found.'}
                    </td>

                  </tr>

                )}


              </tbody>

            </table>

          </div>

        </section>


      </main>

    </div>
  );
}


export default Report;
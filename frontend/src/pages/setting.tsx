import { useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Temporary logout
    navigate('/');
  };

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

          <div>
            <p className="text-xs font-medium text-blue-600 mb-1">
              ACCOUNT
            </p>

            <h1 className="text-2xl font-bold text-gray-900">
              Settings
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your administrator profile and account settings.
            </p>
          </div>

        </div>
      </header>


      {/* Main */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">

        {/* Profile */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">

          <div className="p-5 border-b border-gray-200">

            <h2 className="font-semibold text-gray-900">
              Admin Profile
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Your administrator account information
            </p>

          </div>


          <div className="p-5">

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">

              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">
                NV
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Naitik Vadher
                </h3>

                <p className="text-sm text-gray-500">
                  System Administrator
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  ECE Batch 2023 · Institutional Management
                </p>
              </div>

            </div>


            {/* Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value="Naitik Vadher"
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none"
                />
              </div>


              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Role
                </label>

                <input
                  type="text"
                  value="System Administrator"
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none"
                />
              </div>


              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value="admin@test.com"
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none"
                />
              </div>


              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Phone
                </label>

                <input
                  type="text"
                  value="+91 98765 43210"
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none"
                />
              </div>

            </div>

          </div>

        </section>


        {/* Account Information */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">

          <div className="p-5 border-b border-gray-200">

            <h2 className="font-semibold text-gray-900">
              Account Information
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Information about your administrator account
            </p>

          </div>


          <div className="divide-y divide-gray-100">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-5">

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Account Status
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Current status of your administrator account
                </p>
              </div>

              <span className="self-start sm:self-auto bg-green-50 text-green-600 px-3 py-1 rounded-md text-xs font-medium">
                Active
              </span>

            </div>


            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-5">

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Department
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Department associated with this account
                </p>
              </div>

              <p className="text-sm text-gray-600">
                Electronics & Communication Engineering
              </p>

            </div>


            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-5">

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Institution
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Institution associated with this system
                </p>
              </div>

              <p className="text-sm text-gray-600">
                MNIT Jaipur
              </p>

            </div>

          </div>

        </section>


        {/* Security */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">

          <div className="p-5 border-b border-gray-200">

            <h2 className="font-semibold text-gray-900">
              Security
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Manage your account security
            </p>

          </div>


          <div className="p-5">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Password
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Change your administrator password
                </p>
              </div>

              <button
                type="button"
                className="self-start sm:self-auto border border-gray-200 rounded-lg px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Change Password
              </button>

            </div>

          </div>

        </section>


        {/* Logout */}
        <section className="bg-white border border-red-100 rounded-xl overflow-hidden">

          <div className="p-5">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>

                <h2 className="font-semibold text-gray-900">
                  Sign out
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Sign out from the administrator account.
                </p>

              </div>


              <button
                type="button"
                onClick={handleLogout}
                className="self-start sm:self-auto bg-red-500 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-red-600 transition"
              >
                Logout
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Settings;
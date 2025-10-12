export default function Profile() {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 mt-2">
            Manage your personal information and preferences
          </p>
        </div>
  
        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              A
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Alex Carter</h2>
              <p className="text-gray-500">alex.carter@example.com</p>
            </div>
          </div>
  
          {/* Form */}
          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value="Alex Carter"
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none"
                />
              </div>
  
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value="alex.carter@example.com"
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none"
                />
              </div>
  
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value="+1 (555) 123-4567"
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none"
                />
              </div>
  
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value="New York, USA"
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none"
                />
              </div>
            </div>
  
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Professional Bio</label>
              <textarea
                value="Full Stack Developer with a passion for scalable web apps and great UX."
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 resize-none focus:outline-none"
                rows={4}
              />
            </div>
  
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Skills</label>
              <input
                type="text"
                value="React, TypeScript, Node.js, TailwindCSS"
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none"
              />
            </div>
  
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-md transition-all"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
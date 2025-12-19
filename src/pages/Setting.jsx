function Setting() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Notifications</span>
            </label>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Dark Mode</span>
            </label>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Language</span>
            </label>
            <select className="select select-bordered w-full">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <button className="btn btn-primary mt-6">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default Setting;